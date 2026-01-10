import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function CalendarPage() {
    const session = await auth()
    if (!session?.user) {
        redirect("/login")
    }

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Takvim</h1>

                <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            Takvim özelliği yakında aktif olacak!
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            Database migration tamamlandıktan sonra randevu oluşturabileceksiniz.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
