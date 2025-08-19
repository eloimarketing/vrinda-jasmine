import MaxWidthWrapper from '@/components/max-width-wrapper'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import Image from 'next/image'
import { Prisma } from '@prisma/client'

type PropertyWithAll = Prisma.PropertyGetPayload<{
	include: {
		independentHouseVilla: true
		location: true
		owner: true
	}
}>

export default function IndependentHouseVillaViewPage({ property }: { property: PropertyWithAll }) {
	const independentHouseVilla = property.independentHouseVilla!
	console.log(independentHouseVilla)
	return (
		<div>
			<MaxWidthWrapper className="my-10 max-w-6xl">
				<h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Seller View - {property.title}</h1>

				{/* Main Image */}
				{property.images.length > 0 && (
					<div className="w-full max-h-[400px] rounded-3xl mb-10 shadow-xs border">
						<Carousel
							opts={{
								align: 'start',
								loop: true,
							}}
							className="p-4">
							<CarouselContent>
								{property.images.map((img, indx) => (
									<CarouselItem key={indx} className="md:basis-1/2 ">
										<Image
											src={img}
											alt={property.title}
											width={1200}
											height={500}
											className="object-fill rounded-3xl max-h-[340px]"
										/>
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious className="ml-12 " />
							<CarouselNext className="mr-12" />
						</Carousel>
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
					{/* General Info */}
					<div className="bg-white rounded-2xl shadow p-6 space-y-4 border border-gray-200">
						<h2 className="text-2xl font-semibold text-indigo-600">General Information</h2>
						<div className="text-gray-700 space-y-2">
							<Info label="Price" value={`₹${property.price.toLocaleString()}`} />
							<Info label="Description" value={property.description} />
							<Info label="Status" value={property.status} />
							<Info label="Property Type" value="Apartment / Flat" />
							<Info label="Listed By" value={property.owner.firstName + ' ' + property.owner.lastName || 'N/A'} />
							<Info label="Location" value={`${property.location?.city}, ${property.location?.state}`} />
							<Info label="Verified" value={property.isVerified ? 'Yes' : 'No'} />
							<Info label="Created At" value={new Date(property.createdAt).toLocaleDateString()} />
						</div>
					</div>

					{/* Apartment Info */}
					<div className="bg-white rounded-2xl shadow p-6 space-y-4 border border-gray-200">
						<h2 className="text-2xl font-semibold text-indigo-600">Independent House Villa Details</h2>
						<div className="text-gray-700 space-y-2">
							<Info label="Bedrooms" value={independentHouseVilla.bedrooms.toString()} />
							<Info label="Plot Area" value={`${independentHouseVilla.plotArea} sqft`} />
							<Info label="Built-Up Area" value={`${independentHouseVilla.builtUpArea} sqft`} />
							<Info label="Floors" value={`${independentHouseVilla.floors}`} />
							<Info label="Parking" value={independentHouseVilla.parking ? 'Yes' : 'No'} />
							<Info label="Age of Construction" value={independentHouseVilla.ageOfConstruction.toString()} />
							<Info label="Furnishing Status" value={independentHouseVilla.furnishingStatus.replaceAll('_', ' ')} />
							<Info label="Facing" value={independentHouseVilla.facingDirection?.replaceAll('_', ' ') || 'N/A'} />
							<Info label="Has Garden Lawn" value={independentHouseVilla.hasGardenLawn ? 'Yes' : 'No'} />
							<Info label="Has Water Source" value={independentHouseVilla.hasWaterSource ? 'Yes' : 'No'} />
							<Info label="Has Power Backup" value={independentHouseVilla.hasPowerBackup ? 'Yes' : 'No'} />
							<Info label="Has Security" value={independentHouseVilla.hasSecurity ? 'Yes' : 'No'} />
							<Info label="Has Swimming Pool" value={independentHouseVilla.hasSwimmingPool ? 'Yes' : 'No'} />
						</div>
					</div>
				</div>

				<div className="w-full my-10 flex gap-4 flex-wrap">
					{property.videos.length > 0 &&
						property.videos.map((video, index) => (
							<video
								autoPlay
								muted
								key={index}
								src={video}
								controls
								className="h-96 w-full max-w-[calc(40vw-3rem)] rounded-2xl border p-2"
							/>
						))}
				</div>
			</MaxWidthWrapper>
		</div>
	)
}

function Info({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex justify-between border-b border-gray-100 pb-1">
			<span className="font-medium text-gray-600">{label}:</span>
			<span className="text-gray-800">{value}</span>
		</div>
	)
}
