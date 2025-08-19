'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function SignOutBtn({
	variant = 'outline',
}: {
	variant?: 'link' | 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost'
}) {
	return (
		<Button variant={variant} onClick={() => signOut({ redirectTo: '/', redirect: true })}>
			Sign Out
		</Button>
	)
}
