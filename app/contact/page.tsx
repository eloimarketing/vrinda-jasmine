import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import MaxWidthWrapper from '@/components/max-width-wrapper'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
	return (
		<MaxWidthWrapper className="py-8">
			<div className="text-center mb-12">
				<h1 className="text-3xl font-bold text-gray-900 mb-4">
					Contact Us
				</h1>
				<p className="text-lg text-gray-600 max-w-2xl mx-auto">
					Get in touch with us for any questions about our hospitality equipment marketplace
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Contact Form */}
				<Card>
					<CardHeader>
						<CardTitle>Send us a message</CardTitle>
						<CardDescription>
							Fill out the form below and we&apos;ll get back to you as soon as possible.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="firstName">First Name</Label>
									<Input id="firstName" placeholder="John" />
								</div>
								<div>
									<Label htmlFor="lastName">Last Name</Label>
									<Input id="lastName" placeholder="Doe" />
								</div>
							</div>
							<div>
								<Label htmlFor="email">Email</Label>
								<Input id="email" type="email" placeholder="john.doe@example.com" />
							</div>
							<div>
								<Label htmlFor="subject">Subject</Label>
								<Input id="subject" placeholder="How can we help you?" />
							</div>
							<div>
								<Label htmlFor="message">Message</Label>
								<Textarea 
									id="message" 
									placeholder="Tell us more about your inquiry..."
									rows={5}
								/>
							</div>
							<Button type="submit" className="w-full">
								Send Message
							</Button>
						</form>
					</CardContent>
				</Card>

				{/* Contact Information */}
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Get in touch</CardTitle>
							<CardDescription>
								We&apos;d love to hear from you. Here&apos;s how you can reach us.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center space-x-3">
								<Mail className="h-5 w-5 text-gray-500" />
								<div>
									<p className="font-medium">Email</p>
									<p className="text-sm text-gray-600">info@vrindajasmin.com</p>
								</div>
							</div>
							<div className="flex items-center space-x-3">
								<Phone className="h-5 w-5 text-gray-500" />
								<div>
									<p className="font-medium">Phone</p>
									<p className="text-sm text-gray-600">+91 98765 43210</p>
								</div>
							</div>
							<div className="flex items-center space-x-3">
								<MapPin className="h-5 w-5 text-gray-500" />
								<div>
									<p className="font-medium">Address</p>
									<p className="text-sm text-gray-600">Mumbai, Maharashtra, India</p>
								</div>
							</div>
							<div className="flex items-center space-x-3">
								<Clock className="h-5 w-5 text-gray-500" />
								<div>
									<p className="font-medium">Business Hours</p>
									<p className="text-sm text-gray-600">Mon - Fri: 9:00 AM - 6:00 PM</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Why choose Vrinda Jasmine?</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div>
								<h4 className="font-medium">Quality Assurance</h4>
								<p className="text-sm text-gray-600">All products are verified and quality-checked</p>
							</div>
							<div>
								<h4 className="font-medium">Wide Selection</h4>
								<p className="text-sm text-gray-600">Thousands of products across 8 categories</p>
							</div>
							<div>
								<h4 className="font-medium">Trusted Suppliers</h4>
								<p className="text-sm text-gray-600">Connect with verified hospitality equipment suppliers</p>
							</div>
							<div>
								<h4 className="font-medium">24/7 Support</h4>
								<p className="text-sm text-gray-600">Round-the-clock customer support</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</MaxWidthWrapper>
	)
}
