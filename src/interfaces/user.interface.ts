import { ObjectId } from "bson";

export interface User {
	_id?: ObjectId;
	auth0Id: string;
	email: string;
	nickname?: string;
	createdAt: Date;
	updatedAt: Date;
	lastLogin: Date;
}

export interface CreateUserDTO {
	auth0Id: string;
	email: string;
	nickname?: string;
}
