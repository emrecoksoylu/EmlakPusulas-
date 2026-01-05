"use client"

import { Home, LineChart, ListPlus, Settings, Building2, Users, LayoutDashboard, FileText, LogOut, ShieldCheck, LifeBuoy, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { logout } from "@/app/actions/authenticate"
import { useSession } from "next-auth/react"
import { useState } from "react"

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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const user = session?.user as any
    const isAdmin = user?.role === 'admin' || user?.email === 'coksoyluemre@gmail.com'

    const handleLogout = async () => {
        await logout()
    }

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg"
            >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-bold text-blue-900 truncate">
                                Emlak<span className="text-blue-600">Pusulası</span>
                            </h2>
                            {user?.companyName && (
                                <p className="text-xs text-gray-500 truncate">{user.companyName}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {isAdmin && (
                        <Link
                            href="/admin"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                pathname === "/admin"
                                    ? "bg-red-50 text-red-700"
                                    : "text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            <ShieldCheck className="h-5 w-5" />
                            Admin Panel
                        </Link>
                    )}

                    {sidebarItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {item.title}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100">
                    <div className="mb-3 px-4">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name || user?.email}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Çıkış Yap
                    </button>
                </div>
            </aside>
        </>
    )
}
