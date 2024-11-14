import { Collection, Document } from "mongodb";
import Database from "../config/database";

export abstract class BaseRepository<T extends Document> {
	protected collection: Collection<T>;

	constructor(collectionName: string) {
		const db = Database.getInstance().getDb();
		this.collection = db.collection<T>(collectionName);
	}
}
