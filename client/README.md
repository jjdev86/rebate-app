### Client – Smart Benefit Claim Portal
Frontend for the Smart Benefit Claim Portal.
Built with React (Vite) and Tailwind CSS.

### Features
- Responsive user interface for authentication and rebate management
- Register and Login forms
- Profile display via /me route
- Form validation using built-in HTML5 and React techniques
- Styled with Tailwind CSS for rapid development

### Tech Stack
- React (Vite)
- Tailwind CSS
- Axios for HTTP requests
- React Router for client-side routing

Installation & Setup
1. Install dependencies
```bash

cd client
npm install

```
2. Environment Variables
Create a .env file inside client/ (optional for API base URL):
```bash
VITE_API_URL=http://localhost:5000/api
```
.env is already in .gitignore.

3. Start the Frontend
```bash
npm run dev
```
The client will run at:

http://localhost:5173


### Usage
- Open the app in your browser at the Vite dev server URL
- Register a new user and log in
- View your profile
- Interact with the backend API via the forms

### Development Notes
- Ensure the backend server is running before using the frontend
- Axios requests use VITE_API_URL to dynamically point to your server
- Tailwind CSS classes are already configured for responsive design