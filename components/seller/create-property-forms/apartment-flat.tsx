'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { commonInfoSchema, apartmentFlatSchema } from '@/lib/schema/backend/property'
import { getCitiesByState, IndianStates, getCurrentLocation } from '@/utils/constant/data'

const FormSchema = commonInfoSchema.merge(apartmentFlatSchema)

export default function ApartmentFlatForm() {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const router = useRouter()
	const [cities, setCities] = useState<string[]>([''])

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: '',
			description: '',
			price: 0,
			address: '',
			city: '',
			state: 'Rajasthan',
			pincode: '',
			googleMapLat: 0,
			googleMapLng: 0,
			bhk: 1,
			vendorContactNumber: '',
			propertyRent: 0,
			securityDeposit: 0,
			advanceBookingAmount: 0,
			carpetArea: 0,
			builtUpArea: 0,
			floorNumber: 0,
			totalFloors: 0,
			bathrooms: 0,
			ageOfProperty: 0,
			reraNumber: '',
			balcony: false,
			parking: false,
			hasLift: false,
			hasSecurity: false,
			hasGym: false,
			hasSwimmingPool: false,
			hasPowerBackup: false,
			hasGarden: false,
			images: [],
			videos: [],
		},
	})

	const watchState = form.watch('state')

	useEffect(() => {
		if (watchState) {
			const result = getCitiesByState({ stateName: watchState })
			setCities(result || [])
			// Optional: Reset city field on state change
			form.setValue('city', '')
		}
	}, [watchState])

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		setIsSubmitting(true)
		try {
			const formData = new FormData()

			// Add property type
			formData.append('propertyType', 'Apartment_Flat')
			formData.append('status', 'ACTIVE') // Add status field as seen in backend

			// Add all form fields
			Object.entries(data).forEach(([key, value]) => {
				if (key === 'images' && Array.isArray(value)) {
					value.forEach(file => {
						formData.append('images', file)
					})
				} else if (key === 'videos' && Array.isArray(value)) {
					value.forEach(file => {
						formData.append('videos', file)
					})
				} else if (key !== 'images' && key !== 'videos') {
					formData.append(key, String(value))
				}
			})

			formData.append('propertyType', 'Apartment_Flat')

			const response = await fetch('/api/seller/property/create', {
				method: 'POST',
				body: formData,
			})

			const result = await response.json()
			if (!response.ok) {
				throw new Error(result.message || 'Failed to create property')
			}

			toast.success('Property created successfully!')

			setTimeout(() => {
				router.push(`/seller/property/${result.createdData.id}`)
			}, 1500)
			// form.reset()
		} catch (error) {
			console.error('Error creating property:', error)
			toast.error('Failed to create property. Please try again.')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					{/* Basic Information */}
					<div className="space-y-4">
						<h2 className="text-lg font-semibold">Basic Information</h2>

						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Property Title</FormLabel>
									<FormControl>
										<Input placeholder="Enter property title" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea placeholder="Enter property description" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Price</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Enter price"
											{...field}
											onChange={e => field.onChange(parseInt(e.target.value) || 0)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="listingType"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Listing Type</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select availability status" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="FOR_SALE">For Sale</SelectItem>
											<SelectItem value="FOR_RENT">For Rent</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Media Files */}
					<div className="space-y-4">
						<h2 className="text-lg font-semibold">Media</h2>

						<FormField
							control={form.control}
							name="images"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Images</FormLabel>
									<FormControl>
										<Input
											type="file"
											multiple
											accept="image/*"
											onChange={e => {
												const files = e.target.files
												if (files) {
													field.onChange(Array.from(files))
												}
											}}
										/>
									</FormControl>
									<FormDescription>Select multiple images of the property</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="videos"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Videos (Optional)</FormLabel>
									<FormControl>
										<Input
											type="file"
											multiple
											accept="video/*"
											onChange={e => {
												const files = e.target.files
												if (files) {
													field.onChange(Array.from(files))
												}
											}}
										/>
									</FormControl>
									<FormDescription>Select videos of the property</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Location Information */}
					<div className="space-y-4">
						<h2 className="text-lg font-semibold">Location</h2>

						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Address</FormLabel>
									<FormControl>
										<Textarea placeholder="Enter full address" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<FormField
								control={form.control}
								name="state"
								render={({ field }) => (
									<FormItem>
										<FormLabel>State</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl className="w-full">
												<SelectTrigger>
													<SelectValue placeholder="Enter state" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{IndianStates.map(state => (
													<SelectItem key={state.id} value={state.name}>
														{state.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="city"
								render={({ field }) => (
									<FormItem>
										<FormLabel>City</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl className="w-full">
												<SelectTrigger>
													<SelectValue placeholder="Enter city" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{cities.map((city, indx) => (
													<SelectItem key={indx} value={city}>
														{city}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="pincode"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Pincode</FormLabel>
										<FormControl>
											<Input placeholder="Enter pincode" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="googleMapLat"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Latitude</FormLabel>
										<FormControl>
											<Input placeholder="Enter latitude" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="googleMapLng"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Longitude</FormLabel>
										<FormControl>
											<Input placeholder="Enter longitude" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button
								onClick={async () => {
									try {
										const { latitude, longitude } = await getCurrentLocation()
										form.setValue('googleMapLat', parseFloat(latitude.toString()))
										form.setValue('googleMapLng', parseFloat(longitude.toString()))
									} catch (error) {
										form.setError('googleMapLat', { type: 'manual', message: 'Failed to get location' })
										form.setError('googleMapLng', { type: 'manual', message: 'Failed to get location' })
										console.log('Failed to get location:', error)
									}
								}}>
								Get Current Location
							</Button>
						</div>
					</div>

					{/* Property Details */}
					<div className="space-y-4">
						<h2 className="text-lg font-semibold">Property Details</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="bhk"
								render={({ field }) => (
									<FormItem>
										<FormLabel>BHK</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="e.g., 2, 3"
												{...field}
												onChange={e => field.onChange(parseInt(e.target.value) || 0)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="bathrooms"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Bathrooms</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Number of bathrooms"
												{...field}
												onChange={e => field.onChange(parseInt(e.target.value) || 0)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="carpetArea"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Carpet Area (sq ft)</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Carpet area"
												{...field}
												onChange={e => field.onChange(parseInt(e.target.value) || 0)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="builtUpArea"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Built-up Area (sq ft)</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Built-up area"
												{...field}
												onChange={e => field.onChange(parseInt(e.target.value) || 0)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<FormField
								control={form.control}
								name="floorNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Floor Number</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Floor number"
												{...field}
												onChange={e => field.onChange(parseInt(e.target.value) || 0)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="totalFloors"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Total Floors</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Total floors"
												{...field}
												onChange={e => field.onChange(parseInt(e.target.value) || 0)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="ageOfProperty"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Age of Property (years)</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Property age"
												{...field}
												onChange={e => field.onChange(parseInt(e.target.value) || 0)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="furnishingStatus"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Furnishing Status</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select furnishing status" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="UNFURNISHED">Unfurnished</SelectItem>
												<SelectItem value="SEMI_FURNISHED">Semi Furnished</SelectItem>
												<SelectItem value="FULLY_FURNISHED">Fully Furnished</SelectItem>
												<SelectItem value="BARE_SHELL">Bare Shell</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="facingDirection"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Facing Direction</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select facing direction" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="NORTH">North</SelectItem>
												<SelectItem value="SOUTH">South</SelectItem>
												<SelectItem value="EAST">East</SelectItem>
												<SelectItem value="WEST">West</SelectItem>
												<SelectItem value="NORTH_EAST">North East</SelectItem>
												<SelectItem value="NORTH_WEST">North West</SelectItem>
												<SelectItem value="SOUTH_EAST">South East</SelectItem>
												<SelectItem value="SOUTH_WEST">South West</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>

					{/* Amenities */}
					<div className="space-y-4">
						<h2 className="text-lg font-semibold">Amenities</h2>

						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<FormField
								control={form.control}
								name="balcony"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<FormLabel>Balcony</FormLabel>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="parking"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<FormLabel>Parking</FormLabel>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="hasLift"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<FormLabel>Lift</FormLabel>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="hasSecurity"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<FormLabel>Security</FormLabel>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="hasGym"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<FormLabel>Gym</FormLabel>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="hasSwimmingPool"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<FormLabel>Swimming Pool</FormLabel>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="hasPowerBackup"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<FormLabel>Power Backup</FormLabel>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="hasGarden"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<FormLabel>Garden</FormLabel>
									</FormItem>
								)}
							/>
						</div>
					</div>

					{/* Contact Information */}
					<div className="space-y-4">
						<h2 className="text-lg font-semibold">Contact Information</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="vendorContactNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Contact Number</FormLabel>
										<FormControl>
											<Input placeholder="Enter contact number" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="reraNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>RERA Number</FormLabel>
										<FormControl>
											<Input placeholder="Enter RERA number" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="propertyRent"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Property Rent</FormLabel>
									<FormControl>
										<Input placeholder="Property rent" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="securityDeposit"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Security Deposit</FormLabel>
									<FormControl>
										<Input placeholder="Security deposit" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="advanceBookingAmount"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Advance Booking Amount</FormLabel>
									<FormControl>
										<Input
											placeholder="Advance booking amount"
											{...field}
											onChange={e => field.onChange(parseInt(e.target.value) || 0)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Button type="submit" onClick={form.handleSubmit(onSubmit)} className="w-full" disabled={isSubmitting}>
						{isSubmitting ? 'Creating Property...' : 'Create Property'}
					</Button>
				</form>
			</Form>
		</>
	)
}
