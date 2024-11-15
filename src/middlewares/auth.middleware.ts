import { auth } from "express-oauth2-jwt-bearer";

const issuerBaseUrl = process.env.AUTH0_ISSUER;
if (!issuerBaseUrl) {
	throw new Error("AUTH0_ISSUER is not defined");
}
const audience = process.env.AUTH0_AUDIENCE || "http://localhost:5000/";

export const checkJwt = auth({
	audience: [audience, issuerBaseUrl],
	issuerBaseURL: issuerBaseUrl,
	tokenSigningAlg: "RS256",
});
