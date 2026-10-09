# Architecture Document — Notarify DPP Platform

## 1. System Architecture

Notarify follows a classic three-tier architecture deployed as containerized services via Docker Compose.

### High-Level Components

```
┌──────────────────────────────────────────────────────────┐
│                      Docker Compose                       │
│                                                           │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────┐  │
│  │  Frontend    │    │   Backend    │    │  PostgreSQL  │  │
│  │  Next.js 14  │───▶│  NestJS      │───▶│  16-alpine   │  │
│  │  Port 3000   │    │  Port 3001   │    │  Port 5432   │  │
│  └─────────────┘    └──────┬───────┘    └─────────────┘  │
│                            │                              │
│                      ┌─────┴──────┐    ┌─────────────┐   │
│                      │  Uploads   │    │    Redis     │   │
│                      │  (Volume)  │    │  7-alpine    │   │
│                      └────────────┘    └─────────────┘   │
└──────────────────────────────────────────────────────────┘
```

**Frontend (Next.js)** serves the back office UI and the public passport pages. It communicates with the backend exclusively through the REST API. The public passport page is server-side rendered for SEO and fast initial loads.

**Backend (NestJS)** exposes a RESTful API with JWT-based authentication. It handles all business logic, file uploads, QR code generation, and analytics tracking. The API is organized into independent modules following NestJS conventions.

**PostgreSQL** stores all persistent data — users, products, passports, scan events, audit logs. Prisma ORM provides type-safe database access with automatic migration management.

**Redis** acts as a caching layer for frequently accessed data: dashboard statistics, analytics aggregations, and public passport pages. The application degrades gracefully if Redis is unavailable.

**File Storage** uses a Docker volume mounted to the backend container. Files are organized by year/month for manageable directory sizes.

### Request Flow

1. User interacts with the frontend (browser)
2. Frontend sends API requests to the backend (Axios + JWT)
3. Backend validates the request (guards, pipes)
4. Business logic executes (service layer)
5. Prisma queries PostgreSQL, Redis caches are checked/updated
6. Response flows back through interceptors (formatting, audit logging)

### Public Passport Flow

1. End user scans QR Code on a physical product
2. QR redirects to `https://domain.com/passport/{uuid}`
3. Next.js server fetches passport data from backend API
4. Backend registers a scan event (IP, browser, OS, country)
5. Page renders with full product passport information
6. No authentication required — fully public

## 2. Design Decisions

### Why NestJS over Express?

NestJS provides an opinionated, modular architecture out of the box. For a project with multiple domains (products, passports, analytics, auth), its module system keeps code organized without manual architecture decisions. The built-in dependency injection, guard system, and interceptor pipeline reduce boilerplate significantly. Swagger integration is first-class.

### Why Prisma over TypeORM?

Prisma offers better TypeScript integration with auto-generated types from the schema. The schema file serves as a single source of truth for the database structure, making it easy for anyone to understand the data model at a glance. Migrations are deterministic and trackable. The query API is intuitive and prevents common mistakes.

### Caching Strategy

We use a **cache-aside pattern**: the application checks Redis first, and on a cache miss, queries the database and populates the cache. TTLs are chosen based on data volatility:

- Dashboard stats: 30 seconds (frequently changing during active use)
- Analytics aggregations: 60 seconds (acceptable staleness for aggregate data)
- Public passport data: 5 minutes (rarely changes after publication)

The application works without Redis — if the connection fails, we skip caching entirely and query the database directly.

### File Storage Approach

For this assessment, files are stored on the local filesystem within a Docker volume. This keeps the setup self-contained without external service dependencies. In production, swapping to S3 or MinIO would require changing only the storage service implementation — the rest of the application uses a `FileUpload` database record that abstracts the physical storage location.

### Soft Delete Pattern

Products and users support soft delete via a `deletedAt` timestamp. A Prisma middleware automatically filters deleted records from all queries, so the rest of the codebase doesn't need to worry about it. This allows data recovery and maintains referential integrity with existing passports and audit logs.

### QR Code Generation

When a product is published, the backend generates a UUID v4 as the passport identifier and creates a QR Code PNG image using the `qrcode` library. The QR encodes the full public URL (`{frontend_url}/passport/{uuid}`). The image is stored alongside other uploaded files.

## 3. Database Design

The database follows third normal form (3NF) with practical denormalizations where needed.

