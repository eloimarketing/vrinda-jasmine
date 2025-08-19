import MaxWidthWrapper from '@/components/max-width-wrapper'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, User, Shield, Settings, Edit, Key, Bell, Lock } from 'lucide-react'
import prisma from '@/lib/prisma/prisma'

export default async function AdminProfilePage() {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/')
  }

  // Get admin user details
  const adminUser = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  if (!adminUser) {
    redirect('/')
  }

  const profileSections = [
    {
      title: 'Personal Information',
      description: 'Your basic profile details',
      icon: User,
      items: [
        { label: 'Full Name', value: `${adminUser.firstName} ${adminUser.lastName}` },
        { label: 'Email', value: adminUser.email },
        { label: 'Phone Number', value: adminUser.phoneNumber },
        { label: 'Role', value: adminUser.role, badge: true },
        { label: 'Member Since', value: new Date(adminUser.createdAt).toLocaleDateString() }
      ]
    },
    {
      title: 'Account Security',
      description: 'Security and authentication settings',
      icon: Lock,
      items: [
        { label: 'Password', value: 'Last changed recently', action: 'Change Password' },
        { label: 'Two-Factor Auth', value: 'Not enabled', action: 'Enable 2FA' },
        { label: 'Login Sessions', value: 'Active sessions', action: 'View Sessions' }
      ]
    },
    {
      title: 'Admin Permissions',
      description: 'Your administrative privileges',
      icon: Shield,
      items: [
        { label: 'User Management', value: 'Full access', badge: true, badgeVariant: 'default' },
        { label: 'Product Approval', value: 'Full access', badge: true, badgeVariant: 'default' },
        { label: 'System Settings', value: 'Full access', badge: true, badgeVariant: 'default' },
        { label: 'Platform Analytics', value: 'Full access', badge: true, badgeVariant: 'default' }
      ]
    }
  ]

  return (
    <MaxWidthWrapper className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
            <p className="text-gray-600">Manage your administrative account</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-purple-600" />
          <Badge variant="default">Administrator</Badge>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {adminUser.firstName} {adminUser.lastName}
            </h3>
            <p className="text-gray-600 mb-4">{adminUser.email}</p>
            <Badge variant="default" className="mb-4">
              <Shield className="w-4 h-4 mr-1" />
              Administrator
            </Badge>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Member since {new Date(adminUser.createdAt).toLocaleDateString()}</p>
              <p>Last updated {new Date(adminUser.updatedAt).toLocaleDateString()}</p>
            </div>
            <Button className="w-full mt-4">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
            <CardDescription>
              Your administrative activity and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">∞</div>
                <div className="text-sm text-gray-600">Full Access</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-gray-600">System Access</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">100%</div>
                <div className="text-sm text-gray-600">Permissions</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">Admin</div>
                <div className="text-sm text-gray-600">Role Level</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Sections */}
      <div className="space-y-6">
        {profileSections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <section.icon className="h-5 w-5 text-purple-600" />
                {section.title}
              </CardTitle>
              <CardDescription>
                {section.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div>
                      <span className="text-sm font-medium text-gray-600">{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {item.badge ? (
                        <Badge variant={item.badgeVariant || 'outline'}>
                          {item.value}
                        </Badge>
                      ) : (
                        <span className="text-sm">{item.value}</span>
                      )}
                      {item.action && (
                        <Button size="sm" variant="outline">
                          {item.action}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                <Key className="w-5 h-5 mb-2 text-purple-600" />
                <span className="font-medium">Change Password</span>
                <span className="text-xs text-gray-600">Update your password</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                <Bell className="w-5 h-5 mb-2 text-blue-600" />
                <span className="font-medium">Notification Settings</span>
                <span className="text-xs text-gray-600">Configure alerts</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                <Settings className="w-5 h-5 mb-2 text-green-600" />
                <span className="font-medium">Platform Settings</span>
                <span className="text-xs text-gray-600">Manage system settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MaxWidthWrapper>
  )
}
