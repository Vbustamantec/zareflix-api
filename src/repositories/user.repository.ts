import { BaseRepository } from "./base.repository";
import { User, CreateUserDTO } from "../interfaces/user.interface";

export class UserRepository extends BaseRepository<User> {
	constructor() {
		super("users");
	}

	async findByAuth0Id(auth0Id: string): Promise<User | null> {
		try {
			return await this.collection.findOne({ auth0Id });
		} catch (error) {
			throw new Error("Error finding user");
		}
	}

	async createUser(userData: CreateUserDTO): Promise<User> {
		try {
			const user: Omit<User, "_id"> = {
				...userData,
				createdAt: new Date(),
				updatedAt: new Date(),
				lastLogin: new Date(),
			};

			const result = await this.collection.insertOne(user);
			return { ...user, _id: result.insertedId };
		} catch (error) {
			throw new Error("Error creating user");
		}
	}

	async updateLastLogin(auth0Id: string): Promise<void> {
		try {
			await this.collection.updateOne(
				{ auth0Id },
				{ $set: { lastLogin: new Date(), updatedAt: new Date() } }
			);
		} catch (error) {
			throw new Error("Error updating last login");
		}
	}
}
