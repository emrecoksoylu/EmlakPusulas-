
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-10 w-64 bg-gray-200 rounded" />
                    <div className="h-4 w-48 bg-gray-200 rounded" />
                </div>
                <div className="h-10 w-32 bg-gray-200 rounded" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="h-32 bg-gray-100 rounded-xl border border-gray-200" />
                <div className="h-32 bg-gray-100 rounded-xl border border-gray-200" />
            </div>

            <div className="space-y-4">
                <div className="h-8 w-48 bg-gray-200 rounded" />
                <div className="grid gap-4 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 bg-gray-100 rounded-xl border border-gray-200" />
                    ))}
                </div>
            </div>
        </div>
    )
}
