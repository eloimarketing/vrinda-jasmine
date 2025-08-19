'use client'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { IndianStates, getCitiesByState } from '@/utils/constant/data'

interface PriceRange {
	min: string
	max: string
}

type PropertyType =
	| 'Apartment_Flat'
	| 'Independent_House_Villa'
	| 'Plot_Land'
	| 'Office_Space'
	| 'Shop_Showroom'
	| 'Warehouse_Godown'
	| 'Farmhouse_Agricultural_Land'
	| 'CoWorking_Space'
	| 'Paying_Guest_Hostel'

const propertyTypes: { value: PropertyType; label: string }[] = [
	{ value: 'Apartment_Flat', label: 'Apartment/Flat' },
	{ value: 'Independent_House_Villa', label: 'Independent House/Villa' },
	{ value: 'Plot_Land', label: 'Plot/Land' },
	{ value: 'Office_Space', label: 'Office Space' },
	{ value: 'Shop_Showroom', label: 'Shop/Showroom' },
	{ value: 'Warehouse_Godown', label: 'Warehouse/Godown' },
	{ value: 'Farmhouse_Agricultural_Land', label: 'Farmhouse/Agricultural' },
	{ value: 'CoWorking_Space', label: 'Co-Working Space' },
	{ value: 'Paying_Guest_Hostel', label: 'Paying Guest/Hostel' },
]

