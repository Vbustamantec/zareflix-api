import { Request } from "express";

export class Logger {
	private static formatValue(value: any): string {
		if (typeof value === "undefined") return "undefined";
		if (value === null) return "null";
		if (typeof value === "object") return JSON.stringify(value, null, 2);
		return value.toString();
	}

	private static getTimestamp(): string {
		return new Date().toISOString();
	}

	static request(req: Request & { auth?: { payload: any } }) {
		console.log(`
🌐 Request Information [${this.getTimestamp()}]
=====================
URL: ${req.url}
Method: ${req.method}
Auth0 Payload: ${this.formatValue(req.auth?.payload)}
Body: ${this.formatValue(req.body)}
=====================`);
	}

	static userSync(data: {
		action: "create" | "update" | "find";
		auth0Id: string;
		email?: string;
		nickname?: string;
		success: boolean;
		error?: string;
	}) {
		const emoji = data.success ? "✅" : "❌";
		console.log(`
${emoji} User Sync Operation [${this.getTimestamp()}]
=====================
Action: ${data.action.toUpperCase()}
Auth0 ID: ${data.auth0Id}
Email: ${data.email || "N/A"}
Nickname: ${data.nickname || "N/A"}
Status: ${data.success ? "Success" : "Failed"}
${data.error ? `Error: ${data.error}` : ""}
=====================`);
	}

	static info(message: string, data?: any) {
		console.log(`
ℹ️ Info [${this.getTimestamp()}]
=====================
Message: ${message}
${data ? `Data: ${this.formatValue(data)}` : ""}
=====================`);
	}

	static error(context: string, error: any) {
		console.error(`
❌ Error [${this.getTimestamp()}]
=====================
Context: ${context}
Message: ${error.message}
Stack: ${error.stack}
Details: ${this.formatValue(error)}
=====================`);
	}

	static success(message: string, data?: any) {
		console.log(`
✅ Success [${this.getTimestamp()}]
=====================
Message: ${message}
${data ? `Data: ${this.formatValue(data)}` : ""}
=====================`);
	}
}
