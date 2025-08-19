'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Settings, 
  User,
  Building2,
  ShoppingCart,
  Shield
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Suppliers',
    href: '/admin/suppliers',
    icon: Building2,
  },
  {
    name: 'Products',
    href: '/admin/products',
    icon: Package,
  },
  {
    name: 'Pending Approvals',
    href: '/admin/products/pending',
    icon: ShoppingCart,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
  {
    name: 'Profile',
    href: '/admin/profile',
    icon: User,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-purple-100 text-purple-900 border-r-2 border-purple-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </div>
      
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-purple-500 mr-2" />
          <div>
            <p className="text-sm font-medium text-gray-900">Admin Panel</p>
            <p className="text-xs text-gray-500">Full access</p>
          </div>
        </div>
      </div>
    </div>
  )
} 