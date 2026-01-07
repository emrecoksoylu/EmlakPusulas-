import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Building2, MapPin } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { ListingQRCode } from "@/components/ListingQRCode"
import { PrintButton } from "@/components/PrintButton"
import { headers } from "next/headers"

export default async function PrintListingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const listing = await prisma.listing.findUnique({
        where: { id },
        include: { agent: true }
    })

    if (!listing) {
        notFound()
    }

    // Dynamic Host Resolution for QR Code
    const headersList = await headers()
    const host = headersList.get('host') || 'emlakpusulasi.com'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const publicUrl = `${protocol}://${host}/ilan/${listing.id}`

    // Robust Image Strategy: DB Url -> First Array Image -> Hardcoded Placeholder
    const mainImage = listing.imageUrl
        || (listing.images && listing.images.length > 0 ? listing.images[0] : null)
        || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"

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

                {/* 1. Main Photo Area (40% height) - Reduced to give text room */}
                <div className="relative h-[40%] w-full bg-gray-100">
                    <Image
                        src={mainImage}
                        alt={listing.title}
                        fill
                        className="object-cover"
                        priority
                    />

                    {/* Badge */}
                    <div className="absolute top-6 right-6 bg-blue-600 text-white px-6 py-2 text-3xl font-black rounded-l-xl shadow-lg print:shadow-none tracking-widest">
                        SATILIK
                    </div>
                </div>

                {/* 2. Details Area (60% height) - Expanded to fit content */}
                <div className="flex-1 p-8 flex flex-col justify-between bg-white relative">

                    {/* Title & Price */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight uppercase line-clamp-2">
                            {listing.title}
                        </h1>
                        <div className="flex items-center gap-2 text-gray-600 mb-4">
                            <MapPin className="h-5 w-5" />
                            <span className="text-xl">{listing.location}</span>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-4">
                            <div className="bg-gray-50 px-6 py-3 rounded-xl border border-gray-200 flex-1 min-w-[120px]">
                                <span className="block text-sm text-gray-500 uppercase font-bold text-center mb-1">Oda</span>
                                <span className="block text-2xl font-bold text-center text-gray-900">{listing.roomCount}</span>
                            </div>
                            <div className="bg-gray-50 px-6 py-3 rounded-xl border border-gray-200 flex-1 min-w-[120px]">
                                <span className="block text-sm text-gray-500 uppercase font-bold text-center mb-1">m²</span>
                                <span className="block text-2xl font-bold text-center text-gray-900">{listing.m2Net}</span>
                            </div>
                            <div className="bg-gray-50 px-6 py-3 rounded-xl border border-gray-200 flex-1 min-w-[120px]">
                                <span className="block text-sm text-gray-500 uppercase font-bold text-center mb-1">Isıtma</span>
                                <span className="block text-xl font-bold text-center text-gray-900">{listing.heatingType?.substring(0, 10) || '-'}</span>
                            </div>
                        </div>

                        {/* PRICE - Made smaller to fit */}
                        <div className="text-7xl font-black text-blue-700 tracking-tighter mt-2">
                            {listing.priceNumeric
                                ? formatPrice(Number(listing.priceNumeric))
                                : formatPrice(parseFloat(listing.price.replace(/\./g, '').replace(',', '.')))
                            }
                            <span className="text-3xl text-gray-400 font-bold ml-2 tracking-normal relative -top-6">TL</span>
                        </div>
                    </div>

                    {/* Footer: Agent & QR */}
                    <div className="border-t pt-4 flex items-end justify-between">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase mb-1">Daha Fazla Bilgi İçin</p>
                            <h2 className="text-xl font-bold">{listing.agent.companyName || 'EmlakPusulası'}</h2>
                            <p className="text-lg">{listing.agent.name}</p>
                            <p className="text-lg font-mono mt-0.5">{listing.agent.email}</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="border-4 border-black p-1">
                                <ListingQRCode url={publicUrl} />
                            </div>
                            <p className="text-[10px] font-bold mt-1 uppercase tracking-wide">İlanı İncele</p>
                        </div>
                    </div>

                    {/* Decorative Bottom Bar */}
                    <div className="absolute bottom-0 left-0 w-full h-2 bg-blue-600 print:bg-blue-600" />
                </div>
            </div>
        </div>
    )
}
