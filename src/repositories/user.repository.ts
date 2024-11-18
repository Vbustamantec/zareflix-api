import { BaseRepository } from "./base.repository";
import { User, CreateUserDTO } from "../interfaces/user.interface";

export class UserRepository extends BaseRepository<User> {
	constructor() {
		super("users");
	}

	async findByAuth0Id(auth0Id: string): Promise<User | null> {
		try {
			await this.ensureConnection();
			return await this.collection.findOne({ auth0Id });
		} catch (error) {
			console.error("Error finding user:", error);
			throw new Error("Error finding user");
		}
	}

	async createUser(userData: CreateUserDTO): Promise<User> {
		const { email, nickname, auth0Id } = userData;
		try {
			await this.ensureConnection();
			const user: Omit<User, "_id"> = {
				auth0Id,
				email,
				nickname,
				createdAt: new Date(),
				updatedAt: new Date(),
				lastLogin: new Date(),
			};

			const result = await this.collection.insertOne(user);
			return { ...user, _id: result.insertedId };
		} catch (error) {
			console.error("Error creating user:", error);
			throw new Error("Error creating user");
		}
	}

	async updateLastLogin(auth0Id: string): Promise<void> {
		try {
			await this.ensureConnection();
			await this.collection.updateOne(
				{ auth0Id },
				{ $set: { lastLogin: new Date(), updatedAt: new Date() } }
			);
		} catch (error) {
			console.error("Error updating last login:", error);
			throw new Error("Error updating last login");
		}
	}
}
