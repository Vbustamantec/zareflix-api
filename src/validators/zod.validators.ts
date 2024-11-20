import { z } from "zod";
import { Request, Response, NextFunction } from "express";

// Schemas reutilizables
const movieIdSchema = z
	.string()
	.regex(/^tt\d+$/, 'Must be a valid IMDB ID (starting with "tt")')
	.min(9, "Invalid IMDB ID length")
	.max(10, "Invalid IMDB ID length");

const yearSchema = z
	.string()
	.regex(/^(19|20)\d{2}$/, "Must be a valid year between 1900 and 2099");

const posterSchema = z
	.string()
	.url("Must be a valid URL")
	.refine((url) => url.startsWith("http"), "Must be an HTTP URL");

const titleSchema = z
	.string()
	.min(1, "Title is required")
	.max(200, "Title is too long")
	.transform((title) => title.trim());

const personalNotesSchema = z
	.string()
	.max(150, "Notes cannot exceed 150 characters")
	.transform((notes) => notes.trim())
	.optional();

const userIdSchema = z
	.string()
	.regex(
		/^auth0\|[a-zA-Z0-9]+$/,
		'Must be a valid Auth0 user ID (starting with "auth0|")'
	)
	.min(8, "Invalid user ID length");

const emailSchema = z.string().email("Must be a valid email address");

const nicknameSchema = z
	.string()
	.min(3, "Nickname must be at least 3 characters long")
	.max(30, "Nickname cannot exceed 30 characters")
	.optional();

// Create favorite schema
const createFavoriteSchema = z
	.object({
		movieId: movieIdSchema,
		title: titleSchema,
		poster: posterSchema,
		year: yearSchema,
		personalNotes: personalNotesSchema,
	})
	.strict();

// Update favorite schema
const updateFavoriteSchema = z
	.object({
		title: titleSchema.optional(),
		personalNotes: personalNotesSchema,
	})
	.strict();

// Sentiment analysis schema
const sentimentSchema = z
	.object({
		text: z
			.string()
			.min(1, "Text is required")
			.max(150, "Text cannot exceed 150 characters")
			.transform((text) => text.trim())
			.refine(
				(text) => text.split(" ").length >= 3,
				"Text must contain at least 3 words for sentiment analysis"
			),
	})
	.strict();

// Recommendations parameters schema
const recommendationParamsSchema = z
	.object({
		movieId: movieIdSchema,
	})
	.strict();

// User sync schema
const userSyncSchema = z
	.object({
		email: emailSchema,
		nickname: nicknameSchema,
	})
	.strict();

const deleteFavoriteSchema = z
	.object({
		id: z.string(),
	})
	.strict();

const validateRequest = (
	schema: z.ZodSchema,
	source: keyof Request = "body"
) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = await schema.parseAsync(req[source]);

			(req as any).validatedData = data;

			if (source === "body") {
				Object.keys(data).forEach((key) => {
					req.body[key] = data[key];
				});
			}

			next();
		} catch (error) {
			if (error instanceof z.ZodError) {
				return res.status(400).json({
					success: false,
					errors: error.errors.map((err) => ({
						field: err.path.join("."),
						message: err.message,
					})),
					received: req[source],
				});
			}
			next(error);
		}
	};
};

// Expose validators
export const validators = {
	favorites: {
		create: validateRequest(createFavoriteSchema),
		update: validateRequest(updateFavoriteSchema),
		validateId: validateRequest(deleteFavoriteSchema, "params"),
	},
	sentiment: {
		analyze: validateRequest(sentimentSchema),
	},
	recommendations: {
		getById: validateRequest(recommendationParamsSchema, "params"),
	},
	users: {
		sync: validateRequest(userSyncSchema),
	},
	auth: {
		validateUserId: validateRequest(
			z.object({ userId: userIdSchema }),
			"params"
		),
	},
};
