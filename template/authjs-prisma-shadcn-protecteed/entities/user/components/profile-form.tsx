"use client";

import { Button } from "@/shared/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { updateProfile } from "@/entities/user/actions/profile";
import { profileSchema } from "@/entities/user/schemas/user-profile";
import type { User } from "@prisma/client";
import { toast } from "sonner";

interface ProfileFormProps {
	user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof profileSchema>>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: user.name || "",
		},
	});

	async function onSubmit(values: z.infer<typeof profileSchema>) {
		setIsLoading(true);

		try {
			const result = await updateProfile(values);

			if (result.error) {
				toast.error("Error", {
					description: result.error,
				});
				return;
			}

			toast.success("Success", {
				description: "Your profile has been updated",
			});
		} catch (error) {
			toast.error("Error", {
				description: "Something went wrong",
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Your name" {...field} />
							</FormControl>
							<FormDescription>
								This is the name that will be displayed on your profile.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isLoading}>
					{isLoading ? "Saving..." : "Save changes"}
				</Button>
			</form>
		</Form>
	);
}
