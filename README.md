# Photo Editor

A web-based photo editor built with Next.js, Redux Toolkit, and Konva. Features a rich UI for creating and manipulating designs with layers, shapes, text, and images.

## 🚀 Features

- **Canvas Editing**: Drag, resize, rotate, and transform elements.
- **Tools**: Text, Shapes (Rect, Circle, Line), Images, Icons.
- **Layer Management**: Reorder, hide/show, and lock layers via Drag & Drop.
- **Grouping**: Group multiple elements to manipulate them together.
- **History**: Robust Undo/Redo functionality.
- **Helpers**: Snapping guides for precise alignment.
- **Theme**: Dark/Light mode support inspired by Excalidraw.

## ⌨️ Shortcuts

| Action           | Shortcut (Mac)                   | Shortcut (Windows/Linux)         |
| ---------------- | -------------------------------- | -------------------------------- |
| **Undo**         | `Cmd + Z`                        | `Ctrl + Z`                       |
| **Redo**         | `Cmd + Shift + Z` or `Cmd + Y`   | `Ctrl + Shift + Z` or `Ctrl + Y` |
| **Delete**       | `Backspace` / `Delete`           | `Backspace` / `Delete`           |
| **Multi-select** | `dShift + Click` / `Cmd + Click` | `Shift + Click` / `Ctrl + Click` |
| **Group**        | (Toolbar Button)                 | (Toolbar Button)                 |
| **Ungroup**      | (Toolbar Button)                 | (Toolbar Button)                 |

## 🏗️ Technical Implementation

### State Management

We chose **Redux Toolkit** for state management.

- **Why?** The editor state (elements, selection, history) is complex and deeply nested. Redux provides a centralized store, predictable state updates via reducers, and excellent debugging tools.
- **Normalization**: Elements are stored in a normalized `Record<string, EditorElement>` structure for O(1) access updates, rather than traversing arrays.

### Implementation Details

#### Snapping

Snapping is implemented in `Stage.tsx` during the `onDragMove` event.

- We calculate the distance between the dragged element's edges/center and the stage's edges/center.
- If the distance is within a threshold (e.g., 5px), we snap the coordinate and draw a visual guideline.

#### Undo/Redo

Implemented using a custom history stack within the Redux slice (`editorSlice.ts`).

- `history: { past: [], present: ..., future: [] }`
- Actions like `addElement`, `updateElement` call `saveToHistory()` before modifying state to push the current state to `past`.
- `undo` pops from `past` to `present`. `redo` pops from `future` to `present`.
- Added keyboard shortcuts for undo/redo (Cmd + Z(Undo), Cmd + Shift + Z (Redo)).

#### Export

Export is handled via `konva.toDataURL()`. The Stage ref allows extracting the canvas content as a base64 image string, which is then downloaded.

### Performance Optimizations

1.  **React Konva**: Uses optimal canvas drawing updates.
2.  **Normalized State**: Reduces complexity of finding and updating elements.
3.  **Selective Rendering**: separation of `RootElements` and recursive `Group` rendering ensures cleanly structured component tree.
4.  **Debouncing/Event Throttling**: Used in future improvements for heavy operations (currently direct updates are fast enough for typical load).

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── health/        # Health check endpoint
│   │   └── example/       # Example API route
│   ├── dashboard/         # Protected dashboard page
│   ├── forbidden/         # 403 error page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── lib/
│   ├── api/
│   │   ├── client/        # Client-side Axios setup
│   │   └── server/        # Server-side fetch utilities
├── redux/
│   ├── store/             # Redux store configuration
│   └── features/          # Redux slices
├── providers/             # React context providers
├── types/                 # TypeScript type definitions
│   ├── api/              # API-specific types
│   ├── common.ts         # Common shared types
│   └── redux.ts          # Redux-specific types
├── components/            # React components
├── assets/               # Static assets (icons, images)
├── styles/               # Global styles
└── middleware.ts         # Authentication middleware
```

## 🛠️ Getting Started

### Prerequisites

- Node.js >= 18.17.0
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd nextjs-template
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env.local` and update the values:

```bash
cp .env.example .env.local
```

**Important:** Update the following values in production:

- `NEXT_PUBLIC_ENCRYPTION_KEY` - 32-character encryption key
- `JWT_SECRET_KEY` - Minimum 32-character secret for JWT

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🔐 Authentication

### JWT Middleware

The `middleware.ts` file protects routes using JWT verification. Protected routes require a valid token in cookies.

To protect additional routes, update the `protectedRoutes` array in `middleware.ts`.

### Redux Auth Slice

Authentication state is managed with Redux Toolkit and includes:

- User data encryption with `redux-persist-transform-encrypt`
- Automatic token refresh
- Async thunks for login/logout
- localStorage persistence

**Example usage:**

```typescript
import { useAppDispatch } from "@/lib/store/hooks";
import { login } from "@/lib/features/authSlice";

const dispatch = useAppDispatch();

const handleLogin = async () => {
  const result = await dispatch(
    login({
      email: "user@example.com",
      password: "password123",
    }),
  );

  if (login.fulfilled.match(result)) {
    router.push("/dashboard");
  }
};
```

## API Configuration

### Axios Interceptors

Global Axios interceptors are configured in `src/lib/api/client/axios-config.ts`:

- Automatic token injection from Redux store
- Token refresh on 401 errors
- Global error handling with toast notifications
- Automatic redirects (403 → `/forbidden`, 401 → `/login`)

### Server-side Fetch

Use the `fetcher` utility for server-side API calls with Next.js caching:

```typescript
import { fetcher } from "@/lib/api/server";

const { data, error } = await fetcher("/api/users", {
  revalidate: 60, // Cache for 60 seconds
  tags: ["users"], // Cache tags for on-demand revalidation
});
```

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS v3 with a custom design system:

- CSS variables for theming
- Dark mode support
- Custom color palette
- Poppins font family

**Theme Toggle:**

```tsx
import ThemeToggle from "@/components/ThemeToggle";

<ThemeToggle />;
```

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking

# Bundle Analysis
ANALYZE=true npm run build  # Analyze bundle size
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Docker

1. Set `OUTPUT_STANDALONE=true` in `.env`
2. Build the application:

```bash
npm run build
```

3. Create a Dockerfile:

```dockerfile
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

## Security Features

### Headers

Security headers are configured in `next.config.ts`:

- **CSP** (Content Security Policy)
- **HSTS** (HTTP Strict Transport Security)
- **X-Frame-Options** (Clickjacking protection)
- **X-Content-Type-Options** (MIME sniffing protection)
- **Referrer-Policy**
- **Permissions-Policy**

### Data Encryption

User data in Redux is encrypted using `redux-persist-transform-encrypt` before being stored in localStorage.

## Best Practices

1. **Type Safety**: Use TypeScript's strict mode and define all types
2. **Component Organization**: Keep components in `src/components`
3. **API Types**: Define API request/response types in `src/types/api`
4. **Error Handling**: Use try-catch blocks and display user-friendly messages
5. **State Management**: Use Redux for global state, React state for local
6. **Code Quality**: Run `npm run lint` and `npm run format` before committing

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [Sonner](https://sonner.emilkowal.ski/)
