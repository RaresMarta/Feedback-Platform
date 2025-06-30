# CorpComment

A web application for submitting and viewing feedback about companies.

## Project Structure

The project is divided into two main parts:

- **Backend**: A FastAPI Python application that handles data storage, retrieval, and user authentication
- **Frontend**: A React TypeScript application that provides the user interface

## Backend

### Technologies Used
- FastAPI
- SQLAlchemy
- JWT Authentication
- Python 3.9+

### Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Frontend

### Technologies Used
- React
- TypeScript
- Vite

### Setup
```bash
cd frontend
npm install
npm run dev
```

## Features

- User registration and authentication
- Submit feedback about companies
- Option to submit feedback anonymously
- View all feedback
- Upvote feedback
- Filter feedback by company

## API Endpoints

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and get access token
- `GET /api/users/me` - Get current user info
- `GET /api/feedbacks` - Get all feedbacks
- `POST /api/feedbacks` - Create a new feedback
- `POST /api/feedbacks/anonymous` - Create anonymous feedback
- `PUT /api/feedbacks/{id}/upvote` - Upvote a feedback
