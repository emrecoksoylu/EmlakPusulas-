import { DashboardSidebar } from "@/components/DashboardSidebar"
import { ReportIssue } from "@/components/ReportIssue"
import { Providers } from "@/components/Providers"
import { auth } from "@/auth"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    return (
        <Providers session={session}>
            <div className="flex h-screen bg-gray-50 overflow-hidden">
                <DashboardSidebar />
                <main className="flex-1 overflow-y-auto relative">
                    <div className="p-8">
                        {children}
                    </div>
                    <ReportIssue />
                </main>
            </div>
        </Providers>
    )
}
