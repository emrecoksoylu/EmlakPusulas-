
import { Button } from "@/components/ui/button"
import { FileText, Plus, Search, Filter } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default function ContractsPage() {
    const contractTypes = [
        {
            id: "rental",
            title: "Kira Sözleşmesi",
            description: "Standart konut ve işyeri kira sözleşmesi şablonu. Borçlar kanununa uygundur.",
            icon: FileText,
            color: "blue",
            href: "/dashboard/contracts/rental"
        },
        {
            id: "sales",
            title: "Satış Vaadi Sözleşmesi",
            description: "Gayrimenkul satış vaadi ve zilyetlik devri sözleşmesi şablonu (Taslak).",
            icon: FileText,
            color: "purple",
            href: "#"
        },
        {
            id: "deposit",
            title: "Kapora Protokolü",
            description: "Alım-satım öncesi alınan kapora ve şartların belirlendiği tutanak.",
            icon: FileText,
            color: "green",
            href: "#"
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Sözleşmeler</h1>
                    <p className="text-muted-foreground">
                        Profesyonel sözleşme şablonları oluşturun ve yönetin.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {contractTypes.map((type) => (
                    <div key={type.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-blue-200 transition-all group flex flex-col">
                        <div className={`h-12 w-12 rounded-lg bg-${type.color}-50 flex items-center justify-center mb-4 text-${type.color}-600`}>
                            <type.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{type.title}</h3>
                        <p className="text-sm text-gray-500 mb-6 flex-1">
                            {type.description}
                        </p>
                        <Link href={type.href}>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700" variant="default">
                                Sözleşme Oluştur
                            </Button>
                        </Link>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-blue-50/50 border border-blue-100 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-blue-900">Profesyonel Şablonlar</h4>
                        <p className="text-sm text-blue-800 mt-1">
                            Buradaki şablonlar güncel mevzuat dikkate alınarak hazırlanmıştır.
                            Ancak her durum özeldir; hukuki geçerlilik için avukatınıza danışmanızı öneririz.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
