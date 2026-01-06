
"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

import { auth } from "@/auth"

// Helper to get current authenticated agent
async function getDefaultAgent() {
    const session = await auth()

    if (!session?.user?.email) {
        throw new Error("Unauthorized")
    }

    const email = session.user.email

    return await prisma.agent.findUniqueOrThrow({
        where: { email }
    })
}

export async function createListing(formData: FormData) {
    const agent = await getDefaultAgent()

    const title = formData.get("title") as string
    const price = formData.get("price") as string
    const location = formData.get("location") as string
    const description = formData.get("description") as string
    const features = formData.get("features") as string

    // New Fields
    const m2Gross = parseInt(formData.get("m2Gross") as string) || null
    const m2Net = parseInt(formData.get("m2Net") as string) || null
    const roomCount = formData.get("roomCount") as string
    const buildingAge = formData.get("buildingAge") as string
    const floorLocation = formData.get("floorLocation") as string
    const heatingType = formData.get("heatingType") as string
    const bathroomCount = parseInt(formData.get("bathroomCount") as string) || null
    const balcony = formData.get("balcony") === "on"
    const furnished = formData.get("furnished") === "on"
    const usageStatus = formData.get("usageStatus") as string
    const dues = parseInt(formData.get("dues") as string) || null
    const creditSuitable = formData.get("creditSuitable") === "on"

    const imageIds = formData.getAll("images") as string[]

    // Default image if no images provided
    let imageUrl = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
    let images: string[] = []

    if (imageIds.length > 0) {
        images = imageIds
        imageUrl = imageIds[0]
    }

    const priceNumeric = parseFloat(price.replace(/[^0-9.]/g, ''))

    await (prisma as any).listing.create({
        data: {
            title,
            price,
            priceNumeric,
            location,
            description,
            features,
            m2Gross,
            m2Net,
            roomCount,
            buildingAge,
            floorLocation,
            heatingType,
            bathroomCount,
            balcony,
            furnished,
            usageStatus,
            dues,
            creditSuitable,
            source: "Internal",
            agentId: agent.id,
            imageUrl,
            images
        }
    })

    revalidatePath("/dashboard/listings")
}

export async function getListings() {
    const agent = await getDefaultAgent()

    const listings = await prisma.listing.findMany({
        where: {
            agentId: agent.id
        },
        include: {
            stats: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return listings.map(listing => ({
        ...listing,
        priceNumeric: (listing as any).priceNumeric ? (listing as any).priceNumeric.toNumber() : null
    }))
}
export async function updateListingStatus(listingId: string, newStatus: 'active' | 'passive') {
    await (prisma as any).listing.update({
        where: { id: listingId },
        data: { status: newStatus }
    })

    revalidatePath("/dashboard/listings")
    revalidatePath(`/dashboard/listings/${listingId}`)
}
