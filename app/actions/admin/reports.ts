
"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function updateReportStatus(reportId: string, newStatus: string) {
    const session = await auth()

    // Authorization check
    if (!session?.user?.email || session.user.email !== "coksoyluemre@gmail.com") {
        throw new Error("Unauthorized")
    }

    await (prisma as any).errorReport.update({
        where: { id: reportId },
        data: { status: newStatus }
    })

    revalidatePath("/admin")
    revalidatePath("/dashboard/support")
}
