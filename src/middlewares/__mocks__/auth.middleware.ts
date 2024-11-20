export const checkJwt = (req: any, res: any, next: any) => {
	req.auth = { payload: { sub: "auth0|testuser" } };
	res.locals.userId = "auth0|testuser";
	next();
};
