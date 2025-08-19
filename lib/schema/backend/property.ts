import { z } from 'zod'

export const commonInfoSchema = z.object({
	title: z.string().min(2),
	description: z.string().min(2),
	price: z.number().min(1),
	images: z.array(z.instanceof(File)),
	videos: z.array(z.instanceof(File)),
	address: z.string().min(1),
	city: z.string().min(1),
	state: z.string().min(1),
	pincode: z.string().min(1),
	googleMapLat: z.number().min(1),
	googleMapLng: z.number().min(1),
	listingType: z.enum(['FOR_SALE', 'FOR_RENT']),
	vendorContactNumber: z.string().min(1),
	propertyRent: z.number().min(1),
	securityDeposit: z.number().min(0),
	advanceBookingAmount: z.number().min(0),
})

export const apartmentFlatSchema = z.object({
	bhk: z.number().min(1),
	carpetArea: z.number().min(1),
	builtUpArea: z.number().min(1),
	floorNumber: z.number().min(1),
	totalFloors: z.number().min(1),
	bathrooms: z.number().min(1),
	furnishingStatus: z.enum(['UNFURNISHED', 'SEMI_FURNISHED', 'FULLY_FURNISHED', 'BARE_SHELL']),
	balcony: z.boolean(),
	parking: z.boolean(),
	ageOfProperty: z.number().min(1),
	facingDirection: z.enum(['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTH_EAST', 'NORTH_WEST', 'SOUTH_EAST', 'SOUTH_WEST']),
	hasLift: z.boolean(),
	hasSecurity: z.boolean(),
	hasGym: z.boolean(),
	hasSwimmingPool: z.boolean(),
	hasPowerBackup: z.boolean(),
	hasGarden: z.boolean(),
	reraNumber: z.string().min(1),
})

export const independentCommercialSchema = z.object({
	tenureAge: z.number().min(1), // this is going to be in months.
	shopFrontageWidth: z.number(),
	flatArea: z.number().min(1),
	noOfBedrooms: z.number(),
	titleNumber: z.number(),
	classUse: z.string(),

	EPCRating: z.string(),
	councilTaxBand: z.string(),

	bathrooms: z.enum(['EN_SUITE', 'SHARED']),
	furnishingStatus: z.enum(['UNFURNISHED', 'SEMI_FURNISHED', 'FULLY_FURNISHED']),
	previousUse: z.enum(['RETAIL', 'OFFICE', 'SALON', 'ETC']),
	kitchenStyle: z.enum(['Fitted', 'Modern', 'Open_Plan']),
	gardenYardAccess: z.enum(['Private', 'Shared', 'None']),
	ResidenceParkingType: z.enum(['Off_Street', 'On_Street', 'Permit']),
	heatingType: z.enum(['Gas_Central', 'Electric', 'Other']),
	storageSpace: z.enum(['Shed', 'Basement', 'Attic']),
	accessibility: z.enum(['Step_Free', 'Disabled_Access']),

	hasNearbyStation: z.boolean(),
	hasNearbyRoad: z.boolean(),
	hasNearbyBusStands: z.boolean(),
	hasCustomerParking: z.boolean(),
	hasSeparateBusinessAccess: z.boolean(),
	hasSeparateEntrance: z.boolean(),
	hasGas: z.boolean(),
	hasWater: z.boolean(),
	hasElectricity: z.boolean(),
	hasBuildingInsurance: z.boolean(),
	hasPlanningPermission: z.boolean(),
	hasCCTV: z.boolean(),
	hasSecurityAlarmSystem: z.boolean(),
	hasInternetConnection: z.boolean(),
})

export const independentHouseVillaSchema = z.object({
	bedrooms: z.number().min(1),
	plotArea: z.number().min(1),
	builtUpArea: z.number().min(1),
	floors: z.number().min(1),
	parking: z.boolean(),
	ageOfConstruction: z.number().min(1),
	furnishingStatus: z.enum(['UNFURNISHED', 'SEMI_FURNISHED', 'FULLY_FURNISHED']),
	facingDirection: z.enum(['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTH_EAST', 'NORTH_WEST', 'SOUTH_EAST', 'SOUTH_WEST']),
	hasGardenLawn: z.boolean(),
	hasWaterSource: z.boolean(),
	hasPowerBackup: z.boolean(),
	hasSwimmingPool: z.boolean(),
	hasSecurity: z.boolean(),
})

