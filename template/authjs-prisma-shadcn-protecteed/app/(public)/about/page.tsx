export default function AboutPage() {
  return (
    <div className="py-12">
      <h1 className="mb-6 font-bold text-3xl">About This Boilerplate</h1>

      <div className="prose dark:prose-invert max-w-none">
        <p>
          This Next.js 15 boilerplate provides a solid foundation for building
          authenticated web applications with modern tools and best practices.
        </p>

        <h2>Key Features</h2>
        <ul>
          <li>
            <strong>Next.js 15</strong> - The latest version with App Router and
            Server Components
          </li>
          <li>
            <strong>Authentication</strong> - Complete auth system with Auth.js
            (formerly NextAuth)
          </li>
          <li>
            <strong>Database</strong> - Prisma ORM with PostgreSQL for type-safe
            database access
          </li>
          <li>
            <strong>UI Components</strong> - Shadcn UI components with Tailwind
            CSS
          </li>
          <li>
            <strong>Form Handling</strong> - Server actions with Zod validation
          </li>
          <li>
            <strong>Protected Routes</strong> - Route protection with middleware
          </li>
        </ul>

        <h2>Project Structure</h2>
        <p>The project is organized into public and protected routes:</p>
        <ul>
          <li>
            <strong>(public)</strong> - Routes accessible to all users
          </li>
          <li>
            <strong>(protected)</strong> - Routes requiring authentication
          </li>
          <li>
            <strong>actions</strong> - Server actions for form handling
          </li>
          <li>
            <strong>schemas</strong> - Zod schemas for validation
          </li>
          <li>
            <strong>components</strong> - Reusable UI components
          </li>
          <li>
            <strong>lib</strong> - Utility functions and configurations
          </li>
        </ul>
      </div>
    </div>
  );
}
