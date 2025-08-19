'use client'
import React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CountryDropdown } from '@/components/ui/country-dropdown'
import { Checkbox } from '@/components/ui/checkbox'

const formSchema = z.object({
	firstName: z.string().min(2, {
		message: 'First name must be at least 2 characters.',
	}),
	lastName: z.string().min(2, {
		message: 'Last name must be at least 2 characters.',
	}),
	email: z.string().email({
		message: 'Please enter a valid email address.',
	}),
	password: z.string().min(8, {
		message: 'Password must be at least 8 characters.',
	}),
	countryCode: z.string({ required_error: 'Country code is required.' }),
	phoneNumber: z.string().min(5, {
		message: 'Phone number must be at least 5 characters.',
	}),
	profilePicture: z.instanceof(File).optional(),
	isSeller: z.boolean(),
})

export function SignupForm() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [profilePicture, setProfilePicture] = useState<string | null>(null)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			countryCode: '',
			phoneNumber: '',
			isSeller: false,
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true)

		try {
			const formData = new FormData()

			// Add all form fields to FormData
			Object.entries(values).forEach(([key, value]) => {
				if (key === 'dateOfBirth') {
					formData.append(key, value?.toString())
				} else if (key === 'profilePicture' && value instanceof File) {
					formData.append(key, value)
				} else if (value !== undefined && value !== null) {
					formData.append(key, String(value))
				}
			})

			const response = await fetch('/api/auth/register', {
				method: 'POST',
				body: formData,
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || 'Registration failed')
			}

			toast('Registration successful', {
				description: 'Your account has been created. You can now log in.',
			})

			setTimeout(() => {
				router.push('/auth/login')
			}, 1500)
		} catch (error) {
			toast.error('Registration failed', {
				description: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
				// description: 'Something went wrong. Please try again.',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]
			form.setValue('profilePicture', file)

			// Create a preview
			const reader = new FileReader()
			reader.onload = () => {
				setProfilePicture(reader.result as string)
			}
			reader.readAsDataURL(file)
		}
	}

	return (
		<div className="mt-16">
			<div className="flex flex-col items-center gap-2 text-center mb-6">
				<h2 className="text-2xl font-bold">Register your account</h2>
				<p className="text-muted-foreground text-sm text-balance">Enter your details below to register your account</p>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<div className="flex justify-center mb-6">
						<div className="relative">
							<Avatar className="h-24 w-24">
								<AvatarImage src={profilePicture || ''} alt="Profile picture" />
								<AvatarFallback>
									{form.watch('firstName')?.[0]}
									{form.watch('lastName')?.[0]}
								</AvatarFallback>
							</Avatar>
							<Input type="file" id="profilePicture" accept="image/*" className="sr-only" onChange={handleFileChange} />
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="absolute bottom-0 right-0 rounded-full"
								onClick={() => document.getElementById('profilePicture')?.click()}>
								Upload
							</Button>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>First Name</FormLabel>
									<FormControl>
										<Input placeholder="John" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Last Name</FormLabel>
									<FormControl>
										<Input placeholder="Doe" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

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
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type="password" placeholder="********" {...field} />
								</FormControl>
								<FormDescription>Password must be at least 8 characters long.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							name="countryCode"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Country</FormLabel>
									<CountryDropdown
										placeholder="Country"
										defaultValue={field.value}
										onChange={country => {
											field.onChange(country.countryCallingCodes[0])
										}}
									/>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="phoneNumber"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone Number</FormLabel>
									<FormControl>
										<Input placeholder="5551234567" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div>
						<FormField
							control={form.control}
							name="isSeller"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
									<FormControl>
										<Checkbox checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>I&apos;m here to sell hospitality equipment.</FormLabel>
										<FormDescription>Check this box if you are a supplier of hospitality equipment.</FormDescription>
									</div>
								</FormItem>
							)}
						/>
					</div>

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Creating account...
							</>
						) : (
							'Create account'
						)}
					</Button>
				</form>
			</Form>
		</div>
	)
}
