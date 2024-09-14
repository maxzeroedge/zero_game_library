import React from 'react';
import { json, useLoaderData } from "@remix-run/react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const gameId = params.gameId;
    const game = await getGameById(gameId);
    return json({ game });
};

export const GameCatalogItem = () => {
    const {game} = useLoaderData();

    return (
        <div>{game}</div>
    );
}