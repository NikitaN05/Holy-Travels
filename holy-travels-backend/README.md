# Holy Travels Backend API

A Node.js + Express + TypeScript backend for the Holy Travels application with JWT authentication, role-based access control, and PostgreSQL database using Prisma ORM.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/holy_travels?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=8080
NODE_ENV=development
```

### 3. Setup Database

Run Prisma migrations to create the database tables:

```bash
npm run migrate
```

### 4. Seed the Database

Seed the database with initial data (OWNER user and sample tour):

```bash
npm run seed
```

This creates:
- **OWNER user**: `owner@holytravels.com` / `admin123`
- **Sample tour**: Sacred Jerusalem Pilgrimage

### 5. Start the Server

**Development mode** (with hot reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm run build
npm start
```

The server will start on `http://localhost:8080` (or the port specified in `PORT` env variable).

## API Endpoints

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/health` | Health check |

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new traveller | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/me` | Get current user info | Yes |

### Tours (Public)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/tours` | Get all tours | No |
| GET | `/tours/:id` | Get tour by ID | No |

### Owner Routes (OWNER role required)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/owner/tours` | Create new tour | Yes (OWNER) |
| PATCH | `/owner/tours/:id` | Update tour | Yes (OWNER) |
| DELETE | `/owner/tours/:id` | Delete tour | Yes (OWNER) |

## User Roles

- **OWNER**: Can create, update, and delete tours
- **TRAVELLER**: Default role for registered users (can view tours)

## Authentication

The API uses JWT Bearer tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Register a New User

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "traveller@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@holytravels.com",
    "password": "admin123"
  }'
```

### Create a Tour (OWNER only)

```bash
curl -X POST http://localhost:8080/owner/tours \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Vatican City Tour",
    "description": "Explore the holy sites of Vatican City",
    "destination": "Vatican City, Italy",
    "price": 1899.99,
    "duration": 5,
    "startDate": "2025-04-01",
    "endDate": "2025-04-06",
    "maxCapacity": 25
  }'
```

## CORS Configuration

The API allows requests from:
- `https://holy-travels.netlify.app`
- `http://localhost:5173`

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run migrate` | Run Prisma migrations |
| `npm run seed` | Seed the database |

## Project Structure

```
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding script
├── src/
│   ├── controllers/       # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── owner.controller.ts
│   │   └── tour.controller.ts
│   ├── lib/
│   │   └── prisma.ts      # Prisma client instance
│   ├── middleware/
│   │   ├── auth.ts        # JWT authentication
│   │   └── rbac.ts        # Role-based access control
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── owner.routes.ts
│   │   └── tour.routes.ts
│   ├── types/
│   │   └── index.ts       # TypeScript type definitions
│   └── index.ts           # Application entry point
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

## License

ISC

