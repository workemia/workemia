# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Dev server**: `npm run dev` - Start development server on port 3000
- **Build**: `npm run build` - Build production version
- **Lint**: `npm run lint` - Run ESLint to check code quality
- **Start**: `npm start` - Start production server

## Architecture Overview

**ServiceHub** is a Next.js 15 service marketplace application that connects clients with service providers. Built with React 19, TypeScript, and Supabase as the backend.

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Backend**: Supabase (PostgreSQL database, authentication)
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: React Context (NotificationsContext)
- **Maps**: Leaflet for interactive maps
- **Analytics**: Vercel Analytics & Speed Insights

### Core Architecture

**Database Layer** (`lib/`):
- `supabase.ts` - Main Supabase client with auth helpers
- `supabase/client.ts`, `supabase/server.ts`, `supabase/middleware.ts` - Environment-specific clients
- `database.types.ts` - Generated TypeScript types for database schema
- SQL scripts in `scripts/` define database structure with users, providers, services, and notifications

**Application Structure**:
- App Router with nested layouts
- Role-based routing (`/dashboard/cliente`, `/dashboard/prestador`)
- Authentication flow with `/auth/callback` and `/login`
- Specialized pages for services, notifications, and user management

**Key Features**:
- **User Types**: client, provider, admin with different dashboards
- **Service Marketplace**: Request/offer services with status tracking
- **Real-time Notifications**: Context-based notification system
- **Interactive Maps**: Location-based service discovery
- **Rating System**: Provider reviews and ratings
- **Theme System**: Light/dark mode with CSS variables

### Component Organization

**UI Components** (`components/ui/`): Reusable Radix-based components
**Feature Components** (`components/`): Business logic components
**Contexts** (`contexts/`): Global state management
**Hooks** (`hooks/`): Custom React hooks for data fetching

### Database Schema

Core entities: `users`, `providers`, `services`, `service_requests`, `notifications`, `reviews`, `payments`
- Users can be clients, providers, or admins
- Services have status tracking (pending → accepted → in_progress → completed)
- Notification system with real-time updates
- Payment processing with status tracking

### Development Notes

- TypeScript errors and ESLint warnings are ignored in builds (next.config.mjs)
- Images are unoptimized for development
- Uses pnpm as package manager
- Theme system uses CSS custom properties
- Supabase auth with middleware for protected routes