import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma/prisma'
import { z } from 'zod'

// Base schema for common fields
const baseProductSchema = z.object({
	productName: z.string().min(1),
	brand: z.string().min(1),
	description: z.string().min(1),
	price: z.number().positive(),
	productImage: z.string().min(1),
	category: z.string().min(1),
	subcategory: z.string().min(1)
})

// Schema for GlassDoorRefrigeration
const glassDoorRefrigerationSchema = baseProductSchema.extend({
	model: z.string().min(1),
	temperatureRange: z.string().min(1),
	capacityLitres: z.string().min(1),
	glassType: z.string().min(1),
	lighting: z.string().min(1),
	shelves: z.string().min(1),
	dimensions: z.string().min(1),
	powerSupply: z.string().min(1),
	warranty: z.string().min(1)
})

// Schema for IceCreamFreezers
const iceCreamFreezersSchema = baseProductSchema.extend({
	capacity: z.string().min(1),
	temperatureRange: z.string().min(1),
	lidType: z.string().min(1),
	defrostType: z.string().min(1),
	interiorLighting: z.string().min(1),
	power: z.string().min(1),
	dimensions: z.string().min(1),
	warranty: z.string().min(1)
})

// Schema for DrinksFridgesBottleCoolers
const drinksFridgesBottleCoolersSchema = baseProductSchema.extend({
	capacity: z.string().min(1),
	temperatureRange: z.string().min(1),
	doorType: z.string().min(1),
	shelving: z.string().min(1),
	lighting: z.string().min(1),
	power: z.string().min(1),
	dimensions: z.string().min(1),
	warranty: z.string().min(1)
})

// Schema for ServeOverCounters
const serveOverCountersSchema = baseProductSchema.extend({
	capacity: z.string().min(1),
	temperatureRange: z.string().min(1),
	counterType: z.string().min(1),
	displayArea: z.string().min(1),
	lighting: z.string().min(1),
	power: z.string().min(1),
	dimensions: z.string().min(1),
	warranty: z.string().min(1)
})

// Schema for MultideckDisplays
const multideckDisplaysSchema = baseProductSchema.extend({
	capacity: z.string().min(1),
	temperatureRange: z.string().min(1),
	deckCount: z.string().min(1),
	displayType: z.string().min(1),
	lighting: z.string().min(1),
	power: z.string().min(1),
	dimensions: z.string().min(1),
	warranty: z.string().min(1)
})

// Schema for UprightUndercounterFridges
const uprightUndercounterFridgesSchema = baseProductSchema.extend({
	capacity: z.string().min(1),
	temperatureRange: z.string().min(1),
	fridgeType: z.string().min(1),
	shelving: z.string().min(1),
	lighting: z.string().min(1),
	power: z.string().min(1),
	dimensions: z.string().min(1),
	warranty: z.string().min(1)
})

// Schema for FreezersChestAndUpright
const freezersChestAndUprightSchema = baseProductSchema.extend({
	freezerType: z.string().min(1),
	capacity: z.string().min(1),
	temperatureControl: z.string().min(1),
	numberOfCompartments: z.string().min(1),
	power: z.string().min(1),
	dimensions: z.string().min(1),
	warranty: z.string().min(1)
})

// Schema for RangeCookersInductionCookersHobs
const rangeCookersInductionCookersHobsSchema = baseProductSchema.extend({
	burnerCount: z.string().min(1),
	powerOutput: z.string().min(1),
	fuelType: z.string().min(1),
	controlType: z.string().min(1),
	safetyFeatures: z.string().min(1),
	dimensions: z.string().min(1),
	warranty: z.string().min(1)
})

// Schema for Ovens
const ovensSchema = baseProductSchema.extend({
	capacity: z.string().min(1),
	ovenType: z.string().min(1),
	temperatureRange: z.string().min(1),
	cookingModes: z.string().min(1),
	power: z.string().min(1),
	dimensions: z.string().min(1),
	warranty: z.string().min(1)
})

