import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

const requiredEnvVars = [
	"MONGODB_URI",
	"MONGODB_DB_NAME",
	"AUTH0_AUDIENCE",
	"AUTH0_DOMAIN",
	"AUTH0_CLIENT_ID",
	"AUTH0_CLIENT_SECRET",
	"OMDB_API_KEY",
	"HUGGINGFACE_API_KEY",
	"ALLOWED_ORIGINS",
	"DEV_FRONTEND_URL",
];

requiredEnvVars.forEach((varName) => {
	if (!process.env[varName]) {
		throw new Error(`Required environment variable ${varName} is missing`);
	}
});
