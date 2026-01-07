"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Listing } from "@prisma/client"

interface DashboardChartsProps {
    listings: Listing[]
}

const COLORS = ['#2563eb', '#94a3b8', '#f59e0b', '#10b981']

export function DashboardCharts({ listings }: DashboardChartsProps) {
    // 1. Status Distribution
    const statusData = [
        { name: 'Aktif', value: listings.filter((l: any) => l.status === 'active' || !l.status).length },
        { name: 'Pasif', value: listings.filter((l: any) => l.status === 'passive').length },
    ].filter(item => item.value > 0)

    // 2. Room Count Distribution
    const roomCounts = listings.reduce((acc: Record<string, number>, listing: any) => {
        const room = listing.roomCount || 'Diğer'
        acc[room] = (acc[room] || 0) + 1
        return acc
    }, {})

    const roomCountData = Object.entries(roomCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5) // Top 5 room types

    return (
        <div className="grid gap-4 md:grid-cols-2 mt-6">
            {/* Status Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">İlan Durumu Dağılımı</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Room Count Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Oda Sayısı Dağılımı</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={roomCountData}>
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} name="İlan Sayısı" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
