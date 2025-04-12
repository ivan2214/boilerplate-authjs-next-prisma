import { auth } from "@/auth";
import { db } from "@/db";
import type { User } from "@prisma/client";

export const getCurrentUser = async (): Promise<{
	currentUser: User | null;
	error: string | null;
}> => {
	try {
		const session = await auth();

		if (!session?.user) {
			return {
				currentUser: null,
				error: "Not authenticated",
			};
		}

		const currentUser = await db.user.findUnique({
			where: {
				id: session.user.id,
			},
		});

		return {
			currentUser,
			error: null,
		};
	} catch (error) {
		return {
			currentUser: null,
			error: "Something went wrong",
		};
	}
};
