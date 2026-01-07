
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
            <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 bg-gray-200 rounded-full" />
                <div>
                    <div className="h-8 w-48 bg-gray-200 rounded mb-1" />
                    <div className="h-4 w-64 bg-gray-200 rounded" />
                </div>
            </div>

            {/* Main Info Section */}
            <div className="bg-white p-6 rounded-xl border space-y-4 shadow-sm">
                <div className="h-6 w-32 bg-gray-200 rounded mb-4" />

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <div className="h-4 w-20 bg-gray-200 rounded" />
                        <div className="h-10 w-full bg-gray-200 rounded" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-20 bg-gray-200 rounded" />
                        <div className="h-10 w-full bg-gray-200 rounded" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <div className="h-10 w-full bg-gray-200 rounded" />
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="bg-white p-6 rounded-xl border space-y-4 shadow-sm">
                <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
                <div className="grid gap-4 md:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200 rounded" />
                            <div className="h-10 w-full bg-gray-200 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
