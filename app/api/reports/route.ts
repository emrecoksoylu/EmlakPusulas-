import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { title, description } = await req.json()

        if (!title || !description) {
            return new NextResponse("Missing fields", { status: 400 })
        }

        const agent = await prisma.agent.findUnique({
            where: { email: session.user.email }
        })

        if (!agent) {
            return new NextResponse("Agent not found", { status: 404 })
        }

        const report = await prisma.errorReport.create({
            data: {
                title,
                description,
                agentId: agent.id
            }
        })

        return NextResponse.json(report)
    } catch (error) {
        console.error("[REPORTS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
