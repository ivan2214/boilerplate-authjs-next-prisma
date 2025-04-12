"use client";

import type React from "react";

import { LogOut, UserIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { adminNavItems } from "@/shared/constants/navbar";
import { useAuth } from "@/entities/auth/hooks/use-auth";

import type { User } from "@/prisma/generated";
import type { NavItem } from "@/shared/types/nav";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";

interface AuthButtonsProps {
  currentUser: User | null;
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({ currentUser }) => {
  const { setLoginModalOpen, setRegisterModalOpen } = useAuth();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  // Build navigation items based on user role
  const navItems: NavItem[] = currentUser
    ? [
        { name: "Profile", href: "/profile" },
        ...(currentUser.roleUser === "ADMIN"
          ? [{ name: "Admin", children: adminNavItems }]
          : []),
      ]
    : [];

  if (currentUser) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage
                src={currentUser.image || ""}
                alt={currentUser.name || ""}
              />
              <AvatarFallback>
                <UserIcon />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 font-medium text-sm">
            {currentUser?.name || currentUser?.email}
          </div>
          <DropdownMenuSeparator />

          {navItems.map((item, index) => {
            // For items with children, use DropdownMenuSub
            if (item.children && item.children.length > 0) {
              return (
                <DropdownMenuSub key={`nav-item-${item.name}`}>
                  <DropdownMenuSubTrigger>
                    <span>{item.name}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {item.children.map((child) => (
                      <DropdownMenuItem
                        asChild
                        key={`child-${index}-${child.name}`}
                      >
                        <Link href={child.href || "#"}>{child.name}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              );
            }

            // For regular items
            return (
              <DropdownMenuItem asChild key={`nav-item-${item.name}`}>
                <Link href={item.href || "#"}>{item.name}</Link>
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex gap-2">
      <Button variant={"ghost"} onClick={() => setLoginModalOpen(true)}>
        Sign In
      </Button>
      <Button onClick={() => setRegisterModalOpen(true)}>Register</Button>
    </div>
  );
};
