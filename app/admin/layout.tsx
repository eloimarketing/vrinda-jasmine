import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import SubLayout from './sub-layout'

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  const user = session?.user

  if (!user || user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SubLayout />
      <main className="ml-0 sm:ml-[20%] pt-20">
        {children}
      </main>
    </div>
  )
} 