# Real-Time Multiplayer Chess Application

A full-stack **real-time multiplayer chess application** built using **React.js, Tailwind CSS, Express.js, WebSockets, PostgreSQL, Redis, Drizzle ORM, and Turborepo**.

The application enables players to play live chess matches with real-time synchronization, persistent game storage, and scalable backend architecture. The frontend, backend, WebSocket server, and shared packages are organized using a Turborepo monorepo structure.

## Features

- ️ Real-time multiplayer chess gameplay
-  Real-time game state updates between connected players
- ️ Chess clock management with real-time timers
- ️ Persistent game and user data storage using PostgreSQL
-  Redis-based local game state management for fast access
-  Shared packages using Turborepo monorepo architecture
-  User and friendship management system
-  Chess move support 

---
# Tech Stack

Frontend: React.js, TailwindCss
Backend: Express.js, WebSockets
Database : PostgresSQL, drizzle as ORM

Redis is used for storing temporary local game state for active matches.

# Folder Structure

```text
├── .turbo/
├── apps/
│   ├── apis/                  # Express.js backend API service
│   ├── client/                # React.js frontend application
│   └── ws/                    # WebSocket server for real-time communication
├── node_modules/
├── packages/
│   ├── chess-utils/           # Shared chess logic and utilities
│   ├── database/              # Drizzle ORM schema and PostgreSQL setup
│   ├── eslint-config/         # Shared ESLint configuration
│   ├── redis/                 # Redis client and game state utilities
│   ├── typescript-config/     # Shared TypeScript configuration
│   └── ui/                    # Shared UI components
├── .gitignore
├── .npmrc
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
└── turbo.json
```

# Architecture Overview

The application follows a monorepo architecture using Turborepo.

- React client handles the user interface and chess interactions.
- Express API handles REST-based backend operations.
- WebSocket server manages real-time multiplayer communication.
- Redis stores active game states for fast access.
- PostgreSQL stores permanent data such as users, games, and moves.

# Redis Game State Management

Redis is used for storing temporary game state for active matches.

Stored information:

- Current board position (FEN)
- Player information
- Current turn
- Remaining chess clock time
- Game status

Redis allows fast updates during gameplay without continuously querying PostgreSQL.

After the game finishes, the final game state and move history are stored permanently in PostgreSQL.