export default function SearchBar() {
	const [listingType, setListingType] = useState<'FOR_RENT' | 'FOR_SALE'>('FOR_SALE')
	const [selectedState, setSelectedState] = useState<string>('')
	const [selectedCity, setSelectedCity] = useState<string>('')
	const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType | ''>('')
	const [cities, setCities] = useState<string[]>([])
	const [priceRange, setPriceRange] = useState<PriceRange>({ min: '', max: '' })
	const [searchQuery, setSearchQuery] = useState('')
	const router = useRouter()

	useEffect(() => {
		if (selectedState) {
			const allCities = getCitiesByState({ stateName: selectedState })
			if (!allCities) return
			setCities(allCities)
			// Reset city selection when state changes
			setSelectedCity('')
		} else {
			setCities([])
			setSelectedCity('')
		}
	}, [selectedState])

	const handleSearch = () => {
		const searchData = {
			listingType,
			state: selectedState,
			city: selectedCity,
			propertyType: selectedPropertyType,
			query: searchQuery,
			priceRange: {
				min: priceRange.min ? parseInt(priceRange.min) : null,
				max: priceRange.max ? parseInt(priceRange.max) : null,
			},
		}

		router.push(`/user/property/all?data=${encodeURIComponent(JSON.stringify(searchData))}`)
	}

	return (
		<div className="flex justify-center items-center flex-col w-full max-w-6xl mx-auto">
			<div className="w-full max-w-xs sm:max-w-sm border-t border-x rounded-t-lg flex items-center h-12 bg-white">
				<div
					className="flex flex-col items-center justify-between w-full font-semibold hover:cursor-pointer h-full transition-colors duration-200"
					onClick={() => setListingType('FOR_RENT')}>
					<div
						className={cn(
							'p-3 w-full text-center text-sm sm:text-base transition-colors duration-200',
							listingType === 'FOR_RENT' ? 'text-[#89ce3d]' : 'text-muted-foreground hover:text-gray-700'
						)}>
						Rent
					</div>
					{listingType === 'FOR_RENT' && <div className="h-1 mt-auto w-[90%] mx-auto bg-[#89ce3d] rounded-t-sm" />}
				</div>
				<div
					className="flex flex-col items-center justify-between w-full font-semibold hover:cursor-pointer h-full transition-colors duration-200"
					onClick={() => setListingType('FOR_SALE')}>
					<div
						className={cn(
							'p-3 w-full text-center text-sm sm:text-base transition-colors duration-200',
							listingType === 'FOR_SALE' ? 'text-[#89ce3d]' : 'text-muted-foreground hover:text-gray-700'
						)}>
						Buy
					</div>
					{listingType === 'FOR_SALE' && <div className="h-1 mt-auto w-[90%] mx-auto bg-[#89ce3d] rounded-t-sm" />}
				</div>
			</div>

			{/* Search Form */}
			<div className="border rounded-b-lg overflow-hidden w-full max-w-6xl bg-white">
				{/* First Row - Location and Search */}
				<div className="flex flex-col lg:flex-row items-stretch">
					{/* State Selector */}
					<div className="lg:w-[200px] border-b lg:border-b-0 lg:border-r border-gray-200 my-auto">
						<Select value={selectedState} onValueChange={value => setSelectedState(value)}>
							<SelectTrigger className="w-full h-12 border-0 rounded-none focus-visible:ring-0 shadow-none text-sm hover:bg-gray-50 transition-colors duration-200">
								<SelectValue placeholder="Select State" />
							</SelectTrigger>
							<SelectContent className="rounded-lg max-h-[300px] border-gray-200">
								{IndianStates.map(state => (
									<SelectItem
										key={state.id}
										value={state.name}
										className="rounded-sm hover:bg-gray-50 focus:bg-gray-100 transition-colors duration-200">
										{state.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* City Selector */}
					<div className="lg:w-[200px] border-b lg:border-b-0 lg:border-r border-gray-200">
						<Select value={selectedCity} onValueChange={value => setSelectedCity(value)} disabled={!selectedState}>
							<SelectTrigger
								className={cn(
									'w-full h-12 border-0 rounded-none focus-visible:ring-0 shadow-none text-sm transition-colors duration-200',
									selectedState ? 'hover:bg-gray-50' : 'bg-gray-50 cursor-not-allowed'
								)}>
								<SelectValue placeholder={!selectedState ? 'Select State First' : 'Select City'} />
							</SelectTrigger>
							<SelectContent className="rounded-lg max-h-[300px] border-gray-200">
								{cities.map((city, indx) => (
									<SelectItem
										key={indx}
										value={city}
										className="rounded-sm hover:bg-gray-50 focus:bg-gray-100 transition-colors duration-200">
										{city}
									</SelectItem>
								))}
								{cities.length === 0 && selectedState && (
									<SelectItem value="no-cities" disabled className="rounded-sm text-muted-foreground">
										No cities found
									</SelectItem>
								)}
							</SelectContent>
						</Select>
					</div>

					{/* Search Input */}
					<div className="flex-1 border-b lg:border-b-0 lg:border-r border-gray-200">
						<Input
							className="w-full h-12 rounded-none border-0 shadow-none text-sm placeholder:text-gray-400 focus-visible:ring-0 hover:bg-gray-50 transition-colors duration-200"
							placeholder="Enter area, locality, or property name"
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
						/>
					</div>

					{/* Search Button */}
					<div className="lg:w-[140px]">
						<Button
							variant={'destructive'}
							className="w-full h-12 rounded-none font-semibold text-sm sm:text-base px-4 bg-[#89ce3d] hover:bg-[#89ce3d] transition-colors duration-200"
							onClick={handleSearch}>
							<Image
								src="/assets/icons/search-icon.svg"
								width={20}
								height={20}
								alt="search"
								className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
							/>
							Search
						</Button>
					</div>
				</div>

				{/* Second Row - Property Type and Price Range */}
				<div className="border-t border-gray-200 bg-gray-50/30 p-4 flex flex-col lg:flex-row gap-4 lg:gap-6">
					{/* Property Type Selector */}
					<div className="lg:w-[200px]">
						<Select value={selectedPropertyType} onValueChange={value => setSelectedPropertyType(value as PropertyType)}>
							<SelectTrigger className="w-full h-10 border border-gray-300 rounded-md focus-visible:ring-2 focus-visible:ring-[#89ce3d] text-sm bg-white hover:bg-gray-50 transition-colors duration-200">
								<SelectValue placeholder="Property Type" />
							</SelectTrigger>
							<SelectContent className="rounded-lg max-h-[300px] border-gray-200">
								{propertyTypes.map(type => (
									<SelectItem
										key={type.value}
										value={type.value}
										className="rounded-sm hover:bg-gray-50 focus:bg-gray-100 transition-colors duration-200">
										{type.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Price Range */}
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-1">
						<Label className="text-sm font-medium text-gray-700 whitespace-nowrap">
							Price Range ({listingType === 'FOR_RENT' ? 'Monthly' : 'Total'}):
						</Label>
						<div className="flex items-center gap-3 w-full sm:w-auto">
							<div className="flex items-center gap-2">
								<span className="text-sm text-gray-600 font-medium">₹</span>
								<Input
									type="number"
									placeholder="Min"
									className="w-24 sm:w-28 h-10 text-sm border-gray-300 rounded-md focus-visible:ring-2 focus-visible:ring-[#89ce3d] transition-all duration-200"
									value={priceRange.min}
									onChange={e => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
								/>
							</div>
							<span className="text-gray-400 font-medium">to</span>
							<div className="flex items-center gap-2">
								<span className="text-sm text-gray-600 font-medium">₹</span>
								<Input
									type="number"
									placeholder="Max"
									className="w-24 sm:w-28 h-10 text-sm border-gray-300 rounded-md focus-visible:ring-2 focus-visible:ring-[#89ce3d] transition-all duration-200"
									value={priceRange.max}
									onChange={e => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
								/>
							</div>
						</div>
						<div className="text-xs text-gray-500 ml-2 font-medium">
							{listingType === 'FOR_RENT' ? 'per month' : 'total price'}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
