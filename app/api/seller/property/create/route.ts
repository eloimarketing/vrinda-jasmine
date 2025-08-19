import { auth } from '@/auth'
import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'
import {
	commonInfoSchema,
	apartmentFlatSchema,
	independentHouseVillaSchema,
	plotLandSchema,
	officeSpaceSchema,
	shopShowroomSchema,
	wareHouseGodownSchema,
	farmhouseAgriculturalLandSchema,
	payingGuestHostelSchema,
	coWorkingSpaceSchema,
	independentCommercialSchema,
} from '@/lib/schema/backend/property'
import prisma from '@/lib/prisma/prisma'

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
	const session = await auth()
	const user = session?.user

	try {
		const formData = await request.formData()
		const propertyType = formData.get('propertyType') as string

		const commonInfo = {
			title: formData.get('title'),
			description: formData.get('description'),
			price: Number(formData.get('price')),
			images: formData.getAll('images') as File[],
			videos: formData.getAll('videos') as File[],
			// location
			address: formData.get('address') as string,
			city: formData.get('city') as string,
			state: formData.get('state') as string,
			pincode: formData.get('pincode') as string,
			googleMapLat: Number(formData.get('googleMapLat')),
			googleMapLng: Number(formData.get('googleMapLng')),
			listingType: (formData.get('listingType') as string) || 'FOR_SALE',
			vendorContactNumber: formData.get('vendorContactNumber') as string,
			propertyRent: Number(formData.get('propertyRent')),
			securityDeposit: Number(formData.get('securityDeposit')),
			advanceBookingAmount: Number(formData.get('advanceBookingAmount')),
		}

		let validatedPropertyInfo

		// For creating Apartment_Flat
		if (propertyType === 'Apartment_Flat') {
			const apartmentFlatRawData = {
				bhk: parseInt((formData.get('bhk') as string) || '0'), // Ensure bhk is a number
				carpetArea: parseInt((formData.get('carpetArea') as string) || '0'),
				builtUpArea: parseInt((formData.get('builtUpArea') as string) || '0'),
				floorNumber: parseInt((formData.get('floorNumber') as string) || '0'),
				totalFloors: parseInt((formData.get('totalFloors') as string) || '0'),
				bathrooms: parseInt((formData.get('bathrooms') as string) || '0'),
				furnishingStatus: formData.get('furnishingStatus') as 'UNFURNISHED' | 'SEMI_FURNISHED' | 'FULLY_FURNISHED',
				balcony: formData.get('balcony') === 'true',
				parking: formData.get('parking') === 'true',
				ageOfProperty: parseInt((formData.get('ageOfProperty') as string) || '0'),
				facingDirection: formData.get('facingDirection') as string,
				hasLift: formData.get('hasLift') === 'true',
				hasSecurity: formData.get('hasSecurity') === 'true',
				hasGym: formData.get('hasGym') === 'true',
				hasSwimmingPool: formData.get('hasSwimmingPool') === 'true',
				hasPowerBackup: formData.get('hasPowerBackup') === 'true',
				hasGarden: formData.get('hasGarden') === 'true',
				reraNumber: formData.get('reraNumber') as string,
			}
			const validatingSchema = apartmentFlatSchema.merge(commonInfoSchema)
			validatedPropertyInfo = validatingSchema.parse({ ...apartmentFlatRawData, ...commonInfo })

			// For creating Independent_House_Villa
		} else if (propertyType === 'Independent_Commercial_Property') {
			const independentCommercialProperty = {
				tenureAge: Number(formData.get('tenureAge')),
				shopFrontageWidth: Number(formData.get('shopFrontageWidth')),
				flatArea: Number(formData.get('flatArea')),
				noOfBedrooms: Number(formData.get('noOfBedrooms')),
				titleNumber: Number(formData.get('titleNumber')),
				classUse: formData.get('classUse'),

				EPCRating: formData.get('EPCRating'),
				councilTaxBand: formData.get('councilTaxBand'),

				furnishingStatus: formData.get('furnishingStatus') as 'UNFURNISHED' | 'SEMI_FURNISHED' | 'FULLY_FURNISHED',
				previousUse: formData.get('previousUse') as 'Retail' | 'Office' | 'Salon' | 'Etc',
				kitchenStyle: formData.get('kitchenStyle') as 'Fitted' | 'Modern' | 'Open_Plan',
				gardenYardAccess: formData.get('gardenYardAccess') as 'Private' | 'Shared' | 'None',
				ResidenceParkingType: formData.get('ResidenceParkingType') as 'Off_Street' | 'On_Street' | 'Permit',
				heatingType: formData.get('heatingType') as 'Gas_Central' | 'Electric' | 'Other',
				storageSpace: formData.get('storageSpace') as 'Shed' | 'Basement' | 'Attic',
				accessibility: formData.get('accessibility') as 'Step_Free' | 'Disabled_Access',
				bathrooms: formData.get('bathrooms') as 'EN_SUITE' | 'SHARED',

				hasNearbyStation: formData.get('hasNearbyStation') === 'true',
				hasNearbyRoad: formData.get('hasNearbyRoad') === 'true',
				hasNearbyBusStands: formData.get('hasNearbyBusStands') === 'true',
				hasCustomerParking: formData.get('hasCustomerParking') === 'true',
				hasSeparateBusinessAccess: formData.get('hasSeparateBusinessAccess') === 'true',
				hasSeparateEntrance: formData.get('hasSeparateEntrance') === 'true',
				hasGas: formData.get('hasGas') === 'true',
				hasWater: formData.get('hasWater') === 'true',
				hasElectricity: formData.get('hasElectricity') === 'true',
				hasBuildingInsurance: formData.get('hasBuildingInsurance') === 'true',
				hasPlanningPermission: formData.get('hasPlanningPermission') === 'true',
				hasCCTV: formData.get('hasCCTV') === 'true',
				hasSecurityAlarmSystem: formData.get('hasSecurityAlarmSystem') === 'true',
				hasInternetConnection: formData.get('hasInternetConnection') === 'true',
			}

			const validatingSchema = independentCommercialSchema.merge(commonInfoSchema)
			validatedPropertyInfo = validatingSchema.parse({ ...independentCommercialProperty, ...commonInfo })
		} else if (propertyType === 'Independent_House_Villa') {
			const independentHouseVillaRawData = {
				bedrooms: parseInt((formData.get('bedrooms') as string) || '0'),
				plotArea: parseInt((formData.get('plotArea') as string) || '0'),
				builtUpArea: parseInt((formData.get('builtUpArea') as string) || '0'),
				floors: Number(formData.get('floors')),
				parking: formData.get('parking') === 'true',
				ageOfConstruction: Number(formData.get('ageOfConstruction')),
				furnishingStatus: formData.get('furnishingStatus') as 'UNFURNISHED' | 'SEMI_FURNISHED' | 'FULLY_FURNISHED',
				facingDirection: formData.get('facingDirection') as
					| 'NORTH'
					| 'SOUTH'
					| 'EAST'
					| 'WEST'
					| 'NORTH_EAST'
					| 'NORTH_WEST'
					| 'SOUTH_EAST'
					| 'SOUTH_WEST',
				hasGardenLawn: formData.get('hasGardenLawn') === 'true',
				hasWaterSource: formData.get('hasWaterSource') === 'true',
				hasPowerBackup: formData.get('hasPowerBackup') === 'true',
				hasSwimmingPool: formData.get('hasSwimmingPool') === 'true',
				hasSecurity: formData.get('hasSecurity') === 'true',
			}
			const validatingSchema = independentHouseVillaSchema.merge(commonInfoSchema)
			validatedPropertyInfo = validatingSchema.parse({ ...independentHouseVillaRawData, ...commonInfo })
		} else if (propertyType === 'Plot_Land') {
			const plotLandRawData = {
				plotArea: formData.get('plotArea'),
				plotAreaUnit: formData.get('plotAreaUnit') as string,
				boundaryWall: formData.get('boundaryWall') === 'true',
				roadWidth: formData.get('roadWidth'),
				plotFacing: formData.get('plotFacing') as string,
				landUseType: formData.get('landUseType') as string,
				gatedSociety: formData.get('gatedSociety') === 'true',
				ownershipType: formData.get('ownershipType') as string,
				nearbyLandmarks: formData.get('nearbyLandmarks'),
			}
			const validatingSchema = plotLandSchema.merge(commonInfoSchema)
			validatedPropertyInfo = validatingSchema.parse({ ...plotLandRawData, ...commonInfo })
		} else if (propertyType === 'Office_Space') {
			const officeSpaceRawData = {
				carpetArea: formData.get('carpetArea'),
				builtUpArea: formData.get('builtUpArea'),
				furnishingType: formData.get('furnishingType') as string,
				workstations: formData.get('workstations'),
				cabins: formData.get('cabins'),
				conferenceRoom: formData.get('conferenceRoom'),
				pantry: formData.get('pantry') === 'true',
				washrooms: formData.get('washrooms'),
				floorNumber: formData.get('floorNumber'),
				hasLift: formData.get('hasLift') === 'true',
				hasPowerBackup: formData.get('hasPowerBackup') === 'true',
				hasAirConditioning: formData.get('hasAirConditioning') === 'true',
				parking: formData.get('parking') === 'true',
				occupancyStatus: formData.get('occupancyStatus'),
			}
			const validatingSchema = officeSpaceSchema.merge(commonInfoSchema)
			validatedPropertyInfo = validatingSchema.parse({ ...officeSpaceRawData, ...commonInfo })
		} else if (propertyType === 'Shop_Showroom') {
			const shopShowroomRawData = {
				carpetArea: formData.get('carpetArea'),
				frontageWidth: formData.get('frontageWidth'),
				floorNumber: formData.get('floorNumber'),
				hasWashroom: formData.get('hasWashroom') === 'true',
				powerLoad: formData.get('powerLoad'),
				parking: formData.get('parking') === 'true',
				suitableFor: formData.get('suitableFor'),
			}
			const validatingSchema = shopShowroomSchema.merge(commonInfoSchema)
			validatedPropertyInfo = validatingSchema.parse({ ...shopShowroomRawData, ...commonInfo })
		} else if (propertyType === 'Warehouse_Godown') {
			const warehouseGodownRawData = {
				builtUpArea: formData.get('builtUpArea'),
				floorHeight: formData.get('floorHeight'),
				entryRoadWidth: formData.get('entryRoadWidth'),
				hasPowerSupply: formData.get('hasPowerSupply') === 'true',
				hasWaterAvailability: formData.get('hasWaterAvailability') === 'true',
				shutterHeight: formData.get('shutterHeight'),
				hasLoadingUnloadingDock: formData.get('hasLoadingUnloadingDock') === 'true',
				hasSecurity: formData.get('hasSecurity') === 'true',
			}
			const validatingSchema = wareHouseGodownSchema.merge(commonInfoSchema)
			validatedPropertyInfo = validatingSchema.parse({ ...warehouseGodownRawData, ...commonInfo })
		} else if (propertyType === 'Farmhouse_Agricultural_Land') {
			const farmhouseAgriculturalLandRawData = {
				landArea: formData.get('landArea'),
				hasWaterSource: formData.get('hasWaterSource') === 'true',
				hasElectricityConnection: formData.get('hasElectricityConnection') === 'true',
				hasFencing: formData.get('hasFencing') === 'true',
				hasRoadAccess: formData.get('hasRoadAccess') === 'true',
				soilType: formData.get('soilType'),
				cropType: formData.get('cropType'),
				hasFarmhouse: formData.get('hasFarmhouse') === 'true',
				distanceToMainRoad: formData.get('distanceToMainRoad'),
			}
			const validatingSchema = farmhouseAgriculturalLandSchema.merge(commonInfoSchema)
			validatedPropertyInfo = validatingSchema.parse({ ...farmhouseAgriculturalLandRawData, ...commonInfo })
		} else if (propertyType === 'CoWorking_Space') {
			const coWorkingSpaceRawData = {
				deskTypes: formData.getAll('deskTypes'),
				numberOfSeats: formData.get('numberOfSeats'),
				hasInternetAvailability: formData.get('hasInternetAvailability') === 'true',
				hasMeetingRoom: formData.get('hasMeetingRoom') === 'true',
				hasPantry: formData.get('hasPantry') === 'true',
				hasReception: formData.get('hasReception') === 'true',
				hasCommonAreas: formData.get('hasCommonAreas') === 'true',
				hasAirConditioning: formData.get('hasAirConditioning') === 'true',
				hasPowerBackup: formData.get('hasPowerBackup') === 'true',
				hasParking: formData.get('hasParking') === 'true',
			}
			const validatingSchema = coWorkingSpaceSchema.merge(commonInfoSchema)
			validatedPropertyInfo = validatingSchema.parse({ ...coWorkingSpaceRawData, ...commonInfo })
		} else if (propertyType === 'Paying_Guest_Hostel') {
			const payingGuestHostelRawData = {
				roomType: formData.get('roomType') as 'PRIVATE' | 'SHARED' | 'DORMITORY',
				furnished: formData.get('furnished') === 'true',
				numberOfBeds: formData.get('numberOfBeds'),
				hasAttachedWashroom: formData.get('hasAttachedWashroom') === 'true',
				foodIncluded: formData.get('foodIncluded') === 'true',
				hasAC: formData.get('hasAC') === 'true',
				hasWifi: formData.get('hasWifi') === 'true',
				hasHousekeeping: formData.get('hasHousekeeping') === 'true',
				hasLaundry: formData.get('hasLaundry') === 'true',
				guestRules: formData.getAll('guestRules'),
			}
			const validatingSchema = payingGuestHostelSchema.merge(commonInfoSchema)
			validatedPropertyInfo = validatingSchema.parse({ ...payingGuestHostelRawData, ...commonInfo })
		} else {
			return NextResponse.json({ message: 'Please provide a valid property type' }, { status: 400 })
		}

		// Upload Images
		const imgUrls = await Promise.all(
			validatedPropertyInfo.images.map(async img => {
				const arrayBuffer = await img.arrayBuffer()
				const buffer = Buffer.from(arrayBuffer)

				return new Promise((resolve, reject) => {
					cloudinary.uploader
						.upload_stream({ resource_type: 'image' }, (error, result) => {
							if (error) reject(error)
							else resolve(result)
						})
						.end(buffer)
				})
			})
		)

		// Upload Videos
		const videoUrls = await Promise.all(
			validatedPropertyInfo.videos.map(async video => {
				const arrayBuffer = await video.arrayBuffer()
				const buffer = Buffer.from(arrayBuffer)

				return new Promise((resolve, reject) => {
					cloudinary.uploader
						.upload_stream({ resource_type: 'video' }, (error, result) => {
							if (error) reject(error)
							else resolve(result)
						})
						.end(buffer)
				})
			})
		)

		const imagesUrls = imgUrls.map(url => url.secure_url)

		const videosUrls = videoUrls.map(url => url.secure_url)

		const createdData = await prisma.property.create({
			data: {
				title: validatedPropertyInfo.title,
				description: validatedPropertyInfo.description,
				price: validatedPropertyInfo.price,
				images: imagesUrls,
				videos: videosUrls,
				propertyType: propertyType,
				listingType: validatedPropertyInfo.listingType || 'FOR_RENT',
				status: 'ACTIVE',
				googleMapLat: validatedPropertyInfo.googleMapLat,
				googleMapLng: validatedPropertyInfo.googleMapLng,
				propertyRent: validatedPropertyInfo.propertyRent,
				securityDeposit: validatedPropertyInfo.securityDeposit,
				advanceBookingAmount: validatedPropertyInfo.advanceBookingAmount,
				isVerified: false,

				location: {
					create: {
						address: validatedPropertyInfo.address,
						city: validatedPropertyInfo.city,
						state: validatedPropertyInfo.state,
						pincode: validatedPropertyInfo.pincode,
					},
				},

				owner: { connect: { id: user?.id } },

				...(propertyType === 'Apartment_Flat' && {
					apartmentFlat: {
						create: {
							bhk: validatedPropertyInfo.bhk,
							carpetArea: validatedPropertyInfo.carpetArea,
							builtUpArea: validatedPropertyInfo.builtUpArea,
							floorNumber: validatedPropertyInfo.floorNumber,
							totalFloors: validatedPropertyInfo.totalFloors,
							bathrooms: validatedPropertyInfo.bathrooms,
							furnishingStatus: validatedPropertyInfo.furnishingStatus,
							balcony: validatedPropertyInfo.balcony,
							parking: validatedPropertyInfo.parking,
							ageOfProperty: validatedPropertyInfo.ageOfProperty,
							facingDirection: validatedPropertyInfo.facingDirection,
							hasLift: validatedPropertyInfo.hasLift,
							hasSecurity: validatedPropertyInfo.hasSecurity,
							hasGym: validatedPropertyInfo.hasGym,
							hasSwimmingPool: validatedPropertyInfo.hasSwimmingPool,
							hasPowerBackup: validatedPropertyInfo.hasPowerBackup,
							hasGarden: validatedPropertyInfo.hasGarden,
							...(validatedPropertyInfo.reraNumber && { reraNumber: validatedPropertyInfo.reraNumber }),
						},
					},
				}),

				...(propertyType === 'Independent_Commercial_Property' && {
					independentCommercialProperty: {
						create: {
							tenureAge: validatedPropertyInfo.tenureAge,
							bathrooms: validatedPropertyInfo.bathrooms,
							shopFrontageWidth: validatedPropertyInfo.shopFrontageWidth,
							flatArea: validatedPropertyInfo.flatArea,
							noOfBedrooms: validatedPropertyInfo.noOfBedrooms,
							titleNumber: validatedPropertyInfo.titleNumber,
							classUse: validatedPropertyInfo.classUse,
							EPCRating: validatedPropertyInfo.EPCRating,
							councilTaxBand: validatedPropertyInfo.councilTaxBand,
							furnishing: validatedPropertyInfo.furnishingStatus,
							previousUse: validatedPropertyInfo.previousUse,
							kitchenStyle: validatedPropertyInfo.kitchenStyle,
							gardenYardAccess: validatedPropertyInfo.gardenYardAccess,
							residenceParkingType: validatedPropertyInfo.ResidenceParkingType,
							heatingType: validatedPropertyInfo.heatingType,
							storageSpace: validatedPropertyInfo.storageSpace,
							accessibility: validatedPropertyInfo.accessibility,
							hasNearbyStation: validatedPropertyInfo.hasNearbyStation,
							hasNearbyRoad: validatedPropertyInfo.hasNearbyRoad,
							hasNearbyBusStands: validatedPropertyInfo.hasNearbyBusStands,
							hasCustomerParking: validatedPropertyInfo.hasCustomerParking,
							hasSeparateBusinessAccess: validatedPropertyInfo.hasSeparateBusinessAccess,
							hasSeparateEntrance: validatedPropertyInfo.hasSeparateEntrance,
							hasGas: validatedPropertyInfo.hasGas,
							hasWater: validatedPropertyInfo.hasWater,
							hasElectricity: validatedPropertyInfo.hasElectricity,
							hasBuildingInsurance: validatedPropertyInfo.hasBuildingInsurance,
							hasPlanningPermission: validatedPropertyInfo.hasPlanningPermission,
							hasCCTV: validatedPropertyInfo.hasCCTV,
							hasSecurityAlarmSystem: validatedPropertyInfo.hasSecurityAlarmSystem,
							hasInternetConnection: validatedPropertyInfo.hasInternetConnection,
						},
					},
				}),

				...(propertyType === 'Independent_House_Villa' && {
					independentHouseVilla: {
						create: {
							bedrooms: validatedPropertyInfo.bedrooms,
							plotArea: validatedPropertyInfo.plotArea,
							builtUpArea: validatedPropertyInfo.builtUpArea,
							floors: validatedPropertyInfo.floors,
							parking: validatedPropertyInfo.parking,
							ageOfConstruction: validatedPropertyInfo.ageOfConstruction,
							furnishingStatus: validatedPropertyInfo.furnishingStatus,
							facingDirection: validatedPropertyInfo.facingDirection,
							hasGardenLawn: validatedPropertyInfo.hasGardenLawn,
							hasWaterSource: validatedPropertyInfo.hasWaterSource,
							hasPowerBackup: validatedPropertyInfo.hasPowerBackup,
							hasSwimmingPool: validatedPropertyInfo.hasSwimmingPool,
							hasSecurity: validatedPropertyInfo.hasSecurity,
						},
					},
				}),

				...(propertyType === 'Plot_Land' && {
					plotLand: {
						create: {
							plotArea: validatedPropertyInfo.plotArea,
							plotAreaUnit: validatedPropertyInfo.plotAreaUnit,
							boundaryWall: validatedPropertyInfo.boundaryWall,
							roadWidth: validatedPropertyInfo.roadWidth,
							plotFacing: validatedPropertyInfo.plotFacing,
							landUseType: validatedPropertyInfo.landUseType,
							gatedSociety: validatedPropertyInfo.gatedSociety,
							ownershipType: validatedPropertyInfo.ownershipType,
							nearbyLandmarks: validatedPropertyInfo.nearbyLandmarks,
						},
					},
				}),

				...(propertyType === 'Office_Space' && {
					officeSpace: {
						create: {
							carpetArea: validatedPropertyInfo.carpetArea,
							builtUpArea: validatedPropertyInfo.builtUpArea,
							furnishingType: validatedPropertyInfo.furnishingType,
							workstations: validatedPropertyInfo.workstations,
							cabins: validatedPropertyInfo.cabins,
							conferenceRoom: validatedPropertyInfo.conferenceRoom,
							pantry: validatedPropertyInfo.pantry,
							washrooms: validatedPropertyInfo.washrooms,
							floorNumber: validatedPropertyInfo.floorNumber,
							hasLift: validatedPropertyInfo.hasLift,
							hasPowerBackup: validatedPropertyInfo.hasPowerBackup,
							hasAirConditioning: validatedPropertyInfo.hasAirConditioning,
							parking: validatedPropertyInfo.parking,
							occupancyStatus: validatedPropertyInfo.occupancyStatus,
						},
					},
				}),

				...(propertyType === 'Shop_Showroom' && {
					shopShowroom: {
						create: {
							carpetArea: validatedPropertyInfo.carpetArea,
							frontageWidth: validatedPropertyInfo.frontageWidth,
							floorNumber: validatedPropertyInfo.floorNumber,
							hasWashroom: validatedPropertyInfo.hasWashroom,
							powerLoad: validatedPropertyInfo.powerLoad,
							parking: validatedPropertyInfo.parking,
							suitableFor: validatedPropertyInfo.suitableFor,
						},
					},
				}),

				...(propertyType === 'Warehouse_Godown' && {
					warehouseGodown: {
						create: {
							builtUpArea: validatedPropertyInfo.builtUpArea,
							floorHeight: validatedPropertyInfo.floorHeight,
							entryRoadWidth: validatedPropertyInfo.entryRoadWidth,
							hasPowerSupply: validatedPropertyInfo.hasPowerSupply,
							hasWaterAvailability: validatedPropertyInfo.hasWaterAvailability,
							shutterHeight: validatedPropertyInfo.shutterHeight,
							hasLoadingUnloadingDock: validatedPropertyInfo.hasLoadingUnloadingDock,
							hasSecurity: validatedPropertyInfo.hasSecurity,
						},
					},
				}),

				...(propertyType === 'Farmhouse_Agricultural_Land' && {
					farmhouseAgricultural: {
						create: {
							landArea: validatedPropertyInfo.landArea,
							hasWaterSource: validatedPropertyInfo.hasWaterSource,
							hasElectricityConnection: validatedPropertyInfo.hasElectricityConnection,
							hasFencing: validatedPropertyInfo.hasFencing,
							hasRoadAccess: validatedPropertyInfo.hasRoadAccess,
							soilType: validatedPropertyInfo.soilType,
							cropType: validatedPropertyInfo.cropType,
							hasFarmhouse: validatedPropertyInfo.hasFarmhouse,
							distanceToMainRoad: validatedPropertyInfo.distanceToMainRoad,
						},
					},
				}),

				...(propertyType === 'CoWorking_Space' && {
					coWorkingSpace: {
						create: {
							deskTypes: validatedPropertyInfo.deskTypes,
							numberOfSeats: validatedPropertyInfo.numberOfSeats,
							hasInternetAvailability: validatedPropertyInfo.hasInternetAvailability,
							hasMeetingRoom: validatedPropertyInfo.hasMeetingRoom,
							hasPantry: validatedPropertyInfo.hasPantry,
							hasReception: validatedPropertyInfo.hasReception,
							hasCommonAreas: validatedPropertyInfo.hasCommonAreas,
							hasAirConditioning: validatedPropertyInfo.hasAirConditioning,
							hasPowerBackup: validatedPropertyInfo.hasPowerBackup,
							hasParking: validatedPropertyInfo.hasParking,
						},
					},
				}),

				...(propertyType === 'Paying_Guest_Hostel' && {
					payingGuestHostel: {
						create: {
							roomType: validatedPropertyInfo.roomType,
							furnished: validatedPropertyInfo.furnished,
							numberOfBeds: validatedPropertyInfo.numberOfBeds,
							hasAttachedWashroom: validatedPropertyInfo.hasAttachedWashroom,
							foodIncluded: validatedPropertyInfo.foodIncluded,
							hasAC: validatedPropertyInfo.hasAC,
							hasWifi: validatedPropertyInfo.hasWifi,
							hasHousekeeping: validatedPropertyInfo.hasHousekeeping,
							hasLaundry: validatedPropertyInfo.hasLaundry,
							guestRules: validatedPropertyInfo.guestRules,
						},
					},
				}),
			},
		})

		return NextResponse.json({ validatedPropertyInfo, imgUrls, videoUrls, createdData })
	} catch (error) {
		console.log(error)
		return NextResponse.json({ error: 'Failed to process request', details: error }, { status: 500 })
	}
}
