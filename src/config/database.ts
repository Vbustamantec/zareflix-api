import { MongoClient, Db } from "mongodb";

export class Database {
	private static instance: Database;
	private client: MongoClient | null = null;
	private db: Db | null = null;

	private constructor() {}

	public static getInstance(): Database {
		if (!Database.instance) {
			Database.instance = new Database();
		}
		return Database.instance;
	}

	public async connect(): Promise<void> {
		if (!process.env.MONGODB_URI) {
			throw new Error("MongoDB URI is not defined");
		}

		if (!this.client) {
			this.client = await MongoClient.connect(
				process.env.MONGODB_URI as string
			);
			this.db = this.client.db("zareflix");
			console.log("Connected to MongoDB");
		}
	}

	public getDb(): Db {
		if (!this.db) {
			throw new Error("Database not connected");
		}
		return this.db;
	}
}
