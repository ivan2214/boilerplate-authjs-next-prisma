"use server";

import { db } from "@/db";
import { getCurrentUser } from "@/entities/user/hooks/current-user";
import { RoleUser } from "@/prisma/generated";
import { revalidatePath } from "next/cache";

// Function to get all users (admin only)
export async function getAllUsers() {
  try {
    const { currentUser } = await getCurrentUser();
    if (!currentUser || currentUser.roleUser !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        roleUser: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { error: "Failed to fetch users" };
  }
}

// Function to update user role (admin only)
export async function updateUserRole(userId: string, roleUser: RoleUser) {
  try {
    const { currentUser } = await getCurrentUser();
    if (!currentUser || currentUser.roleUser !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    // Validate role
    if (![RoleUser.ADMIN, RoleUser.USER].includes(roleUser)) {
      return { error: "Invalid role" };
    }

    await db.user.update({
      where: { id: userId },
      data: { roleUser },
    });

    revalidatePath("/admin");
    return { success: "User role updated" };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { error: "Failed to update user role" };
  }
}
