import MaxWidthWrapper from '@/components/max-width-wrapper'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Settings, Shield, Users, Package, Bell, Database, Globe } from 'lucide-react'

export default async function AdminSettingsPage() {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/')
  }

  const settingsCategories = [
    {
      title: 'Platform Settings',
      description: 'General platform configuration and policies',
      icon: Globe,
      items: [
        { name: 'Site Configuration', description: 'Website settings and branding', href: '/admin/settings/site' },
        { name: 'Email Templates', description: 'Customize email notifications', href: '/admin/settings/emails' },
        { name: 'Payment Settings', description: 'Payment gateway configuration', href: '/admin/settings/payments' },
        { name: 'Terms & Conditions', description: 'Legal documents and policies', href: '/admin/settings/legal' }
      ]
    },
    {
      title: 'User Management',
      description: 'User roles, permissions, and account settings',
      icon: Users,
      items: [
        { name: 'Role Permissions', description: 'Configure user role permissions', href: '/admin/settings/roles' },
        { name: 'Account Verification', description: 'Email and phone verification settings', href: '/admin/settings/verification' },
        { name: 'User Limits', description: 'Set limits for users and suppliers', href: '/admin/settings/limits' }
      ]
    },
    {
      title: 'Product Management',
      description: 'Product approval and catalog settings',
      icon: Package,
      items: [
        { name: 'Approval Workflow', description: 'Configure product approval process', href: '/admin/settings/approval' },
        { name: 'Category Management', description: 'Manage product categories', href: '/admin/settings/categories' },
        { name: 'Quality Standards', description: 'Set product quality requirements', href: '/admin/settings/quality' }
      ]
    },
    {
      title: 'Security & Access',
      description: 'Security settings and access control',
      icon: Shield,
      items: [
        { name: 'Authentication', description: 'Login and security settings', href: '/admin/settings/auth' },
        { name: 'API Access', description: 'Manage API keys and access', href: '/admin/settings/api' },
        { name: 'Audit Logs', description: 'View system activity logs', href: '/admin/settings/logs' }
      ]
    },
    {
      title: 'Notifications',
      description: 'System notifications and alerts',
      icon: Bell,
      items: [
        { name: 'Email Notifications', description: 'Configure email alerts', href: '/admin/settings/notifications' },
        { name: 'Admin Alerts', description: 'Set up admin notification rules', href: '/admin/settings/alerts' }
      ]
    },
    {
      title: 'System',
      description: 'Database and system maintenance',
      icon: Database,
      items: [
        { name: 'Database Backup', description: 'Manage database backups', href: '/admin/settings/backup' },
        { name: 'System Health', description: 'Monitor system performance', href: '/admin/settings/health' },
        { name: 'Maintenance Mode', description: 'Enable maintenance mode', href: '/admin/settings/maintenance' }
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
            <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
            <p className="text-gray-600">Configure platform settings and policies</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Settings className="w-6 h-6 text-gray-600" />
          <Badge variant="outline">Admin Only</Badge>
        </div>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsCategories.map((category) => (
          <Card key={category.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <category.icon className="h-5 w-5 text-purple-600" />
                {category.title}
              </CardTitle>
              <CardDescription>
                {category.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.items.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                      <div>
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </div>
                      <Button size="sm" variant="ghost">
                        Configure
                      </Button>
                    </div>
                  </Link>
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
                <Shield className="w-5 h-5 mb-2 text-purple-600" />
                <span className="font-medium">System Backup</span>
                <span className="text-xs text-gray-600">Create database backup</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                <Users className="w-5 h-5 mb-2 text-blue-600" />
                <span className="font-medium">User Audit</span>
                <span className="text-xs text-gray-600">Review user activities</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                <Package className="w-5 h-5 mb-2 text-green-600" />
                <span className="font-medium">Product Review</span>
                <span className="text-xs text-gray-600">Review pending products</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MaxWidthWrapper>
  )
} 