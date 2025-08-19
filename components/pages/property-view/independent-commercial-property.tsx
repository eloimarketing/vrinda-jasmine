'use client'

import React, { useState } from 'react'

import {
	Heart,
	Share2,
	ShoppingCart,
	MapPin,
	Car,
	Zap,
	Shield,
	Building2,
	Trees,
	User as UserIcon,
	Home,
	Bath,
	CheckCircle,
	Store,
	Wifi,
	Flame,
	Droplets,
	Eye,
	AlertTriangle,
	FileText,
	Calendar,
	Train,
	Bus,
	CarFront,
	Thermometer,
	Archive,
	Accessibility,
	DoorOpen,
	Car as CarIcon,
	BrickWallFire,
	Briefcase,
	Scissors,
	MoreHorizontal,
} from 'lucide-react'
import Image from 'next/image'
import { Prisma } from '@prisma/client'
import PropertyMap from '@/components/common/map/google-maps-with-pins'
import MaxWidthWrapper from '@/components/max-width-wrapper'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

type PropertyWithAll = Prisma.PropertyGetPayload<{
	include: {
		independentCommercialProperty: true
		location: true
		owner: true
	}
}>

export default function IndependentCommercialViewPage({ property }: { property: PropertyWithAll }) {
	const [activeImage, setActiveImage] = useState(0)
	const [isWishlisted, setIsWishlisted] = useState(false)
	const [cartLoading, setCartLoading] = useState(false)

	async function addToCart() {
		try {
			setCartLoading(true)
			const response = await fetch('/api/user/cart/add', {
				method: 'POST',
				body: JSON.stringify(property.id),
			})
			if (response.ok) {
				toast.success('Property added to cart successfully')
			}
			console.log(response)
		} catch (error) {
			toast.error('Property Already in cart')
			console.log(error)
		} finally {
			setCartLoading(false)
		}
	}

	console.log(property)
	const commercialProperty = property.independentCommercialProperty

	if (!commercialProperty) {
		return <div>Commercial property details not available.</div>
	}

	const formatPrice = (price: number): string => {
		console.log(price, 'price here')
		if (price >= 10000000) {
			const crores = price / 10000000
			return `${crores.toFixed(2)} Crore`
		}
		if (price >= 100000) {
			const lakhs = price / 100000
			return `${lakhs.toFixed(0)} Lakh`
		}
		return price.toLocaleString('en-IN') + ' INR'
	}

	const pricePerSqFt = Math.round(property.price / commercialProperty.flatArea)

	const getPreviousUseIcon = (use: string) => {
		switch (use) {
			case 'RETAIL':
				return Store
			case 'OFFICE':
				return Briefcase
			case 'SALON':
				return Scissors
			default:
				return MoreHorizontal
		}
	}

	const formatEnumValue = (value: string): string => {
		return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
	}

	const basicAmenities = [
		{ icon: Zap, label: 'Electricity', available: commercialProperty.hasElectricity },
		{ icon: Droplets, label: 'Water Supply', available: commercialProperty.hasWater },
		{ icon: Flame, label: 'Gas Connection', available: commercialProperty.hasGas },
		{ icon: Car, label: 'Customer Parking', available: commercialProperty.hasCustomerParking },
		{ icon: Shield, label: 'Building Insurance', available: commercialProperty.hasBuildingInsurance },
	]

	const securityAmenities = [
		{ icon: Eye, label: 'CCTV Security', available: commercialProperty.hasCCTV },
		{ icon: AlertTriangle, label: 'Security Alarm', available: commercialProperty.hasSecurityAlarmSystem },
		{ icon: FileText, label: 'Planning Permission', available: commercialProperty.hasPlanningPermission },
	]

	const connectivityAmenities = [
		{ icon: Wifi, label: 'Internet Connection', available: commercialProperty.hasInternetConnection },
		{ icon: Train, label: 'Near Station', available: commercialProperty.hasNearbyStation },
		{ icon: Bus, label: 'Near Bus Stands', available: commercialProperty.hasNearbyBusStands },
		{ icon: CarFront, label: 'Near Main Road', available: commercialProperty.hasNearbyRoad },
	]

	const residentialFeatures = [
		{ icon: Home, label: 'Bedrooms', value: commercialProperty.noOfBedrooms },
		{ icon: Bath, label: 'Bathrooms', value: formatEnumValue(commercialProperty.bathrooms) },
		{ icon: BrickWallFire, label: 'Kitchen Style', value: formatEnumValue(commercialProperty.kitchenStyle) },
		{ icon: DoorOpen, label: 'Separate Entrance', value: commercialProperty.hasSeparateEntrance ? 'Yes' : 'No' },
	]

	return (
		<div className="min-h-screen bg-blue-200">
			<MaxWidthWrapper className="py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Image Gallery */}
						<div className="bg-white rounded-2xl overflow-hidden shadow-lg">
							<div className="relative">
								<Image
									width={1200}
									height={500}
									src={property.images[activeImage]}
									alt={property.title}
									className="w-full h-96 object-cover"
								/>
								<button
									onClick={() => setIsWishlisted(!isWishlisted)}
									className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
									<Heart className={`w-6 h-6 ${isWishlisted ? 'fill-[#89ce3d] text-[#89ce3d]' : 'text-gray-600'}`} />
								</button>
								<div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
									+{property.images.length - 1}
								</div>
							</div>
							<div className="p-4">
								<div className="grid grid-cols-4 gap-2">
									{property.images.map((img, index) => (
										<Image
											width={1200}
											height={500}
											key={index}
											src={img}
											alt={`View ${index + 2}`}
											className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
											onClick={() => setActiveImage(index)}
										/>
									))}
								</div>
							</div>
						</div>

						{/* Property Details */}
						<div className="bg-white rounded-2xl p-6 shadow-lg">
							<div className="flex justify-between items-start">
								<div>
									<h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
									<div className="flex flex-col gap-2">
										{property.listingType === 'FOR_RENT' ? <Badge>For Rent</Badge> : <Badge>For Sale</Badge>}
										<Badge>Independent Commercial Property</Badge>
									</div>

									<div className="flex items-center text-gray-600 my-2">
										<MapPin className="w-4 h-4 mr-1" />
										<div>{property.location.address}</div>
									</div>
								</div>
								<button className="p-2 hover:bg-gray-100 rounded-full">
									<Share2 className="w-5 h-5 text-gray-600" />
								</button>
							</div>

							{property.listingType === 'FOR_RENT' ? (
								<div className="p-4 rounded-md bg-blue-300 mb-4">
									<div className="text-black font-semibold">
										Rent Price <span className="text-white"> ₹{formatPrice(property.propertyRent!)}/Monthly</span>
									</div>
								</div>
							) : (
								<div className="p-4 rounded-md bg-blue-300 mb-4">
									<div className="text-black font-semibold">
										Property Price <span className="text-white"> ₹{formatPrice(property.price)}</span>
									</div>
								</div>
							)}

							{/* Price and Area */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
								<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
									<div className="text-3xl font-bold text-gray-900 mb-2">₹{formatPrice(property.price)}</div>
									<div className="text-gray-600">Base Price: ₹{pricePerSqFt.toLocaleString()} Per Sq.Ft.</div>
								</div>
								<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl">
									<div className="text-2xl font-bold text-gray-900 mb-2">{commercialProperty.flatArea} sq.ft.</div>
									<div className="text-gray-600">Total Area</div>
								</div>
							</div>

							{/* Property Info Grid */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
								<div className="text-center p-4 bg-gray-50 rounded-lg">
									{React.createElement(getPreviousUseIcon(commercialProperty.previousUse), {
										className: 'w-8 h-8 mx-auto mb-2 text-blue-600',
									})}
									<div className="font-semibold">{formatEnumValue(commercialProperty.previousUse)}</div>
									<div className="text-sm text-gray-600">Previous Use</div>
								</div>
								<div className="text-center p-4 bg-gray-50 rounded-lg">
									<Building2 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
									<div className="font-semibold">{commercialProperty.classUse}</div>
									<div className="text-sm text-gray-600">Class Use</div>
								</div>
								<div className="text-center p-4 bg-gray-50 rounded-lg">
									<Store className="w-8 h-8 mx-auto mb-2 text-blue-600" />
									<div className="font-semibold">{commercialProperty.shopFrontageWidth}ft</div>
									<div className="text-sm text-gray-600">Shop Frontage</div>
								</div>
								<div className="text-center p-4 bg-gray-50 rounded-lg">
									<Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
									<div className="font-semibold">{commercialProperty.tenureAge} months</div>
									<div className="text-sm text-gray-600">Tenure Age</div>
								</div>
							</div>

							{/* Residential Features */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
								{residentialFeatures.map((feature, index) => (
									<div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
										{/* {<feature.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />} */}
										<div className="font-semibold">{feature.value}</div>
										<div className="text-sm text-gray-600">{feature.label}</div>
									</div>
								))}
							</div>

							{/* Amenities */}
							<div className="space-y-6">
								<h3 className="text-xl font-semibold">Amenities & Features</h3>

								<div>
									<h4 className="font-medium text-gray-900 mb-3">BASIC UTILITIES</h4>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
										{basicAmenities.map((amenity, index) => (
											<div key={index} className="flex items-center space-x-2">
												{/* <amenity.icon className="w-5 h-5 text-blue-600" /> */}
												<span className="text-sm text-gray-700">{amenity.label}</span>
												{amenity.available && <CheckCircle className="w-4 h-4 text-green-500" />}
											</div>
										))}
									</div>
								</div>

								<div>
									<h4 className="font-medium text-gray-900 mb-3">SECURITY & COMPLIANCE</h4>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
										{securityAmenities.map((amenity, index) => (
											<div key={index} className="flex items-center space-x-2">
												{/* <amenity.icon className="w-5 h-5 text-blue-600" /> */}
												<span className="text-sm text-gray-700">{amenity.label}</span>
												{amenity.available && <CheckCircle className="w-4 h-4 text-green-500" />}
											</div>
										))}
									</div>
								</div>

								<div>
									<h4 className="font-medium text-gray-900 mb-3">CONNECTIVITY & LOCATION</h4>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
										{connectivityAmenities.map((amenity, index) => (
											<div key={index} className="flex items-center space-x-2">
												{/* <amenity.icon className="w-5 h-5 text-blue-600" /> */}
												<span className="text-sm text-gray-700">{amenity.label}</span>
												{amenity.available && <CheckCircle className="w-4 h-4 text-green-500" />}
											</div>
										))}
									</div>
								</div>
							</div>

							{/* Additional Details */}
							<div className="mt-8 pt-6 border-t">
								<h3 className="text-xl font-semibold mb-4">Additional Property Details</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<DoorOpen className="w-5 h-5 text-blue-600" />
											<span className="font-medium">Separate Business Access:</span>
											<span className="text-gray-700">{commercialProperty.hasSeparateBusinessAccess ? 'Yes' : 'No'}</span>
										</div>
										<div className="flex items-center gap-2">
											<Trees className="w-5 h-5 text-blue-600" />
											<span className="font-medium">Garden/Yard Access:</span>
											<span className="text-gray-700">{formatEnumValue(commercialProperty.gardenYardAccess)}</span>
										</div>
										<div className="flex items-center gap-2">
											<CarIcon className="w-5 h-5 text-blue-600" />
											<span className="font-medium">Parking Type:</span>
											<span className="text-gray-700">{formatEnumValue(commercialProperty.residenceParkingType)}</span>
										</div>
										<div className="flex items-center gap-2">
											<Home className="w-5 h-5 text-blue-600" />
											<span className="font-medium">Furnishing:</span>
											<span className="text-gray-700">{formatEnumValue(commercialProperty.furnishing)}</span>
										</div>
									</div>
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<Thermometer className="w-5 h-5 text-blue-600" />
											<span className="font-medium">Heating Type:</span>
											<span className="text-gray-700">{formatEnumValue(commercialProperty.heatingType)}</span>
										</div>
										<div className="flex items-center gap-2">
											<Archive className="w-5 h-5 text-blue-600" />
											<span className="font-medium">Storage Space:</span>
											<span className="text-gray-700">{formatEnumValue(commercialProperty.storageSpace)}</span>
										</div>
										<div className="flex items-center gap-2">
											<Accessibility className="w-5 h-5 text-blue-600" />
											<span className="font-medium">Accessibility:</span>
											<span className="text-gray-700">{formatEnumValue(commercialProperty.accessibility)}</span>
										</div>
									</div>
								</div>
							</div>

							{/* Property Ratings & Legal */}
							<div className="mt-8 pt-6 border-t">
								<h3 className="text-xl font-semibold mb-4">Legal & Rating Information</h3>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div className="bg-gray-50 p-4 rounded-lg">
										<div className="font-medium text-gray-900">Title Number</div>
										<div className="text-2xl font-bold text-blue-600">{commercialProperty.titleNumber}</div>
									</div>
									<div className="bg-gray-50 p-4 rounded-lg">
										<div className="font-medium text-gray-900">Council Tax Band</div>
										<div className="text-2xl font-bold text-blue-600">{commercialProperty.councilTaxBand}</div>
									</div>
									<div className="bg-gray-50 p-4 rounded-lg">
										<div className="font-medium text-gray-900">EPC Rating</div>
										<div className="text-2xl font-bold text-blue-600">{commercialProperty.EPCRating}</div>
									</div>
								</div>
							</div>

							{/* About Property */}
							<div className="mt-8 pt-6 border-t">
								<h3 className="text-xl font-semibold mb-4">More About This Property</h3>
								<div className="space-y-2 text-gray-700">
									<p>
										<strong>Address:</strong> {property.location.address}
									</p>
									<p className="mt-4">{property.description}</p>
								</div>
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div>
						{/* Action Buttons */}
						<div className="bg-white rounded-2xl p-6 shadow-lg sticky top-4 gap-2">
							<div className="flex flex-col gap-2">
								<Button>Buy Now</Button>
								<Button onClick={addToCart} disabled={cartLoading}>
									<ShoppingCart className="w-5 h-5" />
									<span>Add Cart</span>
								</Button>
							</div>

							{/* Contact */}
							<div className="mt-6 pt-6 border-t">
								<div className="flex items-center space-x-3 mb-4">
									<div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
										<UserIcon className="w-6 h-6 text-gray-600" />
									</div>
									<div>
										<div className="font-semibold">{property.owner.firstName + ' ' + property.owner.lastName}</div>
										<div className="text-sm text-gray-600">Property Owner</div>
									</div>
								</div>
								<button className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
									Contact Owner
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-4">
					<PropertyMap properties={[{ lat: property.googleMapLat!, lng: property.googleMapLng!, title: property.title }]} />
				</div>
			</MaxWidthWrapper>
		</div>
	)
}
