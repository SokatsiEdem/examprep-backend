# ExamPrep Backend

## Overview

ExamPrep Backend is a RESTful API built with Node.js and Express.js. It powers the ExamPrep application by providing authentication, question management, CBT simulation, analytics, bookmarks, and user management.

## Technologies Used

- Node.js
- Express.js
- JavaScript (ES Modules)
- Git & GitHub

## Project Structure

backend/
├── controllers/
├── routes/
├── services/
├── middleware/
├── models/
├── config/
├── database/
├── utils/
└── tests/

## Features

- User Authentication
- User Profile Management
- Question Bank
- Practice Sessions
- Dashboard & Analytics
- Bookmarks
- Settings
- CBT Simulation
- API Testing

## CBT Module

The CBT module allows students to:

- Start a CBT exam
- Submit completed exams
- View examination results
- Review submitted answers

### CBT Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /cbt/start | Start a CBT session |
| POST | /cbt/submit| Submit CBT answers |
| GET  | /cbt/result/:id | View CBT result |
| GET  | /cbt/review/:id | Review submitted answers |

## Installation

Clone the repository

*bash
git clone <repository-url>


Install dependencies

*bash
npm install


Run the project

*bash
npm run dev


## Contributors

- Team Lead – Backend Lead
- Member 2 – Authentication & User Management
- Member 3 – Practice & Question Management
- Member 4 – Dashboard & Analytics
- Member 5 – Bookmarks & Settings
- Member 6 – CBT Module & Testing