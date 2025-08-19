'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import CategorySelector from '@/components/supplier/category-selector'
import DynamicProductForm from '@/components/supplier/dynamic-product-form'

export default function CreateProductPage() {
	const router = useRouter()
	const [step, setStep] = React.useState<'category' | 'form'>('category')
	const [selectedCategory, setSelectedCategory] = React.useState<string>('')
	const [selectedSubcategory, setSelectedSubcategory] = React.useState<string>('')

	const handleCategorySelect = (category: string, subcategory: string) => {
		setSelectedCategory(category)
		setSelectedSubcategory(subcategory)
		setStep('form')
	}

	const handleBackToCategory = () => {
		setStep('category')
		setSelectedCategory('')
		setSelectedSubcategory('')
	}

	const handleSubmit = async (formData: any) => {
		try {
			const response = await fetch('/api/supplier/products', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			})

			if (!response.ok) {
				throw new Error('Failed to create product')
			}

			const result = await response.json()
			toast.success('Product created successfully!')
			router.push('/supplier/products')
		} catch (error) {
			console.error('Error creating product:', error)
			toast.error('Failed to create product. Please try again.')
		}
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-4xl mx-auto">
				{step === 'category' ? (
					<CategorySelector onCategorySelect={handleCategorySelect} />
				) : (
					<DynamicProductForm
						category={selectedCategory}
						subcategory={selectedSubcategory}
						onBack={handleBackToCategory}
						onSubmit={handleSubmit}
					/>
				)}
			</div>
		</div>
	)
} 