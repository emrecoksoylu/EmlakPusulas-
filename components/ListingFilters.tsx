"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
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

    // Manual search trigger
    const handleSearch = () => {
        const newSearchParams = new URLSearchParams()

        if (city) newSearchParams.set("city", city)
        if (district) newSearchParams.set("district", district)
        if (roomCount && roomCount !== "all") newSearchParams.set("roomCount", roomCount)
        if (minPrice) newSearchParams.set("minPrice", minPrice)
        if (maxPrice) newSearchParams.set("maxPrice", maxPrice)

        router.push(`/dashboard/listings?${newSearchParams.toString()}`)
    }

    const handleCityChange = (value: string) => {
        setCity(value)
        setDistrict("") // Reset district
    }

    const cities = Object.keys(turkeyLocations)
    const districts = city ? (turkeyLocations as any)[city] || [] : []

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                {/* City */}
                <div className="space-y-2">
                    <Label>Şehir</Label>
                    <Select value={city} onValueChange={handleCityChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Tümü" />
                        </SelectTrigger>
                        <SelectContent>
                            {cities.map(c => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* District */}
                <div className="space-y-2">
                    <Label>İlçe</Label>
                    <Select value={district} onValueChange={setDistrict} disabled={!city}>
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
                    <Select value={roomCount} onValueChange={setRoomCount}>
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
                            onChange={(e) => setMinPrice(e.target.value)}
                            type="number"
                        />
                        <Input
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            type="number"
                        />
                    </div>
                </div>

                {/* Search Button */}
                <div className="flex gap-2">
                    <Button onClick={handleSearch} className="w-full bg-blue-600 hover:bg-blue-700">
                        <Search className="h-4 w-4 mr-2" />
                        Ara
                    </Button>
                    {(city || minPrice || maxPrice || roomCount !== "all") && (
                        <Button variant="ghost" size="icon" onClick={clearFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0" title="Temizle">
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