export const plotLandSchema = z.object({
	plotArea: z.number().min(1),
	plotAreaUnit: z.enum(['sq_ft', 'acres']),
	boundaryWall: z.boolean(),
	roadWidth: z.number().min(1),
	plotFacing: z.enum(['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTH_EAST', 'NORTH_WEST', 'SOUTH_EAST', 'SOUTH_WEST']),
	landUseType: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'AGRICULTURAL']),
	gatedSociety: z.boolean(),
	ownershipType: z.enum(['FREEHOLD', 'LEASEHOLD']),
	nearbyLandmarks: z.string().min(1),
})

export const officeSpaceSchema = z.object({
	carpetArea: z.number().min(1),
	builtUpArea: z.number().min(1),
	furnishingType: z.enum(['UNFURNISHED', 'SEMI_FURNISHED', 'FULLY_FURNISHED']),
	workstations: z.number().min(1),
	cabins: z.number().min(1),
	conferenceRoom: z.number().min(1),
	pantry: z.boolean(),
	washrooms: z.number().min(1),
	floorNumber: z.number().min(1),
	hasLift: z.boolean(),
	hasPowerBackup: z.boolean(),
	hasAirConditioning: z.boolean(),
	parking: z.boolean(),
	occupancyStatus: z.string().min(1),
})

export const shopShowroomSchema = z.object({
	carpetArea: z.number().min(1),
	frontageWidth: z.number().min(1),
	floorNumber: z.number().min(1),
	hasWashroom: z.boolean(),
	powerLoad: z.number().min(1),
	parking: z.boolean(),
	suitableFor: z.string().min(1), // 'Retail', 'Boutique'
})

export const wareHouseGodownSchema = z.object({
	builtUpArea: z.number().min(1),
	floorHeight: z.number().min(1),
	entryRoadWidth: z.number().min(1),
	hasPowerSupply: z.boolean(),
	hasWaterAvailability: z.boolean(),
	shutterHeight: z.number().min(1),
	hasLoadingUnloadingDock: z.boolean(),
	hasSecurity: z.boolean(),
})

export const farmhouseAgriculturalLandSchema = z.object({
	landArea: z.number().min(1),
	hasWaterSource: z.boolean(),
	hasElectricityConnection: z.boolean(),
	hasFencing: z.boolean(),
	hasRoadAccess: z.boolean(),
	soilType: z.string().min(1),
	cropType: z.string().min(1).optional(),
	hasFarmhouse: z.boolean(),
	distanceToMainRoad: z.number().min(1),
})

export const coWorkingSpaceSchema = z.object({
	deskTypes: z.array(z.enum(['HOT_DESK', 'PRIVATE_CABIN', 'DEDICATED_DESK'])),
	numberOfSeats: z.number().min(1),
	hasInternetAvailability: z.boolean(),
	hasMeetingRoom: z.boolean(),
	hasPantry: z.boolean(),
	hasReception: z.boolean(),
	hasCommonAreas: z.boolean(),
	hasAirConditioning: z.boolean(),
	hasPowerBackup: z.boolean(),
	hasParking: z.boolean(),
})

export const payingGuestHostelSchema = z.object({
	roomType: z.enum(['PRIVATE', 'SHARED', 'DORMITORY']),
	furnished: z.boolean(),
	numberOfBeds: z.number().min(1),
	hasAttachedWashroom: z.boolean(),
	foodIncluded: z.boolean(),
	hasAC: z.boolean(),
	hasWifi: z.boolean(),
	hasHousekeeping: z.boolean(),
	hasLaundry: z.boolean(),
	guestRules: z.array(z.string()).min(1),
})
