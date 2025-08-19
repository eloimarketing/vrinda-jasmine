import MaxWidthWrapper from '@/components/max-width-wrapper'
import { auth } from '@/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar } from 'lucide-react'

export default async function ProfilePage() {
  const session = await auth()
  if (!session || session.user?.role !== 'CUSTOMER') {
    return <div className="text-center py-12">Unauthorized</div>
  }

  const user = session.user

  return (
    <MaxWidthWrapper className="py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/user">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Email Address</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="secondary">{user.role}</Badge>
                <span className="text-sm text-gray-600">Account Type</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Edit Profile Information
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Notification Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Privacy Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/products">
                <Button variant="outline" className="w-full justify-start">
                  Browse Products
                </Button>
              </Link>
              <Link href="/user/cart">
                <Button variant="outline" className="w-full justify-start">
                  View Cart
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="w-full justify-start">
                  Contact Support
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Member Since:</span>
                  <span className="text-sm">Recently</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Login:</span>
                  <span className="text-sm">Today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MaxWidthWrapper>
  )
} 