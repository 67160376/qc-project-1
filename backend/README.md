# QC Project - Backend

This is the Node.js + Express backend for the QC Project.

Prerequisites
- Docker & Docker Compose

Services
- api: Express app running on port 4000
- db: PostgreSQL database
- frontend: (existing) frontend service (left untouched)

Run with Docker Compose

1. Copy environment sample if needed:
   - backend/.env.example -> backend/.env (optional; compose passes env via service environment)

2. Start the stack:
   docker-compose up --build

The API will be available at http://localhost:4000

Health check:
GET /health

Auth endpoints:
POST /api/v1/register
POST /api/v1/login
POST /api/v1/logout
POST /api/v1/change-password

Other endpoints follow the routes described in the project README.

Notes
- Database init script located at /database/init.sql (mounted into postgres init folder by docker-compose)
- Default admin user: username `admin` / password `admin123` (created during init.sql). Change in production.
