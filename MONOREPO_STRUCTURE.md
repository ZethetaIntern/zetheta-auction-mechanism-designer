# ZeTheta Auction Mechanism Designer - Monorepo Structure

## Recommended Production-Grade Monorepo Architecture

This document outlines the enterprise-grade monorepo structure for the ZeTheta Auction Mechanism Designer project, designed for scalability, maintainability, and microservices orchestration.

## Directory Structure

```
zetheta-auction-mechanism-designer/
├── apps/                          # Frontend & Admin Applications
│   ├── web-client/               # React Web Application
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── auction/      # Auction display components
│   │   │   │   ├── bidding/      # Bidding interface components
│   │   │   │   └── shared/       # Reusable UI components
│   │   │   ├── pages/            # Page components
│   │   │   ├── hooks/            # Custom React hooks
│   │   │   ├── services/         # API service layer
│   │   │   └── utils/            # Utility functions
│   │   └── package.json
│   │
│   └── admin-portal/             # Admin Dashboard
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── services/
│       │   └── utils/
│       └── package.json
│
├── services/                      # Microservices
│   ├── auction-service/          # Auction Management Service
│   │   ├── src/
│   │   │   ├── controllers/      # HTTP request handlers
│   │   │   ├── services/         # Business logic
│   │   │   ├── models/           # Data models
│   │   │   └── routes/           # API routes
│   │   └── package.json
│   │
│   ├── bidding-service/          # Bid Processing Service
│   │   ├── src/
│   │   │   ├── handlers/         # WebSocket & event handlers
│   │   │   ├── validators/       # Bid validation logic
│   │   │   └── queue/            # Message queue integration
│   │   └── package.json
│   │
│   ├── matching-engine/          # Order Matching Engine
│   │   ├── src/
│   │   │   ├── algorithms/       # Matching algorithms
│   │   │   ├── order-book/       # Order book management
│   │   │   └── clearing/         # Auction clearing logic
│   │   └── package.json
│   │
│   ├── payment-service/          # Payment Processing
│   │   ├── src/
│   │   │   ├── processors/       # Payment processors
│   │   │   └── gateways/         # Payment gateway integration
│   │   └── package.json
│   │
│   └── notification-service/     # Real-time Notifications
│       ├── src/
│       │   ├── channels/         # Email, SMS, Push notifications
│       │   └── templates/        # Notification templates
│       └── package.json
│
├── packages/                      # Shared Libraries & Utilities
│   ├── database/                 # Prisma Schema & Migrations
│   │   ├── schema.prisma         # Data model definitions
│   │   ├── migrations/           # Database migrations
│   │   └── seeds/                # Database seeders
│   │
│   ├── shared-types/             # TypeScript Type Definitions
│   │   ├── auction.ts            # Auction types
│   │   ├── bid.ts                # Bid types
│   │   ├── order.ts              # Order types
│   │   ├── user.ts               # User types
│   │   └── index.ts              # Type exports
│   │
│   ├── auction-engine/           # Core Auction Algorithms
│   │   ├── src/
│   │   │   ├── english-auction.ts
│   │   │   ├── dutch-auction.ts
│   │   │   ├── sealed-bid-auction.ts
│   │   │   ├── vickrey-auction.ts
│   │   │   └── price-discovery.ts
│   │   └── package.json
│   │
│   └── utils/                    # Common Utilities
│       ├── logger.ts             # Logging utilities
│       ├── validators.ts         # Validation utilities
│       ├── crypto.ts             # Encryption utilities
│       └── errors.ts             # Custom error classes
│
├── infrastructure/               # DevOps & Deployment
│   ├── docker/
│   │   ├── Dockerfile.auction-service
│   │   ├── Dockerfile.bidding-service
│   │   ├── Dockerfile.web-client
│   │   └── Dockerfile.admin-portal
│   │
│   ├── kubernetes/
│   │   ├── auction-service.yaml
│   │   ├── bidding-service.yaml
│   │   ├── postgres-db.yaml
│   │   ├── redis-cache.yaml
│   │   └── ingress.yaml
│   │
│   └── terraform/
│       ├── main.tf               # Main terraform config
│       ├── variables.tf
│       ├── outputs.tf
│       └── aws/                  # AWS-specific configs
│
├── docs/                         # Documentation
│   ├── auction-theory.md         # Auction mechanism theory
│   ├── api.md                    # API documentation
│   ├── deployment.md             # Deployment guide
│   ├── architecture.md           # System architecture
│   └── development.md            # Development guide
│
├── docker-compose.yml            # Local development environment
├── MONOREPO_STRUCTURE.md        # This file
├── README.md                     # Project README
├── package.json                  # Root package with workspaces
├── tsconfig.json                 # Root TypeScript config
├── eslint.config.js              # ESLint configuration
├── prettier.config.js            # Prettier configuration
├── .gitignore                    # Git ignore rules
└── .env.example                  # Environment variables template
```

## Workspace Configuration

The monorepo uses Yarn Workspaces for dependency management:

```json
{
  "workspaces": [
    "apps/*",
    "services/*",
    "packages/*"
  ]
}
```

## Key Components

### Applications (apps/)
- **web-client**: React SPA for public auction participation
- **admin-portal**: Administrative dashboard for auction management

### Microservices (services/)
- **auction-service**: Manages auction lifecycle and state
- **bidding-service**: Handles real-time bid submissions and WebSocket connections
- **matching-engine**: Implements price discovery and order matching
- **payment-service**: Processes payments and settlements
- **notification-service**: Sends real-time notifications to participants

### Shared Libraries (packages/)
- **database**: Prisma ORM schema and migrations
- **shared-types**: TypeScript type definitions used across all services
- **auction-engine**: Core auction algorithms (English, Dutch, Sealed-bid, Vickrey)
- **utils**: Common utilities and helpers

### Infrastructure (infrastructure/)
- **docker/**: Container definitions for all services
- **kubernetes/**: Kubernetes manifests for orchestration
- **terraform/**: Infrastructure-as-Code for AWS deployment

## Development Workflow

### Install Dependencies
```bash
yarn install
```

### Run All Services
```bash
docker-compose up -d
yarn dev
```

### Build All Packages
```bash
yarn build
```

### Test All Services
```bash
yarn test
```

### Lint & Format
```bash
yarn lint
yarn format
```

## Technology Stack

- **Language**: TypeScript
- **Frontend**: React, Redux/Context API
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis
- **Real-time**: WebSocket (Socket.io)
- **Container**: Docker
- **Orchestration**: Kubernetes
- **IaC**: Terraform

## Service Communication

- **Synchronous**: REST APIs via HTTP
- **Asynchronous**: Message Queue (RabbitMQ/Kafka)
- **Real-time**: WebSocket for bidding updates
- **Data Sharing**: Shared PostgreSQL database

## Deployment Strategy

1. **Local Development**: Docker Compose for local testing
2. **Staging**: Kubernetes cluster with staging namespace
3. **Production**: Multi-zone Kubernetes cluster with auto-scaling

## Security Considerations

- API authentication via JWT tokens
- WebSocket authentication via token verification
- Database encryption at rest and in transit
- Environment-based configuration management
- Fraud detection service for bid validation

## Scalability

- Microservices architecture allows independent scaling
- Load balancing via Kubernetes Ingress
- Database read replicas for scaling read operations
- Redis caching layer for performance
- Horizontal pod autoscaling based on CPU/memory metrics
