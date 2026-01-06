
import { Button } from "@/components/ui/button"
import { Plus, User, Phone, Mail, FileText } from "lucide-react"
import Link from "next/link"
import { getCustomers } from "@/app/actions/customers"
import { Customer } from "@prisma/client"

export const dynamic = 'force-dynamic'

export default async function CustomersPage() {
    const customers = await getCustomers()

    const categories = [
        { id: "buyers", label: "Alıcılar / Potansiyel", color: "blue", statusList: ["lead", "active", "buyer"] },
        { id: "sellers", label: "Satıcılar", color: "purple", statusList: ["seller"] },
        { id: "passive", label: "Pasif / Tamamlanan", color: "gray", statusList: ["closed", "cancelled"] }
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Müşteriler</h1>
                    <p className="text-muted-foreground">
                        Müşteri ilişkilerinizi ve potansiyel alıcıları yönetin.
                    </p>
                </div>
                <Link href="/dashboard/customers/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" /> Yeni Müşteri Ekle
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {categories.map((col) => {
                    const filteredCustomers = customers.filter(c => col.statusList.includes(c.status))

                    return (
                        <div key={col.id} className="flex flex-col h-full bg-gray-50/50 rounded-xl border border-gray-100 p-4 min-h-[500px]">
                            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200/50">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <div className={`w-1 h-3 rounded-full bg-${col.color}-500`} />
                                    {col.label}
                                    <span className="text-xs font-normal text-gray-400 ml-1">({filteredCustomers.length})</span>
                                </h3>
                            </div>

                            <div className="space-y-3 flex-1 overflow-y-auto max-h-[700px] pr-1">
                                {filteredCustomers.length === 0 ? (
                                    <div className="bg-white/50 border border-dashed border-gray-200 rounded-lg p-8 text-center">
                                        <p className="text-xs text-gray-400 italic">Kayıt yok</p>
                                    </div>
                                ) : (
                                    filteredCustomers.map((customer) => (
                                        <div key={customer.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:border-blue-200 transition-all group relative">
                                            <Link href={`/dashboard/customers/${customer.id}`} className="absolute inset-0 z-0" />
                                            <div className="relative z-10 pointer-events-none">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <div className={`h-7 w-7 shrink-0 rounded-full bg-${col.color}-50 flex items-center justify-center text-${col.color}-600 font-bold text-[10px] uppercase`}>
                                                            {customer.name.charAt(0)}
                                                        </div>
                                                        <span className="font-medium text-sm text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                                            {customer.name}
                                                        </span>
                                                    </div>
                                                    <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wider
                                                        ${(customer.status === 'active' || customer.status === 'buyer') ? 'bg-green-100 text-green-700' :
                                                            customer.status === 'seller' ? 'bg-purple-100 text-purple-700' :
                                                                customer.status === 'closed' ? 'bg-gray-100 text-gray-600' :
                                                                    'bg-blue-100 text-blue-700'}`}>
                                                        {customer.status === 'lead' ? 'Pot' :
                                                            customer.status === 'active' ? 'Akt' :
                                                                customer.status === 'buyer' ? 'Al' :
                                                                    customer.status === 'seller' ? 'Sat' :
                                                                        customer.status === 'closed' ? 'Tam' : customer.status}
                                                    </span>
                                                </div>

                                                <div className="mt-3 space-y-1">
                                                    {customer.phone && (
                                                        <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                                            <Phone className="h-3 w-3 text-gray-400" />
                                                            <span>{customer.phone}</span>
                                                        </div>
                                                    )}
                                                    {customer.notes && (
                                                        <p className="text-[11px] text-gray-400 line-clamp-2 mt-2 pt-2 border-t border-gray-50 italic">
                                                            "{customer.notes}"
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
