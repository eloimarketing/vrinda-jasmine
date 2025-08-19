import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  Users, 
  Package, 
  Settings, 
  Shield,
  Building2,
  UserCheck
} from 'lucide-react'
import prisma from '@/lib/prisma/prisma'

export default async function AdminDashboard() {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/')
  }

  // Get basic statistics
  const totalUsers = await prisma.user.count()
  const totalSuppliers = await prisma.user.count({
    where: { role: 'SUPPLIER' }
  })
  const totalCustomers = await prisma.user.count({
    where: { role: 'CUSTOMER' }
  })

  // Get product counts from all subcategory tables
  const productTables = [
    'glassDoorRefrigeration',
    'iceCreamFreezers',
    'drinksFridgesBottleCoolers',
    'serveOverCounters',
    'multideckDisplays',
    'uprightUndercounterFridges',
    'freezersChestAndUpright',
    'rangeCookersInductionCookersHobs',
    'ovens',
    'gnPansAccessories',
    'cookware',
    'beverageMachines',
    'blendersMixers',
    'slushMachines',
    'allAppliances',
    'generalEquipment',
    'generalConsumables',
    'allFurniture',
    'dishwashersGlasswashers',
    'hygieneAccessories',
    'laundryMachines',
    'allGradedProducts'
  ]

  let totalProducts = 0
  for (const table of productTables) {
    try {
      const count = await (prisma as Record<string, any>)[table].count()
      totalProducts += count
    } catch (error) {
      console.log(`Error counting ${table}:`, error)
    }
  }

  // const totalCartItems = await prisma.cart.count()

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {session.user.firstName} {session.user.lastName}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuppliers}</div>
            <p className="text-xs text-muted-foreground">
              Equipment suppliers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Hospitality businesses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Listed equipment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>
              Manage all users, suppliers, and customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/admin/users">
                <Button className="w-full" variant="outline">
                  View All Users
                </Button>
              </Link>
              <Link href="/admin/suppliers">
                <Button className="w-full" variant="outline">
                  Manage Suppliers
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Management
            </CardTitle>
            <CardDescription>
              Review and manage all products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/admin/products">
                <Button className="w-full" variant="outline">
                  View All Products
                </Button>
              </Link>
              <Link href="/admin/products/pending">
                <Button className="w-full" variant="outline">
                  Pending Approvals
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Platform Settings
            </CardTitle>
            <CardDescription>
              Configure platform settings and policies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/admin/settings">
                <Button className="w-full" variant="outline">
                  General Settings
                </Button>
              </Link>
              <Link href="/admin/profile">
                <Button className="w-full" variant="outline">
                  Admin Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest platform activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">New supplier registered</p>
                    <p className="text-sm text-gray-600">2 minutes ago</p>
                  </div>
                </div>
                <Badge variant="secondary">New</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Product added to catalog</p>
                    <p className="text-sm text-gray-600">15 minutes ago</p>
                  </div>
                </div>
                <Badge variant="outline">Product</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">New customer signup</p>
                    <p className="text-sm text-gray-600">1 hour ago</p>
                  </div>
                </div>
                <Badge variant="secondary">Customer</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 