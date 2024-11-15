declare namespace Express {
	export interface Request {
		userId?: string;
		auth?: {
			payload: {
				sub: string;
				[key: string]: any;
				email?: string;
				nickname?: string;
			};
		};
	}
}
