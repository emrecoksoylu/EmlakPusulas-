
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
                <div className="h-10 w-32 bg-gray-200 roundedish" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full flex flex-col">
                        {/* Image Skeleton */}
                        <div className="relative h-48 bg-gray-200" />

                        <div className="p-4 flex flex-col flex-1 space-y-3">
                            {/* Badges */}
                            <div className="flex gap-2">
                                <div className="h-5 w-16 bg-gray-200 rounded-full" />
                                <div className="h-5 w-20 bg-gray-200 rounded-full" />
                            </div>

                            {/* Title & Price */}
                            <div className="space-y-1">
                                <div className="h-6 w-3/4 bg-gray-200 rounded" />
                                <div className="h-6 w-1/2 bg-gray-200 rounded" />
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-1">
                                <div className="h-4 w-4 bg-gray-200 rounded-full" />
                                <div className="h-4 w-40 bg-gray-200 rounded" />
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div className="h-4 w-full bg-gray-200 rounded" />
                                <div className="h-4 w-full bg-gray-200 rounded" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