### Key Design Choices

**UUID Primary Keys**: All tables use UUIDs instead of auto-incrementing integers. This avoids sequential ID enumeration attacks, simplifies distributed systems, and makes the public passport URL non-guessable.

**Centralized File Storage**: A single `file_uploads` table tracks all uploaded files. Products, certifications, and documents reference files through foreign keys. This avoids duplicate storage logic and simplifies file cleanup.

**One-to-One Relationships**: `Sustainability` and `ProductPassport` have 1:1 relationships with `Product`. They're separate tables because they represent distinct domains and may not exist for every product (sustainability data is optional, passport is created only on publish).

**Audit Logging**: The `audit_logs` table captures every create, update, and delete operation with before/after JSON snapshots. This provides a complete change history without complicating individual table schemas.

### Indexes

- `users.email` (unique) — login lookups
- `products.sku` (unique) — product identification
- `product_passports.passport_uuid` (unique) — public URL resolution
- `scan_events.scanned_at` — analytics date-range queries
- `scan_events.passport_id` — per-passport scan counts

### Data Volume Estimates

For a typical deployment managing ~1,000 products:
- Products + relations: ~5,000 rows across all tables
- Scan events: 10,000-100,000 rows/year (depends on traffic)
- Audit logs: ~20,000 rows/year

PostgreSQL handles this scale comfortably without partitioning or sharding.

## 4. Security Approach

### Authentication

- **Password Hashing**: bcrypt with 12 salt rounds. Passwords are never stored in plaintext or logged.
- **JWT Tokens**: Access tokens expire after 24 hours. Tokens contain minimal claims (user ID, email, role).
- **Token Transmission**: Sent via Authorization header (Bearer scheme). No cookies to avoid CSRF complexity.

### Authorization

- **Role-Based Access Control (RBAC)**: Two roles — Administrator and Editor.
- Administrators can manage users and access all features.
- Editors can manage products but cannot manage users.
- A custom `RolesGuard` with `@Roles()` decorator enforces access at the controller level.

### Input Validation

- All API inputs are validated with `class-validator` decorators on DTOs.
- `whitelist: true` strips unknown properties.
- `forbidNonWhitelisted: true` rejects requests with unexpected fields.
- File uploads validate MIME types and enforce size limits.

### SQL Injection Prevention

Prisma parameterizes all queries by default. We never construct raw SQL from user input.

### Additional Measures

- **Helmet**: Sets security-related HTTP headers (X-Frame-Options, X-Content-Type-Options, etc.)
- **CORS**: Restricted to the frontend origin.
- **Rate Limiting**: Can be added via `@nestjs/throttler` for production.
- **File Upload Limits**: 10MB max, restricted MIME types.

## 5. Scalability Considerations

### Current Architecture Scalability

The backend is **stateless** (no server-side sessions), so horizontal scaling is straightforward — add more backend containers behind a load balancer. File uploads would need to move to shared storage (S3/MinIO).

**Database scaling options:**
- **Read replicas** for analytics queries (heaviest reads)
- **Connection pooling** via PgBouncer for high concurrency
- **Table partitioning** on `scan_events` by month if volume grows significantly

**Caching improvements:**
- Redis Cluster for high availability
- More aggressive caching of product data
- CDN for static file serving (images, QR codes, documents)

### Bottleneck Analysis

The most likely bottleneck is the `scan_events` table under high scan volume. Mitigations:
1. Batch insert scan events via a queue (Bull/Redis)
2. Partition the table by month
3. Aggregate old data into summary tables

## 6. Possible Future Improvements

- **Multi-Tenancy**: Support multiple companies/organizations, each with isolated data and branding.
- **Webhook Notifications**: Notify external systems when products are published or passports are viewed.
- **OAuth / SSO**: Support Google, Microsoft, and SAML-based enterprise authentication.
- **Blockchain Integration**: Record passport hashes on a blockchain for tamper-proof verification.
- **Real-Time Updates**: WebSocket notifications for scan events and dashboard updates.
- **i18n**: Multi-language support for public passport pages.
- **PDF Export**: Generate downloadable PDF versions of product passports.
- **Advanced Analytics**: Geolocation-based scan maps, conversion funnels, comparison dashboards.
- **API Rate Limiting**: Per-user and per-endpoint throttling for production.
- **CI/CD Pipeline**: Automated testing, building, and deployment via GitHub Actions.
