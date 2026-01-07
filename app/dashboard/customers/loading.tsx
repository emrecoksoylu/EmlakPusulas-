
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
                <div className="h-10 w-32 bg-gray-200 rounded" />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex gap-4">
                    <div className="h-10 flex-1 bg-gray-200 rounded" />
                    <div className="h-10 w-32 bg-gray-200 rounded" />
                </div>

                <div className="p-4 space-y-4">
                    {/* Header Row */}
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="h-4 w-1/4 bg-gray-200 rounded" />
                        <div className="h-4 w-1/4 bg-gray-200 rounded" />
                        <div className="h-4 w-1/4 bg-gray-200 rounded" />
                        <div className="h-4 w-10 bg-gray-200 rounded" />
                    </div>

                    {/* Data Rows */}
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                            <div className="h-10 w-10 rounded-full bg-gray-200 mr-4" />
                            <div className="space-y-2 flex-1">
                                <div className="h-4 w-1/3 bg-gray-200 rounded" />
                                <div className="h-3 w-1/4 bg-gray-200 rounded" />
                            </div>
                            <div className="h-6 w-20 bg-gray-200 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
