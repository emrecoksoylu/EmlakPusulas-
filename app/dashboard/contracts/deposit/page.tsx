
"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Printer, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DepositContractGenerator() {
    const [formData, setFormData] = useState({
        protocolDate: new Date().toISOString().split('T')[0],

        // Seller
        sellerName: "",
        sellerId: "",
        sellerPhone: "",

        // Buyer
        buyerName: "",
        buyerId: "",
        buyerPhone: "",

        // Property
        propertyInfo: "", // Adres, Ada/Parsel vb.
        totalSalePrice: "",

        // Deposit
        depositAmount: "",
        validUntil: "", // Protokol geçerlilik süresi

        // Agency (Optional)
        agencyName: "Emre Emlak",
        commission: "2"
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handlePrint = () => {
        window.print()
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
                        <h1 className="text-2xl font-bold tracking-tight">Kapora Protokolü Oluştur</h1>
                        <p className="text-muted-foreground text-sm">Alım-satım öncesi tarafların niyetini sabitleyen pey akçesi belgesi.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" /> Yazdır (PDF)
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Save className="mr-2 h-4 w-4" /> Kaydet
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="space-y-6 no-print">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Gayrimenkul ve Fiyat</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Taşınmaz Bilgisi</Label>
                                <Input name="propertyInfo" placeholder="Örn: Beşiktaş, 123 Ada 45 Parsel 8 Nolu Daire" value={formData.propertyInfo} onChange={handleChange} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Toplam Satış Bedeli</Label>
                                    <Input name="totalSalePrice" placeholder="5.000.000 TL" value={formData.totalSalePrice} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Alınan Kapora (Pey Akçesi)</Label>
                                    <Input name="depositAmount" placeholder="50.000 TL" value={formData.depositAmount} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Protokol Geçerlilik Son Tarihi</Label>
                                <Input name="validUntil" type="date" value={formData.validUntil} onChange={handleChange} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Taraflar</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4 border-b pb-4">
                                <Label className="text-green-600 font-bold uppercase text-xs">Satıcı</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input name="sellerName" placeholder="Ad Soyad" value={formData.sellerName} onChange={handleChange} />
                                    <Input name="sellerId" placeholder="T.C. Kimlik No" value={formData.sellerId} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label className="text-blue-600 font-bold uppercase text-xs">Alıcı</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input name="buyerName" placeholder="Ad Soyad" value={formData.buyerName} onChange={handleChange} />
                                    <Input name="buyerId" placeholder="T.C. Kimlik No" value={formData.buyerId} onChange={handleChange} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview Section */}
                <div className="bg-white border shadow-lg rounded-lg p-12 font-serif text-[12px] leading-relaxed max-w-[21cm] mx-auto min-h-[29.7cm] text-black print:m-0 print:border-0 print:shadow-none">
                    <h1 className="text-center text-xl font-bold uppercase mb-8 border-b-2 border-black pb-4">KAPORA (PEY AKÇESİ) PROTOKOLÜ</h1>

                    <div className="space-y-6">
                        <section>
                            <h2 className="font-bold underline mb-2 uppercase">1. Taraflar</h2>
                            <p><strong>SATICI:</strong> {formData.sellerName || "...................................."} (TC: {formData.sellerId || "................"})</p>
                            <p className="mt-2"><strong>ALICI:</strong> {formData.buyerName || "...................................."} (TC: {formData.buyerId || "................"})</p>
                        </section>

                        <section>
                            <h2 className="font-bold underline mb-2 uppercase">2. Taşınmaz Bilgileri ve Bedel</h2>
                            <p>Bahse konu {formData.propertyInfo || "........................................................"} adresindeki taşınmazın {formData.totalSalePrice || "................"} TL bedel üzerinden satışı hususunda taraflar mutabakata varmışlardır.</p>
                        </section>

                        <section>
                            <h2 className="font-bold underline mb-2 uppercase">3. Kapora (Pey Akçesi)</h2>
                            <p>Alıcı, yukarıda belirtilen satış bedeline mahsuben Satıcı'ya {formData.depositAmount || "................"} TL kapora bedelini işbu protokolün imzası ile birlikte {new Date().toLocaleDateString('tr-TR')} tarihinde ödemiştir.</p>
                        </section>

                        <section>
                            <h2 className="font-bold underline mb-2 uppercase">4. Protokol Şartları</h2>
                            <div className="space-y-3">
                                <p>4.1. Satış işleminin tapu devri en geç {formData.validUntil ? new Date(formData.validUntil).toLocaleDateString('tr-TR') : "..../..../20..."} tarihine kadar gerçekleştirilecektir.</p>
                                <p>4.2. <strong>Cayma Hali:</strong> Alıcı, taşınmazı almaktan vazgeçmesi durumunda ödemiş olduğu kaporayı geri talep edemez.</p>
                                <p>4.3. <strong>Satıcının İmtinası:</strong> Satıcı, taşınmazı satmaktan vazgeçmesi durumunda aldığı kapora bedelini Alıcı'ya aynen iade eder ve ayrıca kapora tutarı kadar cezai şart ödemeyi kabul eder.</p>
                            </div>
                        </section>

                        <section className="pt-20">
                            <div className="flex justify-between px-10">
                                <div className="text-center">
                                    <p className="font-bold mb-12">SATICI</p>
                                    <div className="w-32 border-b border-black mx-auto"></div>
                                </div>
                                <div className="text-center">
                                    <p className="font-bold mb-12">ALICI</p>
                                    <div className="w-32 border-b border-black mx-auto"></div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="mt-32 text-[10px] text-gray-400 text-center uppercase">
                        Bu protokol taraflar arasında niyet birliğini göstermekte olup yasal hakların takibi için saklanmalıdır.
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                    @page { margin: 1.5cm; }
                }
            `}</style>
        </div>
    )
}
