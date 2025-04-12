"use client";

import { updateUserRole } from "@/entities/admin/actions/admin";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import type { RoleUser, User } from "@/prisma/generated";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: RoleUser) => {
    setIsLoading(userId);

    try {
      const result = await updateUserRole(userId, newRole);

      if (result.error) {
        toast.error("Error", {
          description: result.error,
        });
        return;
      }

      toast.success("Success", {
        description: "User role updated successfully",
      });

      router.refresh();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update user role",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Created</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-2">{user.name || "N/A"}</td>
              <td className="p-2">{user.email || "N/A"}</td>
              <td className="p-2">
                <Badge
                  variant={user.roleUser === "ADMIN" ? "default" : "outline"}
                >
                  {user.roleUser}
                </Badge>
              </td>
              <td className="p-2">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="p-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        handleRoleChange(
                          user.id,
                          user.roleUser === "ADMIN" ? "USER" : "ADMIN"
                        )
                      }
                      disabled={isLoading === user.id}
                    >
                      {user.roleUser === "ADMIN"
                        ? "Remove Admin"
                        : "Make Admin"}
                    </DropdownMenuItem>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
