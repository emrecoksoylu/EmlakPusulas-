
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function saveContract(data: {
    type: string,
    content: string,
    customerId: string,
    listingId?: string,
    agentId: string
}) {
    const contract = await prisma.contract.create({
        data: {
            type: data.type,
            content: data.content,
            customerId: data.customerId,
            listingId: data.listingId,
            agentId: data.agentId,
            status: "draft"
        }
    })

    revalidatePath("/dashboard/contracts")
    return contract
}

export async function getContracts() {
    return await prisma.contract.findMany({
        include: {
            customer: true,
            listing: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
}
