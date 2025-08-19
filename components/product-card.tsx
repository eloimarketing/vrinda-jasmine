import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { ShoppingCart, Eye } from 'lucide-react'

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    image?: string | null
    images?: string[]
    videos?: string[]
    description: string
    brand?: string | null
    category: string
    attributes: Record<string, any>
    owner: {
      firstName: string
      lastName: string
    }
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatCategory = (category: string) => {
    return category.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          {(product.images && product.images.length > 0) ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-200"
            />
          ) : product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">No image</span>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-xs">
              {formatCategory(product.category)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2 leading-tight">
            {product.name}
          </h3>
          
          {product.brand && (
            <p className="text-sm text-gray-600">
              Brand: {product.brand}
            </p>
          )}
          
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
          
          <div className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </div>
          
          <p className="text-xs text-gray-500">
            Sold by: {product.owner.firstName} {product.owner.lastName}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Button asChild className="flex-1" size="sm">
            <Link href={`/products/${product.category.toLowerCase()}/${product.id}`}>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-shrink-0">
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
} 