import { redirect } from "next/navigation";

import { db } from "@/db";
import { UserTable } from "@/entities/admin/components/user-table";
import { getCurrentUser } from "@/entities/user/hooks/current-user";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/shared/components/ui/tabs";

export default async function AdminPage() {
	const { currentUser } = await getCurrentUser();

	if (!currentUser) {
		redirect("/?auth=signin");
	}

	if (currentUser.roleUser !== "ADMIN") {
		redirect("/?error=forbidden");
	}

	// Fetch users for the admin panel
	const users = await db.user.findMany({
		orderBy: {
			createdAt: "desc",
		},
	});

	return (
		<div className="container py-12">
			<h1 className="mb-6 font-bold text-3xl">Admin Dashboard</h1>

			<Tabs defaultValue="users">
				<TabsList className="mb-4">
					<TabsTrigger value="users">Users</TabsTrigger>
					<TabsTrigger value="products">Products</TabsTrigger>
					<TabsTrigger value="settings">Settings</TabsTrigger>
				</TabsList>

				<TabsContent value="users">
					<Card>
						<CardHeader>
							<CardTitle>User Management</CardTitle>
							<CardDescription>
								Manage user accounts and permissions
							</CardDescription>
						</CardHeader>
						<CardContent>
							<UserTable users={users} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="products">
					<Card>
						<CardHeader>
							<CardTitle>Product Management</CardTitle>
							<CardDescription>Manage products and inventory</CardDescription>
						</CardHeader>
						<CardContent>
							<p>Product management content goes here</p>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="settings">
					<Card>
						<CardHeader>
							<CardTitle>Admin Settings</CardTitle>
							<CardDescription>Configure system settings</CardDescription>
						</CardHeader>
						<CardContent>
							<p>Settings content goes here</p>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
