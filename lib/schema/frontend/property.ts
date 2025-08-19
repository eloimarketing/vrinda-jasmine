import { z } from 'zod'

export const commonInfoSchema = z.object({
	title: z.string().min(2),
	description: z.string().min(2),
	price: z.string(),
	images: z.array(z.instanceof(File)),
	videos: z.array(z.instanceof(File)),
	address: z.string().min(1),
	city: z.string().min(1),
	state: z.string().min(1),
	pincode: z.string().min(1),
	googleMapLat: z.string().min(1),
	googleMapLng: z.string().min(1),
	listingType: z.enum(['FOR_SALE', 'FOR_RENT']),
	vendorContactNumber: z.string().min(1),
	propertyRent: z.string().min(1),
	securityDeposit: z.string().min(0),
	advanceBookingAmount: z.string().min(0),
})

export const apartmentFlatSchema = z.object({
	bhk: z.string().min(1),
	carpetArea: z.string().min(1),
	builtUpArea: z.number().min(1),
	floorNumber: z.number().min(1),
	totalFloors: z.number().min(1),
	bathrooms: z.number().min(1),
	furnishingStatus: z.enum(['UNFURNISHED', 'SEMI_FURNISHED', 'FULLY_FURNISHED', 'BARE_SHELL']),
	ageOfProperty: z.number().min(1),
	facingDirection: z.enum(['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTH_EAST', 'NORTH_WEST', 'SOUTH_EAST', 'SOUTH_WEST']),
	parking: z.boolean(),
	hasLift: z.boolean(),
	balcony: z.boolean(),
	hasSecurity: z.boolean(),
	hasGym: z.boolean(),
	hasSwimmingPool: z.boolean(),
	hasPowerBackup: z.boolean(),
	hasGarden: z.boolean(),
	reraNumber: z.string().min(1),
})

export const independentHouseVillaSchema = z.object({
	bedrooms: z.string().min(1),
	plotArea: z.string().min(1),
	builtUpArea: z.string().min(1),
	floors: z.string().min(1),
	parking: z.boolean(),
	ageOfConstruction: z.string().min(1),
	furnishingStatus: z.enum(['UNFURNISHED', 'SEMI_FURNISHED', 'FULLY_FURNISHED']),
	facingDirection: z.enum(['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTH_EAST', 'NORTH_WEST', 'SOUTH_EAST', 'SOUTH_WEST']),
	hasGardenLawn: z.boolean(),
	hasWaterSource: z.boolean(),
	hasPowerBackup: z.boolean(),
	hasSwimmingPool: z.boolean(),
	hasSecurity: z.boolean(),
})

export const plotLandSchema = z.object({
	plotArea: z.number(),
	plotAreaUnit: z.string(),
	boundaryWall: z.boolean(),
	roadWidth: z.number(),
	plotFacing: z.enum(['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTH_EAST', 'NORTH_WEST', 'SOUTH_EAST', 'SOUTH_WEST']),
	landUseType: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'AGRICULTURAL']),
	gatedSociety: z.boolean(),
	ownershipType: z.enum(['FREEHOLD', 'LEASEHOLD']),
	nearbyLandmarks: z.enum(['PetrolPump', 'Hospital', 'RailwayStation', 'School']),
})
