"use client";

import { Button } from "@/shared/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { registerUser } from "@/entities/auth/actions/auth";
import { registerSchema } from "@/entities/auth/schemas/auth";
import { ChromeIcon, GithubIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

interface RegisterModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function RegisterModal({ open, onOpenChange }: RegisterModalProps) {
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof registerSchema>>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(values: z.infer<typeof registerSchema>) {
		setIsLoading(true);

		try {
			const result = await registerUser(values);

			if (result.error) {
				toast.error("Error", {
					description: result.error,
				});
				return;
			}

			toast("Success", {
				description: "Your account has been created",
			});

			router.refresh();
			onOpenChange(false);

			// Open login modal after registration
			setTimeout(() => {
				router.push("/?auth=signin");
			}, 500);
		} catch (error) {
			toast.error("Error", {
				description: "Something went wrong",
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create an account</DialogTitle>
					<DialogDescription>
						Enter your information to create an account
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="John Doe" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="example@email.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Creating account..." : "Create account"}
							</Button>
						</DialogFooter>
					</form>
				</Form>

				<div className="mt-4">
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Or continue with
							</span>
						</div>
					</div>

					<div className="mt-4 grid grid-cols-2 gap-2">
						<Button
							variant="outline"
							onClick={() => signIn("google")}
							disabled={isLoading}
						>
							<ChromeIcon className="h-5 w-5" />
							Google
						</Button>
						<Button
							variant="outline"
							onClick={() => signIn("github")}
							disabled={isLoading}
						>
							<GithubIcon className="h-5 w-5" />
							GitHub
						</Button>
					</div>
				</div>

				<div className="mt-4 text-center text-sm">
					Already have an account?{" "}
					<Button
						variant="link"
						className="h-auto p-0"
						onClick={() => {
							onOpenChange(false);
							setTimeout(() => {
								router.push("/?auth=signin");
							}, 300);
						}}
					>
						Sign in
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
