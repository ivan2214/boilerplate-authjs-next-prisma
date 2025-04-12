"use server";

import { db } from "@/db";
import { registerSchema } from "@/entities/auth/schemas/auth";
import bcrypt from "bcryptjs";
import type { z } from "zod";

export async function registerUser(values: z.infer<typeof registerSchema>) {
	try {
		const validatedFields = registerSchema.safeParse(values);

		if (!validatedFields.success) {
			return { error: "Invalid fields" };
		}

		const { name, email, password } = validatedFields.data;

		// Check if user already exists
		const existingUser = await db.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return { error: "Email already in use" };
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create user
		const user = await db.user.create({
			data: {
				name,
				email,
				hashedPassword,
			},
		});

		return { success: "User created", userId: user.id };
	} catch (error) {
		console.error("Registration error:", error);
		return { error: "Something went wrong" };
	}
}
