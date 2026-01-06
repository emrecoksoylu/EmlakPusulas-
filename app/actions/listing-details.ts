
"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

// Get single listing with details
export async function getListing(id: string) {
    const listing = await prisma.listing.findUnique({
        where: { id },
        include: {
            interestedCustomers: true,
            agent: true
        }
    })

    if (!listing) return null

    return {
        ...listing,
        priceNumeric: listing.priceNumeric ? listing.priceNumeric.toNumber() : null,
        interestedCustomers: listing.interestedCustomers.map(customer => ({
            ...customer,
            minPrice: customer.minPrice ? customer.minPrice.toNumber() : null,
            maxPrice: customer.maxPrice ? customer.maxPrice.toNumber() : null,
        }))
    }
}

// Add or Remove customer from a listing
export async function toggleCustomerInterest(listingId: string, customerId: string, action: 'add' | 'remove') {
    if (action === 'add') {
        await prisma.listing.update({
            where: { id: listingId },
            data: {
                interestedCustomers: {
                    connect: { id: customerId }
                }
            }
        })
    } else {
        await prisma.listing.update({
            where: { id: listingId },
            data: {
                interestedCustomers: {
                    disconnect: { id: customerId }
                }
            }
        })
    }

    revalidatePath(`/dashboard/listings/${listingId}`)
}
