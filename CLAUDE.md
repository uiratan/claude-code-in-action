# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. Users describe React components in natural language, and Claude AI generates the code which is rendered in a live preview and can be edited.

## Commands

```bash
npm run dev           # Start development server (Turbopack)
npm run build         # Production build
npm run lint          # ESLint
npm run test          # Run all tests with Vitest
npx vitest <pattern>  # Run a single test file (e.g., npx vitest file-system)
npm run setup         # Install deps + Prisma generate + migrate
npm run db:reset      # Reset database
```

## Architecture

### App Structure (Next.js 15 App Router)
- `/src/app/page.tsx` - Home route: redirects authenticated users to their most recent project, shows main interface for anonymous users
- `/src/app/[projectId]/page.tsx` - Project detail page (protected route)
- `/src/app/api/chat/route.ts` - AI chat endpoint: processes messages, executes AI tools, persists project data

### State Management (React Context)
Two primary contexts wrap the application:
- `FileSystemProvider` (`@/lib/contexts/file-system-context.tsx`) - Manages VirtualFileSystem state, handles AI tool calls for file operations
- `ChatProvider` (`@/lib/contexts/chat-context.tsx`) - Wraps Vercel AI SDK's `useChat`, manages messages and input state

Usage hierarchy: `FileSystemProvider` → `ChatProvider` → `MainContent`

### Virtual File System
`VirtualFileSystem` class (`@/lib/file-system.ts`) provides in-memory file operations. No files are written to disk. The file system serializes to JSON for database persistence.

### AI Integration
The chat API provides two tools to Claude:
- `str_replace_editor` - File operations (create, str_replace, insert, view)
- `file_manager` - Rename/delete files

If `ANTHROPIC_API_KEY` is not set, a mock provider returns static component code.

### Server Actions (`@/actions/`)
- Auth operations: `signUp`, `signIn`, `signOut`, `getUser`
- Project CRUD: `createProject`, `getProject`, `getProjects`

### Database
SQLite via Prisma. Generated client at `src/generated/prisma/`.

The database schema is defined in `prisma/schema.prisma`. Reference it anytime you need to understand the structure of data stored in the database.

Key design: `messages` and `data` columns store JSON strings (denormalized for simplicity).

### Path Alias
`@/*` maps to `./src/*`

## Code Style

- Use comments sparingly. Only comment complex code.
