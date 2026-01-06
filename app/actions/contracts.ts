
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
    const contracts = await prisma.contract.findMany({
        include: {
            customer: true,
            listing: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return contracts.map(contract => ({
        ...contract,
        listing: contract.listing ? {
            ...contract.listing,
            priceNumeric: (contract.listing as any).priceNumeric ? (contract.listing as any).priceNumeric.toNumber() : null
        } : null,
        // sanitize customer if needed, but customer usually doesn't have Decimal unless minPrice/maxPrice are there.
        // Customer has minPrice/maxPrice as Decimal? Yes.
        customer: {
            ...contract.customer,
            minPrice: (contract.customer as any).minPrice ? (contract.customer as any).minPrice.toNumber() : null,
            maxPrice: (contract.customer as any).maxPrice ? (contract.customer as any).maxPrice.toNumber() : null
        }
    }))
}
