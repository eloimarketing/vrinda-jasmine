import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import SearchBar from './search-bar'
import { Button } from '../ui/button'

export default function HeroPage() {
	return (
		<div className="flex flex-col pt-10 md:pt-20 items-center w-full px-4 sm:px-6 lg:px-8">
			<div className="text-center">
				<h1 className="text-2xl sm:text-3xl lg:text-4xl text-muted-foreground font-medium">
					World&apos;s Largest Property Site
				</h1>
				<div className="bg-[#fcb244]/20 text-xs sm:text-sm font-medium p-3 sm:p-4 w-fit mx-auto rounded-sm flex items-center justify-center gap-2 sm:gap-4 my-4 sm:my-6 flex-wrap sm:flex-nowrap">
					<div className="flex items-center justify-center gap-2">
						<Image src="/assets/icons/interior.svg" width={39} height={22} alt="hero" className="w-6 sm:w-8 lg:w-[39px] h-auto" />
						<p className="whitespace-nowrap">Home Interiors</p>
					</div>
					<Separator orientation="vertical" className="h-4 sm:h-6 w-[1.5px] bg-muted-foreground hidden sm:block" />
					<div className="flex items-center justify-center gap-2">
						<Image src="/assets/icons/key.svg" width={25} height={23} alt="hero" className="w-5 sm:w-6 lg:w-[25px] h-auto" />
						<p className="whitespace-nowrap">45-Days Guarantee</p>
					</div>
				</div>
			</div>

			<div className="w-full max-w-4xl mx-auto">
				<SearchBar />
			</div>

			{/* Are you a property owner */}
			<div className="flex gap-2 sm:gap-4 justify-center items-center mt-8 sm:mt-12 w-full max-w-md">
				<Separator className="flex-1 max-w-16 sm:max-w-24" />
				<div className="text-nowrap text-sm sm:text-base">Are you a Property Owner?</div>
				<Separator className="flex-1 max-w-16 sm:max-w-24" />
			</div>
			<div className="flex justify-center items-center mt-4">
				<Button className="rounded-xs w-36 sm:w-44 bg-muted-foreground hover:bg-muted-foreground/90 text-sm sm:text-base">
					List Your Property
				</Button>
			</div>
		</div>
	)
}
