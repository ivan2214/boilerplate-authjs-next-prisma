"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { navItems } from "@/shared/constants/navbar";

export const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild className="lg:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="mt-8 flex flex-col gap-4">
          {navItems.map((item) => {
            if (item.children) {
              return (
                <div key={`nav-item-children-${item.href}`} className="py-2">
                  <h3 className="mb-2 font-medium text-lg">Categories</h3>
                  {item.children.map((children) => (
                    <Link
                      key={children.href}
                      href={children.href as string}
                      className="block py-2 text-gray-600 hover:text-emerald-600"
                    >
                      {children.name}
                    </Link>
                  ))}
                </div>
              );
            }

            return (
              <Link
                href={item.href as string}
                key={item.href}
                className="font-medium text-lg"
              >
                {item.name}
              </Link>
            );
          })}
          <div className="gapfont-medium -2 mt-4 flex flex-col">
            <Button className="w-full">Sign In</Button>
            <Button variant="outline" className="w-full">
              Register
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
