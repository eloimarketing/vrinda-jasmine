'use client'

import { useState } from 'react'
import {
	MapPin,
	Phone,
	Mail,
	Calendar,
	Home,
	Car,
	Droplets,
	Zap,
	Shield,
	ChevronLeft,
	ChevronRight,
	Star,
	Bed,
	Square,
	Building,
	Trees,
	Users,
	Briefcase,
	Warehouse,
	GraduationCap,
	FileText,
	Wifi,
	Bell,
	Camera,
	Flame,
	Thermometer,
	Store,
	Utensils,
	Compass,
	Truck,
	DoorOpen,
	Shirt,
	Snowflake,
	Coffee,
	User,
	Waves,
} from 'lucide-react'
import Image from 'next/image'
import { Button, buttonVariants } from '@/components/ui/button'
import PropertyMap from '@/components/common/map/google-maps-with-pins'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import ApprovePropertyBtn from '@/app/admin/property/[id]/approve-btn'
import {
	ApartmentFlat,
	CoWorkingSpace,
	FarmhouseAgricultural,
	IndependentCommercialProperty,
	IndependentHouseVilla,
	IndustrialProperty,
	Location,
	OfficeSpace,
	PayingGuestHostel,
	PlotLand,
	Property,
	ShopShowroom,
	WarehouseGodown,
	User as prismaUser,
} from '@prisma/client'

