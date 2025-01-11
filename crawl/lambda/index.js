import chromium from 'chrome-aws-lambda';
import AWS from 'aws-sdk';

const s3 = new AWS.S3();
const sqs = new AWS.SQS();
const dynamodb = new AWS.DynamoDB.DocumentClient();

const BUCKET_NAME = process.env.BUCKET_NAME;
const TABLE_NAME = process.env.TABLE_NAME;
const QUEUE_URL = process.env.QUEUE_URL;

export const handler = async (event) => {
    let browser;

    try {
        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });
        let page = await browser.newPage();

        for (const record of event.Records) {
            const {url, baseUrl} = JSON.parse(record.body);

            try {

                const sanitizedUrl = url.replace(/[^a-zA-Z0-9]/g, '_');
                // Check if URL is already visited
                const isVisited = await dynamodb
                    .get({ TableName: TABLE_NAME, Key: { sanitizedUrl } })
                    .promise();
                if (isVisited.Item) continue;
                // Mark URL as visited
                await dynamodb
                        .put({
                            TableName: TABLE_NAME,
                            Item: { sanitizedUrl, url, status: 'pending', lastUpdated: Date.now() },
                        })
                        .promise();

                // Fetch page HTML
                await page.goto(url);
                const html = await page.content();

                // Save to S3
                const sanitizedKey = 'zero-game-library/raw_html/' + sanitizedUrl + '.html';
                await s3
                    .putObject({
                        Bucket: BUCKET_NAME,
                        Key: sanitizedKey,
                        Body: html,
                        ContentType: 'text/html',
                    })
                    .promise();

                // Save to S3
                let contentHtml = await page.$('#main-content');
                contentHtml = contentHtml.$eval('#wiki-content-block', el => el.outerHTML);
                const contentSanitizedKey = 'zero-game-library/content/' + sanitizedUrl + '.html';
                await s3
                    .putObject({
                        Bucket: BUCKET_NAME,
                        Key: contentSanitizedKey,
                        Body: contentHtml,
                        ContentType: 'text/html',
                    })
                    .promise();

                // Mark URL as success in DynamoDB
                await dynamodb
                    .update({
                        TableName: TABLE_NAME,
                        Key: { sanitizedUrl },
                        UpdateExpression: 'SET status = :status, lastUpdated = :lastUpdated',
                        ExpressionAttributeValues: {
                            ':status': 'success',
                            ':lastUpdated': Date.now(),
                        },
                    })
                    .promise();

                // Get links and enqueue them
                const links = await page.$$eval('a[href]', (anchors) =>
                    anchors.map((a) => a.href).filter((href) => href.includes( baseUrl.replace(/(https?\:\/\/)|\/$/ig, '') ))
                );
                const dedupedLinks = [];
                for (const link of links) {
                    const isAlreadyVisited = await dynamodb
                        .get({ TableName: TABLE_NAME, Key: { sanitizedUrl: link.replace(/[^a-zA-Z0-9]/g, '_') } })
                        .promise();
                    if (!isAlreadyVisited.Item) {
                        dedupedLinks.push(link);
                    }
                }
                // Batch send URLs to SQS
                const sqsMessages = dedupedLinks.map((link, index) => ({
                    Id: `msg-${index}`, // Unique ID within the batch
                    MessageBody: JSON.stringify({
                        url: link,
                    }),
                }));

                // Split messages into batches of 10 (SQS batch limit)
                for (let i = 0; i < sqsMessages.length; i += 10) {
                    await sqs
                        .sendMessageBatch({
                            QueueUrl: QUEUE_URL,
                            Entries: sqsMessages.slice(i, i + 10),
                        })
                        .promise();
                }
            } catch (error) {
                console.error('Error:', error);

                // Mark URL as error in DynamoDB
                await dynamodb
                .update({
                    TableName: TABLE_NAME,
                    Key: { sanitizedUrl },
                    UpdateExpression: 'SET status = :status, lastUpdated = :lastUpdated',
                    ExpressionAttributeValues: {
                        ':status': 'error',
                        ':lastUpdated': Date.now(),
                    },
                })
                .promise();
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
};
