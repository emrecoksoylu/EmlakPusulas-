
"use client"

import { useState } from "react"
import { createListing } from "@/app/actions/listings"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Upload, Home, Ruler, Building, Info } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function ListingForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)

    // AI Generation State
    const [aiPrompt, setAiPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formData = new FormData(e.currentTarget)
            if (imageFile) {
                formData.append("image", imageFile)
            }

            // Handle checkboxes explicitly if needed, but FormData usually handles 'on'
            // We will trust server action to handle "on" conversion

            await createListing(formData)
            toast.success("İlan başarıyla oluşturuldu.")
            router.push("/dashboard/listings")
        } catch (error) {
            console.error(error)
            toast.error("Bir hata oluştu.")
        } finally {
            setLoading(false)
        }
    }

    const generateDescription = async () => {
        if (!aiPrompt) return
        setIsGenerating(true)
        // Mock AI generation
        setTimeout(() => {
            const descInput = document.getElementById("description") as HTMLTextAreaElement
            if (descInput) {
                descInput.value = `Bu harika mülk, ${aiPrompt} özelliklerine sahip olup, merkezi bir konumda yer almaktadır. Geniş pencereleri sayesinde gün boyu ışık alır. Modern mimarisi ve kaliteli malzemeleriyle dikkat çeker. Ailenizle huzurlu bir yaşam sürmeniz için idealdir.`
            }
            setIsGenerating(false)
            toast.success("AI Açıklama oluşturuldu!")
        }, 1500)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-12">

            {/* Temel Bilgiler */}
            <div className="bg-white p-6 rounded-xl border space-y-4 shadow-sm">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                    <Info className="h-5 w-5 text-blue-600" />
                    Temel İlan Bilgileri
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="title">İlan Başlığı</Label>
                        <Input id="title" name="title" placeholder="Örn: Deniz Manzaralı 3+1 Lüks Daire" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price">Fiyat (TL)</Label>
                        <Input id="price" name="price" placeholder="Örn: 5.250.000" required />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="location">Konum / Adres</Label>
                        <Input id="location" name="location" placeholder="İl, İlçe, Mahalle..." required />
                    </div>
                </div>
            </div>

            {/* Detaylı Özellikler (M2, Oda vb.) */}
            <div className="bg-white p-6 rounded-xl border space-y-4 shadow-sm">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                    <Ruler className="h-5 w-5 text-blue-600" />
                    Ölçüler ve Oda Bilgisi
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="m2Gross">Brüt m²</Label>
                        <Input id="m2Gross" name="m2Gross" type="number" placeholder="140" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="m2Net">Net m²</Label>
                        <Input id="m2Net" name="m2Net" type="number" placeholder="125" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="roomCount">Oda Sayısı</Label>
                        <Select name="roomCount">
                            <SelectTrigger>
                                <SelectValue placeholder="Seçiniz" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1+1">1+1</SelectItem>
                                <SelectItem value="2+1">2+1</SelectItem>
                                <SelectItem value="3+1">3+1</SelectItem>
                                <SelectItem value="4+1">4+1</SelectItem>
                                <SelectItem value="5+1">5+1</SelectItem>
                                <SelectItem value="Dublex">Dublex</SelectItem>
                                <SelectItem value="Studio">Stüdyo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="bathroomCount">Banyo Sayısı</Label>
                        <Input id="bathroomCount" name="bathroomCount" type="number" placeholder="1" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="balcony">Balkon</Label>
                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox id="balcony" name="balcony" />
                            <label htmlFor="balcony" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Balkon Var
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bina Özellikleri */}
            <div className="bg-white p-6 rounded-xl border space-y-4 shadow-sm">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                    <Building className="h-5 w-5 text-blue-600" />
                    Bina ve Yapı Özellikleri
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="buildingAge">Bina Yaşı</Label>
                        <Select name="buildingAge">
                            <SelectTrigger>
                                <SelectValue placeholder="Seçiniz" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">0 (Yeni)</SelectItem>
                                <SelectItem value="1-5">1-5</SelectItem>
                                <SelectItem value="5-10">5-10</SelectItem>
                                <SelectItem value="11-20">11-20</SelectItem>
                                <SelectItem value="21+">21 ve üzeri</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="floorLocation">Bulunduğu Kat</Label>
                        <Input id="floorLocation" name="floorLocation" placeholder="Örn: 5" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="heatingType">Isıtma Tipi</Label>
                        <Select name="heatingType">
                            <SelectTrigger>
                                <SelectValue placeholder="Seçiniz" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Kombi">Kombi (Doğalgaz)</SelectItem>
                                <SelectItem value="Merkezi">Merkezi</SelectItem>
                                <SelectItem value="Sobalı">Sobalı</SelectItem>
                                <SelectItem value="Yerden">Yerden Isıtma</SelectItem>
                                <SelectItem value="Klima">Klima</SelectItem>
                                <SelectItem value="Yok">Yok</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="usageStatus">Kullanım Durumu</Label>
                        <Select name="usageStatus">
                            <SelectTrigger>
                                <SelectValue placeholder="Seçiniz" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Boş">Boş</SelectItem>
                                <SelectItem value="Kiracılı">Kiracılı</SelectItem>
                                <SelectItem value="Mülk Sahibi">Mülk Sahibi Oturuyor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dues">Aidat (TL)</Label>
                        <Input id="dues" name="dues" type="number" placeholder="500" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="creditSuitable">Krediye Uygunluk</Label>
                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox id="creditSuitable" name="creditSuitable" defaultChecked />
                            <label htmlFor="creditSuitable" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Uygun
                            </label>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="furnished">Eşyalı</Label>
                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox id="furnished" name="furnished" />
                            <label htmlFor="furnished" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Eşyalı
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Medya ve Açıklama */}
            <div className="bg-white p-6 rounded-xl border space-y-4 shadow-sm">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                    <Upload className="h-5 w-5 text-blue-600" />
                    Görseller ve Açıklama
                </h3>

                <div className="space-y-2">
                    <Label htmlFor="image">İlan Fotoğrafı</Label>
                    <div className="flex items-center gap-4">
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                            className="cursor-pointer file:cursor-pointer"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="description">İlan Açıklaması</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="AI için ipuçları..."
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                className="h-8 w-48 text-xs"
                            />
                            <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={generateDescription}
                                disabled={isGenerating || !aiPrompt}
                            >
                                {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : "AI ile Yaz"}
                            </Button>
                        </div>
                    </div>
                    <Textarea
                        id="description"
                        name="description"
                        placeholder="İlan detayları..."
                        className="h-32"
                        required
                    />
                </div>
            </div>

            {/* Gizli ve Diğer Alanlar */}
            <input type="hidden" name="features" value="[]" /> {/* Geçici olarak boş array, ilerde detaylı özellik seçici eklenebilir */}


            <div className="flex justify-end">
                <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Home className="mr-2 h-4 w-4" />}
                    İlanı Yayınla
                </Button>
            </div>
        </form>
    )
}
