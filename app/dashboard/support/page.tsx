import { auth } from "@/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SupportForm } from "@/components/SupportForm"
import { MessageSquare, Clock, History } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export default async function SupportPage() {
    const session = await auth()

    // Fetch reports for the current user
    const reports = await (prisma as any).errorReport.findMany({
        where: {
            agent: {
                email: session?.user?.email as string
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Destek ve Hata Bildirimi</h1>
                <p className="text-gray-500 mt-2">
                    Bir sorunla mı karşılaştınız? Bize bildirin, en kısa sürede çözelim.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-blue-600" />
                                Hata Bildirim Formu
                            </CardTitle>
                            <CardDescription>
                                Lütfen karşılaştığınız sorunu detaylıca açıklayın.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SupportForm />
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="h-5 w-5 text-blue-600" />
                                Hata Kayıtlarınız
                            </CardTitle>
                            <CardDescription>
                                Gönderdiğiniz bildirimlerin güncel durumunu buradan takip edebilirsiniz.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {reports.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                        Henüz bir hata kaydı oluşturmadınız.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100 border rounded-lg overflow-hidden">
                                        {reports.map((report: any) => (
                                            <div key={report.id} className="p-4 bg-white hover:bg-gray-50 transition-colors">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-semibold text-gray-900">{report.title}</h3>
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${report.status === 'open' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                        report.status === 'in-progress' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                                                            'bg-green-50 text-green-600 border border-green-100'
                                                        }`}>
                                                        {report.status === 'open' ? 'AÇIK' :
                                                            report.status === 'in-progress' ? 'İNCELENİYOR' :
                                                                'ÇÖZÜLDÜ'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{report.description}</p>
                                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(report.createdAt).toLocaleDateString('tr-TR')} {new Date(report.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-blue-50 border-blue-100">
                        <CardHeader>
                            <CardTitle className="text-sm">Hızlı İpucu</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-blue-800">
                            Hata bildiriminizde hangi sayfada olduğunuzu ve ne yapmaya çalışırken sorun yaşadığınızı belirtmeniz çözümü hızlandıracaktır.
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
