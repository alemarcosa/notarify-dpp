# Notarify — Digital Product Passport Platform

A production-ready fullstack application for creating, managing, and publishing Digital Product Passports (DPP). Companies can register products with detailed information — materials, sustainability metrics, certifications, and documents — then generate QR codes that link to public passport pages.

## Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose v2
- Node.js 20+ (only for local development outside Docker)

### Run with Docker (recommended)

```bash
# Clone the repository
git clone <repo-url> notarify-dpp
cd notarify-dpp

# Copy environment variables
cp .env.example .env

# Start all services
docker-compose up --build

# In a separate terminal, run migrations and seed data
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma db seed
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Swagger Docs**: http://localhost:3001/api/docs

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Administrator | admin@notarify.io | Admin123! |
| Editor | editor@notarify.io | Editor123! |

### Local Development

If you prefer running services directly on your machine:

```bash
# Start only database and cache
docker-compose up postgres redis

# Backend
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run start:dev

# Frontend (separate terminal)
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

## Project Structure

```
notarify-dpp/
├── docker-compose.yml          # Service orchestration
├── backend/                    # NestJS API server
│   ├── prisma/                 # Database schema, migrations, seed
│   ├── src/
│   │   ├── common/             # Guards, filters, interceptors, decorators
│   │   ├── modules/
│   │   │   ├── auth/           # JWT authentication
│   │   │   ├── users/          # User management
│   │   │   ├── products/       # Product CRUD + publish
│   │   │   ├── passports/      # Public passport serving + scan tracking
│   │   │   ├── analytics/      # Scan analytics
│   │   │   ├── dashboard/      # Dashboard statistics
│   │   │   └── files/          # File upload and serving
│   │   ├── prisma/             # Prisma service (global)
│   │   └── redis/              # Redis caching service
│   └── test/                   # E2E tests
├── frontend/                   # Next.js web application
│   └── src/
│       ├── app/                # App Router pages
│       ├── components/         # Reusable UI components
│       ├── hooks/              # Custom React hooks (TanStack Query)
│       ├── lib/                # API client, auth utilities
│       ├── types/              # TypeScript type definitions
│       └── theme/              # MUI theme configuration
└── docs/                       # Architecture documentation
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend Framework | NestJS |
| Database | PostgreSQL 16 |
| ORM | Prisma |
| Cache | Redis 7 |
| Auth | JWT (passport-jwt) |
| API Docs | Swagger / OpenAPI |
| Frontend Framework | Next.js 14 (App Router) |
| UI Library | Material UI v6 |
| Data Fetching | TanStack Query |
| Charts | Recharts |
| Containerization | Docker + Docker Compose |

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Authenticate user |
| GET | `/api/auth/me` | Current user profile |
| GET | `/api/products` | List products (paginated) |
| POST | `/api/products` | Create product |
| GET | `/api/products/:id` | Get product details |
| PATCH | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Soft delete product |
| POST | `/api/products/:id/publish` | Publish product passport |
| GET | `/api/passport/:uuid` | Public passport page data |
| GET | `/api/analytics` | Scan analytics |
| GET | `/api/dashboard` | Dashboard statistics |
| POST | `/api/files/upload` | Upload file |
| GET | `/api/files/:id` | Download file |

Full API documentation is available at `/api/docs` when the server is running.

## Available Commands

### Backend

```bash
npm run start:dev          # Development server with hot reload
npm run build              # Production build
npm run lint               # ESLint check
npm run test               # Unit tests
npm run test:e2e           # End-to-end tests
npx prisma studio          # Database GUI
npx prisma migrate dev     # Create and apply migrations
npx prisma db seed         # Seed database
```

### Frontend

```bash
npm run dev                # Development server
npm run build              # Production build
npm run lint               # ESLint check
```

## Environment Variables

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | — |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | Secret key for JWT signing | — |
| `UPLOAD_DIR` | File upload directory | `./uploads` |
| `PORT` | Server port | `3001` |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001` |

## License

Private — All rights reserved.
