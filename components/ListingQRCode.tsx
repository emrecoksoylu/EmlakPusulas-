"use client"

import { QRCodeSVG } from 'qrcode.react'

export function ListingQRCode({ url }: { url: string }) {
    return (
        <QRCodeSVG
            value={url}
            size={120}
            level="H"
            includeMargin={true}
            imageSettings={{
                src: "/icon.png", // Fallback or placeholder, optional
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                excavate: true,
            }}
        />
    )
}
