
import { getCustomer, updateCustomer } from "@/app/actions/customers"
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
import { Loader2, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function EditCustomerPage({ params }: { params: { id: string } }) {
    const customer = await getCustomer(params.id)

    if (!customer) {
        redirect("/dashboard/customers")
    }

    async function updateAction(formData: FormData) {
        "use server"
        await updateCustomer(customer!.id, formData)
        redirect("/dashboard/customers")
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/customers">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Müşteriyi Düzenle</h1>
                    <p className="text-gray-500 mt-2">
                        {customer.name} adlı müşterinin bilgilerini güncelleyin.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form action={updateAction} className="space-y-6">
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
                            className="h-32 resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Link href="/dashboard/customers">
                            <Button type="button" variant="ghost">İptal</Button>
                        </Link>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            <Save className="mr-2 h-4 w-4" /> Değişiklikleri Kaydet
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
