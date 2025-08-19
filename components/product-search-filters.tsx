'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { PRODUCT_CATEGORIES } from '@/utils/constant/product-categories'
import { cn } from '@/lib/utils'

interface ProductFilters {
  search: string
  category: string
  subcategory: string
  minPrice: string
  maxPrice: string
  brand: string
  sortBy: string
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'name-a-z', label: 'Name: A to Z' },
  { value: 'name-z-a', label: 'Name: Z to A' },
]

export default function ProductSearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState<ProductFilters>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    brand: searchParams.get('brand') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
  })

  const [showFilters, setShowFilters] = useState(false)
  const [availableBrands, setAvailableBrands] = useState<string[]>([])
  const [availableSubcategories, setAvailableSubcategories] = useState<Array<{id: string, name: string}>>([])

  // Get available brands and subcategories based on selected category
  useEffect(() => {
    const fetchBrandsAndSubcategories = async () => {
      try {
        const params = new URLSearchParams()
        if (filters.category) {
          params.append('category', filters.category)
        }
        
        const response = await fetch(`/api/products/filters?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setAvailableBrands(data.brands || [])
          setAvailableSubcategories(data.subcategories || [])
        }
      } catch (error) {
        console.error('Error fetching filters data:', error)
      }
    }

    fetchBrandsAndSubcategories()
  }, [filters.category])

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    
    // Update URL with new filters
    const params = new URLSearchParams()
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })
    
    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      subcategory: '',
      minPrice: '',
      maxPrice: '',
      brand: '',
      sortBy: 'newest',
    }
    setFilters(clearedFilters)
    router.push('/products')
  }

  const hasActiveFilters = filters.search || filters.category || filters.subcategory || 
                          filters.minPrice || filters.maxPrice || filters.brand || filters.sortBy !== 'newest'

  return (
    <div className="bg-white border rounded-lg shadow-sm mb-6">
      {/* Search Bar */}
      <div className="p-4 border-b">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products by name, brand, or description..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-4 border-t bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <Label className="text-sm font-medium">Category</Label>
                             <Select
                 value={filters.category || "all"}
                 onValueChange={(value) => updateFilters({ category: value === "all" ? "" : value, subcategory: '' })}
               >
                 <SelectTrigger className="mt-1">
                   <SelectValue placeholder="All Categories" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Categories</SelectItem>
                   {PRODUCT_CATEGORIES.map((category) => (
                     <SelectItem key={category.name} value={category.name}>
                       {category.name}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
            </div>

            {/* Subcategory Filter */}
            <div>
              <Label className="text-sm font-medium">Subcategory</Label>
                             <Select
                 value={filters.subcategory || "all"}
                 onValueChange={(value) => updateFilters({ subcategory: value === "all" ? "" : value })}
                 disabled={!filters.category}
               >
                 <SelectTrigger className="mt-1">
                   <SelectValue placeholder={filters.category ? "All Subcategories" : "Select Category First"} />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Subcategories</SelectItem>
                   {availableSubcategories.map((sub) => (
                     <SelectItem key={sub.id} value={sub.id}>
                       {sub.name}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
            </div>

            {/* Brand Filter */}
            <div>
              <Label className="text-sm font-medium">Brand</Label>
                             <Select
                 value={filters.brand || "all"}
                 onValueChange={(value) => updateFilters({ brand: value === "all" ? "" : value })}
               >
                 <SelectTrigger className="mt-1">
                   <SelectValue placeholder="All Brands" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Brands</SelectItem>
                   {availableBrands.map((brand) => (
                     <SelectItem key={brand} value={brand}>
                       {brand}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
            </div>

            {/* Sort By */}
            <div>
              <Label className="text-sm font-medium">Sort By</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => updateFilters({ sortBy: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price Range */}
          <div className="mt-4">
            <Label className="text-sm font-medium">Price Range (₹)</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => updateFilters({ minPrice: e.target.value })}
                className="flex-1"
              />
              <span className="flex items-center text-gray-500">to</span>
              <Input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                {filters.search && (
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    Search: &quot;{filters.search}&quot;
                    <button
                      onClick={() => updateFilters({ search: '' })}
                      className="ml-1 hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {filters.category && (
                  <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    Category: {filters.category}
                    <button
                      onClick={() => updateFilters({ category: '', subcategory: '' })}
                      className="ml-1 hover:text-green-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {filters.subcategory && (
                  <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    Subcategory: {availableSubcategories.find(s => s.id === filters.subcategory)?.name}
                    <button
                      onClick={() => updateFilters({ subcategory: '' })}
                      className="ml-1 hover:text-green-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {filters.brand && (
                  <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                    Brand: {filters.brand}
                    <button
                      onClick={() => updateFilters({ brand: '' })}
                      className="ml-1 hover:text-purple-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <div className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm">
                    Price: ₹{filters.minPrice || '0'} - ₹{filters.maxPrice || '∞'}
                    <button
                      onClick={() => updateFilters({ minPrice: '', maxPrice: '' })}
                      className="ml-1 hover:text-orange-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {filters.sortBy !== 'newest' && (
                  <div className="flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                    Sort: {SORT_OPTIONS.find(s => s.value === filters.sortBy)?.label}
                    <button
                      onClick={() => updateFilters({ sortBy: 'newest' })}
                      className="ml-1 hover:text-gray-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 