import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

const features = [
  {
    title: "Authentication",
    description:
      "Secure authentication with Auth.js, supporting multiple providers and session management.",
  },
  {
    title: "Protected Routes",
    description:
      "Role-based access control for protected routes with middleware.",
  },
  {
    title: "Server Actions",
    description:
      "Type-safe server actions with Zod validation for form handling.",
  },
  {
    title: "Database Integration",
    description: "Prisma ORM with PostgreSQL for type-safe database access.",
  },
  {
    title: "UI Components",
    description:
      "Beautiful UI components from Shadcn UI with dark mode support.",
  },
  {
    title: "Modal Authentication",
    description:
      "Login and registration via modals without leaving the current page.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center space-y-8 py-12 text-center">
      <div className="max-w-3xl space-y-4">
        <h1 className="font-bold text-4xl tracking-tight sm:text-5xl md:text-6xl">
          Next.js 15 Authentication Boilerplate
        </h1>
        <p className="text-muted-foreground text-xl">
          A complete starter template with Auth.js, Prisma, PostgreSQL, and
          Shadcn UI
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild size="lg">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/about">Learn More</Link>
        </Button>
      </div>

      <div className="mt-12 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-lg border p-6 text-left">
            <h3 className="mb-2 font-medium text-lg">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
