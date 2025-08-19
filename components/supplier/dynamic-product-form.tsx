'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft } from 'lucide-react'

interface DynamicProductFormProps {
	category: string
	subcategory: string
	onBack: () => void
	onSubmit: (data: any) => void
}

export default function DynamicProductForm({ category, subcategory, onBack, onSubmit }: DynamicProductFormProps) {
	const [formData, setFormData] = React.useState<any>({
		productName: '',
		brand: '',
		description: '',
		price: '',
		productImage: ''
	})

	const getSubcategoryFields = () => {
		const commonFields = [
			{ name: 'productName', label: 'Product Name *', type: 'text', required: true },
			{ name: 'brand', label: 'Brand *', type: 'text', required: true },
			{ name: 'description', label: 'Description *', type: 'textarea', required: true },
			{ name: 'price', label: 'Price (₹) *', type: 'number', required: true },
			{ name: 'productImage', label: 'Product Image URL *', type: 'text', required: true }
		]

		const subcategorySpecificFields: { [key: string]: any[] } = {
			// Refrigeration Category
			GlassDoorRefrigeration: [
				{ name: 'model', label: 'Model *', type: 'text', required: true },
				{ name: 'temperatureRange', label: 'Temperature Range *', type: 'text', required: true },
				{ name: 'capacityLitres', label: 'Capacity (Litres) *', type: 'text', required: true },
				{ name: 'glassType', label: 'Glass Type *', type: 'text', required: true },
				{ name: 'lighting', label: 'Lighting *', type: 'text', required: true },
				{ name: 'shelves', label: 'Shelves *', type: 'text', required: true },
				{ name: 'dimensions', label: 'Dimensions *', type: 'text', required: true },
				{ name: 'powerSupply', label: 'Power Supply *', type: 'text', required: true },
				{ name: 'warranty', label: 'Warranty *', type: 'text', required: true }
			],
			IceCreamFreezers: [
				{ name: 'capacity', label: 'Capacity *', type: 'text', required: true },
				{ name: 'temperatureRange', label: 'Temperature Range *', type: 'text', required: true },
				{ name: 'lidType', label: 'Lid Type *', type: 'text', required: true },
				{ name: 'defrostType', label: 'Defrost Type *', type: 'text', required: true },
				{ name: 'interiorLighting', label: 'Interior Lighting *', type: 'text', required: true },
				{ name: 'power', label: 'Power *', type: 'text', required: true },
				{ name: 'dimensions', label: 'Dimensions *', type: 'text', required: true },
				{ name: 'warranty', label: 'Warranty *', type: 'text', required: true }
			],
			DrinksFridgesBottleCoolers: [
				{ name: 'capacity', label: 'Capacity *', type: 'text', required: true },
				{ name: 'temperatureRange', label: 'Temperature Range *', type: 'text', required: true },
				{ name: 'doorType', label: 'Door Type *', type: 'text', required: true },
				{ name: 'shelving', label: 'Shelving *', type: 'text', required: true },
				{ name: 'lighting', label: 'Lighting *', type: 'text', required: true },
				{ name: 'power', label: 'Power *', type: 'text', required: true },
				{ name: 'dimensions', label: 'Dimensions *', type: 'text', required: true },
				{ name: 'warranty', label: 'Warranty *', type: 'text', required: true }
			],
			ServeOverCounters: [
				{ name: 'capacity', label: 'Capacity *', type: 'text', required: true },
				{ name: 'temperatureRange', label: 'Temperature Range *', type: 'text', required: true },
				{ name: 'counterType', label: 'Counter Type *', type: 'text', required: true },
				{ name: 'displayArea', label: 'Display Area *', type: 'text', required: true },
				{ name: 'lighting', label: 'Lighting *', type: 'text', required: true },
				{ name: 'power', label: 'Power *', type: 'text', required: true },
				{ name: 'dimensions', label: 'Dimensions *', type: 'text', required: true },
				{ name: 'warranty', label: 'Warranty *', type: 'text', required: true }
			],
			MultideckDisplays: [
				{ name: 'capacity', label: 'Capacity *', type: 'text', required: true },
				{ name: 'temperatureRange', label: 'Temperature Range *', type: 'text', required: true },
				{ name: 'deckCount', label: 'Deck Count *', type: 'text', required: true },
				{ name: 'displayType', label: 'Display Type *', type: 'text', required: true },
				{ name: 'lighting', label: 'Lighting *', type: 'text', required: true },
				{ name: 'power', label: 'Power *', type: 'text', required: true },
				{ name: 'dimensions', label: 'Dimensions *', type: 'text', required: true },
				{ name: 'warranty', label: 'Warranty *', type: 'text', required: true }
			],
			UprightUndercounterFridges: [
				{ name: 'capacity', label: 'Capacity *', type: 'text', required: true },
				{ name: 'temperatureRange', label: 'Temperature Range *', type: 'text', required: true },
				{ name: 'fridgeType', label: 'Fridge Type *', type: 'text', required: true },
				{ name: 'shelving', label: 'Shelving *', type: 'text', required: true },
				{ name: 'lighting', label: 'Lighting *', type: 'text', required: true },
				{ name: 'power', label: 'Power *', type: 'text', required: true },
				{ name: 'dimensions', label: 'Dimensions *', type: 'text', required: true },
				{ name: 'warranty', label: 'Warranty *', type: 'text', required: true }
			],
			FreezersChestAndUpright: [
				{ name: 'freezerType', label: 'Freezer Type *', type: 'text', required: true },
				{ name: 'capacity', label: 'Capacity *', type: 'text', required: true },
				{ name: 'temperatureControl', label: 'Temperature Control *', type: 'text', required: true },
				{ name: 'numberOfCompartments', label: 'Number of Compartments *', type: 'text', required: true },
				{ name: 'power', label: 'Power *', type: 'text', required: true },
				{ name: 'dimensions', label: 'Dimensions *', type: 'text', required: true },
				{ name: 'warranty', label: 'Warranty *', type: 'text', required: true }
			],
			// Cooking Appliances Category
			RangeCookersInductionCookersHobs: [
				{ name: 'burnerCount', label: 'Burner Count *', type: 'text', required: true },
				{ name: 'powerOutput', label: 'Power Output *', type: 'text', required: true },
				{ name: 'fuelType', label: 'Fuel Type *', type: 'text', required: true },
				{ name: 'controlType', label: 'Control Type *', type: 'text', required: true },
				{ name: 'safetyFeatures', label: 'Safety Features *', type: 'text', required: true },
				{ name: 'dimensions', label: 'Dimensions *', type: 'text', required: true },
				{ name: 'warranty', label: 'Warranty *', type: 'text', required: true }
			],
			Ovens: [
				{ name: 'capacity', label: 'Capacity *', type: 'text', required: true },
				{ name: 'ovenType', label: 'Oven Type *', type: 'text', required: true },
				{ name: 'temperatureRange', label: 'Temperature Range *', type: 'text', required: true },
				{ name: 'cookingModes', label: 'Cooking Modes *', type: 'text', required: true },
				{ name: 'power', label: 'Power *', type: 'text', required: true },
				{ name: 'dimensions', label: 'Dimensions *', type: 'text', required: true },
				{ name: 'warranty', label: 'Warranty *', type: 'text', required: true }
			],
			GnPansAccessories: [
				{ name: 'panSize', label: 'Pan Size *', type: 'text', required: true },
				{ name: 'material', label: 'Material *', type: 'text', required: true },
				{ name: 'depth', label: 'Depth *', type: 'text', required: true },
				{ name: 'handles', label: 'Handles *', type: 'text', required: true },
				{ name: 'lids', label: 'Lids *', type: 'text', required: true },
				{ name: 'capacity', label: 'Capacity *', type: 'text', required: true },
				{ name: 'warranty', label: 'Warranty *', type: 'text', required: true }
			],
			Cookware: [
				{ name: 'material', label: 'Material *', type: 'text', required: true },
				{ name: 'size', label: 'Size *', type: 'text', required: true },
				{ name: 'type', label: 'Type *', type: 'text', required: true },
				{ name: 'handles', label: 'Handles *', type: 'text', required: true },
				{ name: 'lids', label: 'Lids *', type: 'text', required: true },
				{ name: 'inductionCompatible', label: 'Induction Compatible *', type: 'text', required: true },
				{ name: 'warranty', label: 'Warranty *', type: 'text', required: true }
			],
			BeverageMachines: [
				{ name: 'machineType', label: 'Machine Type *', type: 'text', required: true },
				{ name: 'capacity', label: 'Capacity *', type: 'text', required: true },
				{ name: 'power', label: 'Power *', type: 'text', required: true },
				{ name: 'temperatureControl', label: 'Temperature Control *', type: 'text', required: true },
				{ name: 'features', label: 'Features *', type: 'text', required: true },
				{ name: 'dimensions', label: 'Dimensions *', type: 'text', required: true },
				{ name: 'warranty', label: 'Warranty *', type: 'text', required: true }
			],
			BlendersMixers: [
				{ name: 'power', label: 'Power *', type: 'text', required: true },
				{ name: 'capacity', label: 'Capacity *', type: 'text', required: true },
				{ name: 'speedSettings', label: 'Speed Settings *', type: 'text', required: true },
				{ name: 'attachments', label: 'Attachments *', type: 'text', required: true },
				{ name: 'material', label: 'Material *', type: 'text', required: true },
				{ name: 'dimensions', label: 'Dimensions *', type: 'text', required: true },
				{ name: 'warranty', label: 'Warranty *', type: 'text', required: true }
			],
			SlushMachines: [
				{ name: 'capacity', label: 'Capacity *', type: 'text', required: true },
				{ name: 'temperatureRange', label: 'Temperature Range *', type: 'text', required: true },
				{ name: 'tankCount', label: 'Tank Count *', type: 'text', required: true },
				{ name: 'power', label: 'Power *', type: 'text', required: true },
				{ name: 'dimensions', label: 'Dimensions *', type: 'text', required: true },
				{ name: 'warranty', label: 'Warranty *', type: 'text', required: true }
			],
			// Appliances Category
			AllAppliances: [
				{ name: 'applianceType', label: 'Appliance Type *', type: 'text', required: true },
				{ name: 'power', label: 'Power *', type: 'text', required: true },
				{ name: 'capacity', label: 'Capacity *', type: 'text', required: true },
				{ name: 'features', label: 'Features *', type: 'text', required: true },
				{ name: 'dimensions', label: 'Dimensions *', type: 'text', required: true },
				{ name: 'warranty', label: 'Warranty *', type: 'text', required: true }
			],
			// Kitchenware & Equipment Category
			GeneralEquipment: [
				{ name: 'equipmentType', label: 'Equipment Type *', type: 'text', required: true },
				{ name: 'material', label: 'Material *', type: 'text', required: true },
				{ name: 'size', label: 'Size *', type: 'text', required: true },
				{ name: 'power', label: 'Power *', type: 'text', required: true },
				{ name: 'features', label: 'Features *', type: 'text', required: true },
				{ name: 'dimensions', label: 'Dimensions *', type: 'text', required: true },
				{ name: 'warranty', label: 'Warranty *', type: 'text', required: true }
			],
			// Consumables Category
			GeneralConsumables: [
				{ name: 'consumableType', label: 'Consumable Type *', type: 'text', required: true },
				{ name: 'quantity', label: 'Quantity *', type: 'text', required: true },
				{ name: 'unit', label: 'Unit *', type: 'text', required: true },
				{ name: 'expiryDate', label: 'Expiry Date *', type: 'text', required: true },
				{ name: 'storage', label: 'Storage *', type: 'text', required: true },
				{ name: 'usage', label: 'Usage *', type: 'text', required: true },
				{ name: 'warranty', label: 'Warranty *', type: 'text', required: true }
			],
			// Kitchen Furniture Category
			AllFurniture: [
				{ name: 'furnitureType', label: 'Furniture Type *', type: 'text', required: true },
				{ name: 'material', label: 'Material *', type: 'text', required: true },
				{ name: 'dimensions', label: 'Dimensions *', type: 'text', required: true },
				{ name: 'weight', label: 'Weight *', type: 'text', required: true },
				{ name: 'assembly', label: 'Assembly *', type: 'text', required: true },
				{ name: 'finish', label: 'Finish *', type: 'text', required: true },
				{ name: 'warranty', label: 'Warranty *', type: 'text', required: true }
			],
			// Cleaning Category
			DishwashersGlasswashers: [
				{ name: 'capacity', label: 'Capacity *', type: 'text', required: true },
				{ name: 'cycleTime', label: 'Cycle Time *', type: 'text', required: true },
				{ name: 'power', label: 'Power *', type: 'text', required: true },
				{ name: 'waterConsumption', label: 'Water Consumption *', type: 'text', required: true },
				{ name: 'features', label: 'Features *', type: 'text', required: true },
				{ name: 'dimensions', label: 'Dimensions *', type: 'text', required: true },
				{ name: 'warranty', label: 'Warranty *', type: 'text', required: true }
			],
			HygieneAccessories: [
				{ name: 'accessoryType', label: 'Accessory Type *', type: 'text', required: true },
				{ name: 'material', label: 'Material *', type: 'text', required: true },
				{ name: 'size', label: 'Size *', type: 'text', required: true },
				{ name: 'features', label: 'Features *', type: 'text', required: true },
				{ name: 'installation', label: 'Installation *', type: 'text', required: true },
				{ name: 'warranty', label: 'Warranty *', type: 'text', required: true }
			],
			LaundryMachines: [
				{ name: 'capacity', label: 'Capacity *', type: 'text', required: true },
				{ name: 'machineType', label: 'Machine Type *', type: 'text', required: true },
				{ name: 'power', label: 'Power *', type: 'text', required: true },
				{ name: 'waterConsumption', label: 'Water Consumption *', type: 'text', required: true },
				{ name: 'features', label: 'Features *', type: 'text', required: true },
				{ name: 'dimensions', label: 'Dimensions *', type: 'text', required: true },
				{ name: 'warranty', label: 'Warranty *', type: 'text', required: true }
			],
			// Graded Equipment Category
			AllGradedProducts: [
				{ name: 'grade', label: 'Grade *', type: 'text', required: true },
				{ name: 'condition', label: 'Condition *', type: 'text', required: true },
				{ name: 'age', label: 'Age *', type: 'text', required: true },
				{ name: 'originalPrice', label: 'Original Price *', type: 'text', required: true },
				{ name: 'features', label: 'Features *', type: 'text', required: true },
				{ name: 'dimensions', label: 'Dimensions *', type: 'text', required: true },
				{ name: 'warranty', label: 'Warranty *', type: 'text', required: true }
			]
		}

		return [...commonFields, ...(subcategorySpecificFields[subcategory] || [])]
	}

	const renderField = (field: any) => {
		const { name, label, type, options, required } = field

		switch (type) {
			case 'text':
				return (
					<div key={name} className="space-y-2">
						<Label htmlFor={name}>{label}</Label>
						<Input
							id={name}
							value={formData[name] || ''}
							onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
							required={required}
						/>
					</div>
				)
			case 'number':
				return (
					<div key={name} className="space-y-2">
						<Label htmlFor={name}>{label}</Label>
						<Input
							id={name}
							type="number"
							value={formData[name] || ''}
							onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
							required={required}
						/>
					</div>
				)
			case 'textarea':
				return (
					<div key={name} className="space-y-2">
						<Label htmlFor={name}>{label}</Label>
						<Textarea
							id={name}
							value={formData[name] || ''}
							onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
							required={required}
						/>
					</div>
				)
			case 'select':
				return (
					<div key={name} className="space-y-2">
						<Label htmlFor={name}>{label}</Label>
						<Select
							value={formData[name] || ''}
							onValueChange={(value) => setFormData({ ...formData, [name]: value })}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select an option" />
							</SelectTrigger>
							<SelectContent>
								{options?.map((option: string) => (
									<SelectItem key={option} value={option}>
										{option.replace(/_/g, ' ')}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)
			case 'checkbox':
				return (
					<div key={name} className="flex items-center space-x-2">
						<Checkbox
							id={name}
							checked={formData[name] || false}
							onCheckedChange={(checked) => setFormData({ ...formData, [name]: checked })}
						/>
						<Label htmlFor={name}>{label}</Label>
					</div>
				)
			default:
				return null
		}
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		
		// Basic validation
		const requiredFields = getSubcategoryFields().filter(field => field.required)
		const missingFields = requiredFields.filter(field => !formData[field.name])
		
		if (missingFields.length > 0) {
			alert(`Please fill in all required fields: ${missingFields.map(f => f.label).join(', ')}`)
			return
		}

		// Prepare data for submission
		const submitData = {
			...formData,
			category,
			subcategory,
			price: parseFloat(formData.price)
		}

		onSubmit(submitData)
	}

	const fields = getSubcategoryFields()

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center space-x-4">
					<Button variant="outline" size="sm" onClick={onBack}>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Categories
					</Button>
					<div>
						<CardTitle>Add New Product</CardTitle>
						<p className="text-sm text-gray-600">
							{category} - {subcategory.replace(/([A-Z])/g, ' $1').trim()}
						</p>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{fields.map(renderField)}
					</div>
					
					<div className="flex justify-end space-x-4 pt-6 border-t">
						<Button type="button" variant="outline" onClick={onBack}>
							Cancel
						</Button>
						<Button type="submit">
							Create Product
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
} 