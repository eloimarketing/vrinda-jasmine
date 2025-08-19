import { Loader } from 'lucide-react'

export default function Loading() {
	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-none">
			<Loader className="animate-spin" />
		</div>
	)
}
