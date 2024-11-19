const config = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/tests/**/*.test.ts"],
	moduleFileExtensions: ["ts", "js", "json", "node"],
	verbose: true,
	setupFiles: ["<rootDir>/jest.setup.ts"],
	testTimeout: 10000,
};

module.exports = config;
