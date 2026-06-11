# Changelog

All notable changes to Recipe Scaling Engine will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2.0.0] - 2026-02-11

### 🎉 Major Changes
- **Migration from Next.js to Vite SPA** - Complete rewrite as single-page application
- **Standalone Express Backend** - Separate backend server with RESTful API
- **JWT Authentication** - Replaced NextAuth with custom JWT implementation

### ✨ Added
- Express server with 9 API endpoints (recipes + auth)
- JWT-based authentication system
- Prisma ORM with 9 database models
- 4 scaling algorithms (linear, logarithmic, sqrt, fixed)
- Unit conversion system (metric ↔ imperial)
- AI recipe parsing with Groq SDK
- Zod validation (client + server)
- Complete CRUD for recipes
- Like system for recipes
- Advanced filtering and sorting
- Public/private recipe sharing
- User preferences management
- React Router v6 for client-side routing
- Chakra UI v3 components
- Comprehensive documentation:
  - README.md (main project overview)
  - README.SPA.md (SPA-specific guide)
  - PROJECT_STATUS.md (detailed status)
  - TASKS.md (development roadmap)
  - CONTRIBUTING.md (contribution guidelines)
  - Skills documentation in `.github/skills/`

### 🔧 Changed
- Frontend: Next.js 16 → Vite 6.4 + React 19
- Backend: Next.js API routes → Express 5
- Auth: NextAuth.js → JWT (jsonwebtoken)
- Database: Direct Prisma client instead of server actions
- Build: Next.js build → Vite build
- Dev server: Single process → Concurrent (client + server)
- TypeScript strict mode enabled across entire codebase

### 📦 Dependencies
**Added:**
- `vite` ^6.4.1
- `express` ^5.2.1
- `jsonwebtoken` ^9.0.3
- `bcryptjs` ^3.0.3
- `cors` ^2.8.6
- `tsx` ^4.x
- `concurrently` ^9.x
- `react-router-dom` ^6.x
- `groq-sdk` (latest)

**Removed:**
- `next` (no longer needed)
- `next-auth` (replaced with JWT)

### 🗄️ Database Schema
9 Prisma models:
- User (with JWT-based auth)
- Recipe (with isPublic, difficulty, category)
- Ingredient (global ingredient database)
- RecipeIngredient (many-to-many relation)
- Instruction (ordered steps)
- RecipeImage (multiple images per recipe)
- Category (recipe categories)
- RecipeLike (user favorites)
- UserPreferences (user settings)

### 📄 Documentation
- Updated all README files for SPA architecture
- Created comprehensive skill guides
- Added API endpoint documentation
- Updated environment variable examples
- Created contribution guidelines
- Added detailed project status tracking

### 🎯 Current Status
- **Completed**: 70%
- **Backend**: 100% ✅
- **Frontend**: 70% (missing Auth Context, Error Boundaries)
- **Tests**: 0% (not yet implemented)

---

## [1.0.0] - 2026-01-25

### 🎉 Initial Release (Next.js Version)
- Next.js 16 application with App Router
- NextAuth.js authentication
- Prisma + PostgreSQL (Neon)
- Basic CRUD operations
- Recipe scaling algorithms
- Deployed on Vercel

---

## Links
- [Project Status](PROJECT_STATUS.md)
- [Development Tasks](TASKS.md)
- [Contribution Guide](CONTRIBUTING.md)
