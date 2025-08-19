import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import type { NextAuthConfig } from 'next-auth'
import prisma from '@/lib/prisma/prisma'

// Notice this is only an object, not a full Auth.js instance
export default {
	trustHost: true,
	providers: [
		Credentials({
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			authorize: async credentials => {
				if (!credentials?.email || !credentials?.password) {
					throw new Error('Email and password are required')
				}

				console.log('Login attempt for:', credentials.email)

				// logic to verify if the user exists
				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email as string,
					},
				})

				if (!user) {
					console.log('User not found:', credentials.email)
					throw new Error('No user found with this email')
				}

				console.log('User found:', user.email, 'Role:', user.role)

				// Compare the provided password with the hashed password
				const isPasswordValid = await compare(credentials.password as string, user.password)

				if (!isPasswordValid) {
					console.log('Invalid password for user:', credentials.email)
					throw new Error('Invalid password')
				}

				console.log('Login successful for:', credentials.email)

				return {
					id: user.id,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					role: user.role,
					// countryCode: user.countryCode,
					// phoneNumber: user.phoneNumber,
					image: user.avatarUrl,
					// dob: user.dob,
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id
				token.email = user.email
				token.image = user.image
				token.role = user.role
				token.firstName = user.firstName
				token.lastName = user.lastName
			}
			return token
		},
		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.id as string
				session.user.image = token.image as string
				session.user.role = token.role as 'ADMIN' | 'CUSTOMER' | 'SUPPLIER'
				session.user.firstName = token.firstName as string
				session.user.lastName = token.lastName as string
			}
			return session
		},
	},
} satisfies NextAuthConfig
