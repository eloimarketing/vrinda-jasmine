import MaxWidthWrapper from '@/components/max-width-wrapper'
import { auth } from '@/auth'
import prisma from '@/lib/prisma/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react'

export default async function CartPage() {
  const session = await auth()
  if (!session || session.user?.role !== 'CUSTOMER') {
    return <div className="text-center py-12">Unauthorized</div>
  }

  // Get user's cart items
  const cartItems = await prisma.cart.findMany({
    where: { userId: session.user.id }
  })

  const cartCount = cartItems.length

  return (
    <MaxWidthWrapper className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/user">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600">Review your selected items</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ShoppingCart className="w-6 h-6 text-gray-600" />
          <span className="text-lg font-medium">{cartCount} items</span>
        </div>
      </div>

      {cartCount === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
            <Link href="/products">
              <Button>
                Browse Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">Product</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Product #{item.itemId}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">Item ID: {item.itemId}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">₹0.00</p>
                        <p className="text-sm text-gray-600">Price TBD</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cart Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Cart Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹0.00</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₹0.00</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <Button className="w-full" disabled>
                  Proceed to Checkout
                </Button>
                <Link href="/products">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </MaxWidthWrapper>
  )
} 