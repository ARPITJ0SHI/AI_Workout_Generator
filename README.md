# FitnessBro - AI-Powered Workout Generator and Tracker

FitnessBro is a full-stack web application that leverages AI to generate personalized workout routines and helps users track their fitness progress. Built with React, Node.js, Express, and MongoDB, it offers a seamless experience for fitness enthusiasts of all levels.

## Website Link: https://ai-workout-generator-psi.vercel.app/

## Features

- User authentication and authorization with JWT
- Personalized onboarding process
- Personalized Dashboard
- Personalised AI-powered workout generation using Google's Generative AI (Gemini)
- Workout logging
- Streaks maintainence
- Notifications (only added in login and signup)
- User profile management
- Responsive design for desktop and mobile use

 ## Technology Stack
- Frontend: React.js with Tailwind CSS
- Backend: Node.js with Express.js
- Database: MongoDB
- Authentication: JSON Web Tokens (JWT)
- API Integration: Google Generative AI for quiz generation

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- MongoDB (v4.0 or later)
- Google Cloud account with Generative AI API enabled

## Setup Instructions

### Backend Setup

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the `backend` directory with the following content:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_google_generative_ai_api_key
   
   ```

4. Start the backend server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the `workout` directory:
   ```
   cd workout
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

## Usage

1. Open your browser and go to `http://localhost:5173` (or the port specified by Vite).
2. Register a new account or log in if you already have one.
3. Complete the onboarding process to set up your fitness profile.
4. Use the AI Workout Generator to create personalized workout routines.
5. Save the generated workout, if you liked that
6. Log your completed workouts to track your progress
7. view logged workouts
8. View your profile information as needed.

## API Integration

This project integrates with the following external API:

- Google Generative AI API: Used for generating personalized workout routines based on user preferences and fitness levels.

To use this API, you need to:
1. Set up a Google Cloud account
2. Enable the Generative AI API
3. Create an API key and add it to your backend `.env` file


## Project Screenshots are added in project screenshots folder
