
import { getCustomer, updateCustomer } from "@/app/actions/customers"
import { findMatchesForCustomer } from "@/app/actions/matching"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2, Save, ArrowLeft, ExternalLink, FileText } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { formatPrice } from "@/lib/utils"

export const dynamic = 'force-dynamic'

export default async function EditCustomerPage({ params }: { params: { id: string } }) {
    const customer = await getCustomer(params.id)

    if (!customer) {
        redirect("/dashboard/customers")
    }

    const matchedListings = await findMatchesForCustomer(customer.id)

    async function updateAction(formData: FormData) {
        "use server"
        await updateCustomer(customer!.id, formData)
        redirect("/dashboard/customers")
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/customers">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Müşteri Detay ve Düzenleme</h1>
                    <p className="text-gray-500 mt-2">
                        {customer.name} adlı müşterinin bilgilerini ve arayışını yönetin.
                    </p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <form action={updateAction} className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Temel Bilgiler</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Ad Soyad</Label>
                                    <Input id="name" name="name" defaultValue={customer.name} required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Durum</Label>
                                    <Select name="status" defaultValue={customer.status}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seçiniz" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="lead">Potansiyel (Lead)</SelectItem>
                                            <SelectItem value="active">Aktif Görüşülüyor</SelectItem>
                                            <SelectItem value="buyer">Alıcı</SelectItem>
                                            <SelectItem value="seller">Satıcı</SelectItem>
                                            <SelectItem value="closed">Tamamlandı</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">E-posta</Label>
                                    <Input id="email" name="email" type="email" defaultValue={customer.email || ""} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Telefon</Label>
                                    <Input id="phone" name="phone" defaultValue={customer.phone || ""} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="notes">Notlar</Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    defaultValue={customer.notes || ""}
                                    className="h-24 resize-none"
                                />
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 pt-4">Arayış Kriterleri (Eşleştirme)</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="minPrice">Min. Bütçe</Label>
                                    <Input id="minPrice" name="minPrice" type="number" defaultValue={(customer as any).minPrice?.toString() || ""} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="maxPrice">Max. Bütçe</Label>
                                    <Input id="maxPrice" name="maxPrice" type="number" defaultValue={(customer as any).maxPrice?.toString() || ""} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="preferredLocations">Tercih Edilen Bölgeler</Label>
                                    <Input id="preferredLocations" name="preferredLocations" defaultValue={(customer as any).preferredLocations || ""} placeholder="Örn: Beşiktaş, Şişli" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="preferredRoomCount">Oda Sayısı</Label>
                                    <Select name="preferredRoomCount" defaultValue={(customer as any).preferredRoomCount || undefined}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seçiniz" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1+0">1+0</SelectItem>
                                            <SelectItem value="1+1">1+1</SelectItem>
                                            <SelectItem value="2+1">2+1</SelectItem>
                                            <SelectItem value="3+1">3+1</SelectItem>
                                            <SelectItem value="4+1">4+1+</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Link href="/dashboard/customers">
                                    <Button type="button" variant="ghost">İptal</Button>
                                </Link>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                    <Save className="mr-2 h-4 w-4" /> Güncelle
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-blue-50 bg-opacity-50 rounded-xl border border-blue-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-blue-900">Uygun İlanlar</h3>
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                {matchedListings.length} Eşleşme
                            </span>
                        </div>

                        <div className="space-y-4">
                            {matchedListings.length > 0 ? (
                                matchedListings.slice(0, 5).map((listing) => (
                                    <div key={listing.id} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm hover:border-blue-300 transition-all group">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-medium text-sm text-gray-900 truncate flex-1">{listing.title}</h4>
                                            <Link href={`/dashboard/listings/${listing.id}`}>
                                                <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-blue-600" />
                                            </Link>
                                        </div>
                                        <p className="text-blue-600 font-bold text-sm">{formatPrice((listing as any).priceNumeric || listing.price)} TL</p>
                                        <div className="flex gap-2 mt-3">
                                            <Link href={`/dashboard/contracts/rental?customerId=${customer.id}&listingId=${listing.id}`} className="w-full">
                                                <Button size="sm" variant="outline" className="h-7 text-[10px] w-full">
                                                    <FileText className="h-3 w-3 mr-1" /> Sözleşme
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 italic text-center py-4">
                                    Henüz uygun ilan bulunamadı.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
