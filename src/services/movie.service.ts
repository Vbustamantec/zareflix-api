const OMDB_API_KEY = process.env.OMDB_API_KEY;
const BASE_URL = "http://www.omdbapi.com";

export const getMovieById = async (movieId: string) => {
	try {
		const response = await fetch(
			`${BASE_URL}/?apikey=${OMDB_API_KEY}&i=${movieId}&plot=full`
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();

		if (data.Response === "False") {
			throw new Error(data.Error || "Movie not found");
		}

		return data;
	} catch (error) {
		console.error("Error fetching movie:", error);
		throw new Error("Failed to fetch movie details");
	}
};
