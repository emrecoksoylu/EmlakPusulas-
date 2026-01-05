
"use client"

import { useState } from "react"
import { AlertCircle, Send, X } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { toast } from "sonner"

export function ReportIssue() {
    const [isOpen, setIsOpen] = useState(false)
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
                toast.success("Hata kaydı başarıyla gönderildi.")
                setTitle("")
                setDescription("")
                setIsOpen(false)
            } else {
                toast.error("Hata kaydı gönderilemedi.")
            }
        } catch (error) {
            toast.error("Bir sorun oluştu.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full border border-red-100 shadow-lg hover:bg-red-100 transition-all z-50 group"
            >
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Hata Bildir</span>
            </button>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md shadow-2xl border-none">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        Hata Bildir
                    </CardTitle>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Başlık</label>
                            <Input
                                placeholder="Hata nerede oluştu?"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Açıklama</label>
                            <Textarea
                                placeholder="Sorunu detaylıca açıklayınız..."
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                            Vazgeç
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
                            {isSubmitting ? "Gönderiliyor..." : (
                                <>
                                    Gönder
                                    <Send className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
