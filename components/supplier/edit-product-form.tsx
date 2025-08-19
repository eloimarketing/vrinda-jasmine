'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PRODUCT_CATEGORIES } from '@/utils/constant/product-categories'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import MultipleMediaUpload from '@/components/ui/multiple-media-upload'

interface EditProductFormProps {
  product: any
  productType: 'unified' | 'legacy'
  userId: string
}

interface FormData {
  name: string
  brand: string
  category: string
  subcategory: string
  price: string
  description: string
  productImage: string
  productVideo?: string
  mediaType?: 'image' | 'video'
  images: string[]
  videos: string[]
  [key: string]: string | boolean | number | undefined | string[]
}

export default function EditProductForm({ product, productType, userId }: EditProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<any>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    brand: '',
    category: '',
    subcategory: '',
    price: '',
    description: '',
    productImage: '',
    productVideo: '',
    mediaType: 'image',
    images: [],
    videos: [],
  })

  // Initialize form data when product changes
  useEffect(() => {
    if (product) {
      // Map enum values to display names for form data
      const categoryEnumToDisplay: { [key: string]: string } = {
        'REFRIGERATION': 'Refrigeration',
        'COOKING_APPLIANCES': 'Cooking Appliances',
        'APPLIANCES': 'Appliances',
        'KITCHENWARE_EQUIPMENT': 'Kitchenware & Equipment',
        'CONSUMABLES': 'Consumables',
        'KITCHEN_FURNITURE': 'Kitchen Furniture',
        'CLEANING': 'Cleaning',
        'GRADED_EQUIPMENT': 'Graded Equipment',
        'BARWARE': 'Barware',
        'TABLEWARE': 'Tableware',
        'KITCHEN_ACCESSORIES': 'Kitchen Accessories',
        'CATERING_SUPPLIES': 'Catering Supplies',
      }

      const displayCategory = categoryEnumToDisplay[product.category] || product.category

      const initialData: FormData = {
        name: product.name || product.productName || '',
        brand: product.brand || '',
        category: displayCategory,
        subcategory: product.subcategory || '',
        price: product.price?.toString() || '',
        description: product.description || '',
        productImage: product.productImage || '',
        productVideo: product.productVideo || '',
        mediaType: product.mediaType || 'image',
        images: (product as any).images || [],
        videos: (product as any).videos || [],
      }

      // Add dynamic attributes for unified products
      if (productType === 'unified' && product.attributes) {
        product.attributes.forEach((attr: any) => {
          initialData[attr.attributeName] = attr.attributeValue
        })
      }

      setFormData(initialData)

      // Set category and subcategory for form fields
      if (product.category) {
        // Map enum values to display names for form matching
        const categoryEnumToDisplay: { [key: string]: string } = {
          'REFRIGERATION': 'Refrigeration',
          'COOKING_APPLIANCES': 'Cooking Appliances',
          'APPLIANCES': 'Appliances',
          'KITCHENWARE_EQUIPMENT': 'Kitchenware & Equipment',
          'CONSUMABLES': 'Consumables',
          'KITCHEN_FURNITURE': 'Kitchen Furniture',
          'CLEANING': 'Cleaning',
          'GRADED_EQUIPMENT': 'Graded Equipment',
          'BARWARE': 'Barware',
          'TABLEWARE': 'Tableware',
          'KITCHEN_ACCESSORIES': 'Kitchen Accessories',
          'CATERING_SUPPLIES': 'Catering Supplies',
        }

        const displayCategory = categoryEnumToDisplay[product.category] || product.category
        const category = PRODUCT_CATEGORIES.find(cat => cat.name === displayCategory)
        
        if (category) {
          setSelectedCategory(category)
          if (product.subcategory) {
            const subcategory = category.subcategories.find((sub: any) => sub.id === product.subcategory)
            if (subcategory) {
              setSelectedSubcategory(subcategory)
            }
          }
        }
      }
    }
  }, [product, productType])

  // Update form fields when subcategory is selected
  useEffect(() => {
    if (selectedSubcategory) {
      const newFormData = { ...formData }
      selectedSubcategory.formFields.forEach((field: string) => {
        if (!(field in newFormData)) {
          newFormData[field] = ''
        }
      })
      setFormData(newFormData)
    }
  }, [selectedSubcategory])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImagesChange = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: urls,
      productImage: urls[0] || '', // Keep legacy field for backward compatibility
    }))
  }

  const handleVideosChange = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      videos: urls,
      productVideo: urls[0] || '', // Keep legacy field for backward compatibility
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.price || !formData.description) {
        alert('Please fill in all required fields')
        return
      }

      // Validate media upload
      if (formData.images.length === 0 && formData.videos.length === 0) {
        alert('Please upload at least one product image or video')
        return
      }

      const formDataToSend = new FormData()

      // Add basic fields
      formDataToSend.append('name', formData.name)
      formDataToSend.append('brand', formData.brand)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('subcategory', formData.subcategory)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('description', formData.description)

      // Add multiple media fields
      formData.images.forEach((imageUrl) => {
        formDataToSend.append('images', imageUrl)
      })

      formData.videos.forEach((videoUrl) => {
        formDataToSend.append('videos', videoUrl)
      })

      // Add legacy media fields for backward compatibility
      if (formData.images.length > 0) {
        formDataToSend.append('productImage', formData.images[0])
      }
      if (formData.videos.length > 0) {
        formDataToSend.append('productVideo', formData.videos[0])
      }

      // Add dynamic attributes
      const attributes: { [key: string]: any } = {}
      selectedSubcategory?.formFields.forEach((field: string) => {
        if (formData[field] !== undefined && formData[field] !== '') {
          attributes[field] = formData[field]
        }
      })
      formDataToSend.append('attributes', JSON.stringify(attributes))

      // Add product ID for update
      formDataToSend.append('productId', product.id)
      formDataToSend.append('productType', productType)

      const response = await fetch('/api/products/update', {
        method: 'PUT',
        body: formDataToSend,
      })

      const responseData = await response.json()

      if (response.ok) {
        alert('Product updated successfully!')
        router.push('/supplier/products')
      } else {
        alert(`Failed to update product: ${responseData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error updating product. Please check the console for details.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderField = (fieldName: string) => {
    const value = formData[fieldName] || ''

    // Handle different field types
    if (fieldName.toLowerCase().includes('safe') || fieldName.toLowerCase().includes('disposable') || fieldName.toLowerCase().includes('compostable')) {
      return (
        <div key={fieldName} className="flex items-center space-x-2">
          <Checkbox
            id={fieldName}
            checked={value === true || value === 'true'}
            onCheckedChange={(checked) => handleInputChange(fieldName, checked as boolean)}
          />
          <Label htmlFor={fieldName}>{fieldName}</Label>
        </div>
      )
    }

    if (fieldName.toLowerCase().includes('material')) {
      return (
        <div key={fieldName}>
          <Label htmlFor={fieldName}>{fieldName}</Label>
          <Select onValueChange={(value) => handleInputChange(fieldName, value)} value={value as string}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${fieldName.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {/* Barware Materials */}
              {formData.category === 'Barware' && (
                <>
                  <SelectItem value="Stainless Steel">Stainless Steel</SelectItem>
                  <SelectItem value="Glass">Glass</SelectItem>
                  <SelectItem value="Copper">Copper</SelectItem>
                  <SelectItem value="Plastic">Plastic</SelectItem>
                  <SelectItem value="Wood">Wood</SelectItem>
                  <SelectItem value="Silicone">Silicone</SelectItem>
                  <SelectItem value="Aluminum">Aluminum</SelectItem>
                  <SelectItem value="Brass">Brass</SelectItem>
                  <SelectItem value="Ceramic">Ceramic</SelectItem>
                  <SelectItem value="Bamboo">Bamboo</SelectItem>
                </>
              )}
              {/* Add other category materials as needed */}
            </SelectContent>
          </Select>
        </div>
      )
    }

    if (fieldName.toLowerCase().includes('type')) {
      return (
        <div key={fieldName}>
          <Label htmlFor={fieldName}>{fieldName}</Label>
          <Select onValueChange={(value) => handleInputChange(fieldName, value)} value={value as string}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${fieldName.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {/* Barware Types */}
              {formData.category === 'Barware' && (
                <>
                  <SelectItem value="Shaker">Shaker</SelectItem>
                  <SelectItem value="Strainer">Strainer</SelectItem>
                  <SelectItem value="Jigger">Jigger</SelectItem>
                  <SelectItem value="Muddler">Muddler</SelectItem>
                  <SelectItem value="Spoon">Spoon</SelectItem>
                  <SelectItem value="Measure">Measure</SelectItem>
                  <SelectItem value="Opener">Opener</SelectItem>
                  <SelectItem value="Pourer">Pourer</SelectItem>
                  <SelectItem value="Mixing Glass">Mixing Glass</SelectItem>
                  <SelectItem value="Bottle">Bottle</SelectItem>
                  <SelectItem value="Crusher">Crusher</SelectItem>
                  <SelectItem value="Tray">Tray</SelectItem>
                  <SelectItem value="Mat">Mat</SelectItem>
                  <SelectItem value="Caddy">Caddy</SelectItem>
                  <SelectItem value="Dispenser">Dispenser</SelectItem>
                  <SelectItem value="Bucket">Bucket</SelectItem>
                  <SelectItem value="Corkscrew">Corkscrew</SelectItem>
                  <SelectItem value="Sealer">Sealer</SelectItem>
                  <SelectItem value="Hanger">Hanger</SelectItem>
                  <SelectItem value="Game">Game</SelectItem>
                  <SelectItem value="Gift Set">Gift Set</SelectItem>
                  <SelectItem value="Cleaning Tool">Cleaning Tool</SelectItem>
                </>
              )}
              {/* Add other category types as needed */}
            </SelectContent>
          </Select>
        </div>
      )
    }

    // Default text input
    return (
      <div key={fieldName}>
        <Label htmlFor={fieldName}>{fieldName}</Label>
        <Input
          id={fieldName}
          value={value as string}
          onChange={(e) => handleInputChange(fieldName, e.target.value)}
          placeholder={`Enter ${fieldName.toLowerCase()}`}
          required={['Product Name', 'Price', 'Description'].includes(fieldName)}
        />
      </div>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Edit Product</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {productType === 'unified' ? 'Unified Product' : 'Legacy Product'}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/supplier/products')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <MultipleMediaUpload
              onImagesChange={handleImagesChange}
              onVideosChange={handleVideosChange}
              currentImages={formData.images}
              currentVideos={formData.videos}
              label="Product Media"
              maxImages={5}
              maxVideos={3}
              required
            />
          </div>

          {/* Dynamic Fields */}
          {selectedSubcategory && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedSubcategory.formFields
                  .filter((field: string) => !['Product Name', 'Brand', 'Price', 'Product Image', 'Description'].includes(field))
                  .map((field: string) => renderField(field))
                }
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/supplier/products')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Product
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 