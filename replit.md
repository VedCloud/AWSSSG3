# AWS Services Explorer

## Overview

This is a full-stack web application built for exploring AWS services. It features a React frontend with a Node.js Express backend, designed to help users discover and learn about various AWS services through an interactive, searchable interface.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL session store
- **Development**: TSX for TypeScript execution

### Data Storage
- **Database**: PostgreSQL configured via Drizzle ORM
- **ORM**: Drizzle with Zod for schema validation
- **Session Storage**: PostgreSQL sessions using connect-pg-simple
- **Fallback**: In-memory storage implementation for development

## Key Components

### Database Schema
The application uses a single `aws_services` table with the following structure:
- `id`: Primary key (serial)
- `name`: Service short name (e.g., "EC2")
- `full_name`: Complete service name (e.g., "Amazon Elastic Compute Cloud")
- `category`: Service category (Compute, Storage, Database, etc.)
- `color`: Theme color for UI display
- `icon`: Icon filename for visual representation
- `link`: Documentation URL

### API Endpoints
- `GET /api/services` - Retrieve all AWS services
- `GET /api/services/category/:category` - Filter services by category
- `GET /api/services/search?q=query` - Search services by name or description
- `POST /api/services` - Create new service (admin functionality)

### UI Components
- **Service Tiles**: Interactive cards displaying service information
- **Search & Filter**: Real-time search with category filtering
- **Theme Support**: Light/dark mode toggle
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Data Flow

1. **Client Request**: User interacts with the frontend (search, filter, browse)
2. **API Call**: React Query manages HTTP requests to Express backend
3. **Database Query**: Express routes query PostgreSQL via Drizzle ORM
4. **Response**: Data flows back through the stack to update the UI
5. **Caching**: React Query handles client-side caching for performance

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL (cloud-hosted)
- **UI Library**: Radix UI primitives with shadcn/ui
- **Icons**: Lucide React icons + React Icons for AWS branding
- **Validation**: Zod for runtime type checking

### Development Tools
- **Bundler**: Vite with React plugin
- **TypeScript**: Full type safety across the stack
- **ESBuild**: Production build optimization
- **Replit Integration**: Development environment plugins

## Deployment Strategy

### Development
- **Local Development**: `npm run dev` starts both frontend and backend
- **Hot Reloading**: Vite provides instant frontend updates
- **Database**: Uses environment variable `DATABASE_URL` for PostgreSQL connection

### Production Build
- **Frontend**: `vite build` creates optimized static assets
- **Backend**: `esbuild` bundles server code for Node.js
- **Static Serving**: Express serves built frontend assets in production
- **Process**: Single Node.js process handles both API and static file serving

### Environment Configuration
- **Database**: Requires `DATABASE_URL` environment variable
- **Session**: Uses PostgreSQL for session persistence
- **Build**: Different configurations for development vs production

## Changelog

Changelog:
- July 07, 2025. Initial setup
- July 07, 2025. Added comprehensive microservices category with 25 popular services including MongoDB, Redis, PostgreSQL, Docker, Kubernetes, and monitoring tools
- July 07, 2025. Added certification track highlighting feature with 15 AWS certification tracks and comprehensive filtering system. All 240+ services now include relevant certification track assignments for AWS learning paths.
- July 07, 2025. Implemented real-time AWS service status monitoring with Health Dashboard integration. Features include operational/degraded/outage status indicators, status dots on service tiles, auto-refresh functionality, and simulated health check API endpoints.

## User Preferences

Preferred communication style: Simple, everyday language.