import axios from "axios";

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const BASE_URL = "http://www.omdbapi.com";

export const getMovieById = async (movieId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/?apikey=${OMDB_API_KEY}&i=${movieId}&plot=full`);
        
        if (response.data.Response === "False") {
            throw new Error(response.data.Error || "Movie not found");
        }

        return response.data;
    } catch (error) {
        console.error("Error fetching movie:", error);
        throw new Error("Failed to fetch movie details");
    }
};