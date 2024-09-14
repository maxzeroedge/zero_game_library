import { json } from "@remix-run/react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const gameId = params.gameId;
    const game = await getGameById(gameId);
    return json({ game });
};