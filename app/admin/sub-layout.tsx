import Navbar from '@/components/navbar'
import AdminSidebar from '@/components/admin/admin-sidebar'

export default function SubLayout() {
	return (
		<>
			<div className="fixed top-0 left-0 w-full h-20 overflow-hidden z-50 bg-white border-b">
				<Navbar />
			</div>
			<div className="fixed top-20 left-0 hidden sm:block w-[20%] h-[calc(100vh-5rem)] border-r bg-white">
				<AdminSidebar />
			</div>
		</>
	)
}
