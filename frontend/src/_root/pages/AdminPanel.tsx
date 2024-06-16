import AdminWidget from "@/components/widgets/AdminWidget"
import { AdminProvider } from "@/context/AdminContext"

const AdminPanel = () => {
    return (
        <>
            <AdminProvider>
                <AdminWidget />
            </AdminProvider>
        </>
    )
}

export default AdminPanel