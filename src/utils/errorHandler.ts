export class AppError extends Error {
	constructor(
		public statusCode: number,
		message: string,
		public code?: string
	) {
		super(message);
		this.name = "AppError";
		Error.captureStackTrace(this, this.constructor);
	}
}

export const handleError = (error: unknown) => {
	if (error instanceof AppError) {
		return {
			status: error.statusCode,
			message: error.message,
			code: error.code,
		};
	}

	return {
		status: 500,
		message:
			error instanceof Error ? error.message : "An unexpected error occurred",
		code: "INTERNAL_SERVER_ERROR",
	};
};
