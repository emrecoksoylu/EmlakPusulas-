import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { type, content, customerId, listingId } = body

        // Get agent ID from session
        const agent = await prisma.agent.findUnique({
            where: { email: session.user.email! }
        })

        if (!agent) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 })
        }

        const contract = await prisma.contract.create({
            data: {
                type,
                content,
                customerId,
                listingId,
                agentId: agent.id,
                status: "draft"
            }
        })

        return NextResponse.json(contract, { status: 201 })
    } catch (error) {
        console.error("Contract creation error:", error)
        return NextResponse.json({ error: "Failed to create contract" }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const agent = await prisma.agent.findUnique({
            where: { email: session.user.email! }
        })

        if (!agent) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 })
        }

        const contracts = await prisma.contract.findMany({
            where: { agentId: agent.id },
            include: {
                customer: true,
                listing: true
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(contracts)
    } catch (error) {
        console.error("Contract fetch error:", error)
        return NextResponse.json({ error: "Failed to fetch contracts" }, { status: 500 })
    }
}
