import { AppointmentType } from "@prisma/client"
import { Calendar, MapPin, FileText, Users, MoreHorizontal } from "lucide-react"

export function getMonthDays(year: number, month: number) {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: Date[] = []

    // Add previous month's days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(year, month, -i)
        days.push(date)
    }

    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i))
    }

    // Add next month's days to complete the grid
    const remainingDays = 42 - days.length // 6 rows × 7 days
    for (let i = 1; i <= remainingDays; i++) {
        days.push(new Date(year, month + 1, i))
    }

    return days
}

export function formatAppointmentTime(start: Date, end: Date): string {
    const startTime = start.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
    })
    const endTime = end.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
    })

    return `${startTime} - ${endTime}`
}

export function getAppointmentTypeColor(type: AppointmentType): string {
    const colors = {
        PROPERTY_VIEWING: 'bg-blue-100 text-blue-700 border-blue-200',
        LAND_REGISTRY: 'bg-purple-100 text-purple-700 border-purple-200',
        NOTARY: 'bg-amber-100 text-amber-700 border-amber-200',
        CLIENT_MEETING: 'bg-green-100 text-green-700 border-green-200',
        OTHER: 'bg-gray-100 text-gray-700 border-gray-200',
    }

    return colors[type] || colors.OTHER
}

export function getAppointmentTypeIcon(type: AppointmentType) {
    const icons = {
        PROPERTY_VIEWING: MapPin,
        LAND_REGISTRY: FileText,
        NOTARY: FileText,
        CLIENT_MEETING: Users,
        OTHER: MoreHorizontal,
    }

    return icons[type] || icons.OTHER
}

export function getAppointmentTypeLabel(type: AppointmentType): string {
    const labels = {
        PROPERTY_VIEWING: 'Ev Gösterme',
        LAND_REGISTRY: 'Tapu Dairesi',
        NOTARY: 'Noter',
        CLIENT_MEETING: 'Müşteri Görüşmesi',
        OTHER: 'Diğer',
    }

    return labels[type] || labels.OTHER
}

export function isConflicting(
    appointments: Array<{ startTime: Date; endTime: Date }>,
    newStart: Date,
    newEnd: Date
): boolean {
    return appointments.some(apt => {
        const aptStart = new Date(apt.startTime)
        const aptEnd = new Date(apt.endTime)

        // Check if times overlap
        return (
            (newStart >= aptStart && newStart < aptEnd) || // New starts during existing
            (newEnd > aptStart && newEnd <= aptEnd) || // New ends during existing
            (newStart <= aptStart && newEnd >= aptEnd) // New contains existing
        )
    })
}

export function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    )
}

export function formatDate(date: Date): string {
    return date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

export function formatDateShort(date: Date): string {
    return date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short'
    })
}
