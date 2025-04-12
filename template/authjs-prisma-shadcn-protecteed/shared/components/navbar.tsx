import Link from "next/link";

import { ModeToggle } from "@/shared/components/mode-toggle";

import { getCurrentUser } from "@/shared/hooks/current-user";
import { MobileMenu } from "@/shared/components/mobile-menu";
import { AuthButtons } from "@/entities/auth/components/auth-buttons";
import { DesktopMenu } from "@/shared/components/desktop-menu";

export default async function Navbar() {
  const { currentUser } = await getCurrentUser();

  return (
    <header className="container mx-auto border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            Next Auth
          </Link>

          {/* Desktop Navigation */}
          <DesktopMenu />
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />

          <AuthButtons currentUser={currentUser || null} />

          {/* Mobile Navigation */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
