# Weaver Backend

Backend service for Weaver - A reputation score platform for Starknet users and projects.

## Prerequisites

-   Node.js (v16 or higher)
-   MongoDB
-   npm or yarn

## Setup

1. Clone the repository

    ```
    git clone [your-repo-link]
    cd weaver-backend
    ```

2. Install dependencies

    ```
    npm install
    ```

3. Environment Setup
   Create a `.env` file in the root directory with the following variables:
    ```
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/weaver
    ```

## Running the Application

Development mode:
`    npm run dev
   `

Production mode:
`    npm start
   `

## API Endpoints

### Users

-   POST /api/register - Register a new user
    ```
    {
        "address": "0x...",
        "username": "user123"
    }
    ```
-   GET /api/users - Get all users

## Project Structure

    weaver-backend/
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   └── app.js
    ├── .env
    ├── .gitignore
    └── package.json

## Available Scripts

-   `npm start` - Run the server
-   `npm run dev` - Run the server with nodemon (development mode)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
