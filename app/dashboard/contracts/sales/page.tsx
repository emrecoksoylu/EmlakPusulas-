
"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Printer, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SalesContractGenerator() {
    const [formData, setFormData] = useState({
        contractDate: new Date().toISOString().split('T')[0],

        // Seller (Vaat Eden)
        sellerName: "",
        sellerId: "",
        sellerAddress: "",
        sellerPhone: "",

        // Buyer (Vaat Alacaklısı)
        buyerName: "",
        buyerId: "",
        buyerAddress: "",
        buyerPhone: "",

        // Property Details
        city: "",
        district: "",
        neighborhood: "",
        ada: "",
        parsel: "",
        independentUnit: "", // Daire No
        propertyType: "Mesken",

        // Financials
        totalPrice: "",
        downPayment: "",
        remainingBalance: "",
        paymentTerms: "Tapu devri sırasında nakden ve defaten ödenecektir.",

        // Other
        deliveryDate: "Tapu devri ile birlikte",
        penaltyPercentage: "10"
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
                        <h1 className="text-2xl font-bold tracking-tight">Satış Vaadi Sözleşmesi Oluştur</h1>
                        <p className="text-muted-foreground text-sm">Noter onaylı düzenlenmesi gereken gayrimenkul satış vaadi taslağı.</p>
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
                <div className="space-y-6 no-print max-h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-thin">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Gayrimenkul Bilgileri (Tapu)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>İl / İlçe</Label>
                                    <Input name="city" placeholder="İstanbul / Beşiktaş" value={formData.city} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Mahalle</Label>
                                    <Input name="neighborhood" placeholder="Levent Mah." value={formData.neighborhood} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Ada</Label>
                                    <Input name="ada" placeholder="123" value={formData.ada} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Parsel</Label>
                                    <Input name="parsel" placeholder="45" value={formData.parsel} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Daire No</Label>
                                    <Input name="independentUnit" placeholder="8" value={formData.independentUnit} onChange={handleChange} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Satıcı ve Alıcı Bilgileri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4 border-b pb-4">
                                <Label className="text-purple-600 font-bold uppercase text-xs">Satıcı (Vaat Eden)</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input name="sellerName" placeholder="Ad Soyad" value={formData.sellerName} onChange={handleChange} />
                                    <Input name="sellerId" placeholder="T.C. Kimlik No" value={formData.sellerId} onChange={handleChange} />
                                </div>
                                <Input name="sellerAddress" placeholder="Yasal İkametgah Adresi" value={formData.sellerAddress} onChange={handleChange} />
                            </div>
                            <div className="space-y-4">
                                <Label className="text-blue-600 font-bold uppercase text-xs">Alıcı (Vaat Alacaklısı)</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input name="buyerName" placeholder="Ad Soyad" value={formData.buyerName} onChange={handleChange} />
                                    <Input name="buyerId" placeholder="T.C. Kimlik No" value={formData.buyerId} onChange={handleChange} />
                                </div>
                                <Input name="buyerAddress" placeholder="Yasal İkametgah Adresi" value={formData.buyerAddress} onChange={handleChange} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Finansal Koşullar</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Toplam Satış Bedeli</Label>
                                    <Input name="totalPrice" placeholder="5.000.000 TL" value={formData.totalPrice} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Ödenen Peşinat</Label>
                                    <Input name="downPayment" placeholder="500.000 TL" value={formData.downPayment} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Kalan Bakiye</Label>
                                    <Input name="remainingBalance" placeholder="4.500.000 TL" value={formData.remainingBalance} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Bakiye Ödeme Detayı</Label>
                                <Textarea name="paymentTerms" value={formData.paymentTerms} onChange={handleChange} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview Section */}
                <div className="bg-white border shadow-lg rounded-lg p-12 font-serif text-[12px] leading-relaxed max-w-[21cm] mx-auto min-h-[29.7cm] text-black print:m-0 print:border-0 print:shadow-none bg-slate-50/10">
                    <h1 className="text-center text-xl font-bold uppercase mb-8 border-b-2 border-black pb-4">GAYRİMENKUL SATIŞ VAADİ SÖZLEŞMESİ</h1>

                    <div className="space-y-6">
                        <section>
                            <h2 className="font-bold underline mb-2 uppercase">Madde 1: Taraflar</h2>
                            <div className="pl-4 space-y-4">
                                <p><strong>1.1. SATICI (VAAT EDEN):</strong> {formData.sellerName || "...................................."} (TC: {formData.sellerId || "................"}) – Adres: {formData.sellerAddress || "........................................................"}</p>
                                <p><strong>1.2. ALICI (VAAT ALACAKLISI):</strong> {formData.buyerName || "...................................."} (TC: {formData.buyerId || "................"}) – Adres: {formData.buyerAddress || "........................................................"}</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="font-bold underline mb-2 uppercase">Madde 2: Sözleşme Konusu Taşınmaz</h2>
                            <p className="pl-4">
                                Satıcı, maliki bulunduğu {formData.city || "......./......."} İli/İlçesi, {formData.neighborhood || "..............."} Mahallesi, {formData.ada || "...."} Ada, {formData.parsel || "...."} Parsel'de kayıtlı {formData.independentUnit ? formData.independentUnit + " no'lu bağımsız bölüm" : "taşınmazı"} işbu sözleşme şartları ile Alıcı'ya satmayı vaat ve taahhüt etmiştir.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-bold underline mb-2 uppercase">Madde 3: Satış Bedeli ve Ödeme Şartları</h2>
                            <div className="pl-4 space-y-2">
                                <p>3.1. Taşınmazın toplam satış bedeli {formData.totalPrice || "................"} TL'dir.</p>
                                <p>3.2. Peşinat olarak {formData.downPayment || "................"} TL ödenmiştir. </p>
                                <p>3.3. Kalan {formData.remainingBalance || "................"} TL bakiyenin ödeme yöntemi: {formData.paymentTerms}</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="font-bold underline mb-2 uppercase">Madde 4: Tapu Devri ve Teslimat</h2>
                            <p className="pl-4">
                                Satış bedelinin tamamı ödendiğinde, Satıcı taşınmazın tapusunu Alıcı adına devretmekle yükümlüdür. Taşınmaz, {formData.deliveryDate} tarihinde boş ve borçsuz olarak teslim edilecektir.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-bold underline mb-2 uppercase">Madde 5: Cezai Şart</h2>
                            <p className="pl-4">
                                Taraflardan birinin haklı bir neden olmaksızın sözleşmeden cayması durumunda, cayma tazminatı olarak satış bedelinin %{formData.penaltyPercentage} tutarında cezai şart ödemeyi kabul ederler.
                            </p>
                        </section>

                        <section className="pt-10">
                            <p className="text-center italic mb-8">İşbu sözleşme {formData.contractDate} tarihinde iki nüsha olarak imza altına alınmıştır.</p>
                            <div className="flex justify-between px-10">
                                <div className="text-center">
                                    <p className="font-bold mb-12">SATICI (VAAT EDEN)</p>
                                    <div className="w-32 border-b border-black mx-auto mb-2"></div>
                                    <p className="text-[10px]">{formData.sellerName}</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-bold mb-12">ALICI (VAAT ALACAKLISI)</p>
                                    <div className="w-32 border-b border-black mx-auto mb-2"></div>
                                    <p className="text-[10px]">{formData.buyerName}</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="mt-20 p-4 border border-dashed border-gray-400 text-[10px] text-gray-500 text-center uppercase no-print">
                        Not: Bu belge bir taslaktır. Gayrimenkul satış vaadi sözleşmelerinin geçerli olması için NOTER HUZURUNDA yapılması zorunludur.
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; margin: 0; padding: 0; }
                    .print-area { margin: 0 !important; border: 0 !important; }
                    @page { size: A4; margin: 1cm; }
                }
            `}</style>
        </div>
    )
}
