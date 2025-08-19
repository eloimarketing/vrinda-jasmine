'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	Utensils,
	Sofa,
	Bed,
	Droplets,
	Monitor,
	TreePine,
	Shield,
	Wrench,
	ArrowRight,
	Check,
	Wine,
	GlassWater,
	ChefHat,
	Package
} from 'lucide-react'
import { PRODUCT_CATEGORIES } from '@/utils/constant/product-categories'

interface CategorySelectorProps {
	onCategorySelect: (category: string, subcategory: string) => void
}

// Map categories to icons and colors
const categoryConfig = {
	'Refrigeration': { icon: Utensils, color: 'bg-orange-100 text-orange-600' },
	'Cooking Appliances': { icon: Utensils, color: 'bg-red-100 text-red-600' },
	'Appliances': { icon: Monitor, color: 'bg-indigo-100 text-indigo-600' },
	'Kitchenware & Equipment': { icon: Wrench, color: 'bg-gray-100 text-gray-600' },
	'Consumables': { icon: Droplets, color: 'bg-green-100 text-green-600' },
	'Kitchen Furniture': { icon: Sofa, color: 'bg-blue-100 text-blue-600' },
	'Cleaning': { icon: Droplets, color: 'bg-cyan-100 text-cyan-600' },
	'Graded Equipment': { icon: Shield, color: 'bg-purple-100 text-purple-600' },
	'Barware': { icon: Wine, color: 'bg-amber-100 text-amber-600' },
	'Tableware': { icon: GlassWater, color: 'bg-sky-100 text-sky-600' },
	'Kitchen Accessories': { icon: ChefHat, color: 'bg-emerald-100 text-emerald-600' },
	'Catering Supplies': { icon: Package, color: 'bg-rose-100 text-rose-600' }
}

// Convert PRODUCT_CATEGORIES to the format expected by this component
const categories = PRODUCT_CATEGORIES.map(category => {
	const config = categoryConfig[category.name as keyof typeof categoryConfig] || { icon: Utensils, color: 'bg-gray-100 text-gray-600' }
	
	return {
		id: category.name,
		name: category.name,
		icon: config.icon,
		color: config.color,
		subcategories: category.subcategories.map(sub => ({
			id: sub.id,
			name: sub.name
		}))
	}
})

export default function CategorySelector({ onCategorySelect }: CategorySelectorProps) {
	const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
	const [selectedSubcategory, setSelectedSubcategory] = React.useState<string | null>(null)

	const handleCategoryClick = (categoryId: string) => {
		setSelectedCategory(categoryId)
		setSelectedSubcategory(null)
	}

	const handleSubcategoryClick = (subcategoryId: string) => {
		setSelectedSubcategory(subcategoryId)
	}

	const handleContinue = () => {
		if (selectedCategory && selectedSubcategory) {
			onCategorySelect(selectedCategory, selectedSubcategory)
		}
	}

	const selectedCategoryData = categories.find(cat => cat.id === selectedCategory)

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Select Product Category</h2>
				<p className="text-gray-600">Choose a category and subcategory for your product</p>
			</div>

			{/* Categories Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{categories.map((category) => (
					<Card
						key={category.id}
						className={`cursor-pointer transition-all hover:shadow-md ${
							selectedCategory === category.id
								? 'ring-2 ring-blue-500 bg-blue-50'
								: 'hover:bg-gray-50'
						}`}
						onClick={() => handleCategoryClick(category.id)}
					>
						<CardContent className="p-4">
							<div className="flex items-center space-x-3">
								<div className={`p-2 rounded-lg ${category.color}`}>
									<category.icon className="w-5 h-5" />
								</div>
								<div className="flex-1">
									<h3 className="font-medium text-gray-900">{category.name}</h3>
									<p className="text-sm text-gray-500">
										{category.subcategories.length} subcategories
									</p>
								</div>
								{selectedCategory === category.id && (
									<Check className="w-5 h-5 text-blue-500" />
								)}
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Subcategories */}
			{selectedCategory && selectedCategoryData && (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<ArrowRight className="w-4 h-4 text-gray-400" />
							<h3 className="text-lg font-semibold text-gray-900">
								Select {selectedCategoryData.name} Subcategory
							</h3>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								setSelectedCategory(null)
								setSelectedSubcategory(null)
							}}
							className="flex items-center gap-2"
						>
							<ArrowRight className="w-4 h-4 rotate-180" />
							Back to Categories
						</Button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
						{selectedCategoryData.subcategories.map((subcategory) => (
							<Button
								key={subcategory.id}
								variant={selectedSubcategory === subcategory.id ? 'default' : 'outline'}
								className="justify-start h-auto p-3"
								onClick={() => handleSubcategoryClick(subcategory.id)}
							>
								{subcategory.name}
								{selectedSubcategory === subcategory.id && (
									<Check className="w-4 h-4 ml-2" />
								)}
							</Button>
						))}
					</div>

					{/* Continue Button */}
					{selectedSubcategory && (
						<div className="flex justify-center pt-4">
							<Button
								onClick={handleContinue}
								className="px-8 py-2"
								size="lg"
							>
								Continue to Product Details
								<ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	)
} 