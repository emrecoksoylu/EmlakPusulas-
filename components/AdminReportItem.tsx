
"use client"

import { useState } from "react"
import { User, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { updateReportStatus } from "@/app/actions/admin/reports"
import { toast } from "sonner"

interface AdminReportItemProps {
    report: any
}

export function AdminReportItem({ report }: AdminReportItemProps) {
    const [isUpdating, setIsUpdating] = useState(false)

    const handleStatusUpdate = async (newStatus: string) => {
        setIsUpdating(true)
        try {
            await updateReportStatus(report.id, newStatus)
            toast.success("Durum güncellendi")
        } catch (error) {
            toast.error("Güncelleme sırasında bir hata oluştu")
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="py-6 first:pt-0 last:pb-0">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-semibold text-lg text-gray-900">{report.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                            <User className="h-4 w-4" /> {report.agent.name || report.agent.email}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" /> {new Date(report.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${report.status === 'open' ? 'bg-red-100 text-red-700' :
                            report.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                        }`}>
                        {report.status === 'open' ? 'AÇIK' :
                            report.status === 'in-progress' ? 'İNCELENİYOR' :
                                'ÇÖZÜLDÜ'}
                    </span>
                </div>
            </div>

            <p className="text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                {report.description}
            </p>

            <div className="flex gap-2">
                {report.status !== 'in-progress' && report.status !== 'resolved' && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                        onClick={() => handleStatusUpdate('in-progress')}
                        disabled={isUpdating}
                    >
                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "İncelemeye Al"}
                    </Button>
                )}
                {report.status !== 'resolved' && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => handleStatusUpdate('resolved')}
                        disabled={isUpdating}
                    >
                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                            <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Tamamlandı Olarak İşaretle
                            </>
                        )}
                    </Button>
                )}
                {report.status === 'resolved' && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleStatusUpdate('open')}
                        disabled={isUpdating}
                    >
                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                            <>
                                <AlertCircle className="mr-2 h-4 w-4" />
                                Tekrar Aç
                            </>
                        )}
                    </Button>
                )}
            </div>
        </div>
    )
}
