import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Building2, Ruler, Calendar, MapPin, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"

import { PublicListingShare } from "@/components/PublicListingShare"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const listing = await prisma.listing.findUnique({ where: { id } })

    if (!listing) return { title: 'İlan Bulunamadı' }

    const price = formatPrice(parseFloat(listing.price))
    const title = `${listing.title} - ${price} TL`
    const description = `${listing.location} konumunda, ${listing.roomCount}, ${listing.m2Net}m² satılık gayrimenkul.`

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: listing.imageUrl ? [listing.imageUrl] : [],
        }
    }
}

export default async function PublicListingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const listing = await prisma.listing.findUnique({
        where: { id },
        include: { agent: true }
    })

    if (!listing) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Hero Image */}
            <div className="relative h-[300px] md:h-[400px] w-full bg-gray-900">
                {listing.imageUrl ? (
                    <Image
                        src={listing.imageUrl}
                        alt={listing.title}
                        fill
                        className="object-cover opacity-90"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-white">
                        <Building2 className="h-20 w-20 opacity-50" />
                    </div>
                )}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                    <h1 className="text-2xl md:text-4xl font-bold">{listing.title}</h1>
                    <div className="flex items-center gap-2 mt-2 text-gray-200">
                        <MapPin className="h-4 w-4" />
                        <span>{listing.location}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 -mt-10 relative z-10 space-y-6">
                {/* Price Card */}
                <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center justify-center text-center">
                    <span className="text-sm text-gray-500 uppercase tracking-widest font-semibold">Satış Fiyatı</span>
                    <div className="text-4xl font-extrabold text-blue-600 mt-2">
                        {formatPrice(parseFloat(listing.price))} TL
                    </div>
                </div>

                {/* Key Features Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                        <Ruler className="h-6 w-6 text-blue-500 mb-2" />
                        <span className="text-sm text-gray-500">Net m²</span>
                        <span className="font-bold text-lg">{listing.m2Net || '-'} m²</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                        <Building2 className="h-6 w-6 text-purple-500 mb-2" />
                        <span className="text-sm text-gray-500">Oda</span>
                        <span className="font-bold text-lg">{listing.roomCount}</span>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">İlan Açıklaması</h3>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {listing.description}
                    </p>
                </div>

                {/* Agent Contact Card */}
                <div className="bg-blue-900 rounded-xl shadow-lg p-6 text-white text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Phone className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-xl mb-1">{listing.agent.name || 'Emlak Danışmanı'}</h3>
                    <p className="text-blue-200 mb-6">{listing.agent.companyName || 'EmlakPusulası Üyesi'}</p>

                    <div className="space-y-3">
                        <a href={`tel:${listing.agent.email}`} className="block">
                            {/* Using email as placeholder if phone not available in schema yet */}
                            <Button className="w-full bg-white text-blue-900 hover:bg-gray-100 font-bold h-12">
                                Hemen Ara
                            </Button>
                        </a>

                        {/* Share Buttons */}
                        <PublicListingShare title={listing.title} />
                    </div>
                </div>
            </div>
        </div>
    )
}
