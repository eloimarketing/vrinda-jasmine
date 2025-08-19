import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import MaxWidthWrapper from '@/components/max-width-wrapper'
import { Users, Shield, Package, Truck, Award, Heart } from 'lucide-react'

export default function AboutPage() {
	const values = [
		{
			icon: Shield,
			title: 'Quality Assurance',
			description: 'Every product on our platform is verified and quality-checked to ensure you get the best hospitality equipment.'
		},
		{
			icon: Users,
			title: 'Trusted Community',
			description: 'Connect with verified suppliers and buyers in the hospitality industry across India.'
		},
		{
			icon: Package,
			title: 'Wide Selection',
			description: 'Browse thousands of products across 8 major categories and 22 subcategories.'
		},
		{
			icon: Truck,
			title: 'Reliable Delivery',
			description: 'Fast and secure delivery across the country with professional logistics partners.'
		},
		{
			icon: Award,
			title: 'Industry Expertise',
			description: 'Built by hospitality professionals who understand the unique needs of the industry.'
		},
		{
			icon: Heart,
			title: 'Customer First',
			description: 'Dedicated support team committed to providing exceptional customer service.'
		}
	]

	const stats = [
		{ label: 'Products Listed', value: '1000+' },
		{ label: 'Verified Suppliers', value: '500+' },
		{ label: 'Happy Customers', value: '2000+' },
		{ label: 'Cities Served', value: '50+' }
	]

	return (
		<MaxWidthWrapper className="py-8">
			{/* Hero Section */}
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold text-gray-900 mb-6">
					About Vrinda Jasmine
				</h1>
				<p className="text-xl text-gray-600 max-w-3xl mx-auto">
					Your premier B2B marketplace for hospitality equipment, connecting verified suppliers with quality-conscious buyers across India.
				</p>
			</div>

			{/* Mission & Vision */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
				<Card>
					<CardHeader>
						<CardTitle>Our Mission</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-600">
							To revolutionize the hospitality equipment industry by providing a trusted platform where quality meets convenience. 
							We strive to connect suppliers with buyers through transparent, efficient, and reliable transactions.
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Our Vision</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-600">
							To become India's leading B2B marketplace for hospitality equipment, setting industry standards for quality, 
							transparency, and customer satisfaction while empowering businesses to grow and succeed.
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
				{stats.map((stat, index) => (
					<Card key={index} className="text-center">
						<CardContent className="pt-6">
							<div className="text-3xl font-bold text-purple-600 mb-2">{stat.value}</div>
							<div className="text-sm text-gray-600">{stat.label}</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Values */}
			<div className="mb-12">
				<h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{values.map((value, index) => (
						<Card key={index} className="text-center">
							<CardHeader>
								<div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
									<value.icon className="w-6 h-6 text-purple-600" />
								</div>
								<CardTitle className="text-lg">{value.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-gray-600">
									{value.description}
								</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* Story */}
			<Card className="mb-12">
				<CardHeader>
					<CardTitle>Our Story</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-gray-600">
						Vrinda Jasmine was born from a simple observation: the hospitality industry in India needed a better way to source 
						quality equipment. Traditional methods were often inefficient, with limited transparency and quality assurance.
					</p>
					<p className="text-gray-600">
						Founded by hospitality professionals who understood the challenges firsthand, we set out to create a platform that 
						would bridge the gap between suppliers and buyers. Our goal was to build a marketplace that prioritized quality, 
						transparency, and trust.
					</p>
					<p className="text-gray-600">
						Today, Vrinda Jasmine serves as the go-to platform for hospitality businesses across India, offering a comprehensive 
						range of equipment from verified suppliers. We continue to innovate and expand, always keeping our customers&apos; needs at the forefront.
					</p>
				</CardContent>
			</Card>

			{/* Team */}
			<div className="text-center">
				<h2 className="text-3xl font-bold mb-8">Our Team</h2>
				<p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
					We&apos;re a team of passionate professionals dedicated to transforming the hospitality equipment industry 
					through technology and innovation.
				</p>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<Card className="text-center">
						<CardContent className="pt-6">
							<div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
								<span className="text-gray-500">CEO</span>
							</div>
							<h3 className="font-semibold mb-2">Leadership Team</h3>
							<p className="text-sm text-gray-600">Experienced professionals with deep industry knowledge</p>
						</CardContent>
					</Card>
					<Card className="text-center">
						<CardContent className="pt-6">
							<div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
								<span className="text-gray-500">Tech</span>
							</div>
							<h3 className="font-semibold mb-2">Technology Team</h3>
							<p className="text-sm text-gray-600">Building innovative solutions for the hospitality industry</p>
						</CardContent>
					</Card>
					<Card className="text-center">
						<CardContent className="pt-6">
							<div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
								<span className="text-gray-500">Support</span>
							</div>
							<h3 className="font-semibold mb-2">Customer Support</h3>
							<p className="text-sm text-gray-600">Dedicated team ensuring exceptional customer experience</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</MaxWidthWrapper>
	)
} 