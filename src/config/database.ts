import { MongoClient, Db } from "mongodb";

export class Database {
	private static instance: Database;
	private client: MongoClient | null = null;
	private db: Db | null = null;

	private constructor() {
		if (!process.env.MONGODB_URI) {
			throw new Error("MONGODB_URI is not defined in environment variables");
		}
		if (!process.env.MONGODB_DB_NAME) {
			throw new Error(
				"MONGODB_DB_NAME is not defined in environment variables"
			);
		}
	}

	public static getInstance(): Database {
		if (!Database.instance) {
			Database.instance = new Database();
		}
		return Database.instance;
	}

	public async connect(): Promise<void> {
		if (!this.client) {
			this.client = await MongoClient.connect(
				process.env.MONGODB_URI as string
			);
			this.db = this.client.db(process.env.MONGODB_DB_NAME);
			console.log(
				`Connected to MongoDB database: ${process.env.MONGODB_DB_NAME}`
			);
		}
	}

	public getDb(): Db {
		if (!this.db) {
			throw new Error("Database not connected");
		}
		return this.db;
	}
}
