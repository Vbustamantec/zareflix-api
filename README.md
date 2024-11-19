# ZareFlix API - Backend Documentation

## Overview

ZareFlix API is a RESTful backend service built with Node.js/Express and MongoDB Atlas, powering a movie exploration platform with AI-enhanced features. The API provides secure authentication, comprehensive movie management, and AI-powered recommendations and sentiment analysis.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#api-documentation)
- [API Documentation](#api-documentation)
- [User Routes](#user-routes)
- [Environment Setup](#environment-setup)
- [Local Development](#local-development)

## Features

### Core Functionalities

- User authentication and authorization via Auth0
- CRUD operations for user favorite movies
- AI-powered movie recommendations using HuggingFace
- Sentiment analysis for movie reviews
- Secure endpoints with JWT validation
- MongoDB Atlas integration

### Key Implementations

- Repository pattern for database operations
- Middleware-based authentication
- Error handling and logging system
- Environment-based configuration
- Comprehensive testing suite

### Tech Stack

- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB Atlas
- Authentication: Auth0
- AI Services: HuggingFace (Mixtral-8x7B, BERT)
- Testing: Jest
- Language: TypeScript

## API Documentation

###Authentication

All endpoints except /recommendations require a valid Auth0 JWT token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

## User Routes

### Get Current User

```http
GET /api/user/me
```

Response

```json
{
	"success": true,
	"data": {
		"_id": "507f1f77bcf86cd799439011",
		"auth0Id": "auth0|123456789",
		"email": "user@example.com",
		"nickname": "moviefan",
		"createdAt": "2024-03-19T10:00:00Z",
		"updatedAt": "2024-03-19T10:00:00Z",
		"lastLogin": "2024-03-19T10:00:00Z"
	}
}
```

### Sync User Data

```http
POST /api/user/sync
```

Request Body:

```json
{
	"email": "user@example.com",
	"nickname": "moviefan"
}
```

Response:

```json
{
	"success": true,
	"data": {
		"_id": "507f1f77bcf86cd799439011",
		"auth0Id": "auth0|123456789",
		"email": "user@example.com",
		"nickname": "moviefan",
		"createdAt": "2024-03-19T10:00:00Z",
		"updatedAt": "2024-03-19T10:00:00Z",
		"lastLogin": "2024-03-19T10:00:00Z"
	}
}
```

### Favorites Routes

### Get User Favorites

```http
GET /api/favorites
```

Response

```json
{
	"success": true,
	"data": [
		{
			"_id": "507f1f77bcf86cd799439011",
			"userId": "auth0|123456789",
			"movieId": "tt0111161",
			"title": "The Shawshank Redemption",
			"poster": "http://example.com/poster.jpg",
			"year": "1994",
			"personalNotes": "Best movie ever!",
			"sentiment": {
				"sentiment": "positive",
				"score": 0.95
			},
			"createdAt": "2024-03-19T10:00:00Z",
			"updatedAt": "2024-03-19T10:00:00Z"
		}
	]
}
```

### Add Favorite Movie

```http
POST /api/favorites
```

Request Body:

```json
{
	"movieId": "tt0111161",
	"title": "The Shawshank Redemption",
	"poster": "http://example.com/poster.jpg",
	"year": "1994",
	"personalNotes": "Best movie ever!"
}
```

Response:

```json
{
	"success": true,
	"data": {
		"_id": "507f1f77bcf86cd799439011",
		"userId": "auth0|123456789",
		"movieId": "tt0111161",
		"title": "The Shawshank Redemption",
		"poster": "http://example.com/poster.jpg",
		"year": "1994",
		"personalNotes": "Best movie ever!",
		"createdAt": "2024-03-19T10:00:00Z",
		"updatedAt": "2024-03-19T10:00:00Z"
	}
}
```

### Update Favorite Movie

```http
PUT /api/favorites/:id
```

Request Body:

```json
{
	"title": "The Shawshank Redemption (Updated)",
	"personalNotes": "Even better after rewatching!"
}
```

Response:

```json
{
	"success": true,
	"data": {
		"_id": "507f1f77bcf86cd799439011",
		"title": "The Shawshank Redemption (Updated)",
		"personalNotes": "Even better after rewatching!",
		"updatedAt": "2024-03-19T10:00:00Z"
	}
}
```

### Delete Favorite Movie

```http
DELETE /api/favorites/:id
```

Response:

```json
{
	"success": true,
	"message": "Favorite removed successfully"
}
```

## Recommendations Routes

### Get Movie Recommendations

```http
GET /recommendations/:movieId
```

Response:

```json
{
	"success": true,
	"data": {
		"movie": {
			"title": "The Shawshank Redemption",
			"genre": "Drama",
			"year": "1994"
		},
		"recommendations": [
			"1. The Green Mile (1999)",
			"2. The Godfather (1972)",
			"3. Forrest Gump (1994)",
			"4. Schindler's List (1993)",
			"5. One Flew Over the Cuckoo's Nest (1975)"
		]
	}
}
```

## Sentiment Routes

### Analyze Sentiment

```http
POST /api/sentiment/analyze
```

Request Body:

```json
{
	"text": "This movie was absolutely amazing! A masterpiece of storytelling."
}
```

Response:

```json
{
	"success": true,
	"data": {
		"sentiment": "positive",
		"score": 0.95
	}
}
```

## Environment Setup

Required environment variables:

```bash
PORT=3001
MONGODB_URI=your_mongodb_uri
MONGODB_DB_NAME=your_db_name
AUTH0_AUDIENCE=your_auth0_audience
AUTH0_ISSUER=your_auth0_issuer
HUGGINGFACE_API_KEY=your_hf_key
OMDB_API_KEY=your_omdb_key
ALLOWED_ORIGINS=your_frontend_url
```

## Local Development

1. Clone the repository

```bash
git clone <repository-url>
cd zareflix-api
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
```

4. Start development server

```bash
npm run dev
```
