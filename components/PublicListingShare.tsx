"use client"

import { Button } from "@/components/ui/button"
import { Share2, Link as LinkIcon, Check } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface PublicListingShareProps {
    title: string
    url?: string // Optional, computed on client if missing
}

export function PublicListingShare({ title, url }: PublicListingShareProps) {
    const [copied, setCopied] = useState(false)

    const handleShareWhatsapp = () => {
        const currentUrl = url || window.location.href
        const text = `Bu ilanı incele: ${title}\n${currentUrl}`
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
    }

    const handleCopyLink = () => {
        const currentUrl = url || window.location.href
        navigator.clipboard.writeText(currentUrl)
        setCopied(true)
        toast.success("Bağlantı kopyalandı")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="flex gap-2 w-full mt-4">
            <Button
                onClick={handleShareWhatsapp}
                className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold"
            >
                <Share2 className="mr-2 h-4 w-4" />
                WhatsApp Paylaş
            </Button>
            <Button
                onClick={handleCopyLink}
                variant="outline"
                className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
            >
                {copied ? <Check className="mr-2 h-4 w-4" /> : <LinkIcon className="mr-2 h-4 w-4" />}
                {copied ? "Kopyalandı" : "Link Kopyala"}
            </Button>
        </div>
    )
}
