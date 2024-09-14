import React from 'react';
import { json, useLoaderData } from "@remix-run/react";

const getGameById = async (gameId: string) => {
    const response = await fetch('http://localhost:8080/game/' + gameId);
    const data = await response.json();
    return data.game;
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const gameId = params.gameId;
    const game = await getGameById(gameId);
    return json({ game });
};

export const GameCatalogItem = () => {
    const { game } = useLoaderData();

    return (
        <div>{game}</div>
    );
}