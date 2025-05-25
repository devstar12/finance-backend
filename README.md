# Finance Backend

A backend application for managing financial operations, built with Node.js, Express, TypeScript, and TypeORM.

## Features

- User management
- Health check endpoint
- Database integration with TypeORM
- Environment variable configuration using `dotenv`

## Prerequisites

- Node.js (v16 or later)
- PostgreSQL database
- TypeScript

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/devstar12/finance-backend.git
   cd finance-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following variables:
   ```env
   PORT=5000
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Build the project:
   ```bash
   npm run build
   ```

## Running the Application

### Development Mode
Start the application in development mode:
```bash
npm run dev
```

### Production Mode
Build and start the application:
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- **GET** `/api` - Returns the health status of the application.

### User Management
- **GET** `/api/users` - Fetch all users.
- **POST** `/api/users` - Create a new user.

## Database

This project uses TypeORM for database management. Ensure your PostgreSQL database is running and the connection string is correctly set in the `.env` file.

To run migrations:
```bash
npm run typeorm migration:run
```

## Scripts

- `npm run dev` - Start the application in development mode.
- `npm run build` - Compile TypeScript to JavaScript.
- `npm start` - Start the application in production mode.
- `npm run typeorm` - Run TypeORM CLI commands.

## License

This project is licensed under the ISC License.