import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
	Utensils, 
	Sofa, 
	Droplets, 
	Monitor, 
	Shield, 
	Wrench, 
	ArrowRight, 
	Users,
	Package,
	Shield as ShieldIcon,
	Truck
} from 'lucide-react'
import { auth } from '@/auth'

export default async function HomePage() {
	const session = await auth()
	const user = session?.user

	const categories = [
		{
			name: 'Refrigeration',
			icon: Utensils,
			description: 'Commercial refrigeration equipment',
			color: 'bg-orange-100 text-orange-600',
			subcategories: 7
		},
		{
			name: 'Cooking Appliances',
			icon: Utensils,
			description: 'Professional cooking equipment',
			color: 'bg-red-100 text-red-600',
			subcategories: 7
		},
		{
			name: 'Appliances',
			icon: Monitor,
			description: 'General kitchen appliances',
			color: 'bg-indigo-100 text-indigo-600',
			subcategories: 1
		},
		{
			name: 'Kitchenware & Equipment',
			icon: Wrench,
			description: 'Tools and equipment',
			color: 'bg-gray-100 text-gray-600',
			subcategories: 1
		},
		{
			name: 'Consumables',
			icon: Droplets,
			description: 'Kitchen consumables',
			color: 'bg-green-100 text-green-600',
			subcategories: 1
		},
		{
			name: 'Kitchen Furniture',
			icon: Sofa,
			description: 'Commercial furniture',
			color: 'bg-blue-100 text-blue-600',
			subcategories: 1
		},
		{
			name: 'Cleaning',
			icon: Droplets,
			description: 'Cleaning equipment',
			color: 'bg-cyan-100 text-cyan-600',
			subcategories: 3
		},
		{
			name: 'Graded Equipment',
			icon: Shield,
			description: 'Used and graded equipment',
			color: 'bg-purple-100 text-purple-600',
			subcategories: 1
		}
	]

	const features = [
		{
			icon: Users,
			title: 'B2B Marketplace',
			description: 'Connect with verified suppliers and buyers in the hospitality industry'
		},
		{
			icon: Package,
			title: 'Wide Product Range',
			description: 'Thousands of products across 8 major categories and 22 subcategories'
		},
		{
			icon: ShieldIcon,
			title: 'Quality Assurance',
			description: 'All products are verified and quality-checked before listing'
		},
		{
			icon: Truck,
			title: 'Reliable Delivery',
			description: 'Fast and secure delivery across the country'
		}
	]

	return (
		<div className="min-h-screen bg-white">
			{/* Hero Section */}
			<section className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white">
				<div className="container mx-auto px-4 py-20">
					<div className="max-w-4xl mx-auto text-center">
						<h1 className="text-5xl font-bold mb-6">
							Vrinda Jasmine
						</h1>
						<p className="text-xl mb-8 text-purple-100">
							Your Premier B2B Marketplace for Hospitality Equipment
						</p>
						<p className="text-lg mb-10 text-purple-200">
							Connect with verified suppliers and discover quality equipment for your hospitality business
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							{/* Show different buttons based on user role */}
							{user?.role === 'SUPPLIER' ? (
								<Link href="/supplier/create-product">
									<Button size="lg" className="bg-white text-purple-600 hover:bg-white hover:text-purple-600">
										List Your Product
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>
								</Link>
							) : user?.role === 'CUSTOMER' ? (
								<Link href="/products">
									<Button size="lg" className="bg-white text-purple-600 hover:bg-white hover:text-purple-600">
										Browse Products
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>
								</Link>
							) : (
								<>
									<Link href="/supplier/create-product">
										<Button size="lg" className="bg-white text-purple-600 hover:bg-white hover:text-purple-600">
											List Your Product
											<ArrowRight className="ml-2 h-5 w-5" />
										</Button>
									</Link>
									<Link href="/products">
										<Button size="lg" variant="outline" className="bg-white text-purple-600 hover:bg-white hover:text-purple-600">
											Browse Products
										</Button>
									</Link>
								</>
							)}
							
							{/* Show additional button for logged in users */}
							{user && (
								<Link href={user.role === 'SUPPLIER' ? '/supplier' : '/user'}>
									<Button size="lg" variant="outline" className="bg-white text-purple-600 hover:bg-white hover:text-purple-600">
										My Dashboard
									</Button>
								</Link>
							)}
							
							{/* Show login for guests */}
							{!user && (
								<Link href="/auth/login">
									<Button size="lg" variant="outline" className="border-white text-white hover:bg-transparent hover:text-white">
										Sign In
									</Button>
								</Link>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-16 bg-gray-50">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Why Choose Vrinda Jasmine?
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							The trusted platform for hospitality businesses to source quality equipment and connect with reliable suppliers
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{features.map((feature, index) => (
							<Card key={index} className="text-center border-0 shadow-lg">
								<CardHeader>
									<div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
										<feature.icon className="w-6 h-6 text-purple-600" />
									</div>
									<CardTitle className="text-lg">{feature.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-gray-600">
										{feature.description}
									</CardDescription>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Categories Section */}
			<section className="py-16">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Product Categories
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							Explore our comprehensive range of hospitality equipment across 8 major categories
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{categories.map((category, index) => (
							<Link key={index} href={`/products?category=${encodeURIComponent(category.name)}`}>
								<Card className="hover:shadow-lg transition-shadow cursor-pointer group">
									<CardHeader>
										<div className="flex items-center space-x-3">
											<div className={`p-3 rounded-lg ${category.color}`}>
												<category.icon className="w-6 h-6" />
											</div>
											<div className="flex-1">
												<CardTitle className="text-lg">{category.name}</CardTitle>
												<Badge variant="secondary" className="mt-1">
													{category.subcategories} subcategories
												</Badge>
											</div>
										</div>
									</CardHeader>
									<CardContent>
										<CardDescription className="text-gray-600 mb-4">
											{category.description}
										</CardDescription>
										<Button variant="outline" className="w-full group-hover:bg-purple-50 group-hover:border-purple-200">
											Explore
											<ArrowRight className="ml-2 h-4 w-4" />
										</Button>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 bg-purple-600 text-white">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-3xl font-bold mb-4">
						Ready to Get Started?
					</h2>
					<p className="text-lg mb-8 text-purple-100 max-w-2xl mx-auto">
						Join thousands of hospitality businesses that trust Vrinda Jasmine for their equipment needs
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						{user?.role === 'SUPPLIER' ? (
							<Link href="/supplier/create-product">
								<Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
									Start Listing Products
								</Button>
							</Link>
						) : user?.role === 'CUSTOMER' ? (
							<Link href="/products">
								<Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
									Browse Equipment
								</Button>
							</Link>
						) : (
							<>
								<Link href="/auth/signup">
									<Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
										Join Now
									</Button>
								</Link>
								<Link href="/products">
									<Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
										Browse Products
									</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-900 text-white py-12">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div>
							<h3 className="text-xl font-bold mb-4">Vrinda Jasmine</h3>
							<p className="text-gray-400">
								Your premier B2B marketplace for hospitality equipment
							</p>
						</div>
						<div>
							<h4 className="font-semibold mb-4">Quick Links</h4>
							<ul className="space-y-2 text-gray-400">
								<li><Link href="/" className="hover:text-white">Home</Link></li>
								<li><Link href="/supplier/create-product" className="hover:text-white">Add Product</Link></li>
								<li><Link href="/auth/login" className="hover:text-white">Login</Link></li>
								<li><Link href="/auth/signup" className="hover:text-white">Sign Up</Link></li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-4">Categories</h4>
							<ul className="space-y-2 text-gray-400">
								<li><Link href="/products?category=Refrigeration" className="hover:text-white">Refrigeration</Link></li>
								<li><Link href="/products?category=Cooking%20Appliances" className="hover:text-white">Cooking Appliances</Link></li>
								<li><Link href="/products?category=Appliances" className="hover:text-white">Appliances</Link></li>
								<li><Link href="/products?category=Kitchenware%20%26%20Equipment" className="hover:text-white">Kitchenware & Equipment</Link></li>
								<li><Link href="/products?category=Consumables" className="hover:text-white">Consumables</Link></li>
								<li><Link href="/products?category=Kitchen%20Furniture" className="hover:text-white">Kitchen Furniture</Link></li>
								<li><Link href="/products?category=Cleaning" className="hover:text-white">Cleaning</Link></li>
								<li><Link href="/products?category=Graded%20Equipment" className="hover:text-white">Graded Equipment</Link></li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-4">Contact</h4>
							<ul className="space-y-2 text-gray-400">
								<li>Email: info@vrindajasmin.com</li>
								<li>Phone: +91 98765 43210</li>
								<li>Address: Mumbai, India</li>
							</ul>
						</div>
					</div>
					<div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
						<p>&copy; 2024 Vrinda Jasmine. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	)
} 