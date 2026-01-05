
"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

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

export async function createCustomer(formData: FormData) {
    const agent = await getDefaultAgent()

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const notes = formData.get("notes") as string
    const status = (formData.get("status") as string) || "lead"

    await prisma.customer.create({
        data: {
            name,
            email,
            phone,
            notes,
            status,
            agentId: agent.id
        }
    })

    revalidatePath("/dashboard/customers")
}

export async function getCustomers() {
    const agent = await getDefaultAgent()

    return await prisma.customer.findMany({
        where: {
            agentId: agent.id
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
}

export async function updateCustomer(id: string, formData: FormData) {
    const agent = await getDefaultAgent()

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const notes = formData.get("notes") as string
    const status = (formData.get("status") as string) || "lead"

    // Verify ownership
    const existing = await prisma.customer.findFirst({
        where: { id, agentId: agent.id }
    })

    if (!existing) {
        throw new Error("Müşteri bulunamadı veya yetkiniz yok.")
    }

    await prisma.customer.update({
        where: { id },
        data: {
            name,
            email,
            phone,
            notes,
            status
        }
    })

    revalidatePath("/dashboard/customers")
    revalidatePath(`/dashboard/customers/${id}`)
}

export async function getCustomer(id: string) {
    const agent = await getDefaultAgent()

    return await prisma.customer.findFirst({
        where: {
            id,
            agentId: agent.id
        }
    })
}
