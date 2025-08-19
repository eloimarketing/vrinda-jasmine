'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { PRODUCT_CATEGORIES } from '@/utils/constant/product-categories'
import type { JSX } from 'react'

type DynamicField = {
  name: string
  type: 'text' | 'number' | 'textarea'
  required: boolean
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: RegExp
  }
}

const baseFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  price: z.number().min(0, 'Price must be positive'),
  image: z.string().min(1, 'Image URL is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().min(1, 'Subcategory is required'),
  'Temperature Range': z.string().optional(),
  'Capacity (Litres)': z.string().optional(),
  'Capacity': z.string().optional(),
  'Glass Type': z.string().optional(),
  'Lighting': z.string().optional(),
  'Shelves': z.string().optional(),
  'Power Supply': z.string().optional(),
  'Power': z.string().optional(),
  'Energy Rating': z.string().optional(),
  'Defrost Type': z.string().optional(),
  'Dimensions': z.string().optional(),
  'Warranty': z.string().optional()
})

type FormValues = z.infer<typeof baseFormSchema>

type DynamicFormValues = FormValues & Record<string, string | number>

export default function CreateItem(): JSX.Element {
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [fields, setFields] = useState<DynamicField[]>([])
  const [showForm, setShowForm] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const getDynamicSchema = (fields: DynamicField[]) => {
    const schema = baseFormSchema
    return fields.reduce((acc, field) => {
      let fieldSchema: z.ZodTypeAny = z.string()
      if (field.required) {
        fieldSchema = fieldSchema.min(1, `${field.name} is required`)
      }
      
      return acc.extend({
        [field.name]: fieldSchema
      })
    }, schema)
  }

  const handleSubcategoryChange = (value: string) => {
    setSubcategory(value)
    const selectedSubcategory = PRODUCT_CATEGORIES
      .find(cat => cat.name === category)
      ?.subcategories?.find(sub => sub.name === value)

    if (selectedSubcategory) {
      setFields(selectedSubcategory.formFields.map(field => ({
        name: field,
        type: 'text',
        required: true
      })))
    }
    setShowForm(true)
  }

  const form = useForm<DynamicFormValues>({
    resolver: zodResolver(getDynamicSchema(fields)),
    defaultValues: {
      name: '',
      brand: '',
      model: '',
      price: 0,
      image: '',
      description: '',
      category: '',
      subcategory: '',
      ...PRODUCT_CATEGORIES.reduce((acc, category) => {
        category.subcategories.forEach(subcategory => {
          subcategory.formFields.forEach(field => {
            acc[field] = '';
          });
        });
        return acc;
      }, {} as Record<string, string>),
    },
  })

  useEffect(() => {
    if (fields.length > 0) {
      const dynamicSchema = getDynamicSchema(fields)
      form.reset({
        name: '',
        brand: '',
        model: '',
        price: 0,
        image: '',
        description: '',
        category: category,
        subcategory: subcategory,
        ...PRODUCT_CATEGORIES.reduce((acc, category) => {
          category.subcategories.forEach(subcategory => {
            subcategory.formFields.forEach(field => {
              acc[field] = '';
            });
          });
          return acc;
        }, {} as Record<string, string>),
      })
    }
  }, [fields])

  useEffect(() => {
    setIsInitialized(true)
  }, [])

  const onSubmit = async (data: DynamicFormValues) => {
    try {
      console.log('Form submission started')
      console.log('Form data:', data)
      console.log('Selected category:', category)
      console.log('Selected subcategory:', subcategory)
      
      setIsLoading(true)
      
      // Get the subcategory ID from the selected subcategory name
      const selectedCategory = PRODUCT_CATEGORIES.find(cat => cat.name === category)
      if (!selectedCategory) {
        throw new Error('Invalid category selected')
      }

      const selectedSubcategory = selectedCategory.subcategories.find(sub => sub.name === subcategory)
      if (!selectedSubcategory) {
        throw new Error('Invalid subcategory selected')
      }

      console.log('Found subcategory:', selectedSubcategory)

      // Transform the form data to match API expectations
      const transformedData = {
        name: data.name,
        brand: data.brand,
        model: data.model,
        price: data.price,
        image: data.image,
        description: data.description,
        subcategoryId: selectedSubcategory.id,
        // Add other required fields based on subcategory
        ...(selectedSubcategory.name === 'Glass Door Refrigeration' && {
          temperatureRange: data['Temperature Range'],
          capacityLitres: data['Capacity (Litres)'],
          glassType: data['Glass Type'],
          lighting: data['Lighting'],
          shelves: data['Shelves'],
          powerSupply: data['Power Supply'],
          dimensions: data['Dimensions'],
          warranty: data['Warranty']
        }),
        ...(selectedSubcategory.name === 'Ice Cream Freezers' && {
          temperatureRange: data['Temperature Range'],
          capacityLitres: data['Capacity'],
          energyRating: data['Energy Rating'],
          defrostType: data['Defrost Type'],
          powerSupply: data['Power'],
          dimensions: data['Dimensions'],
          warranty: data['Warranty']
        })
      }

      console.log('Transformed data:', transformedData)

      const response = await fetch('/api/supplier/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData),
      })

      console.log('API Response:', response)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error Response:', errorData)
        throw new Error(errorData.error || 'Failed to create product')
      }

      const successData = await response.json()
      console.log('Product created successfully:', successData)

      toast.success('Product created successfully')
      form.reset()
      setShowForm(false)
      setFields([])
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create product')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      {isInitialized ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <FormLabel>Category *</FormLabel>
              <Select onValueChange={(value) => {
                setCategory(value)
                setSubcategory('')
                setShowForm(false)
                setFields([])
              }}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map(cat => (
                    <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </div>

            {category && (
              <div>
                <FormLabel>Subcategory *</FormLabel>
                <Select onValueChange={handleSubcategoryChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.find(c => c.name === category)?.subcategories?.map(sub => (
                      <SelectItem key={sub.name} value={sub.name}>{sub.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </div>
            )}

            {/* Dynamic Form Fields */}
            {showForm && fields.map((field: DynamicField) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.name} {field.required && '*'}</FormLabel>
                    <FormControl>
                      {field.type === 'textarea' ? (
                        <Textarea {...formField} />
                      ) : (
                        <Input {...formField} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button type="submit" disabled={isLoading || !form.formState.isValid}>
              {isLoading ? 'Creating...' : 'Create Product'}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  )
}