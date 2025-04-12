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
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { loginSchema } from "@/entities/auth/schemas/auth";
import { ChromeIcon, GithubIcon } from "lucide-react";
import { toast } from "sonner";

interface LoginModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof loginSchema>) {
		setIsLoading(true);

		try {
			const result = await signIn("credentials", {
				email: values.email,
				password: values.password,
				redirect: false,
			});

			if (result?.error) {
				toast.error("Error", {
					description: "Invalid email or password",
				});
				return;
			}

			toast("Success", {
				description: "You have been signed in",
			});

			router.refresh();
			onOpenChange(false);
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
					<DialogTitle>Sign In</DialogTitle>
					<DialogDescription>
						Enter your email and password to sign in to your account
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

						<DialogFooter>
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Signing in..." : "Sign In"}
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

					<div className="mt-4 text-center text-sm">
						Don&apos;t have an account?{" "}
						<Button
							variant="link"
							className="h-auto p-0"
							onClick={() => {
								onOpenChange(false);
								setTimeout(() => {
									router.push("/?auth=signup");
								}, 300);
							}}
						>
							Sign up
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
