import { auth } from "express-oauth2-jwt-bearer";

const issuerBaseUrl = process.env.AUTH0_ISSUER;
const audience = process.env.AUTH0_AUDIENCE || "http://localhost:5000/";

export const checkJwt = auth({
	audience: audience,
	issuerBaseURL: issuerBaseUrl,
	tokenSigningAlg: "RS256",
});
