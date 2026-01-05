import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, ShieldAlert, Clock, CheckCircle, LogOut } from "lucide-react"
import { logout } from "@/app/actions/authenticate"
import { Button } from "@/components/ui/button"
import { AdminReportItem } from "@/components/AdminReportItem"

export default async function AdminPage() {
    const session = await auth()

    // Authorization check
    if (!session?.user?.email || session.user.email !== "coksoyluemre@gmail.com") {
        redirect("/dashboard")
    }

    // Fetch stats
    const totalMembers = await prisma.agent.count()
    const errorReports = await (prisma as any).errorReport.findMany({
        include: {
            agent: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const openReports = errorReports.filter((r: any) => r.status === "open").length

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold tracking-tight">Yönetici Paneli</h1>
                    <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">
                        Admin Erişimi
                    </div>
                </div>
                <form action={logout}>
                    <Button variant="outline" className="text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700">
                        <LogOut className="mr-2 h-4 w-4" /> Oturumu Kapat
                    </Button>
                </form>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-white/50 backdrop-blur-sm border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Üye</CardTitle>
                        <User className="h-4 w-4 text-indigo-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalMembers}</div>
                        <p className="text-xs text-muted-foreground">Aktif emlak danışmanları</p>
                    </CardContent>
                </Card>

                <Card className="bg-white/50 backdrop-blur-sm border-red-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Açık Hata Kayıtları</CardTitle>
                        <ShieldAlert className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{openReports}</div>
                        <p className="text-xs text-muted-foreground">İlgilenilmesi gereken sorunlar</p>
                    </CardContent>
                </Card>

                <Card className="bg-white/50 backdrop-blur-sm border-green-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Çözülen Hatalar</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{errorReports.length - openReports}</div>
                        <p className="text-xs text-muted-foreground">Toplam çözülen kayıt</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm bg-white">
                <CardHeader>
                    <CardTitle>Hata Kayıtları</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {errorReports.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                Henüz hata kaydı bulunmuyor.
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {errorReports.map((report: any) => (
                                    <AdminReportItem key={report.id} report={report} />
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
