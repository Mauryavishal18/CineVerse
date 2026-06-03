# CineVerse 🎬

A Netflix-inspired full-stack streaming platform that allows users to discover movies, search content, watch trailers, manage watchlists, and receive AI-powered movie recommendations. The application uses TMDB API for real-time movie data and Groq AI for personalized suggestions.

## Features

* User Registration and Login
* JWT-based Authentication & Authorization
* Browse Trending, Top Rated, Upcoming, and Now Playing Movies
* Search Movies by Title
* Filter Movies by Genre
* Detailed Movie Information
* Trailer Playback
* Personalized Watchlist Management
* AI-Powered Movie Recommendations using Groq AI
* Responsive UI for Desktop and Mobile Devices
* Redux Toolkit for State Management

## Tech Stack

### Frontend

* React.js
* TypeScript
* Vite
* Tailwind CSS
* Redux Toolkit
* React Router

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose

### Authentication

* JWT (JSON Web Token)
* bcryptjs

### APIs & Services

* TMDB API
* Groq AI

## Project Structure

```text
cineverse/
├── backend/
│   ├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   └── services/
│
└── frontend/
    ├── src/
    ├── components/
    ├── pages/
    ├── redux/
    ├── services/
    └── assets/
```

## Installation & Setup

### Clone Repository

```bash
git clone <repository-url>
cd cineverse
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file and add:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

TMDB_API_KEY=your_tmdb_api_key

GROQ_API_KEY=your_groq_api_key
```

Start Backend Server:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Movies

```http
GET /api/movies/trending
GET /api/movies/top-rated
GET /api/movies/upcoming
GET /api/movies/now-playing
GET /api/movies/search
GET /api/movies/genres
GET /api/movies/by-genre
GET /api/movies/:id
```

### Watchlist

```http
GET    /api/watchlist
POST   /api/watchlist/add
DELETE /api/watchlist/remove/:movieId
```

### AI Recommendations

```http
POST /api/ai/recommend
```

## Future Enhancements

* Video Streaming Integration
* User Profiles
* Dark/Light Theme Toggle
* Social Sharing
* Movie Reviews & Ratings
* Recommendation History
* Admin Dashboard

## Author

Vishal Maurya


