import prisma from '@/lib/prisma/prisma'
import { auth } from '@/auth'
import { Button } from './ui/button'
import { redirect } from 'next/navigation'

export default function RemoveFromCart({ propertyId }: { propertyId: string }) {
	return (
		<form
			action={async () => {
				'use server'
				const session = await auth()
				if (!session?.user) return

				await prisma.cart.deleteMany({
					where: {
						userId: session.user.id,
						propertyId: propertyId,
					},
				})
				redirect('/user/cart')
			}}>
			<Button type="submit">Remove from Cart</Button>
		</form>
	)
}
