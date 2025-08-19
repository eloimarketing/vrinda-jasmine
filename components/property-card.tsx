import { ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { buttonVariants } from './ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Property, UserRole } from '@prisma/client'
import Link from 'next/link'

export default function PropertyCard({ property, role }: { property: Property; role: UserRole }) {
	const userRole = role === 'BUYER' ? 'user' : role.toLowerCase()

	return (
		<Link href={`/${userRole}/property/${property.id}`}>
			<div className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
				<div className="h-58 overflow-hidden">
					<Image
						src={property.images[0]}
						alt="property"
						width={1080}
						height={1080}
						className="object-cover rounded-t-md w-full h-58 hover:scale-125 transition-all duration-200"
					/>
				</div>
				<div className="p-3">
					<div className="flex items-center gap-2 justify-between">
						<div className="flex gap-2 items-center w-52">
							<h3 className="font-semibold text-sm line-clamp-2">{property.title}</h3>
						</div>
						<Tooltip>
							<TooltipTrigger className={cn('hover:cursor-pointer', buttonVariants({ variant: 'outline' }))}>
								<ExternalLink />
							</TooltipTrigger>
							<TooltipContent>
								<p>View Property</p>
							</TooltipContent>
						</Tooltip>
					</div>
					<div className="mt-4 flex justify-between items-center gap-2">
						<div className="font-bold text-sm flex justify-start items-start flex-col">
							₹ {property.price}
							<span className="font-medium"> Rent / Month</span>
						</div>
						<div className="font-bold text-sm flex justify-center items-center flex-col text-center">
							{property.propertyType === 'Apartment_Flat' && (
								<>
									Apartment <br /> & Flat
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</Link>
	)
}