const PropertyViewPage = ({
	property,
	isAdmin = false,
}: {
	property: Property & {
		location: Location
		owner: prismaUser

		apartmentFlat?: ApartmentFlat | null
		independentHouseVilla?: IndependentHouseVilla | null
		plotLand?: PlotLand | null
		officeSpace?: OfficeSpace | null
		shopShowroom?: ShopShowroom | null
		industrialProperty?: IndustrialProperty | null
		farmhouseAgricultural?: FarmhouseAgricultural | null
		coWorkingSpace?: CoWorkingSpace | null
		warehouseGodown?: WarehouseGodown | null
		payingGuestHostel?: PayingGuestHostel | null
		independentCommercialProperty?: IndependentCommercialProperty | null
	}
	isAdmin?: boolean
}) => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [activeTab, setActiveTab] = useState('overview')

	const formatPrice = price => {
		if (price >= 10000000) {
			return `₹${(price / 10000000).toFixed(2)} Cr`
		} else if (price >= 100000) {
			return `₹${(price / 100000).toFixed(2)} Lakh`
		} else {
			return `₹${price.toLocaleString()}`
		}
	}

	const getPropertyIcon = type => {
		const icons = {
			Apartment_Flat: Building,
			Independent_House_Villa: Home,
			Plot_Land: Square,
			Office_Space: Briefcase,
			Shop_Showroom: Building,
			Warehouse_Godown: Warehouse,
			Farmhouse_Agricultural_Land: Trees,
			CoWorking_Space: Users,
			Paying_Guest_Hostel: GraduationCap,
			Independent_Commercial_Property: Building,
		}
		return icons[type] || Building
	}

	const nextImage = () => {
		setCurrentImageIndex(prev => (prev + 1) % property.images.length)
	}

	const prevImage = () => {
		setCurrentImageIndex(prev => (prev - 1 + property.images.length) % property.images.length)
	}

	const renderPropertyDetails = () => {
		const PropertyIcon = getPropertyIcon(property.propertyType)

		// Apartment/Flat Details
		if (property.propertyType === 'Apartment_Flat' && property.apartmentFlat) {
			const details = property.apartmentFlat
			return (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Bed className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Configuration</span>
						</div>
						<p className="text-gray-600">
							{details.bhk} BHK, {details.bathrooms} Bathrooms
						</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Square className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Area</span>
						</div>
						<p className="text-gray-600">Carpet: {details.carpetArea} sq ft</p>
						<p className="text-gray-600">Built-up: {details.builtUpArea} sq ft</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Building className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Floor Details</span>
						</div>
						<p className="text-gray-600">
							{details.floorNumber} of {details.totalFloors} Floors
						</p>
						<p className="text-gray-600">Facing: {details.facingDirection}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Home className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Furnishing</span>
						</div>
						<p className="text-gray-600">{details.furnishingStatus.replace('_', ' ')}</p>
						<p className="text-gray-600">Age: {details.ageOfProperty} years</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Car className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Parking & Extras</span>
						</div>
						<p className="text-gray-600">{details.parking ? 'Parking Available' : 'No Parking'}</p>
						<p className="text-gray-600">{details.balcony ? 'Balcony Available' : 'No Balcony'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Shield className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">RERA</span>
						</div>
						<p className="text-gray-600">{details.reraNumber || 'Not Available'}</p>
					</div>
				</div>
			)
		}

		// Independent House/Villa Details
		if (property.propertyType === 'Independent_House_Villa' && property.independentHouseVilla) {
			const details = property.independentHouseVilla
			return (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Bed className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Configuration</span>
						</div>
						<p className="text-gray-600">{details.bedrooms} Bedrooms</p>
						<p className="text-gray-600">{details.floors} Floors</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Square className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Area</span>
						</div>
						<p className="text-gray-600">Plot: {details.plotArea} sq ft</p>
						<p className="text-gray-600">Built-up: {details.builtUpArea} sq ft</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Compass className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Direction & Age</span>
						</div>
						<p className="text-gray-600">Facing: {details.facingDirection || 'Not specified'}</p>
						<p className="text-gray-600">Age: {details.ageOfConstruction} years</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Home className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Furnishing</span>
						</div>
						<p className="text-gray-600">{details.furnishingStatus.replace('_', ' ')}</p>
						<p className="text-gray-600">{details.parking ? 'Parking Available' : 'No Parking'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Trees className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Amenities</span>
						</div>
						<p className="text-gray-600">{details.hasGardenLawn ? 'Garden/Lawn Available' : 'No Garden'}</p>
						<p className="text-gray-600">{details.hasWaterSource ? 'Water Source Available' : 'No Water Source'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Zap className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Utilities</span>
						</div>
						<p className="text-gray-600">{details.hasPowerBackup ? 'Power Backup' : 'No Power Backup'}</p>
						<p className="text-gray-600">{details.hasSecurity ? 'Security Available' : 'No Security'}</p>
					</div>
				</div>
			)
		}

		// Plot/Land Details
		if (property.propertyType === 'Plot_Land' && property.plotLand) {
			const details = property.plotLand
			return (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Square className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Plot Details</span>
						</div>
						<p className="text-gray-600">
							Area: {details.plotArea} {details.plotAreaUnit}
						</p>
						<p className="text-gray-600">Facing: {details.plotFacing || 'Not specified'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<MapPin className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Location & Access</span>
						</div>
						<p className="text-gray-600">Road Width: {details.roadWidth ? `${details.roadWidth} ft` : 'Not specified'}</p>
						<p className="text-gray-600">{details.gatedSociety ? 'Gated Society' : 'Open Area'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<FileText className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Legal Details</span>
						</div>
						<p className="text-gray-600">Land Use: {details.landUseType}</p>
						<p className="text-gray-600">Ownership: {details.ownershipType}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Shield className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Infrastructure</span>
						</div>
						<p className="text-gray-600">{details.boundaryWall ? 'Boundary Wall' : 'No Boundary Wall'}</p>
						<p className="text-gray-600">Landmarks: {details.nearbyLandmarks?.length || 0} nearby</p>
					</div>
				</div>
			)
		}

		// Office Space Details
		if (property.propertyType === 'Office_Space' && property.officeSpace) {
			const details = property.officeSpace
			return (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Square className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Area Details</span>
						</div>
						<p className="text-gray-600">Carpet: {details.carpetArea} sq ft</p>
						<p className="text-gray-600">Built-up: {details.builtUpArea} sq ft</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Building className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Floor & Layout</span>
						</div>
						<p className="text-gray-600">Floor: {details.floorNumber}</p>
						<p className="text-gray-600">Furnishing: {details.furnishingType.replace('_', ' ')}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Users className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Workspace</span>
						</div>
						<p className="text-gray-600">Workstations: {details.workstations}</p>
						<p className="text-gray-600">Cabins: {details.cabins}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Home className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Facilities</span>
						</div>
						<p className="text-gray-600">Conference Rooms: {details.conferenceRoom}</p>
						<p className="text-gray-600">Washrooms: {details.washrooms}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Zap className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Amenities</span>
						</div>
						<p className="text-gray-600">{details.hasLift ? 'Lift Available' : 'No Lift'}</p>
						<p className="text-gray-600">{details.hasPowerBackup ? 'Power Backup' : 'No Power Backup'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Car className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Additional Features</span>
						</div>
						<p className="text-gray-600">{details.parking ? 'Parking Available' : 'No Parking'}</p>
						<p className="text-gray-600">{details.pantry ? 'Pantry Available' : 'No Pantry'}</p>
					</div>
				</div>
			)
		}

		// Shop/Showroom Details
		if (property.propertyType === 'Shop_Showroom' && property.shopShowroom) {
			const details = property.shopShowroom
			return (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Square className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Area & Layout</span>
						</div>
						<p className="text-gray-600">Carpet Area: {details.carpetArea} sq ft</p>
						<p className="text-gray-600">Frontage: {details.frontageWidth ? `${details.frontageWidth} ft` : 'Not specified'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Building className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Floor & Facilities</span>
						</div>
						<p className="text-gray-600">Floor: {details.floorNumber}</p>
						<p className="text-gray-600">{details.hasWashroom ? 'Washroom Available' : 'No Washroom'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Zap className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Utilities</span>
						</div>
						<p className="text-gray-600">Power Load: {details.powerLoad ? `${details.powerLoad} KW` : 'Not specified'}</p>
						<p className="text-gray-600">{details.parking ? 'Parking Available' : 'No Parking'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Store className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Business Type</span>
						</div>
						<p className="text-gray-600">Suitable for: {details.suitableFor || 'General retail'}</p>
					</div>
				</div>
			)
		}

		// Warehouse/Godown Details
		if (property.propertyType === 'Warehouse_Godown' && property.warehouseGodown) {
			const details = property.warehouseGodown
			return (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Square className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Area & Dimensions</span>
						</div>
						<p className="text-gray-600">Built-up Area: {details.builtUpArea} sq ft</p>
						<p className="text-gray-600">Floor Height: {details.floorHeight} ft</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Truck className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Loading Features</span>
						</div>
						<p className="text-gray-600">
							Entry Road: {details.entryRoadWidth ? `${details.entryRoadWidth} ft` : 'Not specified'}
						</p>
						<p className="text-gray-600">
							Shutter Height: {details.shutterHeight ? `${details.shutterHeight} ft` : 'Not specified'}
						</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Zap className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Utilities</span>
						</div>
						<p className="text-gray-600">{details.hasPowerSupply ? 'Power Supply Available' : 'No Power Supply'}</p>
						<p className="text-gray-600">{details.hasWaterAvailability ? 'Water Available' : 'No Water'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Shield className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Security & Access</span>
						</div>
						<p className="text-gray-600">{details.hasSecurity ? 'Security Available' : 'No Security'}</p>
						<p className="text-gray-600">{details.hasLoadingUnloadingDock ? 'Loading Dock Available' : 'No Loading Dock'}</p>
					</div>
				</div>
			)
		}

		// Farmhouse/Agricultural Details
		if (property.propertyType === 'Farmhouse_Agricultural_Land' && property.farmhouseAgricultural) {
			const details = property.farmhouseAgricultural
			return (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Square className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Land Details</span>
						</div>
						<p className="text-gray-600">Land Area: {details.landArea} acres</p>
						<p className="text-gray-600">Soil Type: {details.soilType || 'Not specified'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Droplets className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Water & Utilities</span>
						</div>
						<p className="text-gray-600">{details.hasWaterSource ? 'Water Source Available' : 'No Water Source'}</p>
						<p className="text-gray-600">{details.hasElectricityConnection ? 'Electricity Available' : 'No Electricity'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Shield className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Security & Access</span>
						</div>
						<p className="text-gray-600">{details.hasFencing ? 'Fencing Available' : 'No Fencing'}</p>
						<p className="text-gray-600">{details.hasRoadAccess ? 'Road Access Available' : 'No Road Access'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Home className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Farmhouse & Crops</span>
						</div>
						<p className="text-gray-600">{details.hasFarmhouse ? 'Farmhouse Available' : 'No Farmhouse'}</p>
						<p className="text-gray-600">Crop Type: {details.cropType || 'Not specified'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<MapPin className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Location</span>
						</div>
						<p className="text-gray-600">
							Distance to Main Road: {details.distanceToMainRoad ? `${details.distanceToMainRoad} km` : 'Not specified'}
						</p>
					</div>
				</div>
			)
		}

		// CoWorking Space Details
		if (property.propertyType === 'CoWorking_Space' && property.coWorkingSpace) {
			const details = property.coWorkingSpace
			return (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Users className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Seating & Desk Types</span>
						</div>
						<p className="text-gray-600">Total Seats: {details.numberOfSeats}</p>
						<p className="text-gray-600">Desk Types: {details.deskTypes?.join(', ').replace(/_/g, ' ') || 'Not specified'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Wifi className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Connectivity</span>
						</div>
						<p className="text-gray-600">{details.hasInternetAvailability ? 'Internet Available' : 'No Internet'}</p>
						<p className="text-gray-600">{details.hasReception ? 'Reception Available' : 'No Reception'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Home className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Facilities</span>
						</div>
						<p className="text-gray-600">{details.hasMeetingRoom ? 'Meeting Room Available' : 'No Meeting Room'}</p>
						<p className="text-gray-600">{details.hasPantry ? 'Pantry Available' : 'No Pantry'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Zap className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Utilities</span>
						</div>
						<p className="text-gray-600">{details.hasAirConditioning ? 'AC Available' : 'No AC'}</p>
						<p className="text-gray-600">{details.hasPowerBackup ? 'Power Backup' : 'No Power Backup'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Car className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Additional Features</span>
						</div>
						<p className="text-gray-600">{details.hasParking ? 'Parking Available' : 'No Parking'}</p>
						<p className="text-gray-600">{details.hasCommonAreas ? 'Common Areas Available' : 'No Common Areas'}</p>
					</div>
				</div>
			)
		}

		// Paying Guest/Hostel Details
		if (property.propertyType === 'Paying_Guest_Hostel' && property.payingGuestHostel) {
			const details = property.payingGuestHostel
			return (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Bed className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Room Details</span>
						</div>
						<p className="text-gray-600">Room Type: {details.roomType}</p>
						<p className="text-gray-600">Number of Beds: {details.numberOfBeds}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Home className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Furnishing & Washroom</span>
						</div>
						<p className="text-gray-600">{details.furnished ? 'Furnished' : 'Unfurnished'}</p>
						<p className="text-gray-600">{details.hasAttachedWashroom ? 'Attached Washroom' : 'Shared Washroom'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Utensils className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Food & AC</span>
						</div>
						<p className="text-gray-600">{details.foodIncluded ? 'Food Included' : 'Food Not Included'}</p>
						<p className="text-gray-600">{details.hasAC ? 'AC Available' : 'No AC'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Wifi className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Connectivity & Services</span>
						</div>
						<p className="text-gray-600">{details.hasWifi ? 'WiFi Available' : 'No WiFi'}</p>
						<p className="text-gray-600">{details.hasLaundry ? 'Laundry Service' : 'No Laundry'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Shield className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Services</span>
						</div>
						<p className="text-gray-600">{details.hasHousekeeping ? 'Housekeeping Available' : 'No Housekeeping'}</p>
						<p className="text-gray-600">Guest Rules: {details.guestRules?.length || 0} rules</p>
					</div>
				</div>
			)
		}

		// Independent Commercial Property Details
		if (property.propertyType === 'Independent_Commercial_Property' && property.independentCommercialProperty) {
			const details = property.independentCommercialProperty
			return (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Building className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Property Details</span>
						</div>
						<p className="text-gray-600">Age: {details.tenureAge} months</p>
						<p className="text-gray-600">Class Use: {details.classUse}</p>
						<p className="text-gray-600">Previous Use: {details.previousUse?.replace('_', ' ')}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Square className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Area & Configuration</span>
						</div>
						<p className="text-gray-600">Flat Area: {details.flatArea} sq ft</p>
						<p className="text-gray-600">Bedrooms: {details.noOfBedrooms}</p>
						<p className="text-gray-600">Bathrooms: {details.bathrooms}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Store className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Commercial Features</span>
						</div>
						<p className="text-gray-600">Shop Frontage: {details.shopFrontageWidth} ft</p>
						<p className="text-gray-600">{details.hasSeparateBusinessAccess ? 'Separate Business Access' : 'Shared Access'}</p>
						<p className="text-gray-600">{details.hasCustomerParking ? 'Customer Parking' : 'No Customer Parking'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Home className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Furnishing & Style</span>
						</div>
						<p className="text-gray-600">Furnishing: {details.furnishing?.replace('_', ' ')}</p>
						<p className="text-gray-600">Kitchen: {details.kitchenStyle?.replace('_', ' ')}</p>
						<p className="text-gray-600">{details.hasSeparateEntrance ? 'Separate Entrance' : 'Shared Entrance'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Car className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Parking & Garden</span>
						</div>
						<p className="text-gray-600">Parking: {details.residenceParkingType?.replace('_', ' ')}</p>
						<p className="text-gray-600">Garden Access: {details.gardenYardAccess?.replace('_', ' ')}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<MapPin className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Location Benefits</span>
						</div>
						<p className="text-gray-600">{details.hasNearbyStation ? 'Near Station' : 'Away from Station'}</p>
						<p className="text-gray-600">{details.hasNearbyRoad ? 'Near Main Road' : 'Away from Main Road'}</p>
						<p className="text-gray-600">{details.hasNearbyBusStands ? 'Near Bus Stands' : 'Away from Bus Stands'}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<FileText className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Legal & Compliance</span>
						</div>
						<p className="text-gray-600">Title Number: {details.titleNumber}</p>
						<p className="text-gray-600">Council Tax: {details.councilTaxBand}</p>
						<p className="text-gray-600">EPC Rating: {details.EPCRating}</p>
					</div>

					<div className="bg-blue-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Thermometer className="w-5 h-5 text-blue-600" />
							<span className="font-semibold text-gray-700">Heating & Storage</span>
						</div>
						<p className="text-gray-600">Heating: {details.heatingType?.replace('_', ' ')}</p>
						<p className="text-gray-600">Storage: {details.storageSpace?.replace('_', ' ')}</p>
						<p className="text-gray-600">Accessibility: {details.accessibility?.replace('_', ' ')}</p>
					</div>
				</div>
			)
		}

		// Add similar detailed views for other property types
		return (
			<div className="bg-blue-50 p-4 rounded-lg">
				<div className="flex items-center gap-2 mb-2">
					<PropertyIcon className="w-5 h-5 text-blue-600" />
					<span className="font-semibold text-gray-700">Property Type</span>
				</div>
				<p className="text-gray-600">{property.propertyType.replace('_', ' ')}</p>
			</div>
		)
	}

	const renderAmenities = () => {
		// Apartment/Flat Amenities
		if (property.propertyType === 'Apartment_Flat' && property.apartmentFlat) {
			const amenities = [
				{ name: 'Lift', available: property.apartmentFlat.hasLift, icon: Building },
				{ name: 'Security', available: property.apartmentFlat.hasSecurity, icon: Shield },
				{ name: 'Gym', available: property.apartmentFlat.hasGym, icon: Users },
				{ name: 'Swimming Pool', available: property.apartmentFlat.hasSwimmingPool, icon: Droplets },
				{ name: 'Power Backup', available: property.apartmentFlat.hasPowerBackup, icon: Zap },
				{ name: 'Garden', available: property.apartmentFlat.hasGarden, icon: Trees },
				{ name: 'Balcony', available: property.apartmentFlat.balcony, icon: Home },
				{ name: 'Parking', available: property.apartmentFlat.parking, icon: Car },
			]

			return (
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
					{amenities.map((amenity, index) => (
						<div
							key={index}
							className={`p-3 rounded-lg border-2 ${
								amenity.available ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
							}`}>
							<div className="flex items-center gap-2">
								<amenity.icon className={`w-5 h-5 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`} />
								<span className={`text-sm font-medium ${amenity.available ? 'text-green-700' : 'text-gray-500'}`}>
									{amenity.name}
								</span>
							</div>
							<p className={`text-xs mt-1 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`}>
								{amenity.available ? 'Available' : 'Not Available'}
							</p>
						</div>
					))}
				</div>
			)
		}

		// Independent House/Villa Amenities
		if (property.propertyType === 'Independent_House_Villa' && property.independentHouseVilla) {
			const amenities = [
				{ name: 'Parking', available: property.independentHouseVilla.parking, icon: Car },
				{ name: 'Garden/Lawn', available: property.independentHouseVilla.hasGardenLawn, icon: Trees },
				{ name: 'Water Source', available: property.independentHouseVilla.hasWaterSource, icon: Droplets },
				{ name: 'Power Backup', available: property.independentHouseVilla.hasPowerBackup, icon: Zap },
				{ name: 'Swimming Pool', available: property.independentHouseVilla.hasSwimmingPool, icon: Waves },
				{ name: 'Security', available: property.independentHouseVilla.hasSecurity, icon: Shield },
			]

			return (
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
					{amenities.map((amenity, index) => (
						<div
							key={index}
							className={`p-3 rounded-lg border-2 ${
								amenity.available ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
							}`}>
							<div className="flex items-center gap-2">
								<amenity.icon className={`w-5 h-5 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`} />
								<span className={`text-sm font-medium ${amenity.available ? 'text-green-700' : 'text-gray-500'}`}>
									{amenity.name}
								</span>
							</div>
							<p className={`text-xs mt-1 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`}>
								{amenity.available ? 'Available' : 'Not Available'}
							</p>
						</div>
					))}
				</div>
			)
		}

		// Plot/Land Amenities
		if (property.propertyType === 'Plot_Land' && property.plotLand) {
			const amenities = [
				{ name: 'Boundary Wall', available: property.plotLand.boundaryWall, icon: Square },
				{ name: 'Gated Society', available: property.plotLand.gatedSociety, icon: Shield },
			]

			return (
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
					{amenities.map((amenity, index) => (
						<div
							key={index}
							className={`p-3 rounded-lg border-2 ${
								amenity.available ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
							}`}>
							<div className="flex items-center gap-2">
								<amenity.icon className={`w-5 h-5 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`} />
								<span className={`text-sm font-medium ${amenity.available ? 'text-green-700' : 'text-gray-500'}`}>
									{amenity.name}
								</span>
							</div>
							<p className={`text-xs mt-1 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`}>
								{amenity.available ? 'Available' : 'Not Available'}
							</p>
						</div>
					))}
				</div>
			)
		}

		// Office Space Amenities
		if (property.propertyType === 'Office_Space' && property.officeSpace) {
			const amenities = [
				{ name: 'Pantry', available: property.officeSpace.pantry, icon: Coffee },
				{ name: 'Lift', available: property.officeSpace.hasLift, icon: Building },
				{ name: 'Power Backup', available: property.officeSpace.hasPowerBackup, icon: Zap },
				{ name: 'Air Conditioning', available: property.officeSpace.hasAirConditioning, icon: Snowflake },
				{ name: 'Parking', available: property.officeSpace.parking, icon: Car },
			]

			return (
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
					{amenities.map((amenity, index) => (
						<div
							key={index}
							className={`p-3 rounded-lg border-2 ${
								amenity.available ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
							}`}>
							<div className="flex items-center gap-2">
								<amenity.icon className={`w-5 h-5 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`} />
								<span className={`text-sm font-medium ${amenity.available ? 'text-green-700' : 'text-gray-500'}`}>
									{amenity.name}
								</span>
							</div>
							<p className={`text-xs mt-1 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`}>
								{amenity.available ? 'Available' : 'Not Available'}
							</p>
						</div>
					))}
				</div>
			)
		}

		// Shop/Showroom Amenities
		if (property.propertyType === 'Shop_Showroom' && property.shopShowroom) {
			const amenities = [
				{ name: 'Washroom', available: property.shopShowroom.hasWashroom, icon: Home },
				{ name: 'Parking', available: property.shopShowroom.parking, icon: Car },
			]

			return (
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
					{amenities.map((amenity, index) => (
						<div
							key={index}
							className={`p-3 rounded-lg border-2 ${
								amenity.available ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
							}`}>
							<div className="flex items-center gap-2">
								<amenity.icon className={`w-5 h-5 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`} />
								<span className={`text-sm font-medium ${amenity.available ? 'text-green-700' : 'text-gray-500'}`}>
									{amenity.name}
								</span>
							</div>
							<p className={`text-xs mt-1 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`}>
								{amenity.available ? 'Available' : 'Not Available'}
							</p>
						</div>
					))}
				</div>
			)
		}

		// Warehouse/Godown Amenities
		if (property.propertyType === 'Warehouse_Godown' && property.warehouseGodown) {
			const amenities = [
				{ name: 'Power Supply', available: property.warehouseGodown.hasPowerSupply, icon: Zap },
				{ name: 'Water Availability', available: property.warehouseGodown.hasWaterAvailability, icon: Droplets },
				{ name: 'Loading/Unloading Dock', available: property.warehouseGodown.hasLoadingUnloadingDock, icon: Truck },
				{ name: 'Security', available: property.warehouseGodown.hasSecurity, icon: Shield },
			]

			return (
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
					{amenities.map((amenity, index) => (
						<div
							key={index}
							className={`p-3 rounded-lg border-2 ${
								amenity.available ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
							}`}>
							<div className="flex items-center gap-2">
								<amenity.icon className={`w-5 h-5 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`} />
								<span className={`text-sm font-medium ${amenity.available ? 'text-green-700' : 'text-gray-500'}`}>
									{amenity.name}
								</span>
							</div>
							<p className={`text-xs mt-1 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`}>
								{amenity.available ? 'Available' : 'Not Available'}
							</p>
						</div>
					))}
				</div>
			)
		}

		// Farmhouse/Agricultural Amenities
		if (property.propertyType === 'Farmhouse_Agricultural_Land' && property.farmhouseAgricultural) {
			const amenities = [
				{ name: 'Water Source', available: property.farmhouseAgricultural.hasWaterSource, icon: Droplets },
				{ name: 'Electricity Connection', available: property.farmhouseAgricultural.hasElectricityConnection, icon: Zap },
				{ name: 'Fencing', available: property.farmhouseAgricultural.hasFencing, icon: Square },
				{ name: 'Road Access', available: property.farmhouseAgricultural.hasRoadAccess, icon: MapPin },
				{ name: 'Farmhouse', available: property.farmhouseAgricultural.hasFarmhouse, icon: Home },
			]

			return (
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
					{amenities.map((amenity, index) => (
						<div
							key={index}
							className={`p-3 rounded-lg border-2 ${
								amenity.available ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
							}`}>
							<div className="flex items-center gap-2">
								<amenity.icon className={`w-5 h-5 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`} />
								<span className={`text-sm font-medium ${amenity.available ? 'text-green-700' : 'text-gray-500'}`}>
									{amenity.name}
								</span>
							</div>
							<p className={`text-xs mt-1 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`}>
								{amenity.available ? 'Available' : 'Not Available'}
							</p>
						</div>
					))}
				</div>
			)
		}

		// CoWorking Space Amenities
		if (property.propertyType === 'CoWorking_Space' && property.coWorkingSpace) {
			const amenities = [
				{ name: 'Internet', available: property.coWorkingSpace.hasInternetAvailability, icon: Wifi },
				{ name: 'Meeting Room', available: property.coWorkingSpace.hasMeetingRoom, icon: Users },
				{ name: 'Pantry', available: property.coWorkingSpace.hasPantry, icon: Coffee },
				{ name: 'Reception', available: property.coWorkingSpace.hasReception, icon: User },
				{ name: 'Common Areas', available: property.coWorkingSpace.hasCommonAreas, icon: Home },
				{ name: 'Air Conditioning', available: property.coWorkingSpace.hasAirConditioning, icon: Snowflake },
				{ name: 'Power Backup', available: property.coWorkingSpace.hasPowerBackup, icon: Zap },
				{ name: 'Parking', available: property.coWorkingSpace.hasParking, icon: Car },
			]

			return (
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
					{amenities.map((amenity, index) => (
						<div
							key={index}
							className={`p-3 rounded-lg border-2 ${
								amenity.available ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
							}`}>
							<div className="flex items-center gap-2">
								<amenity.icon className={`w-5 h-5 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`} />
								<span className={`text-sm font-medium ${amenity.available ? 'text-green-700' : 'text-gray-500'}`}>
									{amenity.name}
								</span>
							</div>
							<p className={`text-xs mt-1 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`}>
								{amenity.available ? 'Available' : 'Not Available'}
							</p>
						</div>
					))}
				</div>
			)
		}

		// Paying Guest/Hostel Amenities
		if (property.propertyType === 'Paying_Guest_Hostel' && property.payingGuestHostel) {
			const amenities = [
				{ name: 'Furnished', available: property.payingGuestHostel.furnished, icon: Home },
				{ name: 'Attached Washroom', available: property.payingGuestHostel.hasAttachedWashroom, icon: Droplets },
				{ name: 'Food Included', available: property.payingGuestHostel.foodIncluded, icon: Coffee },
				{ name: 'AC', available: property.payingGuestHostel.hasAC, icon: Snowflake },
				{ name: 'WiFi', available: property.payingGuestHostel.hasWifi, icon: Wifi },
				{ name: 'Housekeeping', available: property.payingGuestHostel.hasHousekeeping, icon: User },
				{ name: 'Laundry', available: property.payingGuestHostel.hasLaundry, icon: Shirt },
			]

			return (
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
					{amenities.map((amenity, index) => (
						<div
							key={index}
							className={`p-3 rounded-lg border-2 ${
								amenity.available ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
							}`}>
							<div className="flex items-center gap-2">
								<amenity.icon className={`w-5 h-5 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`} />
								<span className={`text-sm font-medium ${amenity.available ? 'text-green-700' : 'text-gray-500'}`}>
									{amenity.name}
								</span>
							</div>
							<p className={`text-xs mt-1 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`}>
								{amenity.available ? 'Available' : 'Not Available'}
							</p>
						</div>
					))}
				</div>
			)
		}

		// Industrial Property Amenities
		if (property.propertyType === 'Industrial_Property' && property.industrialProperty) {
			const amenities = [
				{ name: 'Water Supply', available: property.industrialProperty.hasWaterSupply, icon: Droplets },
				{ name: 'Fire Safety', available: property.industrialProperty.hasFireSafety, icon: Shield },
				{ name: 'Security', available: property.industrialProperty.hasSecurity, icon: Shield },
				{ name: 'Road Access', available: property.industrialProperty.roadAccess, icon: MapPin },
			]

			return (
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
					{amenities.map((amenity, index) => (
						<div
							key={index}
							className={`p-3 rounded-lg border-2 ${
								amenity.available ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
							}`}>
							<div className="flex items-center gap-2">
								<amenity.icon className={`w-5 h-5 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`} />
								<span className={`text-sm font-medium ${amenity.available ? 'text-green-700' : 'text-gray-500'}`}>
									{amenity.name}
								</span>
							</div>
							<p className={`text-xs mt-1 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`}>
								{amenity.available ? 'Available' : 'Not Available'}
							</p>
						</div>
					))}
				</div>
			)
		}

		// Independent Commercial Property Amenities
		if (property.propertyType === 'Independent_Commercial_Property' && property.independentCommercialProperty) {
			const amenities = [
				{ name: 'Gas Connection', available: property.independentCommercialProperty.hasGas, icon: Flame },
				{ name: 'Water Supply', available: property.independentCommercialProperty.hasWater, icon: Droplets },
				{ name: 'Electricity', available: property.independentCommercialProperty.hasElectricity, icon: Zap },
				{ name: 'Building Insurance', available: property.independentCommercialProperty.hasBuildingInsurance, icon: Shield },
				{ name: 'Planning Permission', available: property.independentCommercialProperty.hasPlanningPermission, icon: FileText },
				{ name: 'CCTV', available: property.independentCommercialProperty.hasCCTV, icon: Camera },
				{ name: 'Security Alarm', available: property.independentCommercialProperty.hasSecurityAlarmSystem, icon: Bell },
				{ name: 'Internet Connection', available: property.independentCommercialProperty.hasInternetConnection, icon: Wifi },
				{ name: 'Customer Parking', available: property.independentCommercialProperty.hasCustomerParking, icon: Car },
				{
					name: 'Separate Business Access',
					available: property.independentCommercialProperty.hasSeparateBusinessAccess,
					icon: DoorOpen,
				},
				{ name: 'Separate Entrance', available: property.independentCommercialProperty.hasSeparateEntrance, icon: DoorOpen },
			]

			return (
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
					{amenities.map((amenity, index) => (
						<div
							key={index}
							className={`p-3 rounded-lg border-2 ${
								amenity.available ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
							}`}>
							<div className="flex items-center gap-2">
								<amenity.icon className={`w-5 h-5 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`} />
								<span className={`text-sm font-medium ${amenity.available ? 'text-green-700' : 'text-gray-500'}`}>
									{amenity.name}
								</span>
							</div>
							<p className={`text-xs mt-1 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`}>
								{amenity.available ? 'Available' : 'Not Available'}
							</p>
						</div>
					))}
				</div>
			)
		}

		return <p className="text-gray-600">Amenity information not available for this property type.</p>
	}

	return (
		<div className="min-h-screen bg-blue-50">
			<div className="mx-auto px-4 py-6">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Left Column - Images and Details */}
					<div className="lg:col-span-2 space-y-6">
						{/* Image Gallery */}
						<div className="bg-white rounded-lg shadow-sm overflow-hidden">
							<div className="relative">
								<Image
									width={800}
									height={600}
									src={property.images[currentImageIndex]}
									alt={`Property ${currentImageIndex + 1}`}
									className="w-full h-96 object-cover"
								/>
								{property.images.length > 1 && (
									<>
										<button
											onClick={prevImage}
											className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md">
											<ChevronLeft className="w-5 h-5 text-gray-700" />
										</button>
										<button
											onClick={nextImage}
											className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md">
											<ChevronRight className="w-5 h-5 text-gray-700" />
										</button>
									</>
								)}
								<div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium">
									{currentImageIndex + 1} / {property.images.length}
								</div>
								{property.isVerified && (
									<div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
										<Star className="w-4 h-4" />
										Verified
									</div>
								)}
								{!property.isVerified && (
									<div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
										<Star className="w-4 h-4" />
										Un-Verified
									</div>
								)}
							</div>

							{/* Thumbnail Strip */}
							<div className="p-4 flex gap-2 overflow-x-auto">
								{property.images.map((img, index) => (
									<button
										key={index}
										onClick={() => setCurrentImageIndex(index)}
										className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
											currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
										}`}>
										<Image width={800} height={600} src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
									</button>
								))}
							</div>
						</div>

						{/* Property Information */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<div className="flex items-start justify-between mb-4">
								<div>
									<h2 className="text-2xl font-bold text-gray-800 mb-2">{property.title}</h2>
									<div className="flex items-center gap-2 text-gray-600 mb-2">
										<MapPin className="w-4 h-4" />
										<span>
											{property.location.address}, {property.location.city}, {property.location.state} - {property.location.pincode}
										</span>
									</div>
									<div className="flex items-center gap-4 text-sm text-gray-500">
										<div className="flex items-center gap-1">
											<Calendar className="w-4 h-4" />
											<span>Posted {new Date(property.createdAt).toLocaleDateString()}</span>
										</div>
									</div>
								</div>
								<div className="text-right">
									<div className="text-3xl font-bold text-blue-600">{formatPrice(property.price)}</div>
									<div className="text-sm text-gray-500">{property.listingType === 'FOR_SALE' ? 'For Sale' : 'For Rent'}</div>
									{property.advanceBookingAmount > 0 && (
										<div className="text-sm text-gray-600 mt-1">Booking Amount: {formatPrice(property.advanceBookingAmount)}</div>
									)}
								</div>
							</div>

							<p className="text-gray-700 mb-6">{property.description}</p>

							{/* Tabs */}
							<div className="border-b border-gray-200 mb-6">
								<nav className="flex space-x-8">
									{['overview', 'details', 'amenities', 'location'].map(tab => (
										<button
											key={tab}
											onClick={() => setActiveTab(tab)}
											className={`py-2 px-1 border-b-2 font-medium text-sm ${
												activeTab === tab
													? 'border-blue-500 text-blue-600'
													: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
											}`}>
											{tab.charAt(0).toUpperCase() + tab.slice(1)}
										</button>
									))}
								</nav>
							</div>

							{/* Tab Content */}
							<div className="tab-content">
								{activeTab === 'overview' && (
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-gray-800">Property Overview</h3>
										{renderPropertyDetails()}
									</div>
								)}

								{activeTab === 'details' && (
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-gray-800">Detailed Information</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="bg-gray-50 p-4 rounded-lg">
												<h4 className="font-medium text-gray-700 mb-2">Property Status</h4>
												<p className="text-gray-600">{property.status}</p>
											</div>
											<div className="bg-gray-50 p-4 rounded-lg">
												<h4 className="font-medium text-gray-700 mb-2">Property Type</h4>
												<p className="text-gray-600">{property.propertyType.replace('_', ' ')}</p>
											</div>
											<div className="bg-gray-50 p-4 rounded-lg">
												<h4 className="font-medium text-gray-700 mb-2">Listing Type</h4>
												<p className="text-gray-600">{property.listingType.replace('_', ' ')}</p>
											</div>
											<div className="bg-gray-50 p-4 rounded-lg">
												<h4 className="font-medium text-gray-700 mb-2">Last Updated</h4>
												<p className="text-gray-600">{new Date(property.updatedAt).toLocaleDateString()}</p>
											</div>
										</div>
									</div>
								)}

								{activeTab === 'amenities' && (
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-gray-800">Amenities & Features</h3>
										{renderAmenities()}
									</div>
								)}

								{activeTab === 'location' && (
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-gray-800">Location Details</h3>
										<div className="bg-gray-50 p-4 rounded-lg">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<h4 className="font-medium text-gray-700 mb-2">Address</h4>
													<p className="text-gray-600">{property.location.address}</p>
												</div>
												<div>
													<h4 className="font-medium text-gray-700 mb-2">City</h4>
													<p className="text-gray-600">{property.location.city}</p>
												</div>
												<div>
													<h4 className="font-medium text-gray-700 mb-2">State</h4>
													<p className="text-gray-600">{property.location.state}</p>
												</div>
												<div>
													<h4 className="font-medium text-gray-700 mb-2">Pincode</h4>
													<p className="text-gray-600">{property.location.pincode}</p>
												</div>
											</div>
										</div>

										{property.googleMapLat && property.googleMapLng && (
											<div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center my-6 overflow-hidden">
												<PropertyMap properties={[{ lat: property.googleMapLat, lng: property.googleMapLng, title: 'Property' }]} />
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Right Column - Contact and Actions */}
					<div className="space-y-6">
						{/* Owner Contact Card */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Owner</h3>
							<div className="flex items-center gap-3 mb-4">
								<Image
									width={100}
									height={100}
									src={
										property.owner.avatarUrl ||
										'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
									}
									alt={`${property.owner.firstName} ${property.owner.lastName}`}
									className="w-12 h-12 rounded-full object-cover"
								/>
								<div>
									<h4 className="font-medium text-gray-800">
										{property.owner.firstName} {property.owner.lastName}
									</h4>
									<p className="text-sm text-gray-600">Property Owner</p>
								</div>
							</div>

							<div className="space-y-3">
								<Link
									href={`tel:${property.owner.phoneNumber}`}
									className={cn(
										buttonVariants({ variant: 'default' }),
										'w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2'
									)}>
									<Phone className="w-5 h-5" />
									Call {property.owner.countryCode} {property.owner.phoneNumber}
								</Link>

								<Link
									href={`mailto:${property.owner.email}`}
									className={cn(
										buttonVariants({ variant: 'default' }),
										'w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2'
									)}>
									<Mail className="w-5 h-5" />
									Send Email
								</Link>
							</div>
						</div>

						{/* Quick Actions */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
							<Button className="w-full">Add to Wishlist</Button>
							{isAdmin && <ApprovePropertyBtn propertyId={property.id} className="w-full mt-2" />}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PropertyViewPage
