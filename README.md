#  ExamPrep Backend API

A production-ready RESTful API powering the **ExamPrep** platform. The API provides authentication, question management, CBT simulation, practice sessions, bookmarks, analytics, and user settings.

---

##  Features

-  JWT Authentication
-  User Profile Management
-  Question Bank
-  Practice Sessions
-  CBT (Computer-Based Test) Simulation
-  Dashboard & Analytics
-  Bookmarks
-  User Settings
-  Email Verification
-  Password Reset
-  Role-Based Authorization
-  Request Validation
-  Prisma ORM
-  PostgreSQL Database

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt
- Nodemailer
- Express Validator
- Helmet
- CORS
- Morgan

---

## Project Structure

```text
examprep-backend/
│
├── config/
├── controllers/
├── middleware/
├── prisma/
├── routes/
├── services/
├── utils/
├── validators/
├── app.js
├── server.js
├── package.json
└── README.md
```

---

## Installation

### Clone the repository

```bash
git clone https://github.com/yourusername/examprep-backend.git
```

### Navigate into the project

```bash
cd examprep-backend
```

### Install dependencies

```bash
npm install
```

### Create environment variables

Copy the example file.

```bash
cp .env.example .env
```

Update `.env` with your own values.

### Generate Prisma Client

```bash
npx prisma generate
```

### Run database migrations

```bash
npx prisma migrate dev
```

### Start the development server

```bash
npm run dev
```

The API will run at

```
http://localhost:5001
```

---

##  Environment Variables

Create a `.env` file using `.env.example`.

```env
PORT=5001
NODE_ENV=development

DATABASE_URL=postgresql://username:password@localhost:5432/examprep

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:3000

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=ExamPrep <your_email@gmail.com>
```

---

# API Modules

## Authentication

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout

GET    /api/auth/profile
PUT    /api/auth/profile

PUT    /api/auth/change-password

POST   /api/auth/forgot-password
POST   /api/auth/reset-password

POST   /api/auth/verify-email
POST   /api/auth/refresh-token

GET    /api/auth/settings
PUT    /api/auth/settings
```

---

## Questions

```
GET    /api/questions
GET    /api/questions/:id
POST   /api/questions
PUT    /api/questions/:id
DELETE /api/questions/:id
```

---

## Practice

```
POST   /api/practice/start
POST   /api/practice/:id/save-answer
POST   /api/practice/:id/submit

GET    /api/practice/history
GET    /api/practice/:id
GET    /api/practice/:id/review
```

---

## CBT

```
POST   /api/exams/start
POST   /api/exams/:id/save-answer
POST   /api/exams/:id/submit

GET    /api/exams/history
GET    /api/exams/:id
GET    /api/exams/:id/result
GET    /api/exams/:id/review
```

---

## Bookmarks

```
POST   /api/bookmarks
GET    /api/bookmarks
DELETE /api/bookmarks/:id
```

---

## Analytics

```
GET /api/analytics/dashboard
GET /api/analytics/practice
GET /api/analytics/cbt
GET /api/analytics/subjects
GET /api/analytics/trend
GET /api/analytics/bookmarks
GET /api/analytics/activities
```

---

## Security

- JWT Authentication
- Password Hashing with bcrypt
- Helmet
- CORS Protection
- Input Validation
- Centralized Error Handling

---

## Database

Built with **PostgreSQL** using **Prisma ORM**.

Main models include:

- User
- UserSetting
- Question
- PracticeSession
- PracticeAnswer
- Exam
- ExamAnswer
- Bookmark

---

## Future Improvements

- Refresh Token Rotation
- Redis Caching
- File Uploads
- Docker Support
- CI/CD Pipeline
- API Documentation (Swagger/OpenAPI)
- Rate Limiting

---

## Contributors

- **Backend Team Lead**
- **Member 2** – Authentication & User Management
- **Member 3** – Practice & Question Management
- **Member 4** – Dashboard & Analytics
- **Member 5** – Bookmarks & Settings
- **Member 6** – CBT Module & Testing

---

## License

This project is licensed under the MIT License.