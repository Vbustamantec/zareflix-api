import swaggerJsdoc from "swagger-jsdoc";

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "ZareFlix API Documentation",
			version: "1.0.0",
			description: "API documentation for ZareFlix movie application",
			license: {
				name: "ISC",
				url: "https://opensource.org/licenses/ISC",
			},
			contact: {
				name: "API Support",
				email: "your-email@example.com",
			},
		},
		servers: [
			{
				url:
					process.env.NODE_ENV === "production"
						? "https://zareflix-api.onrender.com"
						: "http://localhost:3001",
				description:
					process.env.NODE_ENV === "production"
						? "Production server"
						: "Development server",
			},
		],
		components: {
			securitySchemes: {
				BearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
		security: [
			{
				BearerAuth: [],
			},
		],
	},
	apis: ["./src/docs/*.yml"], 
};

export const specs = swaggerJsdoc(options);
