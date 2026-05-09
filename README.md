# 🧪 Image Lab

**Image Lab** is a high-performance web application designed for seamless image management and creative workflows. Built with a focus on speed, security, and aesthetics, it empowers users to organize, upload, and process images in a professional, cloud-powered environment.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![Neon](https://img.shields.io/badge/Neon-Postgres-00E599?style=for-the-badge&logo=neon)

---

## ✨ Features

- 📁 **Smart Folder Management**: Organize your images into customizable folders.
- ☁️ **Cloud Uploads**: High-speed image uploads directly to Cloudinary.
- 🔒 **Secure Authentication**: Robust user authentication powered by Better Auth.
- 🎨 **Premium UI/UX**: Clean, responsive interface built with Tailwind CSS 4 and Shadcn UI.
- 🚀 **Smooth Animations & Skeleton Loading**: Interactive elements enhanced with Framer Motion and seamless loading states.

## 🛠️ How It Is Made (Tech Stack)

Image Lab is built on a modern, robust, and scalable technology stack. Here's a breakdown of how the different pieces fit together:

- **Frontend & Framework (Next.js 16 & React 19)**: The core of the application uses the Next.js App Router for server-side rendering, routing, and API endpoints, taking advantage of React 19's performance improvements.
- **Database & ORM (Neon Postgres & Prisma)**: The database is hosted on Neon Serverless Postgres, providing scalable, serverless SQL storage. Prisma ORM is used for type-safe database querying and schema management.
- **Authentication (Better Auth)**: User sessions, Google OAuth, and secure route protection are handled using Better Auth.
- **Styling (Tailwind CSS 4 & Shadcn UI)**: The UI is styled with Tailwind CSS for utility-first responsive design. Shadcn UI provides accessible and customizable, pre-built component structures.
- **Image Hosting (Cloudinary & Next Cloudinary)**: All uploaded media is securely stored on Cloudinary. The frontend uses `next-cloudinary` for optimized image rendering, lazy loading, and on-the-fly transformations.
- **State Management (Zustand & SWR)**: Client-side state is efficiently managed with Zustand, while SWR handles data fetching, caching, and revalidation.

## 💫 Animations & Skeleton Loading

A core focus of Image Lab is delivering a premium, highly responsive user experience:

- **Animations (Framer Motion)**: We utilize `framer-motion` for complex, fluid, and physics-based animations (such as the centering and transitions of modals, smooth page load reveals, and dynamic list interactions). 
- **Micro-interactions (Tailwind & tw-animate-css)**: Subtle hover effects, button scaling, and minor layout transitions are handled natively through Tailwind CSS and `tw-animate-css` for minimal performance overhead.
- **Skeleton Loading States**: To ensure the user interface feels fast and never "jumps" or leaves users staring at blank screens, we implement Skeleton Loading screens. During data fetches (e.g., loading folders or images), placeholder skeleton elements matching the shape of the incoming data are displayed. This prevents cumulative layout shift (CLS) and offers a perceived performance boost, keeping the user engaged while asynchronous operations finish.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ installed
- A Neon Postgres database
- A Cloudinary account
- Google OAuth credentials

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/image-lab.git
   cd image-lab
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up your environment variables (see below).

4. Run database migrations:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

---

## 🔑 Environment Variables Required

Create a `.env` file in the root directory. The application requires the following environment variables to function correctly:

### Database
- `DATABASE_URL`: Your connection string for the Neon Serverless Postgres database. Format: `postgresql://[user]:[password]@[host]/[dbname]?sslmode=verify-full`.

### Authentication (Better Auth)
- `BETTER_AUTH_SECRET`: A secure, randomly generated string used to sign session cookies.
- `BETTER_AUTH_URL`: The base URL of the application. Use `http://localhost:3000` for local development.
- `NEXT_PUBLIC_BETTER_AUTH_URL`: Same as `BETTER_AUTH_URL`, exposed to the client side.
- `GOOGLE_CLIENT_ID`: Your Google Cloud Console OAuth Client ID.
- `GOOGLE_CLIENT_SECRET`: Your Google Cloud Console OAuth Client Secret.

### Cloudinary (Image Hosting)
- `CLOUDINARY_CLOUD_NAME`: The unique name of your Cloudinary cloud environment.
- `CLOUDINARY_API_KEY`: Your Cloudinary account's API key.
- `CLOUDINARY_API_SECRET`: Your Cloudinary account's API secret.
- `CLOUDINARY_URL`: The full connection string for Cloudinary. Format: `cloudinary://[API_KEY]:[API_SECRET]@[CLOUD_NAME]`.

### AI Integrations
- `OPENAI_API_KEY` (Optional): API key for OpenAI functionalities if you are utilizing AI features.

---

## 📂 Project Structure

- `app/`: Next.js App Router (Pages, API routes, Layouts)
- `components/`: Reusable UI components (Shadcn, Skeletons, custom components)
- `lib/`: Shared utility functions and library initializations (Auth, Prisma, Cloudinary)
- `prisma/`: Database schema and migration files
- `public/`: Static assets

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by [Muhammad Kumail Ali](https://github.com/kumail0254)