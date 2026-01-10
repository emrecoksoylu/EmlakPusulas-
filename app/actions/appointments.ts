'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { AppointmentStatus, AppointmentType } from "@prisma/client"

export async function createAppointment(formData: FormData) {
    const session = await auth()
    if (!session?.user?.email) {
        throw new Error("Unauthorized")
    }

    const agent = await prisma.agent.findUnique({
        where: { email: session.user.email }
    })

    if (!agent) {
        throw new Error("Agent not found")
    }

    const title = formData.get("title") as string
    const type = formData.get("type") as AppointmentType
    const startTime = new Date(formData.get("startTime") as string)
    const endTime = new Date(formData.get("endTime") as string)
    const location = formData.get("location") as string | null
    const address = formData.get("address") as string | null
    const customerId = formData.get("customerId") as string | null
    const listingId = formData.get("listingId") as string | null
    const notes = formData.get("notes") as string | null

    // Check for conflicts
    const hasConflict = await checkConflicts(agent.id, startTime, endTime)
    if (hasConflict) {
        throw new Error("Bu zaman diliminde başka bir randevunuz var")
    }

    const appointment = await prisma.appointment.create({
        data: {
            title,
            type,
            startTime,
            endTime,
            location,
            address,
            agentId: agent.id,
            customerId: customerId || undefined,
            listingId: listingId || undefined,
            notes,
        }
    })

    revalidatePath("/dashboard/calendar")
    revalidatePath("/dashboard")

    return appointment
}

export async function updateAppointment(id: string, formData: FormData) {
    const session = await auth()
    if (!session?.user?.email) {
        throw new Error("Unauthorized")
    }

    const agent = await prisma.agent.findUnique({
        where: { email: session.user.email }
    })

    if (!agent) {
        throw new Error("Agent not found")
    }

    const title = formData.get("title") as string
    const type = formData.get("type") as AppointmentType
    const startTime = new Date(formData.get("startTime") as string)
    const endTime = new Date(formData.get("endTime") as string)
    const location = formData.get("location") as string | null
    const address = formData.get("address") as string | null
    const customerId = formData.get("customerId") as string | null
    const listingId = formData.get("listingId") as string | null
    const notes = formData.get("notes") as string | null
    const status = formData.get("status") as AppointmentStatus

    // Check for conflicts (excluding current appointment)
    const hasConflict = await checkConflicts(agent.id, startTime, endTime, id)
    if (hasConflict) {
        throw new Error("Bu zaman diliminde başka bir randevunuz var")
    }

    const appointment = await prisma.appointment.update({
        where: { id, agentId: agent.id },
        data: {
            title,
            type,
            startTime,
            endTime,
            location,
            address,
            customerId: customerId || null,
            listingId: listingId || null,
            notes,
            status,
        }
    })

    revalidatePath("/dashboard/calendar")
    revalidatePath("/dashboard")

    return appointment
}

export async function deleteAppointment(id: string) {
    const session = await auth()
    if (!session?.user?.email) {
        throw new Error("Unauthorized")
    }

    const agent = await prisma.agent.findUnique({
        where: { email: session.user.email }
    })

    if (!agent) {
        throw new Error("Agent not found")
    }

    await prisma.appointment.delete({
        where: { id, agentId: agent.id }
    })

    revalidatePath("/dashboard/calendar")
    revalidatePath("/dashboard")
}

export async function getAppointments(
    agentId: string,
    startDate?: Date,
    endDate?: Date
) {
    const where: any = { agentId }

    if (startDate && endDate) {
        where.startTime = {
            gte: startDate,
            lte: endDate
        }
    }

    return await prisma.appointment.findMany({
        where,
        include: {
            customer: true,
            listing: true,
        },
        orderBy: {
            startTime: 'asc'
        }
    })
}

export async function getAppointmentById(id: string) {
    return await prisma.appointment.findUnique({
        where: { id },
        include: {
            customer: true,
            listing: true,
            agent: true,
        }
    })
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
    const session = await auth()
    if (!session?.user?.email) {
        throw new Error("Unauthorized")
    }

    const agent = await prisma.agent.findUnique({
        where: { email: session.user.email }
    })

    if (!agent) {
        throw new Error("Agent not found")
    }

    const appointment = await prisma.appointment.update({
        where: { id, agentId: agent.id },
        data: { status }
    })

    revalidatePath("/dashboard/calendar")
    revalidatePath("/dashboard")

    return appointment
}

export async function checkConflicts(
    agentId: string,
    startTime: Date,
    endTime: Date,
    excludeId?: string
): Promise<boolean> {
    const where: any = {
        agentId,
        status: {
            not: 'CANCELLED'
        },
        OR: [
            {
                // New appointment starts during existing appointment
                AND: [
                    { startTime: { lte: startTime } },
                    { endTime: { gt: startTime } }
                ]
            },
            {
                // New appointment ends during existing appointment
                AND: [
                    { startTime: { lt: endTime } },
                    { endTime: { gte: endTime } }
                ]
            },
            {
                // New appointment completely contains existing appointment
                AND: [
                    { startTime: { gte: startTime } },
                    { endTime: { lte: endTime } }
                ]
            }
        ]
    }

    if (excludeId) {
        where.id = { not: excludeId }
    }

    const conflicts = await prisma.appointment.findMany({ where })

    return conflicts.length > 0
}

export async function getTodaysAppointments(agentId: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return await getAppointments(agentId, today, tomorrow)
}
