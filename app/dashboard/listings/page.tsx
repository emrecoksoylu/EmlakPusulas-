
import { Button } from "@/components/ui/button"
import { Plus, MapPin, Edit2 } from "lucide-react"
import Link from "next/link"
import { getListings } from "@/app/actions/listings"
import { Listing } from "@prisma/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatPrice } from "@/lib/utils"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const listings = await getListings()

    const activeListings = listings.filter(l => l.status === 'active' || !l.status)
    const passiveListings = listings.filter(l => l.status === 'passive' || l.status === 'archived')

    const renderListingGrid = (items: any[]) => {
        if (items.length === 0) {
            return (
                <div className="rounded-lg border bg-white p-12 text-center shadow-sm">
                    <h3 className="mt-2 text-lg font-semibold text-gray-900">Bu kategoride ilan bulunmuyor</h3>
                    <p className="mt-1 text-sm text-gray-500">Yeni bir ilan ekleyerek başlayabilirsiniz.</p>
                </div>
            )
        }

        return (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((listing) => (
                    <div key={listing.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group flex flex-col hover:border-blue-200 transition-all relative">
                        <Link href={`/dashboard/listings/${listing.id}`} className="absolute inset-0 z-0" />
                        <div className="relative z-10 pointer-events-none flex flex-col h-full">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={listing.imageUrl || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"}
                                    alt={listing.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-700">
                                    {listing.source}
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                        {listing.title}
                                    </h3>
                                </div>
                                <p className="text-lg font-bold text-blue-600 mb-2">{formatPrice(listing.priceNumeric || listing.price)} TL</p>

                                <div className="flex items-center text-sm text-gray-500 mb-4">
                                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                    {listing.location}
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                                    <span className={listing.status === 'passive' ? 'text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded' : 'text-green-600 font-medium bg-green-50 px-2 py-1 rounded'}>
                                        {listing.status === 'passive' ? 'Pasif' : 'Yayında'}
                                    </span>
                                    <div className="pointer-events-auto">
                                        <Button variant="ghost" size="sm" className="h-8" asChild>
                                            <Link href={`/dashboard/listings/${listing.id}`}>
                                                <Edit2 className="w-3 h-3 mr-1" /> Düzenle
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">İlanlarım</h1>
                    <p className="text-muted-foreground">
                        Mevcut ilanlarınızı yönetin ve durumlarını kontrol edin.
                    </p>
                </div>
                <Link href="/dashboard/listings/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" /> Yeni İlan Ekle
                    </Button>
                </Link>
            </div>

            <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
                    <TabsTrigger value="active">Aktif İlanlar ({activeListings.length})</TabsTrigger>
                    <TabsTrigger value="passive">Pasif / Arşiv ({passiveListings.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="active">
                    {renderListingGrid(activeListings)}
                </TabsContent>

                <TabsContent value="passive">
                    {renderListingGrid(passiveListings)}
                </TabsContent>
            </Tabs>
        </div>
    )
}
