
"use client"

import { useState } from "react"
import { createCustomer } from "@/app/actions/customers"
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
import { Loader2, User } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { CityDistrictSelector } from "@/components/CityDistrictSelector"

export default function NewCustomerPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData(e.currentTarget)
            await createCustomer(formData)
            toast.success("Müşteri başarıyla kaydedildi.")
            router.push("/dashboard/customers")
        } catch (error) {
            console.error(error)
            toast.error("Bir hata oluştu.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Yeni Müşteri Ekle</h1>
                <p className="text-gray-500 mt-2">
                    Potansiyel alıcı veya satıcı bilgilerini CRM'e kaydedin.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Ad Soyad</Label>
                            <Input id="name" name="name" placeholder="Örn: Ahmet Yılmaz" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Durum</Label>
                            <Select name="status" defaultValue="lead">
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
                            <Input id="email" name="email" type="email" placeholder="ahmet@ornek.com" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Telefon</Label>
                            <Input id="phone" name="phone" placeholder="0555 555 55 55" />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notlar</Label>
                        <Textarea
                            id="notes"
                            name="notes"
                            placeholder="Müşteri talepleri vb..."
                            className="h-24 resize-none"
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h3 className="text-lg font-semibold text-blue-900">Arayış Kriterleri (Eşleştirme İçin)</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="minPrice">Min. Bütçe (TL)</Label>
                                <Input
                                    id="minPrice"
                                    name="minPrice"
                                    type="text"
                                    placeholder="Örn: 5.000.000"
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '')
                                        e.target.value = value ? parseInt(value).toLocaleString('tr-TR') : ''
                                    }}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="maxPrice">Max. Bütçe (TL)</Label>
                                <Input
                                    id="maxPrice"
                                    name="maxPrice"
                                    type="text"
                                    placeholder="Örn: 20.000.000"
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '')
                                        e.target.value = value ? parseInt(value).toLocaleString('tr-TR') : ''
                                    }}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">


                            <div className="grid gap-2">
                                <Label htmlFor="preferredLocations">Tercih Edilen Bölgeler</Label>
                                <CityDistrictSelector name="preferredLocations" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="preferredRoomCount">Oda Sayısı</Label>
                                <Select name="preferredRoomCount">
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

                        <div className="grid gap-2">
                            <Label htmlFor="propertyType">Konut Tipi</Label>
                            <Select name="propertyType">
                                <SelectTrigger>
                                    <SelectValue placeholder="Seçiniz" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Daire">Daire</SelectItem>
                                    <SelectItem value="Villa">Villa</SelectItem>
                                    <SelectItem value="Arsa">Arsa</SelectItem>
                                    <SelectItem value="Ticari">Ticari</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="ghost" onClick={() => router.back()}>İptal</Button>
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Kaydediliyor
                                </>
                            ) : (
                                <>
                                    <User className="mr-2 h-4 w-4" /> Müşteriyi Kaydet
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
