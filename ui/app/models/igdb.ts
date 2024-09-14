export interface SubDetail {
    id: string | number;
    name: string;
}

export interface Game {
    id?: number;
    name?: string;
    cover?: {
      url: string;
    };
    genres?: Array<SubDetail>;
    themes?: Array<SubDetail>;
    rating?: number;
    summary?: string;
    first_release_date?: number;
}