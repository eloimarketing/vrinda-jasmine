import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const session = await auth()
	const user = session?.user

	if (!user || user.role !== 'CUSTOMER') {
		redirect('/')
	}

	return <>{children}</>
}
