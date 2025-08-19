import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/prisma'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	if (!id) {
		return NextResponse.json({ error: 'Property ID is required' }, { status: 400 })
	}

	try {
		const property = await prisma.property.findUnique({
			where: { id: id },
			select: { isVerified: true },
		})

		if (!property) {
			return NextResponse.json({ error: 'Property not found' }, { status: 404 })
		}

		return NextResponse.json({ isApproved: property.isVerified })
	} catch (error) {
		console.log(error)
		return NextResponse.json(error, { status: 500 })
	}
}
