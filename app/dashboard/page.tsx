import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, LineChart, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getListings } from "@/app/actions/listings"
import { getCustomers } from "@/app/actions/customers"

export const dynamic = 'force-dynamic'

export default async function DashboardHome() {
    const session = await auth()

    if (session?.user?.email === "coksoyluemre@gmail.com") {
        redirect("/admin")
    }

    const [listings, customers] = await Promise.all([
        getListings(),
        getCustomers()
    ])

    const activeListings = listings.length
    const totalCustomers = customers.length

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        {session?.user?.companyName || "Hoş Geldiniz"} 👋
                    </h1>
                    <p className="text-gray-500 mt-2">
                        {session?.user?.name} - Emlak portföyünüzün güncel durumu.
                    </p>
                </div>
                <Link href="/dashboard/listings/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" /> Yeni İlan Ekle
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Link href="/dashboard/listings">
                    <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Toplam İlan</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeListings}</div>
                            <p className="text-xs text-muted-foreground">
                                Aktif ilanlarınız
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/customers">
                    <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Müşteriler</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalCustomers}</div>
                            <p className="text-xs text-muted-foreground">
                                Kayıtlı müşteri
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
