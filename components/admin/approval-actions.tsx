'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ApprovalActionsProps {
  productId: string
  category: string
  onActionComplete?: () => void
}

export default function ApprovalActions({ productId, category, onActionComplete }: ApprovalActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)
  const router = useRouter()

  const handleAction = async (actionType: 'approve' | 'reject') => {
    setIsLoading(true)
    setAction(actionType)

    try {
      const response = await fetch('/api/admin/products/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          category,
          action: actionType,
          reason: actionType === 'reject' ? 'Product does not meet quality standards' : undefined
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log(`${actionType} successful:`, result.message)
        
        // Refresh the page or call callback
        if (onActionComplete) {
          onActionComplete()
        } else {
          router.refresh()
        }
      } else {
        const error = await response.json()
        console.error(`${actionType} failed:`, error.error)
        alert(`Failed to ${actionType} product: ${error.error}`)
      }
    } catch (error) {
      console.error(`Error ${actionType}ing product:`, error)
      alert(`Error ${actionType}ing product. Please try again.`)
    } finally {
      setIsLoading(false)
      setAction(null)
    }
  }

  return (
    <div className="flex gap-3 pt-4 border-t">
      <Button 
        size="sm" 
        className="flex-1 bg-green-600 hover:bg-green-700"
        onClick={() => handleAction('approve')}
        disabled={isLoading}
      >
        {isLoading && action === 'approve' ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
        ) : (
          <CheckCircle className="w-4 h-4 mr-1" />
        )}
        {isLoading && action === 'approve' ? 'Approving...' : 'Approve'}
      </Button>
      
      <Button 
        size="sm" 
        variant="outline" 
        className="text-red-600 hover:text-red-700"
        onClick={() => handleAction('reject')}
        disabled={isLoading}
      >
        {isLoading && action === 'reject' ? (
          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-1" />
        ) : (
          <XCircle className="w-4 h-4 mr-1" />
        )}
        {isLoading && action === 'reject' ? 'Rejecting...' : 'Reject'}
      </Button>
    </div>
  )
} 