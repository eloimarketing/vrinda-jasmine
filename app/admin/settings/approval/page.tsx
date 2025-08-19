import MaxWidthWrapper from '@/components/max-width-wrapper'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Clock, Save, Settings, AlertTriangle } from 'lucide-react'

export default async function AdminApprovalSettingsPage() {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <MaxWidthWrapper className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin/settings">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Settings
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Approval Workflow</h1>
            <p className="text-gray-600">Configure product approval process</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-6 h-6 text-gray-600" />
          <Badge variant="outline">Approval Settings</Badge>
        </div>
      </div>

      {/* Approval Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Approval Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              General Settings
            </CardTitle>
            <CardDescription>
              Basic approval workflow configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auto-approval for verified suppliers
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option value="disabled">Disabled</option>
                <option value="enabled">Enabled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum approval time (hours)
              </label>
              <input
                type="number"
                defaultValue="48"
                min="1"
                max="168"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Require admin approval for
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  New suppliers
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  High-value products (&gt;£10,000)
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  Products with custom specifications
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  All products
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure approval notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email notifications
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  New product submissions
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  Approval decisions
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  Rejection reasons
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Daily summary
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin notification recipients
              </label>
              <textarea
                defaultValue="admin@hospitalityequipment.com"
                rows={3}
                placeholder="Enter email addresses, one per line"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slack webhook URL (optional)
              </label>
              <input
                type="url"
                placeholder="https://hooks.slack.com/services/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quality Standards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Quality Standards
            </CardTitle>
            <CardDescription>
              Set product quality requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum product images required
              </label>
              <input
                type="number"
                defaultValue="1"
                min="0"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required product information
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  Product name
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  Brand
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  Model number
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  Detailed description
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  Technical specifications
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  Warranty information
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price validation
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  Flag unusually low prices
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  Flag unusually high prices
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Require price justification
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approval Queue Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Queue Management
            </CardTitle>
            <CardDescription>
              Manage approval queue settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Queue priority rules
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option value="fifo">First in, first out</option>
                <option value="priority">Priority based</option>
                <option value="category">Category based</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auto-reject after (days)
              </label>
              <input
                type="number"
                defaultValue="7"
                min="1"
                max="30"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch approval limit
              </label>
              <input
                type="number"
                defaultValue="10"
                min="1"
                max="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Queue display settings
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  Show supplier information
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  Show submission date
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  Show product preview
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Show previous rejections
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <Button className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Approval Settings
        </Button>
      </div>
    </MaxWidthWrapper>
  )
} 