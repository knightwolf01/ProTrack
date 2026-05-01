# Project Management Frontend

Complete Next.js 14 frontend for a project management SaaS application with:

## Features
- ✅ User authentication (login/signup)
- ✅ Project management (CRUD operations)
- ✅ Task management within projects
- ✅ Dashboard with statistics
- ✅ Responsive Tailwind CSS design
- ✅ Smooth animations with Framer Motion
- ✅ Toast notifications with React Hot Toast
- ✅ Protected routes with AuthGuard
- ✅ Context API for state management

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── layout.tsx      # Root layout with providers
│   ├── page.tsx        # Home (redirects to dashboard/login)
│   ├── login/
│   ├── signup/
│   ├── dashboard/
│   ├── projects/
│   └── project/[id]/
├── components/         # Reusable components
│   ├── Navbar.tsx
│   ├── AuthGuard.tsx
│   ├── StatCard.tsx
│   ├── AnimatedCard.tsx
│   └── FadeIn.tsx
├── features/          # Feature-specific modules
│   ├── auth/          # Authentication
│   ├── projects/      # Project management
│   └── tasks/         # Task management
├── context/           # React Context providers
│   └── AuthContext.tsx
├── lib/              # Utility functions
│   └── token.ts      # Token management
└── styles/           # Global styles
    └── globals.css
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

3. Update `.env.local` with your API URL (default is http://localhost:5000/api)

4. Run development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build & Deploy

- Build for production: `npm run build`
- Start production server: `npm start`

## API Integration

The frontend connects to a backend API running on http://localhost:5000/api.

### Available Endpoints:
- **Auth**: POST /auth/login, POST /auth/signup, POST /auth/logout, GET /auth/me
- **Projects**: GET/POST /projects, GET/PUT/DELETE /projects/:id
- **Tasks**: GET /projects/:id/tasks, POST /projects/:id/tasks, PUT/DELETE /tasks/:id

## Tech Stack

- **Framework**: Next.js 14.1.0
- **Language**: TypeScript
- **UI**: React 18.2.0 + Tailwind CSS
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **State**: React Context API
- **HTTP**: Fetch API
