# TipForge Backend

Core system for TipForge — payment orchestration, creator management, and Stellar integration.

## Purpose

The backend is the authoritative system that:

- Manages user authentication and creator profiles
- Handles payment orchestration and USDC settlement
- Integrates with Stellar blockchain
- Tracks transactions and payouts
- Exposes REST APIs consumed by SDK and frontend

**Design principle:** Backend = source of truth. All business logic, data consistency, and payment rules live here.

## Tech Stack

- **Framework:** Fastify (Node.js/TypeScript)
- **Database:** PostgreSQL + Prisma ORM
- **Cache/Queue:** Redis + BullMQ
- **Blockchain:** Stellar SDK + Soroban for contracts
- **Auth:** JWT

## Prerequisites

- Node.js 20+ LTS
- PostgreSQL 14+
- Redis 6+

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

### 3. Setup database

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Start development server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

## Project Structure

```
src/
├── config/       # Configuration (env, etc)
├── types/        # API contracts & types (source of truth for SDK)
├── routes/       # API endpoints
├── services/     # Business logic
├── middleware/   # Auth, validation, error handling
├── utils/        # Helpers (logger, errors)
└── index.ts      # Entry point

prisma/
├── schema.prisma # Database schema
└── migrations/   # Schema versions
```

## API Contracts

All API types are defined in `src/types/index.ts`. This is the **source of truth** that:

1. Backend implements
2. SDK wraps
3. Frontend consumes

### Key endpoints (planned)

```
POST   /api/v1/auth/signup          # Register user
POST   /api/v1/auth/login           # Login
POST   /api/v1/creators/register    # Register as creator
GET    /api/v1/creators/:id         # Get creator profile
POST   /api/v1/tips                 # Create tip transaction
GET    /api/v1/tips/history         # Get transaction history
```

## Scripts

```bash
npm run dev              # Start dev server (watch mode)
npm run build            # Compile TypeScript
npm run start            # Run production build
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run test             # Run tests
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
```

## Code Standards

- **TypeScript:** Strict mode enabled (no `any` types)
- **Formatting:** Prettier (100 char line width)
- **Linting:** ESLint + TypeScript rules
- **Logging:** Structured logging via `logger` utility
- **Errors:** Use custom `AppError` classes for consistency

## Database Schema

Key models:

- **User** — accounts (email, password, profile)
- **Creator** — extended profile for creators
- **SocialProfile** — linked social accounts (X, Instagram, etc)
- **Wallet** — Stellar wallet connections
- **Transaction** — tip payments
- **PayoutRecord** — creator payouts
- **Session** — JWT session tracking

See `prisma/schema.prisma` for full schema.

## Integration with SDK

The backend types in `src/types/index.ts` are the contract that `tipforge-sdk` builds upon. Any backend change affects the SDK surface.

## Development

### Adding a new endpoint

1. Define types in `src/types/index.ts` (the contract)
2. Implement service logic in `src/services/`
3. Add route in `src/routes/`
4. Test the endpoint
5. SDK will consume this contract automatically

### Adding a database model

1. Add to `prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Update types if API-exposed

## Testing

Tests use Vitest. Run:

```bash
npm run test        # Single run
npm run test:watch  # Watch mode
```

## Notes

- This backend is the **system anchor** — changes here ripple to SDK and frontend
- Always keep types in sync with implementation
- Use middleware for cross-cutting concerns (auth, validation, logging)
- Payment logic is isolated in dedicated service
