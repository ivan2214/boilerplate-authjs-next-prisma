import { redirect } from "next/navigation";

import { db } from "@/db";
import { ProfileForm } from "@/entities/user/components/profile-form";
import { getCurrentUser } from "@/entities/user/hooks/current-user";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";

export default async function ProfilePage() {
	const { currentUser } = await getCurrentUser();

	if (!currentUser) {
		redirect("/?auth=signin");
	}

	// Fetch user data from database
	const user = await db.user.findUnique({
		where: {
			id: currentUser.id,
		},
	});

	if (!user) {
		redirect("/?auth=signin");
	}

	return (
		<div className="container py-12">
			<h1 className="mb-6 font-bold text-3xl">Your Profile</h1>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Profile Information</CardTitle>
						<CardDescription>Update your account information</CardDescription>
					</CardHeader>
					<CardContent>
						<ProfileForm user={user} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Account Details</CardTitle>
						<CardDescription>
							Your account information and settings
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-1">
							<div className="font-medium text-muted-foreground text-sm">
								Account ID
							</div>
							<div className="truncate text-sm">{user.id}</div>
						</div>
						<div className="grid grid-cols-2 gap-1">
							<div className="font-medium text-muted-foreground text-sm">
								Email
							</div>
							<div className="text-sm">{user.email}</div>
						</div>
						<div className="grid grid-cols-2 gap-1">
							<div className="font-medium text-muted-foreground text-sm">
								Role
							</div>
							<div className="text-sm capitalize">{user.roleUser}</div>
						</div>
						<div className="grid grid-cols-2 gap-1">
							<div className="font-medium text-muted-foreground text-sm">
								Member Since
							</div>
							<div className="text-sm">
								{new Date(user.createdAt).toLocaleDateString()}
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button variant="outline" size="sm" className="w-full">
							Download Your Data
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
