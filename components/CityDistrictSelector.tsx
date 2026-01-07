"use client"

import { useState, useEffect } from "react"
import { turkeyLocations } from "@/lib/turkey-locations"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface CityDistrictSelectorProps {
    name: string
    defaultValue?: string
    labelCity?: string
    labelDistrict?: string
    className?: string
}

export function CityDistrictSelector({
    name,
    defaultValue = "",
    labelCity = "İl",
    labelDistrict = "İlçe",
    className = ""
}: CityDistrictSelectorProps) {
    // Parse default value "City / District" or "City, District"
    const parseDefault = () => {
        if (!defaultValue) return { city: "", district: "" }
        const parts = defaultValue.split(/[\/,]+/).map(p => p.trim())
        return {
            city: parts[0] || "",
            district: parts[1] || ""
        }
    }

    const initial = parseDefault()
    const [selectedCity, setSelectedCity] = useState(initial.city)
    const [selectedDistrict, setSelectedDistrict] = useState(initial.district)

    // Reset district when city changes
    useEffect(() => {
        if (selectedCity && !Object.keys(turkeyLocations).includes(selectedCity)) {
            // If invalid city (maybe from manual entry previously), reset
            // But actually we should just try to match if possible or leave it.
        }
    }, [selectedCity])

    const handleCityChange = (city: string) => {
        setSelectedCity(city)
        setSelectedDistrict("") // Reset district
    }

    const handleDistrictChange = (district: string) => {
        setSelectedDistrict(district)
    }

    const districts = selectedCity ? (turkeyLocations as any)[selectedCity] || [] : []

    // Construct the hidden value
    const finalValue = selectedCity && selectedDistrict
        ? `${selectedCity} / ${selectedDistrict}`
        : selectedCity || ""

    return (
        <div className={`grid gap-4 md:grid-cols-2 ${className}`}>
            {/* Hidden input to pass value to the form via the original name */}
            <input type="hidden" name={name} value={finalValue} />

            <div className="space-y-2">
                <Label>{labelCity}</Label>
                <Select value={selectedCity} onValueChange={handleCityChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="İl Seçiniz" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                        {Object.keys(turkeyLocations).map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>{labelDistrict}</Label>
                <Select value={selectedDistrict} onValueChange={handleDistrictChange} disabled={!selectedCity}>
                    <SelectTrigger>
                        <SelectValue placeholder="İlçe Seçiniz" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                        {districts.map((district: string) => (
                            <SelectItem key={district} value={district}>{district}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
