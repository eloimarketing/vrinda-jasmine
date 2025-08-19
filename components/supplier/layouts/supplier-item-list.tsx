'use client'

import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { getSession } from 'next-auth/react'

export default function SupplierItemList({ items }: { items: any[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <img src="/assets/icons/no-broker.png" alt="No items" className="mx-auto w-32 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No items</h2>
        <p className="text-gray-500 mb-4">You haven&apos;t added any items yet. Start by adding your first item to showcase your products!</p>
        <Link href="/supplier/item/create">
          <button className="mt-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium shadow">
            Add Your First Item
          </button>
        </Link>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {items.map(item => (
        <div key={item.id} className="border rounded-lg p-4 shadow">
          <h2 className="font-bold text-lg mb-2">{item.name}</h2>
          <p className="text-gray-600 mb-1">Category: {item.itemCategory || 'N/A'}</p>
          <p className="text-gray-600 mb-1">Price: ₹{item.price}</p>
          <p className="text-gray-600 mb-1">Stock: {item.stock}</p>
          <p className="text-xs text-gray-400 mt-2">ID: {item.id}</p>
        </div>
      ))}
    </div>
  )
} 