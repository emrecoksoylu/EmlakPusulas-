
"use client"

import { Home, LineChart, ListPlus, Settings, Building2, Users, LayoutDashboard, FileText, LogOut, ShieldCheck, LifeBuoy } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { logout } from "@/app/actions/authenticate"
import { useSession } from "next-auth/react"

const sidebarItems = [
    {
        title: "Özet Ekranı",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "İlanlarım",
        href: "/dashboard/listings",
        icon: Home,
    },
    {
        title: "Yeni İlan Ekle",
        href: "/dashboard/listings/new",
        icon: ListPlus,
    },
    {
        title: "Müşteriler",
        href: "/dashboard/customers",
        icon: Users,
    },
    {
        title: "Sözleşmeler",
        href: "/dashboard/contracts",
        icon: FileText,
    },
    {
        title: "Ayarlar",
        href: "/dashboard/settings",
        icon: Settings,
    },
    {
        title: "Hata Bildir",
        href: "/dashboard/support",
        icon: LifeBuoy,
    },
]

export function DashboardSidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const isAdmin = (session?.user as any)?.role === 'admin' || session?.user?.email === 'coksoyluemre@gmail.com'

    const items = [...sidebarItems]
    if (isAdmin) {
        items.push({
            title: "Admin Paneli",
            href: "/admin",
            icon: ShieldCheck,
        })
    }
    return (
        <div className="flex h-full w-64 flex-col border-r bg-white">
            <div className="flex h-16 items-center border-b px-6">
                <Building2 className="mr-2 h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold text-blue-900 tracking-tight">Emlak<span className="text-blue-600">Pusulası</span></span>
            </div>
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid gap-1 px-2">
                    {items.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 transition-colors",
                                pathname === item.href ? "bg-blue-50 text-blue-700" : "text-gray-700"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="border-t p-4 space-y-2">
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-100 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                        <Users className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{session?.user?.companyName || session?.user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                        <p className="text-[10px] items-center gap-1 font-bold text-blue-600 flex bg-blue-50 w-fit px-1.5 py-0.5 rounded-full mt-1">
                            <ShieldCheck className="h-3 w-3" /> {session?.user?.role === 'admin' ? 'YÖNETİCİ' : 'DANIŞMAN'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => logout()}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Oturumu Kapat
                </button>
            </div>
        </div>
    )
}
