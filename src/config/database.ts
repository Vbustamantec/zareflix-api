import { MongoClient, Db } from "mongodb";

export class Database {
	private static instance: Database;
	private client: MongoClient | null = null;
	private db: Db | null = null;
	private readonly uri: string = process.env.MONGODB_URI as string;
	private readonly dbName: string = process.env.MONGODB_DB_NAME as string;

	private constructor() {}

	public static getInstance(): Database {
		if (!Database.instance) {
			Database.instance = new Database();
		}
		return Database.instance;
	}

	public async connect(): Promise<void> {
		if (!this.client) {
			try {
				const options = {
					useNewUrlParser: true,
					useUnifiedTopology: true,
					serverSelectionTimeoutMS: 5000,
				};

				this.client = await MongoClient.connect(this.uri, options);
				this.db = this.client.db(this.dbName);
				console.log(`Connected to MongoDB: ${this.dbName}`);
			} catch (error) {
				console.error("Failed to connect to MongoDB", error);
				throw error;
			}
		}
	}

	public getDb(): Db {
		if (!this.db) {
			throw new Error("Database not connected");
		}
		return this.db;
	}
}

export default Database;
