import { Collection, Document } from "mongodb";
import Database from "../config/database";

export abstract class BaseRepository<T extends Document> {
	protected collection: Collection<T>;

	constructor(collectionName: string) {
		const db = Database.getInstance();
		if (!db) {
			console.error("Database connection not found");
		}
		this.collection = db.getDb().collection<T>(collectionName);
	}

	protected async ensureConnection() {
		await Database.getInstance().connect();
	}
}
