"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Printer, ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function RentalContractGenerator() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const customerId = searchParams.get("customerId")
    const listingId = searchParams.get("listingId")

    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        startDate: "",
        duration: "1 Yıl",
        monthlyRent: "",
        paymentDay: "Her ayın 1. ile 5. günü arası",
        deposit: "",

        ownerName: "",
        ownerId: "",
        ownerAddress: "",

        tenantName: "",
        tenantId: "",
        tenantAddress: "",

        propertyAddress: "",
        propertyType: "Konut",
        fixtures: "Boya-badana yapılmış, kombi çalışır vaziyette."
    })

    useEffect(() => {
        // Auto-fill from URL params if available
        if (listingId) {
            // In a real scenario, fetch listing data
            // For now, we'll just set a placeholder
        }
        if (customerId) {
            // In a real scenario, fetch customer data
        }
    }, [customerId, listingId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handlePrint = () => {
        window.print()
    }

    const handleSave = async () => {
        setIsLoading(true)
        try {
            // Save contract to database
            const response = await fetch("/api/contracts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "Kira Sözleşmesi",
                    content: JSON.stringify(formData),
                    customerId,
                    listingId
                })
            })

            if (response.ok) {
                toast.success("Sözleşme kaydedildi!")
                router.push("/dashboard/contracts")
            } else {
                toast.error("Kaydetme başarısız.")
            }
        } catch (error) {
            toast.error("Bir hata oluştu.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between no-print">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/contracts">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Kira Sözleşmesi Oluştur</h1>
                        <p className="text-muted-foreground text-sm">Standart Borçlar Kanunu uyumlu kira kontratı.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" /> Yazdır (PDF)
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Kaydet
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="space-y-6 no-print">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Gayrimenkul ve Kira Bilgileri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Başlangıç Tarihi</Label>
                                    <Input name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Sözleşme Süresi</Label>
                                    <Input name="duration" value={formData.duration} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Aylık Kira Bedeli</Label>
                                    <Input name="monthlyRent" placeholder="15.000 TL" value={formData.monthlyRent} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Depozito</Label>
                                    <Input name="deposit" placeholder="30.000 TL" value={formData.deposit} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Gayrimenkul Adresi</Label>
                                <Input name="propertyAddress" placeholder="Örn: Beşiktaş, İstanbul..." value={formData.propertyAddress} onChange={handleChange} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Taraflar</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4 border-b pb-4">
                                <Label className="text-blue-600 font-bold uppercase text-xs">Kiraya Veren (Mülk Sahibi)</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input name="ownerName" placeholder="Ad Soyad" value={formData.ownerName} onChange={handleChange} />
                                    <Input name="ownerId" placeholder="T.C. Kimlik No" value={formData.ownerId} onChange={handleChange} />
                                </div>
                                <Input name="ownerAddress" placeholder="Adres" value={formData.ownerAddress} onChange={handleChange} />
                            </div>
                            <div className="space-y-4">
                                <Label className="text-blue-600 font-bold uppercase text-xs">Kiracı</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input name="tenantName" placeholder="Ad Soyad" value={formData.tenantName} onChange={handleChange} />
                                    <Input name="tenantId" placeholder="T.C. Kimlik No" value={formData.tenantId} onChange={handleChange} />
                                </div>
                                <Input name="tenantAddress" placeholder="Adres" value={formData.tenantAddress} onChange={handleChange} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview Section */}
                <div className="bg-white border shadow-lg rounded-lg p-10 font-serif text-[12px] leading-relaxed max-w-[21cm] mx-auto min-h-[29.7cm] text-black print:m-0 print:border-0 print:shadow-none">
                    <h1 className="text-center text-xl font-bold uppercase mb-8 border-b-2 border-black pb-4">KİRA SÖZLEŞMESİ</h1>

                    <div className="grid grid-cols-3 border border-black">
                        <div className="p-2 border-r border-b border-black font-bold">Dairesi</div><div className="p-2 border-b border-black col-span-2">İSTANBUL</div>
                        <div className="p-2 border-r border-b border-black font-bold">Mahallesi</div><div className="p-2 border-b border-black col-span-2">-</div>
                        <div className="p-2 border-r border-b border-black font-bold">Cadde/Sokak</div><div className="p-2 border-b border-black col-span-2">{formData.propertyAddress || "........................................................"}</div>
                        <div className="p-2 border-r border-b border-black font-bold">Kiralananın Cinsi</div><div className="p-2 border-b border-black col-span-2">{formData.propertyType}</div>
                        <div className="p-2 border-r border-b border-black font-bold">Kiraya Veren</div><div className="p-2 border-b border-black col-span-2 font-bold">{formData.ownerName || "...................................."}</div>
                        <div className="p-2 border-r border-b border-black font-bold">Kiraya Veren TC</div><div className="p-2 border-b border-black col-span-2">{formData.ownerId || "...................................."}</div>
                        <div className="p-2 border-r border-b border-black font-bold">Kiracı</div><div className="p-2 border-b border-black col-span-2 font-bold">{formData.tenantName || "...................................."}</div>
                        <div className="p-2 border-r border-b border-black font-bold">Kiracı TC</div><div className="p-2 border-b border-black col-span-2 font-bold">{formData.tenantId || "...................................."}</div>
                        <div className="p-2 border-r border-b border-black font-bold">Kira Başlangıcı</div><div className="p-2 border-b border-black col-span-2">{formData.startDate || ".... / .... / 202..."}</div>
                        <div className="p-2 border-r border-b border-black font-bold">Kira Süresi</div><div className="p-2 border-b border-black col-span-2">{formData.duration}</div>
                        <div className="p-2 border-r border-b border-black font-bold">Aylık Kira</div><div className="p-2 border-b border-black col-span-2">{formData.monthlyRent || "................ TL"}</div>
                        <div className="p-2 border-r border-black font-bold">Ödeme Günü</div><div className="p-2 col-span-2">{formData.paymentDay}</div>
                    </div>

                    <div className="mt-8 space-y-4">
                        <h2 className="font-bold border-b border-black inline-block">GENEL KOŞULLAR</h2>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>Kiracı, kiralananı özenle kullanmaya mecburdur.</li>
                            <li>Kiracı, kiralananda mülk sahibinin yazılı izni olmadan değişiklik yapamaz.</li>
                            <li>Kira bedeli, her ayın belirtilen gününde tam ve nakden ödenir.</li>
                            <li>Mülke ait aidat, elektrik, su, doğalgaz vb. tüm kullanım giderleri kiracıya aittir.</li>
                            <li>Kiracı, kiralananı kısmen veya tamamen başkasına devredemez, alt kiraya veremez.</li>
                            <li>Sözleşme sonunda kiralanan, teslim alındığı gibi çalışır ve temiz vaziyette mülk sahibine iade edilir.</li>
                        </ol>
                    </div>

                    <div className="mt-8 space-y-4">
                        <h2 className="font-bold border-b border-black inline-block">HUSUSİ ŞARTLAR</h2>
                        <p>1. Kiralanan mülk sadece konut amacıyla kullanılacaktır.</p>
                        <p>2. Depozito bedeli olarak {formData.deposit || ".........."} TL mülk sahibine teslim edilmiştir.</p>
                        <p>3. Yıllık kira artış oranı, bir önceki kira yılındaki (TÜFE) on iki aylık ortalamalara göre değişim oranını geçmemek koşuluyla belirlenecektir.</p>
                        <p>4. Demirbaş Durumu: {formData.fixtures}</p>
                    </div>

                    <div className="mt-16 flex justify-between px-10">
                        <div className="text-center">
                            <p className="font-bold mb-12">KİRAYA VEREN</p>
                            <p className="text-[10px]">{formData.ownerName}</p>
                        </div>
                        <div className="text-center">
                            <p className="font-bold mb-12">KİRACI</p>
                            <p className="text-[10px]">{formData.tenantName}</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                    .print-area { margin: 0 !important; border: 0 !important; }
                    @page { margin: 1cm; }
                }
            `}</style>
        </div>
    )
}
