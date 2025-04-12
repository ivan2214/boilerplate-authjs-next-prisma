import { db } from "@/db";
import { getCurrentUser } from "@/entities/user/hooks/current-user";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
	const { currentUser } = await getCurrentUser();

	if (!currentUser) {
		redirect("/?auth=signin");
	}

	// Fetch user data with additional information
	const user = await db.user.findUnique({
		where: {
			id: currentUser.id,
		},
		select: {
			id: true,
			name: true,
			email: true,
			roleUser: true,
			createdAt: true,
		},
	});

	return (
		<div className="container py-12">
			<h1 className="mb-6 font-bold text-3xl">Dashboard</h1>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>Welcome, {user?.name || "User"}!</CardTitle>
						<CardDescription>
							You're signed in with {user?.email}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="mb-4 text-muted-foreground">
							This is a protected route that requires authentication.
						</p>
						<div className="flex gap-2">
							<Button asChild size="sm">
								<Link href="/profile">View Profile</Link>
							</Button>
							<Button asChild size="sm" variant="outline">
								<Link href="/purchases">View Purchases</Link>
							</Button>
							{user?.roleUser === "ADMIN" && (
								<Button asChild variant="outline" size="sm">
									<Link href="/admin">Admin Panel</Link>
								</Button>
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Account Information</CardTitle>
						<CardDescription>Manage your account details</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground">
							Update your profile information and preferences.
						</p>
						<Button asChild className="mt-4" variant="outline" size="sm">
							<Link href="/profile">Edit Profile</Link>
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Activity</CardTitle>
						<CardDescription>Your recent activity</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2 text-sm">
							<li className="flex justify-between">
								<span>Last login</span>
								<span className="text-muted-foreground">Today, 10:30 AM</span>
							</li>
							<li className="flex justify-between">
								<span>Account created</span>
								<span className="text-muted-foreground">
									{user?.createdAt
										? new Date(user.createdAt).toLocaleDateString()
										: "N/A"}
								</span>
							</li>
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