// Schema for GnPansAccessories
const gnPansAccessoriesSchema = baseProductSchema.extend({
	panSize: z.string().min(1),
	material: z.string().min(1),
	depth: z.string().min(1),
	handles: z.string().min(1),
	lids: z.string().min(1),
	capacity: z.string().min(1),
	warranty: z.string().min(1)
})

// Schema for Cookware
const cookwareSchema = baseProductSchema.extend({
	material: z.string().min(1),
	size: z.string().min(1),
	type: z.string().min(1),
	handles: z.string().min(1),
	lids: z.string().min(1),
	inductionCompatible: z.string().min(1),
	warranty: z.string().min(1)
})

// Schema for BeverageMachines
const beverageMachinesSchema = baseProductSchema.extend({
	machineType: z.string().min(1),
	capacity: z.string().min(1),
	power: z.string().min(1),
	temperatureControl: z.string().min(1),
	features: z.string().min(1),
	dimensions: z.string().min(1),
	warranty: z.string().min(1)
})

// Schema for BlendersMixers
const blendersMixersSchema = baseProductSchema.extend({
	power: z.string().min(1),
	capacity: z.string().min(1),
	speedSettings: z.string().min(1),
	attachments: z.string().min(1),
	material: z.string().min(1),
	dimensions: z.string().min(1),
	warranty: z.string().min(1)
})

// Schema for SlushMachines
const slushMachinesSchema = baseProductSchema.extend({
	capacity: z.string().min(1),
	temperatureRange: z.string().min(1),
	tankCount: z.string().min(1),
	power: z.string().min(1),
	dimensions: z.string().min(1),
	warranty: z.string().min(1)
})

// Schema for AllAppliances
const allAppliancesSchema = baseProductSchema.extend({
	applianceType: z.string().min(1),
	power: z.string().min(1),
	capacity: z.string().min(1),
	features: z.string().min(1),
	dimensions: z.string().min(1),
	warranty: z.string().min(1)
})

// Schema for GeneralEquipment
const generalEquipmentSchema = baseProductSchema.extend({
	equipmentType: z.string().min(1),
	material: z.string().min(1),
	size: z.string().min(1),
	power: z.string().min(1),
	features: z.string().min(1),
	dimensions: z.string().min(1),
	warranty: z.string().min(1)
})

// Schema for GeneralConsumables
const generalConsumablesSchema = baseProductSchema.extend({
	consumableType: z.string().min(1),
	quantity: z.string().min(1),
	unit: z.string().min(1),
	expiryDate: z.string().min(1),
	storage: z.string().min(1),
	usage: z.string().min(1),
	warranty: z.string().min(1)
})

// Schema for AllFurniture
const allFurnitureSchema = baseProductSchema.extend({
	furnitureType: z.string().min(1),
	material: z.string().min(1),
	dimensions: z.string().min(1),
	weight: z.string().min(1),
	assembly: z.string().min(1),
	finish: z.string().min(1),
	warranty: z.string().min(1)
})

// Schema for DishwashersGlasswashers
const dishwashersGlasswashersSchema = baseProductSchema.extend({
	capacity: z.string().min(1),
	cycleTime: z.string().min(1),
	power: z.string().min(1),
	waterConsumption: z.string().min(1),
	features: z.string().min(1),
	dimensions: z.string().min(1),
	warranty: z.string().min(1)
})

// Schema for HygieneAccessories
const hygieneAccessoriesSchema = baseProductSchema.extend({
	accessoryType: z.string().min(1),
	material: z.string().min(1),
	size: z.string().min(1),
	features: z.string().min(1),
	installation: z.string().min(1),
	warranty: z.string().min(1)
})

// Schema for LaundryMachines
const laundryMachinesSchema = baseProductSchema.extend({
	capacity: z.string().min(1),
	machineType: z.string().min(1),
	power: z.string().min(1),
	waterConsumption: z.string().min(1),
	features: z.string().min(1),
	dimensions: z.string().min(1),
	warranty: z.string().min(1)
})

// Schema for AllGradedProducts
const allGradedProductsSchema = baseProductSchema.extend({
	grade: z.string().min(1),
	condition: z.string().min(1),
	age: z.string().min(1),
	originalPrice: z.string().min(1),
	features: z.string().min(1),
	dimensions: z.string().min(1),
	warranty: z.string().min(1)
})

