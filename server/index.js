/**
 * @fileoverview This file sets up an HTTP server that mimics AWS Lambda behavior for local development.
 * @module server
 */

import http from 'http';
import { handler } from './src/main.js';

/** @type {number} */
const port = process.env.PORT || 8080;

/**
 * @typedef {Object} LambdaEvent
 * @property {string} httpMethod - The HTTP method of the request
 * @property {string} path - The URL path of the request
 * @property {Object.<string, string>} headers - The request headers
 * @property {URLSearchParams} queryStringParameters - The query parameters
 * @property {string} body - The request body
 */

/**
 * @typedef {Object} LambdaResult
 * @property {number} statusCode - The HTTP status code
 * @property {Object.<string, string>} [headers] - The response headers
 * @property {string} body - The response body
 */

/**
 * Creates an HTTP server that handles requests by invoking the Lambda handler
 * @type {http.Server}
 */
const server = http.createServer(async (req, res) => {
  try {
    /** @type {LambdaEvent} */
    const event = {
      httpMethod: req.method,
      path: req.url,
      headers: req.headers,
      queryStringParameters: new URL(req.url, `http://${req.headers.host}`).searchParams,
      body: '',
    };

    // Read the request body if present
    if (req.method === 'POST' || req.method === 'PUT') {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      event.body = Buffer.concat(buffers).toString();
    }

    /** @type {LambdaResult} */
    console.log('Event:', event.queryStringParameters);
    const result = await handler(event);

    // Set the status code and headers
    res.statusCode = result.statusCode || 200;
    Object.entries(result.headers || {}).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // Send the response body
    res.end(result.body);
  } catch (error) {
    console.error('Error handling request:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
