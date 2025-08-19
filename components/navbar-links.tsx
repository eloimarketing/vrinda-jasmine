'use client'

import Link from 'next/link'
import { Button, buttonVariants } from './ui/button'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { User } from 'next-auth'
import {
	AlignJustify,
	ShoppingCart,
	Home,
	Building2,
	Phone,
	Settings,
	User as UserIcon,
	ChevronRight,
	Building,
} from 'lucide-react'
import SignOutBtn from './common/map/sign-out-btn'
import { Cart } from '@prisma/client'
import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from './ui/sheet'
import { Separator } from './ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import Image from 'next/image'
import MaxWidthWrapper from './max-width-wrapper'

export default function NavbarLinks({ user, cart }: { user: User | undefined; cart: Cart[] }) {
	const pathname = usePathname()
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	const userFields = [
		{ name: 'Home', href: '/', icon: Home, visible: true },
		{ name: 'Products', href: '/products', icon: Building2, visible: true },
		{ name: 'Contact Us', href: '/contact', icon: Phone, visible: true },
		{ name: 'About Us', href: '/about', icon: Settings, visible: true },
	]

	const vendorFields = [
		{ name: 'Home', href: '/', icon: Home, visible: true },
		{ name: 'Add Product', href: '/supplier/create-product', icon: Building, visible: true },
		{ name: 'My Products', href: '/supplier/products', icon: Building2, visible: true },
		{ name: 'Profile', href: '/supplier/profile', icon: UserIcon, visible: false },
		{ name: 'Contact Us', href: '/contact', icon: Phone, visible: true },
		{ name: 'About Us', href: '/about', icon: Settings, visible: true },
	]

	const adminFields = [
		{ name: 'Home', href: '/', icon: Home, visible: true },
		{ name: 'All Products', href: '/admin/products', icon: Building2, visible: true },
		{ name: 'Contact Us', href: '/contact', icon: Phone, visible: true },
		{ name: 'About Us', href: '/about', icon: Settings, visible: true },
	]

	const getFieldsForUser = () => {
		if (user?.role === 'CUSTOMER') return userFields
		if (user?.role === 'SUPPLIER') return vendorFields
		if (user?.role === 'ADMIN') return adminFields
		return userFields
	}

	const getVisibleFieldsForDesktop = () => {
		const fields = getFieldsForUser()
		return fields.filter(field => field.visible)
	}

	const getUserDisplayName = () => {
		if (!user) return 'Guest'
		return user.name || user.email || 'User'
	}

	const getUserInitials = () => {
		const name = getUserDisplayName()
		return name
			.split(' ')
			.map(n => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2)
	}

	const closeMobileMenu = () => setIsMobileMenuOpen(false)

	return (
		<MaxWidthWrapper className="flex justify-between items-center overflow-hidden min-h-20">
			<Link
				href={
					user?.role === 'ADMIN'
						? '/admin'
						: user?.role === 'SUPPLIER'
						? '/supplier'
						: user?.role === 'CUSTOMER'
						? '/user'
						: '/'
				}
				className="flex items-center gap-2 h-20"
			>
				<Image src={'/assets/logo.jpeg'} alt="logo" width={1536} height={1024} className="h-20 w-auto object-contain" />
			</Link>

			<div className="mx-auto hidden sm:block">
				{/* Desktop navigation - only show visible fields */}
				{getVisibleFieldsForDesktop().map((field, index) => (
					<Link
						key={index}
						href={field.href}
						className={cn(buttonVariants({ variant: 'ghost' }), pathname === field.href && 'underline underline-offset-4')}>
						{field.name}
					</Link>
				))}
			</div>

			<div className="flex items-center gap-2">
				{/* Mobile menu and cart - Always show on mobile */}
				<div className="flex items-center gap-2 sm:hidden">
					{/* Cart for buyers */}
					{user?.role === 'CUSTOMER' && (
						<Link href={'/user/cart'} className={cn('relative', buttonVariants({ variant: 'outline', size: 'icon' }))}>
							<ShoppingCart />
							{cart.length > 0 && (
								<div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
									{cart.length}
								</div>
							)}
						</Link>
					)}

					{/* Quick action for suppliers */}
					{user?.role === 'SUPPLIER' && (
						<Link href={'/supplier/create-product'} className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}>
							<Building2 className="h-4 w-4" />
						</Link>
					)}

					{/* Mobile hamburger menu - Always present */}

					<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
						<SheetTrigger asChild>
							<Button
								// onClick={e => setIsMobileMenuOpen(e)}
								variant={'outline'}
								size={'icon'}
								className="hover:bg-gray-100 transition-colors">
								<AlignJustify className="h-5 w-5" />
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-80 p-0 flex flex-col">
							{/* Header Section */}
							<SheetHeader className="p-6 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
								<div className="flex items-center justify-between">
									<SheetTitle className="text-xl font-semibold text-gray-900">Menu</SheetTitle>
								</div>

								{/* User Profile Section */}
								<div className="flex items-center gap-3 mt-4">
									<Avatar className="h-12 w-12 border-2 border-white shadow-sm">
										<AvatarImage src={user?.image || ''} alt={getUserDisplayName()} />
										<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
											{getUserInitials()}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 min-w-0">
										<p className="font-semibold text-gray-900 truncate">{getUserDisplayName()}</p>
										<p className="text-sm text-gray-600 capitalize">{user?.role?.toLowerCase() || 'Guest'}</p>
									</div>
								</div>
							</SheetHeader>

							{/* Navigation Links - show all fields in mobile sidebar */}
							<div className="flex-1 px-6 py-4 space-y-2">
								<div className="space-y-1">
									{getFieldsForUser().map((field, index) => {
										const Icon = field.icon
										const isActive = pathname === field.href

										return (
											<Link
												key={index}
												href={field.href}
												onClick={closeMobileMenu}
												className={cn(
													'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group',
													isActive
														? 'bg-blue-50 text-blue-700 border border-blue-200'
														: 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
												)}>
												<Icon
													className={cn(
														'h-5 w-5 transition-colors',
														isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
													)}
												/>
												<span className="font-medium flex-1">{field.name}</span>
												<ChevronRight
													className={cn(
														'h-4 w-4 transition-all duration-200',
														isActive
															? 'text-blue-500 transform translate-x-1'
															: 'text-gray-400 group-hover:text-gray-600 group-hover:transform group-hover:translate-x-1'
													)}
												/>
											</Link>
										)
									})}
								</div>

								<Separator className="my-4" />

								{/* Role-specific Actions */}
								<div className="space-y-2">
									{(!user || user.role === 'SUPPLIER') && (
										<Link
											href={'/supplier/create-product'}
											onClick={closeMobileMenu}
											className="flex items-center gap-3 px-3 py-3 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors">
											<Building2 className="h-5 w-5 text-green-600" />
											<span className="font-medium">List Your Product</span>
										</Link>
									)}

									{user?.role === 'ADMIN' && (
										<Link
											href={'/admin/products'}
											onClick={closeMobileMenu}
											className="flex items-center gap-3 px-3 py-3 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors">
											<Settings className="h-5 w-5 text-purple-600" />
											<span className="font-medium">Manage Products</span>
										</Link>
									)}

									{user?.role === 'CUSTOMER' && (
										<Link
											href={'/user/cart'}
											onClick={closeMobileMenu}
											className="flex items-center gap-3 px-3 py-3 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors relative">
											<ShoppingCart className="h-5 w-5 text-orange-600" />
											<span className="font-medium flex-1">Shopping Cart</span>
											{cart.length > 0 && (
												<div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
													{cart.length}
												</div>
											)}
										</Link>
									)}
								</div>
							</div>

							{/* Footer Section */}
							<div className="p-6 pt-4 border-t bg-gray-50">
								{!user ? (
									<Link
										href={'/auth/login'}
										onClick={closeMobileMenu}
										className={cn(buttonVariants({ variant: 'default' }), 'w-full justify-center gap-2')}>
										<UserIcon className="h-4 w-4" />
										Log In
									</Link>
								) : (
									<div onClick={closeMobileMenu}>
										<SignOutBtn />
									</div>
								)}
							</div>
						</SheetContent>
					</Sheet>
				</div>

				{/* Desktop action buttons */}
				<div className="hidden sm:flex items-center gap-2">
					{(!user || user.role === 'SUPPLIER') && (
						<Link href={'/supplier/create-product'} className={buttonVariants({ variant: 'default' })}>
							List Your Product
						</Link>
					)}

					{user?.role === 'ADMIN' && (
						<Link href={'/admin/products'} className={buttonVariants({ variant: 'default' })}>
							Manage Products
						</Link>
					)}

					{user?.role === 'CUSTOMER' && (
						<div className="relative">
							<Link href={'/user/cart'} className={buttonVariants({ variant: 'outline', size: 'icon' })}>
								<ShoppingCart />
							</Link>
							{cart.length > 0 && (
								<div className="absolute -top-2 -right-2 bg-red-500 text-white border border-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
									{cart.length}
								</div>
							)}
						</div>
					)}

					{!user ? (
						<Link href={'/auth/login'} className={buttonVariants({ variant: 'outline' })}>
							Log In
						</Link>
					) : (
						<SignOutBtn />
					)}
				</div>
			</div>
		</MaxWidthWrapper>
	)
}
