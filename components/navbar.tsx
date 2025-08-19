import { auth } from '@/auth'
import prisma from '@/lib/prisma/prisma'
import NavbarLinks from './navbar-links'

export default async function Navbar() {
	const session = await auth()
	const user = session?.user

	const cart = await prisma.cart.findMany({ where: { userId: user?.id } })

	return (
		<div className="border-b shadow-md w-full h-20">
			<NavbarLinks user={user} cart={cart} />
		</div>
	)
}
