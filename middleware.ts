import NextAuth from 'next-auth'
import authConfig from './auth.config'

import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth(async function middleware(request) {
	const authRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password']

	const allowedPaths = [
		'/',
		'/api/razorpay/webhook',
		'/forgot-password',
		'/about',
		'/contact',
		'/products',
		'/api/cities',
		'/terms-and-conditions',
		'/business-policy',
		'/admin',
		'/admin/products',
		'/admin/users',
		'/admin/suppliers',
		'/admin/products/pending',
		'/admin/settings',
		'/admin/settings/site',
		'/admin/settings/approval',
		'/admin/profile',
		'/supplier',
		'/supplier/products',
		'/supplier/create-product',
		'/user',
		'/user/cart',
		'/user/profile',
		...authRoutes,
	]

	// Check if the request path is in the allowed list
	if (allowedPaths.includes(request.nextUrl.pathname)) {
		return NextResponse.next()
	}

	// Redirect to login if not authenticated and not on the login page
	if (!request.auth) {
		const requestedUrl = request.nextUrl.pathname
		const urls = requestedUrl.split('/')
		if (urls[1] === 'supplier' || urls[1] === 'admin' || urls[1] === 'user') {
			const newUrl = new URL('/auth/login', request.nextUrl.origin)
			return NextResponse.redirect(newUrl)
		}

		const newUrl = new URL('/', request.nextUrl.origin)
		return NextResponse.redirect(newUrl)
	}

	return NextResponse.next()
})

export const config = {
	matcher: [
		'/((?!api/auth|auth|assets|_next/static|_next/image|favicon.ico|api/cloudinary/image-upload|^/$).+)',
	],
}
