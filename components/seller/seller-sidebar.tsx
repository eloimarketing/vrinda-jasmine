'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SellerSidebar() {
	const pathname = usePathname()

	const links = [
		{ name: 'Add Product', path: '/seller/property/create' },
		{ name: 'All Products', path: '/seller/property' },
		{ name: 'Profile', path: '/seller/profile' },
	]

	return (
		<div>
			<div className="flex flex-col gap-2">
				{links.map((link, indx) => (
					<Link
						href={link.path}
						key={indx}
						className={cn(
							'w-full p-2 rounded-md hover:bg-primary/90 hover:text-white font-medium hover:cursor-pointer border border-black',
							link.path === pathname && 'bg-primary text-white border-none'
						)}>
						{link.name}
					</Link>
				))}
			</div>
		</div>
	)
}
