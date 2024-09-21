/**
 * Class responsible for mapping game results from different APIs to a common format.
 */
export class GameResultMapper {

    /** @type {string} Common fields for game results */
    fields = "id,name,summary,image,releaseDate";

    /** @type {string} Fields specific to IGDB API */
    #igdbFields = "id,name,summary,storyline,genres.name,platforms.name,themes.name,game_modes.name,player_perspectives.name,keywords.name,cover.url,first_release_date";

    /** @type {string} Fields specific to RAWG API */
    #rawgFields = "id,name,description,image,releaseDate";

    /**
     * Maps an IGDB game result to the common format.
     * @param {Object} game - The game object from IGDB API.
     * @returns {Object} Mapped game object in common format.
     */
    static mapIgdbGameResult(game) {
        let releaseDate = "";
        if(game.release_dates) {
            releaseDate = Object.values(game.release_dates)[0].date;
        }
        return {
            id: game.id,
            name: game.name,
            summary: game.summary,
            image: game.cover?.url,
            releaseDate: releaseDate,
            genres: game.genres,
            platforms: game.platforms,
            game_modes: game.game_modes,
            player_perspectives: game.player_perspectives,
            rating: game.rating,
            keywords: game.keywords,
        }
    }


    /**
     * Maps a RAWG game result to the common format.
     * @param {Object} game - The game object from RAWG API.
     * @returns {Object} Mapped game object in common format.
     */
    static mapRawgGameResult(game) {
        return {
            id: game.id,
            name: game.name,
            summary: game.description,
            image: game.background_image,
            releaseDate: game.releaseDate,
            genres: game.genres,
            platforms: game.platforms,
            game_modes: game.game_modes,
            player_perspectives: game.player_perspectives,
            keywords: game.keywords,
            rating: game.ratings
        }
    }

    /**
     * Maps a list of IGDB game results to the common format.
     * @param {Array<Object>} games - The list of game objects from IGDB API.
     * @returns {Array<Object>} List of mapped game objects in common format.
     */
    static mapIgdbGameResultList(games) {
        return games?.map(game => this.mapIgdbGameResult(game)) ?? [];
    }

    /**
     * Maps a list of RAWG game results to the common format.
     * @param {Array<Object>} games - The list of game objects from RAWG API.
     * @returns {Array<Object>} List of mapped game objects in common format.
     */
    static mapRawgGameResultList(games) {
        return games?.map(game => this.mapRawgGameResult(game)) ?? [];
    }
}