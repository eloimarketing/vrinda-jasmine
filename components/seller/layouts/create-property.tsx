'use client'

import MaxWidthWrapper from '@/components/max-width-wrapper'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { ItemCategory } from '@/lib/enums'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

// Create Property Forms
import ApartmentFlatForm from '../create-property-forms/apartment-flat'
import IndependentCommercialPropertyForm from '../create-property-forms/Independent-commercial-property'

const FormSchema = z.object({
	itemCategory: z.string({
		required_error: 'Please select a product category to create.',
	}),
})

export default function CreateProduct() {
	const [itemCategory, setItemCategory] = useState<ItemCategory>()

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			itemCategory: itemCategory,
		},
	})

	function onSubmit(data: z.infer<typeof FormSchema>) {
		setItemCategory(data.itemCategory as ItemCategory)
		toast('Product category changed successfully')
	}

	return (
		<MaxWidthWrapper className="my-6 px-0">
			<h1 className="text-2xl ms:text-4xl font-semibold text-center">Create Product</h1>

			<div className="my-6">
				<Card>
					<CardHeader>
						<CardTitle>Create new product Listing</CardTitle>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
								<FormField
									control={form.control}
									name="itemCategory"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Product Category *</FormLabel>
											<Select onValueChange={field.onChange} defaultValue={field.value}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a product category to create" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{Object.keys(ItemCategory).map(type => (
														<SelectItem key={type} value={type}>
															{type.replaceAll('_', ' ')}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit">Create Product</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>

			{/* Create Product Forms */}
			{/* You can add product-specific forms here based on itemCategory if needed */}
		</MaxWidthWrapper>
	)
}
