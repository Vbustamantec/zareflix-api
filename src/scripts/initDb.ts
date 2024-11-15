import { Database } from "../config/database";

async function initializeDatabase() {
	try {
		const db = Database.getInstance();
		await db.connect();

		const database = db.getDb();

		await database
			.collection("users")
			.createIndexes([
				{
					key: { auth0Id: 1 },
					unique: true,
					name: "unique_auth0_id",
				},
				{
					key: { email: 1 },
					unique: true,
					name: "unique_email",
				},
			])
			.catch((err) => console.error("Error creating users indices:", err));

		await database
			.collection("favorites")
			.createIndexes([
				{
					key: { userId: 1 },
					name: "user_id_index",
				},
				{
					key: { userId: 1, movieId: 1 },
					unique: true,
					name: "unique_user_movie",
				},
			])
			.catch((err) => console.error("Error creating favorites indices:", err));

		console.log("Database indices created successfully");
		process.exit(0);
	} catch (error) {
		console.error("Failed to initialize database:", error);
		process.exit(1);
	}
}

// Ejecutar si este archivo es llamado directamente
if (require.main === module) {
	initializeDatabase();
}

export { initializeDatabase };
