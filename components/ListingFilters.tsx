"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { turkeyLocations } from "@/lib/turkey-locations"

export function ListingFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [city, setCity] = useState(searchParams.get("city") || "")
    const [district, setDistrict] = useState(searchParams.get("district") || "")
    const [roomCount, setRoomCount] = useState(searchParams.get("roomCount") || "all")
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")

    // Reset filters
    const clearFilters = () => {
        setCity("")
        setDistrict("")
        setRoomCount("all")
        setMinPrice("")
        setMaxPrice("")
        router.push("/dashboard/listings")
    }

    // Debounce URL updates for text/number inputs
    const updateUrl = useDebouncedCallback((params: Record<string, string>) => {
        const newSearchParams = new URLSearchParams(searchParams.toString())

        Object.entries(params).forEach(([key, value]) => {
            if (value && value !== "all") {
                newSearchParams.set(key, value)
            } else {
                newSearchParams.delete(key)
            }
        })

        router.push(`/dashboard/listings?${newSearchParams.toString()}`)
    }, 500)

    // Effect to update URL when selected values change directly (Selects)
    useEffect(() => {
        const params: Record<string, string> = {}
        if (city) params.city = city
        if (district) params.district = district
        if (roomCount && roomCount !== "all") params.roomCount = roomCount

        // Only trigger if these strictly changed to avoid conflict with debouncer
        // But for Selects, immediate update is usually better.
        // We'll trust the individual handlers to manage their URL updates mostly or use a apply button. 
        // For better UX in modern dashboards, instantaneous or debounced auto-search is preferred.

    }, [city, district, roomCount])


    const handleCityChange = (value: string) => {
        setCity(value)
        setDistrict("") // Reset district
        updateUrl({ city: value, district: "", roomCount, minPrice, maxPrice })
    }

    const handleDistrictChange = (value: string) => {
        setDistrict(value)
        updateUrl({ city, district: value, roomCount, minPrice, maxPrice })
    }

    const handleRoomChange = (value: string) => {
        setRoomCount(value)
        updateUrl({ city, district, roomCount: value, minPrice, maxPrice })
    }

    const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMinPrice(e.target.value)
        updateUrl({ city, district, roomCount, minPrice: e.target.value, maxPrice })
    }

    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMaxPrice(e.target.value)
        updateUrl({ city, district, roomCount, minPrice, maxPrice: e.target.value })
    }

    const cities = turkeyLocations.map(l => l.city)
    const districts = city ? turkeyLocations.find(l => l.city === city)?.districts || [] : []

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                {/* City */}
                <div className="space-y-2">
                    <Label>Şehir</Label>
                    <Select value={city} onValueChange={handleCityChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Tümü" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all_cities_placeholder" disabled className="hidden">Tümü</SelectItem>
                            {/* Note: SelectItem value cannot be empty string in some versions, handling clear logic individually if needed or just don't have a clear option inside select */}
                            {cities.map(c => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* District */}
                <div className="space-y-2">
                    <Label>İlçe</Label>
                    <Select value={district} onValueChange={handleDistrictChange} disabled={!city}>
                        <SelectTrigger>
                            <SelectValue placeholder="Tümü" />
                        </SelectTrigger>
                        <SelectContent>
                            {districts.map(d => (
                                <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Room Count */}
                <div className="space-y-2">
                    <Label>Oda Sayısı</Label>
                    <Select value={roomCount} onValueChange={handleRoomChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Tümü" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tümü</SelectItem>
                            <SelectItem value="1+1">1+1</SelectItem>
                            <SelectItem value="2+1">2+1</SelectItem>
                            <SelectItem value="3+1">3+1</SelectItem>
                            <SelectItem value="4+1">4+1</SelectItem>
                            <SelectItem value="5+1">5+1</SelectItem>
                            <SelectItem value="Dublex">Dublex</SelectItem>
                            <SelectItem value="Studio">Stüdyo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-2 lg:col-span-2">
                    <Label>Fiyat Aralığı</Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Min"
                            value={minPrice}
                            onChange={handleMinPriceChange}
                            type="number"
                        />
                        <Input
                            placeholder="Max"
                            value={maxPrice}
                            onChange={handleMaxPriceChange}
                            type="number"
                        />
                    </div>
                </div>
            </div>

            {/* Active Filters Summary or Clear Button */}
            {(city || minPrice || maxPrice || roomCount !== "all") && (
                <div className="mt-4 flex justify-end">
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <X className="mr-2 h-4 w-4" />
                        Filtreleri Temizle
                    </Button>
                </div>
            )}
        </div>
    )
}
