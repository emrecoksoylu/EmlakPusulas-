
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
import { Loader2, Upload, Home, Ruler, Building, Info, X } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { CityDistrictSelector } from "@/components/CityDistrictSelector"

export function ListingForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [previewUrls, setPreviewUrls] = useState<string[]>([])
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([])

    // Debug logging state
    const [uploadLogs, setUploadLogs] = useState<string[]>([])

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString()
        setUploadLogs(prev => [`[${timestamp}] ${message}`, ...prev])
        console.log(`[Upload Debug] ${message}`)
    }

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        const files = Array.from(e.target.files)
        setUploading(true)
        setUploadLogs([]) // Clear previous logs
        addLog(`Starting upload for ${files.length} files`)

        // Dynamically import compression to avoid SSR issues
        const imageCompression = (await import('browser-image-compression')).default

        const options = {
            maxSizeMB: 0.5, // Aggressive compression (max 500KB)
            maxWidthOrHeight: 1280, // Safe for mobile data and standard screens
            useWebWorker: true,
            initialQuality: 0.7
        }

        try {
            toast.info("Fotoğraflar optimize ediliyor...")

            const compressedFiles = await Promise.all(
                files.map(async (file) => {
                    // Only compress images
                    if (file.type.startsWith('image/')) {
                        try {
                            console.log(`Original size (${file.name}):`, file.size / 1024 / 1024, "MB")

                            const compressedBlob = await imageCompression(file, options)

                            console.log(`Compressed size (${file.name}):`, compressedBlob.size / 1024 / 1024, "MB")

                            // Vercel Serverless Function Limit Check (4.5MB Body Size)
                            if (compressedBlob.size > 4.5 * 1024 * 1024) {
                                throw new Error(`Dosya çok büyük: ${file.name} (Sıkıştırma sonrası >4.5MB)`)
                            }

                            // Create a new File object to ensure we preserve the name
                            return new File([compressedBlob], file.name, {
                                type: compressedBlob.type,
                                lastModified: Date.now(),
                            })
                        } catch (err: any) {
                            console.error("Compression failed for", file.name, err)
                            // If it failed because it's too big, re-throw
                            if (err.message && err.message.includes("Dosya çok büyük")) {
                                throw err
                            }
                            return file // Fallback to original if compression fails
                        }
                    }
                    return file
                })
            )

            const formData = new FormData()
            compressedFiles.forEach(file => formData.append("images", file))

            // Local preview update (using compressed files is fine/better)
            const localPreviews = compressedFiles.map(file => URL.createObjectURL(file))
            setPreviewUrls(prev => [...prev, ...localPreviews])

            toast.info("Yükleme başladı...")

            // Upload to Supabase
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData
            })

            const data = await response.json()

            if (!response.ok) {
                // Determine user friendly error
                let errorMessage = "Yükleme başarısız"
                if (data.error?.includes("File too large")) errorMessage = "Dosya boyutu çok yüksek (max 5MB)"
                else if (data.error?.includes("Invalid file type")) errorMessage = "Geçersiz dosya formatı"

                throw new Error(errorMessage)
            }

            setUploadedUrls(prev => [...prev, ...data.urls])
            toast.success(`${files.length} fotoğraf başarıyla yüklendi`)
        } catch (error: any) {
            console.error("Upload error:", error)
            toast.error(error.message || "Fotoğraf yüklenirken hata oluştu")
        } finally {
            setUploading(false)
        }
    }

    const removeImage = (index: number) => {
        setPreviewUrls(prev => prev.filter((_, i) => i !== index))
        setUploadedUrls(prev => prev.filter((_, i) => i !== index))
    }

    // AI Generation State
    const [aiPrompt, setAiPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formData = new FormData(e.currentTarget)

            // Manually append images from state to ensure they are sent correctly
            // First, remove any 'images' that might have been picked up from the DOM (hidden inputs)
            formData.delete('images')

            // Append each URL from the state
            if (uploadedUrls.length > 0) {
                uploadedUrls.forEach(url => {
                    formData.append('images', url)
                })
            } else {
                // If using 'previewUrls' (blobs) without upload, we can't save. 
                // But typically uploadedUrls should be populated.
                console.warn("No uploaded URLs found in state")
            }

            console.log("Submitting form with images:", uploadedUrls)

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
                        <Input
                            id="price"
                            name="price"
                            placeholder="Örn: 5.250.000"
                            required
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '')
                                e.target.value = value ? parseInt(value).toLocaleString('tr-TR') : ''
                            }}
                        />
                    </div>



                    <div className="space-y-2 md:col-span-2">
                        <CityDistrictSelector name="location" labelCity="İl" labelDistrict="İlçe" />
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

                <div className="space-y-4">
                    <Label>İlan Fotoğrafları</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Upload Button */}
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors relative h-32">
                            <input
                                type="file"
                                id="images"
                                multiple
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                disabled={uploading}
                            />
                            {uploading ? (
                                <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                            ) : (
                                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            )}
                            <span className="text-xs text-gray-500 font-medium">
                                {uploading ? "Yükleniyor..." : "Fotoğraf Yükle"}
                            </span>
                        </div>

                        {/* Image Previews */}
                        {previewUrls.map((url, index) => (
                            <div key={url} className="relative group rounded-xl overflow-hidden border border-gray-200 h-32 bg-gray-100">
                                <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                                {index === 0 && (
                                    <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] py-1 text-center backdrop-blur-sm">
                                        Kapak Fotoğrafı
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                    {uploadedUrls.map(url => (
                        <input key={url} type="hidden" name="images" value={url} />
                    ))}
                </div>

                {/* Debug Logs Box */}
                {uploadLogs.length > 0 && (
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs font-mono overflow-y-auto max-h-48 border border-gray-700 shadow-inner">
                        <div className="flex justify-between items-center mb-2 border-b border-gray-700 pb-1">
                            <span className="font-bold text-gray-300">Yükleme Logları (Hata Durumunda Kopyala)</span>
                            <button type="button" onClick={() => setUploadLogs([])} className="text-gray-500 hover:text-white">Temizle</button>
                        </div>
                        {uploadLogs.map((log, i) => (
                            <div key={i} className={log.includes("FATAL") || log.includes("Error") ? "text-red-400 font-bold" : ""}>
                                {log}
                            </div>
                        ))}
                    </div>
                )}

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
                <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto" disabled={loading || uploading}>
                    {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : uploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Home className="mr-2 h-4 w-4" />
                    )}
                    {uploading ? "Fotoğraflar Yükleniyor..." : "İlanı Yayınla"}
                </Button>
            </div>
        </form>
    )
}
