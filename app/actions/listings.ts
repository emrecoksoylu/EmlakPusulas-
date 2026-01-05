
"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

// Helper to get or create a default agent for development
async function getDefaultAgent() {
    const email = "demo@emlakasistani.com"

    return await prisma.agent.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: "Demo Emlakçı"
        }
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

    const file = formData.get("image") as File

    let imageUrl = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80" // Default

    if (file && file.size > 0) {
        try {
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)

            // Ensure directory exists
            const uploadDir = join(process.cwd(), "public", "uploads")
            await mkdir(uploadDir, { recursive: true })

            // Create unique filename
            const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`
            const filepath = join(uploadDir, filename)

            // Write file
            await writeFile(filepath, buffer)
            imageUrl = `/uploads/${filename}`
        } catch (error) {
            console.error("Error uploading file:", error)
            // Continue with default image if upload fails
        }
    }

    await prisma.listing.create({
        data: {
            title,
            price,
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
            imageUrl
        }
    })

    revalidatePath("/dashboard/listings")
}

export async function getListings() {
    const agent = await getDefaultAgent()

    return await prisma.listing.findMany({
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
}
export async function updateListingStatus(listingId: string, newStatus: 'active' | 'passive') {
    await (prisma as any).listing.update({
        where: { id: listingId },
        data: { status: newStatus }
    })

    revalidatePath("/dashboard/listings")
    revalidatePath(`/dashboard/listings/${listingId}`)
}
