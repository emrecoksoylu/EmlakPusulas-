"use client"

import { QRCodeSVG } from 'qrcode.react'

export function ListingQRCode({ url }: { url: string }) {
    return (
        <QRCodeSVG
            value={url}
            size={120}
            level="H"
            includeMargin={true}
            includeMargin={true}
        />
    )
}
