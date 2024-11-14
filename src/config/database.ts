import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

export class Database {
	private static instance: Database;
	private client: MongoClient | null = null;
	private db: Db | null = null;

	private constructor() {
		const uri = process.env.MONGODB_URI;
		const dbName = process.env.MONGODB_DB_NAME;

		if (!uri) {
			throw new Error("MONGODB_URI is not defined in environment variables");
		}

		if (!dbName) {
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
			try {
				const uri = process.env.MONGODB_URI;
				if (!uri) {
					throw new Error("MONGODB_URI is not defined");
				}

				this.client = await MongoClient.connect(uri);
				this.db = this.client.db(process.env.MONGODB_DB_NAME);
				console.log("Connected to MongoDB successfully");
			} catch (error) {
				console.error("Failed to connect to MongoDB:", error);
				throw error;
			}
		}
	}

	public getDb(): Db {
		if (!this.db) {
			throw new Error("Database not connected. Call connect() first.");
		}
		return this.db;
	}

	public async disconnect(): Promise<void> {
		if (this.client) {
			await this.client.close();
			this.client = null;
			this.db = null;
		}
	}
}

export default Database;
