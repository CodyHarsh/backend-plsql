# Backend PlayPower Assignment

## Overview

This is a Node.js application with Express and PostgreSQL, designed to manage assignments and submissions for teachers and students.

## API Endpoints

### Authentication

#### Login
- **Endpoint:** `/api/auth/login`
- **Method:** `POST`
- **Description:** Authenticates a user (teacher or student) and returns a JWT token.
- **Request Body:**
  ```json
  {
      "username": "user1",
      "password": "password123",
      "role": "teacher"
  }
  ```
  or
  ```json
  {
      "username": "user1",
      "password": "password123",
      "role": "student"
  }
  ```
#### SignUp

- **Endpoint:** `/api/auth/signup`
- **Method:** `POST`
- **Description:** Creates a user of (teacher or student).
- **Request Body:**
  ```json
  {
      "username": "user1",
      "password": "password123",
      "role": "teacher"
  }
  ```
  or
  ```json
  {
      "username": "user1",
      "password": "password123",
      "role": "student"
  }
  ```
### Authentication
#### Create a New Assignments
- **Endpoint:** `/api/assignments`
- **Method:** `POST`
- **Description:** Creates a new assignment (teachers only).
- **Request Body:**
  ```curl
    curl --location 'http://localhost:3000/assignments' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6InRlYWNoZXIiLCJpYXQiOjE3MTY3MTUyMjcsImV4cCI6MTcxNjcxODgyN30.RqvnP4l5x2RDrzcyE1c825IyGhBeALT2oVoxs3rQIkc' \
    --data '{
    "title": "Math Assignment",
    "description": "Solve the following math problems.",
    "due_date": "2024-06-30",
    "total_score": 100,
    "max_score": 220
  }
  '
  ```
#### Get All Assignments
- **Endpoint:** `/api/assignments`
- **Method:** `GET`
- **Description:** Retrieves all assignments for the authenticated user.
- **Request Body:**
  ```curl
    curl --location 'http://localhost:3000/assignments' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6InRlYWNoZXIiLCJpYXQiOjE3MTY3MTUyMjcsImV4cCI6MTcxNjcxODgyN30.RqvnP4l5x2RDrzcyE1c825IyGhBeALT2oVoxs3rQIkc' \
    --data ''
  ```

#### Update Existing Assignment
- **Endpoint:** `/api/assignments/:id`
- **Method:** `PUT`
- **Description:** Updates an existing assignment (teachers only).
- **Request Body:**
  ```curl
    curl --location --request PUT 'http://localhost:3000/assignments' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6InRlYWNoZXIiLCJpYXQiOjE3MTY3MTUyMjcsImV4cCI6MTcxNjcxODgyN30.RqvnP4l5x2RDrzcyE1c825IyGhBeALT2oVoxs3rQIkc' \
    --data '{
      "title": "Math Assignment",
      "description": "Solve the following math problems.",
      "due_date": "2024-06-30",
      "total_score": 100,
      "max_score": 220
    }
    '
  ```
  
#### Delete a assignment
- **Endpoint:** `/api/assignments/:id`
- **Method:** `Delete`
- **Description:** Updates an existing assignment (teachers only).
- **Request Body:**
  ```curl
    curl --location --request DELETE 'http://localhost:3000/assignments/1' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6InRlYWNoZXIiLCJpYXQiOjE3MTY3MTUyMjcsImV4cCI6MTcxNjcxODgyN30.RqvnP4l5x2RDrzcyE1c825IyGhBeALT2oVoxs3rQIkc'
  ```
  
### Submissions

#### Student assignment submission (students only):
- **Endpoint:** `/api/submissions`
- **Method:** `POST`
- **Description:** Submits an assignment (students only).
- **Request Body:**
  ```curl
    curl --location 'http://localhost:3000/submissions' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3MTY3MTY2NzcsImV4cCI6MTcxNjcyMDI3N30.IicqqpUc-QtTjl-cZo0kqEGCsR2mLi5yf8stoWVBG4s' \
    --data '{
      "assignment_id": 1,
      "submission_date": "2024-06-25",
      "submission_text": "Here is my solution to the math assignment.",
      "graded": true
    }
    '
  ```

#### Grades a submission (teachers only):
- **Endpoint:** `/api/submissions`
- **Method:** `PUT`
- **Description:** Grades a submission (teachers only):
- **Request Body:**
  ```curl
    curl --location --request PUT 'http://localhost:3000/submissions' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3MTY3MTY2NzcsImV4cCI6MTcxNjcyMDI3N30.IicqqpUc-QtTjl-cZo0kqEGCsR2mLi5yf8stoWVBG4s' \
    --data '{
        "score": 90
    }
    '
  ```

# Backend PL/SQL

This repository contains the backend API for the PL/SQL project.

## Setup Instructions

### Prerequisites

- Node.js
- PostgreSQL
- Docker (if you want to build and run the service in a container)

### Setup Steps

1. **Clone the repository:**
   ```sh
   git clone https://github.com/CodyHarsh/backend-plsql.git
   cd backend-plsql
2. **Install dependencies:**
   ```
   npm install
   ```
4. **Set up environment variables: (.env) file**
   ```
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret
   ```
6. **Create database tables:**
   ```
   node create_tables.js
   ```
8. **Start the server:**
    ```
    nodemon index.js
    ```

### Docker Instructions
    docker build -t backendplsql .
    docker run -d -p 3000:3000 --env-file .env backendplsql
