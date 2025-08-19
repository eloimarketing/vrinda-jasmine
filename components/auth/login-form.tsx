'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { getSession } from 'next-auth/react'

import { Button, buttonVariants } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const formSchema = z.object({
	email: z.string().email({
		message: 'Please enter a valid email address.',
	}),
	password: z.string().min(1, {
		message: 'Password is required.',
	}),
})

export function LoginForm() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true)

		try {
			const result = await signIn('credentials', {
				email: values.email,
				password: values.password,
				redirect: false,
			})

			if (result?.error) {
				throw new Error(result.error || 'Login failed')
			}

			toast('Login successful', {
				description: 'You have been logged in successfully.',
			})

			// Fetch the session to get the user role
			const session = await getSession()
			const role = session?.user?.role

			// Role-based redirection
			if (role === 'ADMIN') {
				router.push('/admin')
			} else if (role === 'SUPPLIER') {
				router.push('/supplier')
			} else if (role === 'CUSTOMER') {
				router.push('/user')
			} else {
				// Default fallback
				router.push('/')
			}
			router.refresh()
		} catch (error) {
			console.log(error)
			toast('Login failed', {
				// description: error instanceof Error ? error.message : 'Invalid email or password.',
				description: 'Invalid email or password.',
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div>
			<div className="flex flex-col items-center gap-2 text-center mb-6">
				<h2 className="text-2xl font-bold">Login to your account</h2>
				<p className="text-muted-foreground text-sm text-balance">Enter your email below to login to your account</p>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" placeholder="john.doe@example.com" {...field} />
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
								<FormLabel className="flex items-center justify-between gap-2">
									Password{' '}
									{/* <Link href="/forgot-password" className="ml-auto font-normal text-sm underline-offset-4 hover:underline">
										Forgot your password?
									</Link> */}
								</FormLabel>
								<FormControl>
									<Input type="password" placeholder="********" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Logging in...
							</>
						) : (
							'Login'
						)}
					</Button>

					<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
						<span className="bg-background text-muted-foreground relative z-10 px-2">Or continue with</span>
					</div>

					<Link href={'/auth/signup'} className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}>
						Create an account
					</Link>
				</form>
			</Form>
		</div>
	)
}
