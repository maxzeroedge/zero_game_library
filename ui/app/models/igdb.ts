export interface SubDetail {
    id: string | number;
    name: string;
}

export interface Game {
    id?: number;
    name?: string;
    image?: string;
    genres?: Array<SubDetail>;
    themes?: Array<SubDetail>;
    platforms?: Array<SubDetail>;
    game_modes?: Array<SubDetail>;
    player_perspectives?: Array<SubDetail>;
    keywords?: Array<SubDetail>;
    rating?: number;
    summary?: string;
    releaseDate?: number;
}