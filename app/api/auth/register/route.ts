import { type NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import prisma from '@/lib/prisma/prisma'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Define schema for validation
const signupSchema = z.object({
	firstName: z.string().min(3),
	lastName: z.string().min(3),
	email: z.string().email(),
	password: z.string().min(8),
	countryCode: z.string().min(1),
	phoneNumber: z.string().min(5),
	role: z.enum(['SUPPLIER', 'CUSTOMER']),
})

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData()

		// Extract and validate form data
		const data = {
			firstName: formData.get('firstName') as string,
			lastName: formData.get('lastName') as string,
			email: formData.get('email') as string,
			password: formData.get('password') as string,
			countryCode: formData.get('countryCode') as string,
			phoneNumber: formData.get('phoneNumber') as string,
			role: formData.get('isSeller') === 'true' ? 'SUPPLIER' : 'CUSTOMER',
		}

		// Validate data
		const validatedData = signupSchema.parse(data)

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email: validatedData.email },
		})

		if (existingUser) {
			return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 })
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(validatedData.password, 10)

		// Handle profile picture if provided
		const profilePicture = formData.get('profilePicture') as File | null
		let profilePictureUrl = ''

		if (profilePicture) {
			const arrayBuffer = await profilePicture.arrayBuffer()
			const buffer = Buffer.from(arrayBuffer)

			const uploadResponse = await new Promise((resolve, reject) => {
				cloudinary.uploader
					.upload_stream({ resource_type: 'image' }, (error, result) => {
						if (error) reject(error)
						else resolve(result)
					})
					.end(buffer)
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			profilePictureUrl = (uploadResponse as any).secure_url
		}

		// Create user in database
		const user = await prisma.user.create({
			data: {
				role: validatedData.role,
				firstName: validatedData.firstName,
				lastName: validatedData.lastName,
				email: validatedData.email,
				password: hashedPassword,
				phoneNumber: validatedData.phoneNumber,
				avatarUrl: profilePictureUrl || null,
			},
		})

		// Return success response without exposing sensitive data
		return NextResponse.json(
			{
				message: 'User registered successfully',
				userId: user.id,
			},
			{ status: 201 }
		)
	} catch (error) {
		console.log('Registration error:', error)

		if (error instanceof z.ZodError) {
			console.log(error)
			console.log(error.message)
			return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 })
		}

		return NextResponse.json({ message: 'Failed to register user' }, { status: 500 })
	}
}
