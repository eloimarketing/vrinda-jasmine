'use client'

import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import MaxWidthWrapper from '@/components/max-width-wrapper'
import Link from 'next/link'
import { 
  Package, 
  User, 
  Calendar, 
  Shield, 
  ArrowLeft,
  ShoppingCart,
  Phone,
  Mail,
  Play,
  Image as ImageIcon
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { use } from 'react'

interface ProductDetailPageProps {
  params: Promise<{
    category: string
    id: string
  }>
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  brand?: string
  subcategory?: string
  productImage?: string
  productVideo?: string
  images?: string[]
  videos?: string[]
  isApproved: boolean
  createdAt: string
  owner: {
    firstName: string
    lastName: string
    email: string
    phoneNumber?: string
  }
  attributes: Array<{
    attributeName: string
    attributeValue: string
  }>
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { category, id } = use(params)
  const { data: session } = useSession()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)
  const [allMedia, setAllMedia] = useState<Array<{ type: 'image' | 'video', url: string }>>([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Looking for product with ID:', id)
        console.log('Category from URL:', category)
        
        const response = await fetch(`/api/products/${id}`)
        if (!response.ok) {
          throw new Error('Product not found')
        }
        
        const productData = await response.json()
        console.log('Product found:', productData ? 'Yes' : 'No')
        
        if (productData) {
          console.log('Product category:', productData.category)
          console.log('Product approved:', productData.isApproved)
        }

        if (!productData) {
          console.log('Product not found, returning 404')
          notFound()
        }

        // Convert attributes array to object for easier access
        const attributes = Array.isArray(productData.attributes) 
          ? productData.attributes.reduce((acc: any, attr: any) => {
              acc[attr.attributeName] = attr.attributeValue;
              return acc;
            }, {})
          : productData.attributes || {};

        // Combine all media (images and videos)
        const media = [
          ...((productData as any).images || []).map((url: string) => ({ type: 'image' as const, url })),
          ...((productData as any).videos || []).map((url: string) => ({ type: 'video' as const, url }))
        ]

        // Fallback to legacy single image/video if no multiple media
        if (media.length === 0) {
          if (productData.productImage) {
            media.push({ type: 'image', url: productData.productImage })
          }
          if (productData.productVideo) {
            media.push({ type: 'video', url: productData.productVideo })
          }
        }

        setProduct({ ...productData, attributes })
        setAllMedia(media)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching product:', error)
        notFound()
      }
    }

    fetchProduct()
  }, [id, category])

  if (loading) {
    return (
      <MaxWidthWrapper className="py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </MaxWidthWrapper>
    )
  }

  if (!product) {
    notFound()
  }

  // Format category for display
  const formatCategory = (category: string) => {
    return category.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const displayCategory = formatCategory(product.category)

  // Convert attributes array to object for easier access
  const attributes = Array.isArray(product.attributes) 
    ? product.attributes.reduce((acc: any, attr: any) => {
        acc[attr.attributeName] = attr.attributeValue;
        return acc;
      }, {})
    : product.attributes || {};

  // Determine back button URL based on user role
  const getBackButtonUrl = () => {
    if (session?.user?.role === 'SUPPLIER') {
      return '/supplier/products'
    }
    return '/products'
  }

  return (
    <MaxWidthWrapper className="py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href={getBackButtonUrl()}>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            {session?.user?.role === 'SUPPLIER' ? 'Back to My Products' : 'Back to Products'}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Media Gallery */}
        <div className="space-y-4">
          {allMedia.length > 0 ? (
            <div className="space-y-4">
                             {/* Main Media Display */}
               <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                 {allMedia[selectedMediaIndex].type === 'image' ? (
                   <img 
                     src={allMedia[selectedMediaIndex].url} 
                     alt={product.name}
                     className="w-full h-full object-cover"
                   />
                 ) : (
                   <video 
                     src={allMedia[selectedMediaIndex].url}
                     controls
                     preload="metadata"
                     className="w-full h-full object-cover"
                     poster={allMedia[selectedMediaIndex].url}
                   >
                     Your browser does not support the video tag.
                   </video>
                 )}
               </div>

              {/* Thumbnail Gallery */}
              {allMedia.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {allMedia.map((media, index) => (
                    <div 
                      key={index}
                      className={`aspect-square bg-gray-100 rounded-lg overflow-hidden relative cursor-pointer hover:opacity-80 transition-opacity ${
                        index === selectedMediaIndex ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedMediaIndex(index)}
                    >
                      {media.type === 'image' ? (
                        <img 
                          src={media.url} 
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                                             ) : (
                         <div className="relative w-full h-full">
                           <video 
                             src={media.url}
                             className="w-full h-full object-cover"
                             preload="metadata"
                             muted
                           />
                           <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                             <Play className="w-8 h-8 text-white opacity-80" />
                           </div>
                         </div>
                       )}
                    </div>
                  ))}
                </div>
              )}

              {/* Media Count Badge */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ImageIcon className="w-4 h-4" />
                <span>
                  {(product as any).images?.length || 0} image{((product as any).images?.length || 0) !== 1 ? 's' : ''}, {' '}
                  {(product as any).videos?.length || 0} video{((product as any).videos?.length || 0) !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          ) : (
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              <Package className="w-24 h-24 text-gray-400" />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">{displayCategory}</Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-lg text-gray-600">{product.description}</p>
          </div>

          {/* Price */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-green-600">
                ₹{product.price.toLocaleString()}
              </span>
              <Button size="lg" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Product Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Product Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                {product.brand && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Brand</span>
                    <p className="text-sm">{product.brand}</p>
                  </div>
                )}
                {product.subcategory && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Subcategory</span>
                    <p className="text-sm">{product.subcategory}</p>
                  </div>
                )}
                {/* Dynamic attributes */}
                {Object.entries(attributes).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-sm font-medium text-gray-500">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                    <p className="text-sm">{String(value)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Supplier Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Supplier Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">
                  {product.owner.firstName} {product.owner.lastName}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Mail className="w-4 h-4" />
                  <span>{product.owner.email}</span>
                </div>
                {product.owner.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Phone className="w-4 h-4" />
                    <span>{product.owner.phoneNumber}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Supplier
                </Button>
                <Button variant="outline" className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Supplier
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Product Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Product Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    product.isApproved ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-sm font-medium">
                    {product.isApproved ? 'Approved & Verified' : 'Pending Approval'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Listed on {new Date(product.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MaxWidthWrapper>
  )
} 