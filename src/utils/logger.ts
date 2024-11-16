import { Request } from "express";

export class Logger {
	private static formatValue(value: any): string {
		if (typeof value === "undefined") return "undefined";
		if (value === null) return "null";
		if (typeof value === "object") return JSON.stringify(value, null, 2);
		return value.toString();
	}

	static request(req: Request & { auth?: { payload: any } }) {
		console.log(`
🌐 Request Information
=====================
URL: ${req.url}
Method: ${req.method}
Auth0 Payload: ${this.formatValue(req.auth?.payload)}
Headers: ${this.formatValue({
			authorization: req.headers.authorization ? "Present" : "Missing",
			...req.headers,
		})}
Body: ${this.formatValue(req.body)}
=====================
    `);
	}

	static userSync(data: {
		auth0Id?: string;
		email?: string;
		nickname?: string;
	}) {
		console.log(`
👤 User Sync Operation
=====================
Auth0 ID: ${data.auth0Id}
Email: ${data.email}
Nickname: ${data.nickname}
Timestamp: ${new Date().toISOString()}
=====================
    `);
	}

	static error(context: string, error: any) {
		console.error(`
❌ Error in ${context}
=====================
Message: ${error.message}
Stack: ${error.stack}
Data: ${this.formatValue(error)}
=====================
    `);
	}
}