export async function POST(request: NextRequest) {
	try {
		// Authenticate user
		const session = await auth()
		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Check if user is a supplier
		if (session.user.role !== 'SUPPLIER') {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

		const body = await request.json()
		
		// Validate data based on subcategory
		let validatedData: any
		
		switch (body.subcategory) {
			case 'GlassDoorRefrigeration':
				validatedData = glassDoorRefrigerationSchema.parse(body)
				break
			case 'IceCreamFreezers':
				validatedData = iceCreamFreezersSchema.parse(body)
				break
			case 'DrinksFridgesBottleCoolers':
				validatedData = drinksFridgesBottleCoolersSchema.parse(body)
				break
			case 'ServeOverCounters':
				validatedData = serveOverCountersSchema.parse(body)
				break
			case 'MultideckDisplays':
				validatedData = multideckDisplaysSchema.parse(body)
				break
			case 'UprightUndercounterFridges':
				validatedData = uprightUndercounterFridgesSchema.parse(body)
				break
			case 'FreezersChestAndUpright':
				validatedData = freezersChestAndUprightSchema.parse(body)
				break
			case 'RangeCookersInductionCookersHobs':
				validatedData = rangeCookersInductionCookersHobsSchema.parse(body)
				break
			case 'Ovens':
				validatedData = ovensSchema.parse(body)
				break
			case 'GnPansAccessories':
				validatedData = gnPansAccessoriesSchema.parse(body)
				break
			case 'Cookware':
				validatedData = cookwareSchema.parse(body)
				break
			case 'BeverageMachines':
				validatedData = beverageMachinesSchema.parse(body)
				break
			case 'BlendersMixers':
				validatedData = blendersMixersSchema.parse(body)
				break
			case 'SlushMachines':
				validatedData = slushMachinesSchema.parse(body)
				break
			case 'AllAppliances':
				validatedData = allAppliancesSchema.parse(body)
				break
			case 'GeneralEquipment':
				validatedData = generalEquipmentSchema.parse(body)
				break
			case 'GeneralConsumables':
				validatedData = generalConsumablesSchema.parse(body)
				break
			case 'AllFurniture':
				validatedData = allFurnitureSchema.parse(body)
				break
			case 'DishwashersGlasswashers':
				validatedData = dishwashersGlasswashersSchema.parse(body)
				break
			case 'HygieneAccessories':
				validatedData = hygieneAccessoriesSchema.parse(body)
				break
			case 'LaundryMachines':
				validatedData = laundryMachinesSchema.parse(body)
				break
			case 'AllGradedProducts':
				validatedData = allGradedProductsSchema.parse(body)
				break
			default:
				return NextResponse.json({ error: 'Invalid subcategory' }, { status: 400 })
		}

		// Create product in the appropriate table
		let product: any
		
		switch (validatedData.subcategory) {
			case 'GlassDoorRefrigeration':
				product = await prisma.glassDoorRefrigeration.create({
					data: {
						productName: validatedData.productName,
						brand: validatedData.brand,
						model: validatedData.model,
						temperatureRange: validatedData.temperatureRange,
						capacityLitres: validatedData.capacityLitres,
						glassType: validatedData.glassType,
						lighting: validatedData.lighting,
						shelves: validatedData.shelves,
						dimensions: validatedData.dimensions,
						powerSupply: validatedData.powerSupply,
						warranty: validatedData.warranty,
						price: validatedData.price,
						productImage: validatedData.productImage,
						description: validatedData.description,
						ownerId: session.user.id,
						isApproved: false
					}
				})
				break
			case 'IceCreamFreezers':
				product = await prisma.iceCreamFreezers.create({
					data: {
						productName: validatedData.productName,
						brand: validatedData.brand,
						capacity: validatedData.capacity,
						temperatureRange: validatedData.temperatureRange,
						lidType: validatedData.lidType,
						defrostType: validatedData.defrostType,
						interiorLighting: validatedData.interiorLighting,
						power: validatedData.power,
						dimensions: validatedData.dimensions,
						warranty: validatedData.warranty,
						price: validatedData.price,
						productImage: validatedData.productImage,
						description: validatedData.description,
						ownerId: session.user.id,
						isApproved: false
					}
				})
				break
			case 'DrinksFridgesBottleCoolers':
				product = await prisma.drinksFridgesBottleCoolers.create({
					data: {
						productName: validatedData.productName,
						brand: validatedData.brand,
						capacity: validatedData.capacity,
						temperatureRange: validatedData.temperatureRange,
						doorType: validatedData.doorType,
						shelving: validatedData.shelving,
						lighting: validatedData.lighting,
						power: validatedData.power,
						dimensions: validatedData.dimensions,
						warranty: validatedData.warranty,
						price: validatedData.price,
						productImage: validatedData.productImage,
						description: validatedData.description,
						ownerId: session.user.id,
						isApproved: false
					}
				})
				break
			case 'ServeOverCounters':
				product = await prisma.serveOverCounters.create({
					data: {
						productName: validatedData.productName,
						brand: validatedData.brand,
						capacity: validatedData.capacity,
						temperatureRange: validatedData.temperatureRange,
						counterType: validatedData.counterType,
						displayArea: validatedData.displayArea,
						lighting: validatedData.lighting,
						power: validatedData.power,
						dimensions: validatedData.dimensions,
						warranty: validatedData.warranty,
						price: validatedData.price,
						productImage: validatedData.productImage,
						description: validatedData.description,
						ownerId: session.user.id,
						isApproved: false
					}
				})
				break
			case 'MultideckDisplays':
				product = await prisma.multideckDisplays.create({
					data: {
						productName: validatedData.productName,
						brand: validatedData.brand,
						capacity: validatedData.capacity,
						temperatureRange: validatedData.temperatureRange,
						deckCount: validatedData.deckCount,
						displayType: validatedData.displayType,
						lighting: validatedData.lighting,
						power: validatedData.power,
						dimensions: validatedData.dimensions,
						warranty: validatedData.warranty,
						price: validatedData.price,
						productImage: validatedData.productImage,
						description: validatedData.description,
						ownerId: session.user.id
					}
				})
				break
			case 'UprightUndercounterFridges':
				product = await prisma.uprightUndercounterFridges.create({
					data: {
						productName: validatedData.productName,
						brand: validatedData.brand,
						capacity: validatedData.capacity,
						temperatureRange: validatedData.temperatureRange,
						fridgeType: validatedData.fridgeType,
						shelving: validatedData.shelving,
						lighting: validatedData.lighting,
						power: validatedData.power,
						dimensions: validatedData.dimensions,
						warranty: validatedData.warranty,
						price: validatedData.price,
						productImage: validatedData.productImage,
						description: validatedData.description,
						ownerId: session.user.id
					}
				})
				break
			case 'FreezersChestAndUpright':
				product = await prisma.freezersChestAndUpright.create({
					data: {
						productName: validatedData.productName,
						brand: validatedData.brand,
						freezerType: validatedData.freezerType,
						capacity: validatedData.capacity,
						temperatureControl: validatedData.temperatureControl,
						numberOfCompartments: validatedData.numberOfCompartments,
						power: validatedData.power,
						dimensions: validatedData.dimensions,
						warranty: validatedData.warranty,
						price: validatedData.price,
						productImage: validatedData.productImage,
						description: validatedData.description,
						ownerId: session.user.id
					}
				})
				break
			case 'RangeCookersInductionCookersHobs':
				product = await prisma.rangeCookersInductionCookersHobs.create({
					data: {
						productName: validatedData.productName,
						brand: validatedData.brand,
						burnerCount: validatedData.burnerCount,
						powerOutput: validatedData.powerOutput,
						fuelType: validatedData.fuelType,
						controlType: validatedData.controlType,
						safetyFeatures: validatedData.safetyFeatures,
						dimensions: validatedData.dimensions,
						warranty: validatedData.warranty,
						price: validatedData.price,
						productImage: validatedData.productImage,
						description: validatedData.description,
						ownerId: session.user.id
					}
				})
				break
			case 'Ovens':
				product = await prisma.ovens.create({
					data: {
						productName: validatedData.productName,
						brand: validatedData.brand,
						capacity: validatedData.capacity,
						ovenType: validatedData.ovenType,
						temperatureRange: validatedData.temperatureRange,
						cookingModes: validatedData.cookingModes,
						power: validatedData.power,
						dimensions: validatedData.dimensions,
						warranty: validatedData.warranty,
						price: validatedData.price,
						productImage: validatedData.productImage,
						description: validatedData.description,
						ownerId: session.user.id
					}
				})
				break
			case 'GnPansAccessories':
				product = await prisma.gnPansAccessories.create({
					data: {
						productName: validatedData.productName,
						brand: validatedData.brand,
						panSize: validatedData.panSize,
						material: validatedData.material,
						depth: validatedData.depth,
						handles: validatedData.handles,
						lids: validatedData.lids,
						capacity: validatedData.capacity,
						warranty: validatedData.warranty,
						price: validatedData.price,
						productImage: validatedData.productImage,
						description: validatedData.description,
						ownerId: session.user.id
					}
				})
				break
			case 'Cookware':
				product = await prisma.cookware.create({
					data: {
						productName: validatedData.productName,
						brand: validatedData.brand,
						material: validatedData.material,
						size: validatedData.size,
						type: validatedData.type,
						handles: validatedData.handles,
						lids: validatedData.lids,
						inductionCompatible: validatedData.inductionCompatible,
						warranty: validatedData.warranty,
						price: validatedData.price,
						productImage: validatedData.productImage,
						description: validatedData.description,
						ownerId: session.user.id
					}
				})
				break
			case 'BeverageMachines':
				product = await prisma.beverageMachines.create({
					data: {
						productName: validatedData.productName,
						brand: validatedData.brand,
						machineType: validatedData.machineType,
						capacity: validatedData.capacity,
						power: validatedData.power,
						temperatureControl: validatedData.temperatureControl,
						features: validatedData.features,
						dimensions: validatedData.dimensions,
						warranty: validatedData.warranty,
						price: validatedData.price,
						productImage: validatedData.productImage,
						description: validatedData.description,
						ownerId: session.user.id
					}
				})
				break
			case 'BlendersMixers':
				product = await prisma.blendersMixers.create({
					data: {
						productName: validatedData.productName,
						brand: validatedData.brand,
						power: validatedData.power,
						capacity: validatedData.capacity,
						speedSettings: validatedData.speedSettings,
						attachments: validatedData.attachments,
						material: validatedData.material,
						dimensions: validatedData.dimensions,
						warranty: validatedData.warranty,
						price: validatedData.price,
						productImage: validatedData.productImage,
						description: validatedData.description,
						ownerId: session.user.id
					}
				})
				break
			case 'SlushMachines':
				product = await prisma.slushMachines.create({
					data: {
						productName: validatedData.productName,
						brand: validatedData.brand,
						capacity: validatedData.capacity,
						temperatureRange: validatedData.temperatureRange,
						tankCount: validatedData.tankCount,
						power: validatedData.power,
						dimensions: validatedData.dimensions,
						warranty: validatedData.warranty,
						price: validatedData.price,
						productImage: validatedData.productImage,
						description: validatedData.description,
						ownerId: session.user.id
					}
				})
				break
			case 'AllAppliances':
				product = await prisma.allAppliances.create({
					data: {
						productName: validatedData.productName,
						brand: validatedData.brand,
						applianceType: validatedData.applianceType,
						power: validatedData.power,
						capacity: validatedData.capacity,
						features: validatedData.features,
						dimensions: validatedData.dimensions,
						warranty: validatedData.warranty,
						price: validatedData.price,
						productImage: validatedData.productImage,
						description: validatedData.description,
						ownerId: session.user.id
					}
				})
				break
			case 'GeneralEquipment':
				product = await prisma.generalEquipment.create({
					data: {
						productName: validatedData.productName,
						brand: validatedData.brand,
						equipmentType: validatedData.equipmentType,
						material: validatedData.material,
						size: validatedData.size,
						power: validatedData.power,
						features: validatedData.features,
						dimensions: validatedData.dimensions,
						warranty: validatedData.warranty,
						price: validatedData.price,
						productImage: validatedData.productImage,
						description: validatedData.description,
						ownerId: session.user.id
					}
				})
				break
			case 'GeneralConsumables':
				product = await prisma.generalConsumables.create({
					data: {
						productName: validatedData.productName,
						brand: validatedData.brand,
						consumableType: validatedData.consumableType,
						quantity: validatedData.quantity,
						unit: validatedData.unit,
						expiryDate: validatedData.expiryDate,
						storage: validatedData.storage,
						usage: validatedData.usage,
						warranty: validatedData.warranty,
						price: validatedData.price,
						productImage: validatedData.productImage,
						description: validatedData.description,
						ownerId: session.user.id
					}
				})
				break
			case 'AllFurniture':
				product = await prisma.allFurniture.create({
					data: {
						productName: validatedData.productName,
						brand: validatedData.brand,
						furnitureType: validatedData.furnitureType,
						material: validatedData.material,
						dimensions: validatedData.dimensions,
						weight: validatedData.weight,
						assembly: validatedData.assembly,
						finish: validatedData.finish,
						warranty: validatedData.warranty,
						price: validatedData.price,
						productImage: validatedData.productImage,
						description: validatedData.description,
						ownerId: session.user.id
					}
				})
				break
			case 'DishwashersGlasswashers':
				product = await prisma.dishwashersGlasswashers.create({
					data: {
						productName: validatedData.productName,
						brand: validatedData.brand,
						capacity: validatedData.capacity,
						cycleTime: validatedData.cycleTime,
						power: validatedData.power,
						waterConsumption: validatedData.waterConsumption,
						features: validatedData.features,
						dimensions: validatedData.dimensions,
						warranty: validatedData.warranty,
						price: validatedData.price,
						productImage: validatedData.productImage,
						description: validatedData.description,
						ownerId: session.user.id
					}
				})
				break
			case 'HygieneAccessories':
				product = await prisma.hygieneAccessories.create({
					data: {
						productName: validatedData.productName,
						brand: validatedData.brand,
						accessoryType: validatedData.accessoryType,
						material: validatedData.material,
						size: validatedData.size,
						features: validatedData.features,
						installation: validatedData.installation,
						warranty: validatedData.warranty,
						price: validatedData.price,
						productImage: validatedData.productImage,
						description: validatedData.description,
						ownerId: session.user.id
					}
				})
				break
			case 'LaundryMachines':
				product = await prisma.laundryMachines.create({
					data: {
						productName: validatedData.productName,
						brand: validatedData.brand,
						capacity: validatedData.capacity,
						machineType: validatedData.machineType,
						power: validatedData.power,
						waterConsumption: validatedData.waterConsumption,
						features: validatedData.features,
						dimensions: validatedData.dimensions,
						warranty: validatedData.warranty,
						price: validatedData.price,
						productImage: validatedData.productImage,
						description: validatedData.description,
						ownerId: session.user.id
					}
				})
				break
			case 'AllGradedProducts':
				product = await prisma.allGradedProducts.create({
					data: {
						productName: validatedData.productName,
						brand: validatedData.brand,
						grade: validatedData.grade,
						condition: validatedData.condition,
						age: validatedData.age,
						originalPrice: validatedData.originalPrice,
						features: validatedData.features,
						dimensions: validatedData.dimensions,
						warranty: validatedData.warranty,
						price: validatedData.price,
						productImage: validatedData.productImage,
						description: validatedData.description,
						ownerId: session.user.id
					}
				})
				break
			default:
				return NextResponse.json({ error: 'Invalid subcategory' }, { status: 400 })
		}

		return NextResponse.json({
			message: 'Product created successfully',
			product
		})

	} catch (error) {
		console.error('Error creating product:', error)
		
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
		}
		
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
} 