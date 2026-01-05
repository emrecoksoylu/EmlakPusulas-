
"use client"

import { useState } from "react"
import Link from "next/link"
import { Customer, Listing } from "@prisma/client"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, User, Check, ChevronsUpDown, Share2, Power, PowerOff, Loader2 } from "lucide-react"
import { toggleCustomerInterest } from "@/app/actions/listing-details"
import { updateListingStatus } from "@/app/actions/listings"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface ListingDetailClientProps {
    listing: Listing & { interestedCustomers: Customer[] }
    allCustomers: Customer[]
}

export default function ListingDetailClient({ listing, allCustomers }: ListingDetailClientProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [isStatusUpdating, setIsStatusUpdating] = useState(false)

    const availableCustomers = allCustomers.filter(
        c => !listing.interestedCustomers.some(ic => ic.id === c.id)
    )

    const handleStatusToggle = async () => {
        const newStatus = listing.status === 'passive' ? 'active' : 'passive'
        setIsStatusUpdating(true)
        try {
            await updateListingStatus(listing.id, newStatus)
            toast.success(newStatus === 'active' ? "İlan yayına alındı" : "İlan pasife çekildi")
            router.refresh()
        } catch (error) {
            toast.error("İşlem başarısız")
        } finally {
            setIsStatusUpdating(false)
        }
    }

    const handleAddCustomer = async () => {
        if (!selectedCustomerId) return
        setIsLoading(true)
        try {
            await toggleCustomerInterest(listing.id, selectedCustomerId, 'add')
            toast.success("Müşteri ilana eklendi")
            setSelectedCustomerId("")
            setOpen(false)
            router.refresh()
        } catch (error) {
            toast.error("İşlem başarısız")
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemoveCustomer = async (customerId: string) => {
        if (!confirm("Bu müşteriyi bu ilandan çıkarmak istediğinize emin misiniz?")) return
        try {
            await toggleCustomerInterest(listing.id, customerId, 'remove')
            toast.success("Müşteri çıkarıldı")
            router.refresh()
        } catch (error) {
            toast.error("İşlem başarısız")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${listing.status === 'passive' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                            {listing.status === 'passive' ? 'PASİF' : 'YAYINDA'}
                        </span>
                    </div>
                    <p className="text-gray-500">{listing.location} • <span className="text-blue-600 font-bold">{listing.price} TL</span></p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleStatusToggle}
                        disabled={isStatusUpdating}
                        className={listing.status === 'passive' ? 'text-green-600 border-green-200 hover:bg-green-50' : 'text-orange-600 border-orange-200 hover:bg-orange-50'}
                    >
                        {isStatusUpdating ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : listing.status === 'passive' ? (
                            <Power className="mr-2 h-4 w-4" />
                        ) : (
                            <PowerOff className="mr-2 h-4 w-4" />
                        )}
                        {listing.status === 'passive' ? 'Yayına Al' : 'Pasife Çek'}
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/dashboard/listings")}>Geri Dön</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card className={listing.status === 'passive' ? 'opacity-75 grayscale-[0.5]' : ''}>
                        <CardHeader>
                            <CardTitle>İlan Detayları</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {listing.imageUrl && (
                                <img src={listing.imageUrl} alt={listing.title} className="w-full h-64 object-cover rounded-md" />
                            )}
                            <div>
                                <h3 className="font-semibold mb-2">Açıklama</h3>
                                <p className="text-gray-600 whitespace-pre-wrap">{listing.description}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Özellikler</h3>
                                <div className="flex flex-wrap gap-2">
                                    {listing.features.split(',').map((f, i) => (
                                        <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                            {f.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" /> İlgilenen Müşteriler
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex gap-2 w-full">
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className="w-full justify-between"
                                            >
                                                {selectedCustomerId
                                                    ? availableCustomers.find((customer) => customer.id === selectedCustomerId)?.name
                                                    : "Müşteri Ara..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[300px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Müşteri ara..." />
                                                <CommandList>
                                                    <CommandEmpty>Müşteri bulunamadı.</CommandEmpty>
                                                    <CommandGroup>
                                                        {availableCustomers.map((customer) => (
                                                            <CommandItem
                                                                key={customer.id}
                                                                value={customer.name}
                                                                onSelect={(currentValue) => {
                                                                    // CommandItem returns lowercase value, but we need ID. 
                                                                    // Actually we just set ID based on the map iteration.
                                                                    // But Shadcn command value prop is usually the search term.
                                                                    // We set selected ID manually.
                                                                    setSelectedCustomerId(customer.id === selectedCustomerId ? "" : customer.id)
                                                                    // setOpen(false) // Don't close immediately if we want to add via button next
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        selectedCustomerId === customer.id ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {customer.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>

                                    <Button onClick={handleAddCustomer} disabled={!selectedCustomerId || isLoading} size="icon">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="space-y-3 mt-4">
                                    {listing.interestedCustomers.length === 0 ? (
                                        <p className="text-sm text-gray-500 text-center py-4">Bu ilanla ilgilenen müşteri henüz eklenmedi.</p>
                                    ) : (
                                        listing.interestedCustomers.map(customer => {
                                            const featuresList = listing.features.split(',').slice(0, 5).join(', ')
                                            const message = `Merhaba ${customer.name}, seninle ilgini çekebilecek bir portföy paylaşmak istiyorum.\n\n*${listing.title}*\n\n📍 ${listing.location}\n💰 ${listing.price} TL\n\n🏠 Özellikler: ${featuresList}...\n\n📝 Açıklama: ${listing.description?.substring(0, 100)}...`
                                            const whatsappUrl = `https://wa.me/${customer.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`

                                            return (
                                                <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                    <div className="overflow-hidden">
                                                        <Link href={`/dashboard/customers/${customer.id}`} className="hover:text-blue-600 transition-colors">
                                                            <p className="font-medium text-sm truncate">{customer.name}</p>
                                                        </Link>
                                                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                                            {customer.phone && <span>{customer.phone}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {customer.phone && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                                onClick={() => window.open(whatsappUrl, '_blank')}
                                                                title="WhatsApp ile Gönder"
                                                            >
                                                                <Share2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleRemoveCustomer(customer.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
