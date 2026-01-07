import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Building2, Ruler, MapPin, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { ListingQRCode } from "@/components/ListingQRCode"
import { PrintButton } from "@/components/PrintButton"

export default async function PrintListingPage({ params }: { params: { id: string } }) {
    const listing = await prisma.listing.findUnique({
        where: { id: params.id },
        include: { agent: true }
    })

    if (!listing) {
        notFound()
    }

    const publicUrl = `https://emlakpusulasi.com/ilan/${listing.id}`

    return (
        <div className="bg-white min-h-screen text-black print:p-0 p-8">
            {/* Print Controls - Hidden when printing */}
            <div className="max-w-[210mm] mx-auto mb-8 print:hidden flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                <div>
                    <h1 className="font-bold">Vitrin Yazdırma Önizlemesi</h1>
                    <p className="text-sm text-gray-500">A4 kağıt boyutu için optimize edilmiştir.</p>
                </div>
                <PrintButton />
            </div>

            {/* A4 Page Container */}
            <div className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none print:w-full aspect-[1/1.414] relative flex flex-col overflow-hidden border print:border-0 border-gray-200">

                {/* 1. Main Photo Area (60% height) */}
                <div className="relative h-[60%] w-full bg-gray-100">
                    {listing.imageUrl ? (
                        <Image
                            src={listing.imageUrl}
                            alt={listing.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <Building2 className="h-32 w-32 text-gray-300" />
                        </div>
                    )}

                    {/* Badge */}
                    <div className="absolute top-8 right-8 bg-blue-600 text-white px-6 py-2 text-2xl font-bold rounded-l-xl shadow-lg print:shadow-none">
                        SATILIK
                    </div>
                </div>

                {/* 2. Details Area (40% height) */}
                <div className="flex-1 p-8 flex flex-col justify-between bg-white relative">

                    {/* Title & Price */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight uppercase">
                            {listing.title}
                        </h1>
                        <div className="flex items-center gap-2 text-gray-600 mb-6">
                            <MapPin className="h-5 w-5" />
                            <span className="text-xl">{listing.location}</span>
                        </div>

                        <div className="flex flex-wrap gap-6 mb-8">
                            <div className="bg-gray-50 px-6 py-3 rounded-lg border border-gray-200">
                                <span className="block text-sm text-gray-500 uppercase font-bold text-center">Oda Sayısı</span>
                                <span className="block text-2xl font-bold text-center">{listing.roomCount}</span>
                            </div>
                            <div className="bg-gray-50 px-6 py-3 rounded-lg border border-gray-200">
                                <span className="block text-sm text-gray-500 uppercase font-bold text-center">Net m²</span>
                                <span className="block text-2xl font-bold text-center">{listing.m2Net} m²</span>
                            </div>
                            <div className="bg-gray-50 px-6 py-3 rounded-lg border border-gray-200">
                                <span className="block text-sm text-gray-500 uppercase font-bold text-center">Isıtma</span>
                                <span className="block text-2xl font-bold text-center">{listing.heatingType || '-'}</span>
                            </div>
                        </div>

                        <div className="text-6xl font-black text-blue-700 tracking-tight">
                            {formatPrice(parseFloat(listing.price))}
                        </div>
                    </div>

                    {/* Footer: Agent & QR */}
                    <div className="border-t pt-6 flex items-end justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-bold uppercase mb-1">Daha Fazla Bilgi İçin</p>
                            <h2 className="text-2xl font-bold">{listing.agent.companyName || 'EmlakPusulası'}</h2>
                            <p className="text-xl">{listing.agent.name}</p>
                            <p className="text-xl font-mono mt-1">{listing.agent.email}</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="border-4 border-black p-1">
                                <ListingQRCode url={publicUrl} />
                            </div>
                            <p className="text-xs font-bold mt-2 uppercase tracking-wide">İlanı İncele</p>
                        </div>
                    </div>

                    {/* Decorative Bottom Bar */}
                    <div className="absolute bottom-0 left-0 w-full h-3 bg-blue-600 print:bg-blue-600" />
                </div>
            </div>
        </div>
    )
}
