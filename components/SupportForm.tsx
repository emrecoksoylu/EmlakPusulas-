
"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { toast } from "sonner"

import { useRouter } from "next/navigation"

export function SupportForm() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch("/api/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description }),
            })

            if (response.ok) {
                toast.success("Hata kaydınız yöneticiye iletildi. Teşekkürler!")
                setTitle("")
                setDescription("")
                router.refresh()
            } else {
                toast.error("Hata kaydı gönderilemedi.")
            }
        } catch (error) {
            toast.error("Bir sorun oluştu.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Hata Başlığı</label>
                <Input
                    placeholder="Örn: İlan eklerken resim yüklenmiyor"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Açıklama</label>
                <Textarea
                    placeholder="Lütfen sorunu ve nasıl oluştuğunu açıklayın..."
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? "Gönderiliyor..." : (
                    <>
                        Bildirimi Gönder
                        <Send className="ml-2 h-4 w-4" />
                    </>
                )}
            </Button>
        </form>
    )
}
