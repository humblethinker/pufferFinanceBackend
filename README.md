# README for Backend API Service

## Overview
The backend API service provides an endpoint to retrieve historical blockchain data stored in the database. This API serves data for the frontend visualization.

## Prerequisites
- Node.js installed
- PostgreSQL database set up and accessible

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend-api-service
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variable:
   ```
   DATABASE_URL=your_postgresql_connection_string
   ```

## Running Locally
1. Ensure PostgreSQL is running and accessible.
2. Run the server:
   ```bash
   node server.js
   ```
3. The API will be available at `http://localhost:3000`.
4. You can access the data at the `/contract-history` endpoint.
