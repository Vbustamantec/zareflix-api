import { UserRepository } from "../../repositories/user.repository";
import Database from "../../config/database";

describe("UserRepository", () => {
	let userRepository: UserRepository;

	beforeAll(async () => {
		await Database.getInstance().connect();
		userRepository = new UserRepository();
	});

	afterAll(async () => {
		await Database.getInstance().disconnect();
	});

	test("should create a new user", async () => {
		const userData = {
			auth0Id: "auth0|123456789",
			email: "test@example.com",
			nickname: "testuser",
		};

		const user = await userRepository.createUser(userData);
		expect(user).toHaveProperty("_id");
		expect(user.email).toBe(userData.email);
	});

	test("should find a user by auth0Id", async () => {
		const auth0Id = "auth0|123456789";
		const user = await userRepository.findByAuth0Id(auth0Id);
		expect(user).not.toBeNull();
		expect(user?.auth0Id).toBe(auth0Id);
	});
});
