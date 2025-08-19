import { LoginForm } from '@/components/auth/login-form'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default async function LoginPage() {
	const session = await auth()
	const user = session?.user

	if (user) {
		// Role-based redirection for already logged in users
		if (user.role === 'ADMIN') {
			redirect('/admin')
		} else if (user.role === 'SUPPLIER') {
			redirect('/supplier')
		} else if (user.role === 'CUSTOMER') {
			redirect('/user')
		} else {
			redirect('/')
		}
	}

	return (
		<div className="h-screen flex w-full absolute top-0 z-50 bg-white">
			<div className="w-full md:w-1/2 h-full relative">
				<Link href={'/'} className="flex items-center gap-2 sm:pl-10">
					<Image src={'/assets/logo.jpeg'} alt="logo" width={1536} height={1024} className="w-28" />
				</Link>

				<div className="w-full flex justify-center items-center absolute top-1/2 -translate-y-1/2">
					<div className="w-full px-4 sm:w-[80%] lg:w-[70%]">
						<LoginForm />
					</div>
				</div>
			</div>
			<div className="hidden md:block w-1/2">
				<Image
					src="https://ui.shadcn.com/placeholder.svg"
					alt="placeholder"
					width={1200}
					height={1200}
					className="w-full h-full object-cover"
				/>
			</div>
		</div>
	)
}
