
"use server"

import { prisma } from "@/lib/prisma"

export async function findMatchesForCustomer(customerId: string) {
    const customer = await prisma.customer.findUnique({
        where: { id: customerId }
    })

    if (!customer) return []

    // Criteria-based matching
    return await prisma.listing.findMany({
        where: {
            status: "active",
            // Price range match
            AND: [
                customer.minPrice ? { priceNumeric: { gte: customer.minPrice } } : {},
                customer.maxPrice ? { priceNumeric: { lte: customer.maxPrice } } : {},
                // Partial location match (simple version)
                customer.preferredLocations ? {
                    location: {
                        contains: customer.preferredLocations.split(',')[0].trim()
                    }
                } : {},
                // Room count match
                customer.preferredRoomCount ? {
                    roomCount: customer.preferredRoomCount
                } : {}
            ]
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
}

export async function findMatchesForListing(listingId: string) {
    const listing = await prisma.listing.findUnique({
        where: { id: listingId }
    })

    if (!listing) return []

    const price = parseFloat(listing.price.replace(/[^0-9.]/g, ''))

    return await prisma.customer.findMany({
        where: {
            AND: [
                {
                    OR: [
                        { minPrice: null },
                        { minPrice: { lte: price } }
                    ]
                },
                {
                    OR: [
                        { maxPrice: null },
                        { maxPrice: { gte: price } }
                    ]
                },
                listing.roomCount ? {
                    OR: [
                        { preferredRoomCount: null },
                        { preferredRoomCount: listing.roomCount }
                    ]
                } : {}
            ]
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
}
