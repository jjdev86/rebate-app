# Smart Benefit Claim Portal

A full-stack rebate application platform where users can register, log in, and manage rebate claims.  
The project is split into **client** (Vite + React + Tailwind CSS) and **server** (Node.js + Express + PostgreSQL) applications.

---

## Project Structure
Root/
```bash
│
├── client/ # Frontend (Vite + React + Tailwind CSS)
├── server/ # Backend (Node.js + Express + PostgreSQL)
├── package.json # Root scripts for running both client & server
├── .gitignore # Ignored files/folders for Git
└── README.md # This file
```

---

## Features

- **User Authentication** (Register, Login, JWT Auth)
- **Profile Management** (`/me` route)
- **PostgreSQL Database** connection with Sequelize
- **Form Validations** using `express-validator`
- **Modern Frontend** with Tailwind CSS styling
- **Concurrently** run both client & server in dev mode

---

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS

**Backend**
- Node.js
- Express.js
- PostgreSQL (Sequelize ORM)
- JWT Authentication
- express-validator

---

## Installation & Setup

### Clone the repository
```bash
git clone https://github.com/jjdev86/rebate-app.git
cd rebate-app
```

### Install dependencies
- From the root (for concurrently):
```bash
npm install
```
- From the client:
```bash
cd client
npm install
```
- From the server:
```bash
cd ../server
npm install
```

### Environment Variables
- Create a .env file in /server

DATABASE_URL=postgres://username:password@localhost:5432/yourdbname
JWT_SECRET=your_jwt_secret
PORT=5000


### Running the App
- From the root:
```bash 
npm run dev
```
- This will start both:
- Frontend (client) at http://localhost:5173
- Backend (server) at http://localhost:5000


### Testing API Routes
- Use Postman to test:

- Auth Routes
- Register → POST /api/auth/register

{
  "email": "test@example.com",
  "password": "Password123!"
}

- Login → POST /api/auth/login
- Get Profile → GET /api/auth/me
- Add an Authorization header:

Bearer <JWT_TOKEN>


### Scripts
From root:
```bash 
npm run dev       # Run both client & server in dev mode
```

From client:
```bash
npm run dev       # Run frontend only
```

From server:
```bash
npm run dev       # Run backend only
```

Notes
.env is already in .gitignore — never commit it.

Ensure PostgreSQL is running before starting the backend.

This is an MVP setup — future updates will include AWS S3 storage for file uploads.
