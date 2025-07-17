# Bleater-sync

A Twitter-like microblogging application where users can scream angry messages, like posts, and argue with other users. Built with React, TypeScript, Supabase, and Zero Sync Engine for local-first capabilities.

![Bleater Logo](/public/logo.png)

## Features

- User authentication (sign up, sign in, sign out)
- Create and view posts
- Like/unlike posts
- Local-first with seamless sync using Zero
- User profiles
- Responsive design

## Architecture

### Frontend

- **React 19.1** with TypeScript for the UI
- **Vite** for fast development and optimized builds
- **TanStack Router** for type-safe routing
- **Rocicorp Zero** for local-first data sync and state management
- Custom styling

### Backend

- **Supabase** for backend services:
  - Authentication & User Management
  - PostgreSQL Database
- **Zero Sync Engine** for:
  - Local-first data access
  - Conflict-free data synchronization
  - Real-time updates

### Database Schema

- **post**: Stores user posts with message content and creation timestamp
- **profiles**: Contains user profile information
- **likes**: Junction table to track post likes by users

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- pnpm (preferred) or npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/foxaltus/bleater-sync.git
   cd bleater-sync
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create a `.env` file in the root directory based on the provided `.env.example`, then update the values in the `.env` file:

   ```bash
   # Client-side environment variables
   VITE_SUPABASE_URL=https://xwpazbmcghdjsygjluqs.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3cGF6Ym1jZ2hkanN5Z2psdXFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4Mzg1OTcsImV4cCI6MjA2NjQxNDU5N30.5BYCp5TB4haOzin3bwJXS6xzx3WzqR-t1qrqtvWrRM8
   VITE_PUBLIC_SERVER=http://localhost:4848

   # Zero Cache server environment variables
   ZERO_UPSTREAM_DB="postgresql://postgres:[YOUR-PASSWORD]@db.xwpazbmcghdjsygjluqs.supabase.co:5432/postgres"
   ZERO_REPLICA_FILE="/tmp/bleater.db"
   ZERO_SCHEMA_PATH="src/lib/zero/schema.ts"
   ZERO_AUTH_SECRET=your-supabase-jwt-secret
   ZERO_PUSH_URL="http://localhost:3000/api/zero/push"
   ```

### Running the App

1. Start the development servers:

   ```bash
   # In one terminal, start the Zero Cache server
   pnpm dev:zero

   # In another terminal, start the UI server
   pnpm dev:ui
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Building for Production

```bash
pnpm build
```

The build output will be in the `dist` directory.

## Deployment

### Frontend

You can deploy the frontend (both static files and server functions) to a hosting service such as Netlify.

You will need to specify the following environment variables:

```bash
VITE_SUPABASE_URL=https://xwpazbmcghdjsygjluqs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3cGF6Ym1jZ2hkanN5Z2psdXFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4Mzg1OTcsImV4cCI6MjA2NjQxNDU5N30.5BYCp5TB4haOzin3bwJXS6xzx3WzqR-t1qrqtvWrRM8
VITE_PUBLIC_SERVER=your-zero-service-url
ZERO_AUTH_SECRET=your-supabase-jwt-secret
ZERO_UPSTREAM_DB="postgresql://postgres.xwpazbmcghdjsygjluqs:[YOUR-PASSWORD]@aws-0-eu-west-3.pooler.supabase.com:6543/postgres"
```

> **_NOTE:_** Netlify functions do not support IPv6, so make sure to use the Transaction Pooler URL for the upstream DB if using Supabase.

### Zero service

You can deploy the Zero service on any environment that supports Docker.

Here is an example of Docker Compose file:

```yaml
services:
  zero_cache:
    image: "registry.hub.docker.com/rocicorp/zero:latest"
    environment:
      - "ZERO_UPSTREAM_DB=${ZERO_UPSTREAM_DB}"
      - "ZERO_AUTH_SECRET=${ZERO_AUTH_SECRET}"
      - "ZERO_PUSH_URL=${ZERO_PUSH_URL}"
      - ZERO_REPLICA_FILE=/zero_data/bleater_replica.db
    volumes:
      - "replica:/zero_data"
    networks:
      - "ip6net"
    ports:
      - 4848:4848

volumes:
  replica: null
networks:
  ip6net:
    enable_ipv6: true
```

Using the following environment variables:

```bash
ZERO_AUTH_SECRET=your-supabase-jwt-secret
ZERO_UPSTREAM_DB="postgresql://postgres:[YOUR-PASSWORD]@db.xwpazbmcghdjsygjluqs.supabase.co:5432/postgres"
ZERO_PUSH_URL="[WEBSITE-URL]/api/zero/push"
```

> **_NOTE:_** Zero requires that you use a direct connection string (not the pooler).

In order to access the Zero service securely, make sure the URL is accessible via HTTPS. If your server does not provide
SSL, use a tunnel, such as Cloudflare Tunnel, ngrok, Tailscale Funnel or localhost.run for this.

## License

MIT
