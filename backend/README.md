# HelpDesk Lite MVP

An internal support-ticketing MVP backend built with Node.js, Express, and MongoDB.

## Tech Stack
- Runtime: Node.js + Express
- Database: MongoDB via Mongoose ODM
- Auth: JWT + bcryptjs
- Environment config: dotenv

## Setup Instructions

1. **Install Dependencies**
   If not already installed, run:
   ```bash
   npm install
   ```

2. **Environment Variables**
   Ensure you have a `.env` file in the root directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/helpdesk_lite
   JWT_SECRET=supersecretjwtkey123
   ```

3. **Start the Server**
   Start the development server with nodemon:
   ```bash
   npm run dev
   ```
   Or start it normally:
   ```bash
   npm start
   ```

## Testing API Endpoints
A `HelpDesk_Lite.http` file is provided in the root directory. You can use the **REST Client** extension in VSCode to test all endpoints. It includes examples for both success and failure cases as specified.
