### Server – Smart Benefit Claim Portal
Backend API for the Smart Benefit Claim Portal.
Built with Node.js, Express, and PostgreSQL using Sequelize ORM.

### Features
- User Authentication (Register, Login, JWT Auth)
- Profile Management (/me route)
- PostgreSQL database connection with Sequelize
- Form Validation using express-validator
- Secure password hashing with bcrypt
- Organized MVC folder structure

### Tech Stack
- Node.js
- Express.js
- PostgreSQL (Sequelize ORM)
- JWT Authentication
- bcrypt for password hashing
- express-validator for input validation
- dotenv for environment variables

### Installation & Setup
1. Install dependencies
```bash
cd server
npm install
```

2. Environment Variables
Create a .env file inside server/:

DATABASE_URL=postgres://username:password@localhost:5432/yourdbname
JWT_SECRET=your_jwt_secret
PORT=5000

3. Run Database Migrations
npx sequelize-cli db:migrate

4. Start the Server
Development (with auto-reload via nodemon):
```bash
npm run dev
```
Production:
```bash
npm start
```
The server will run at:
http://localhost:5000

### API Routes
- Auth

Register → POST /api/auth/register
Body:
{
  "email": "test@example.com",
  "password": "Password123!"
}

Login → POST /api/auth/login
Body:
{
  "email": "test@example.com",
  "password": "Password123!"
}

Get Profile → GET /api/auth/me
Header:

Authorization: Bearer <JWT_TOKEN>

### Development Notes
Ensure PostgreSQL is running locally before starting the server.

The DATABASE_URL should match your local Postgres credentials.

All validation errors are returned in a structured JSON format from express-validator.


