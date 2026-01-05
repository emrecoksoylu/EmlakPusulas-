export function formatCurrency(value: number | string): string {
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value

    if (isNaN(numValue)) return '0'

    return new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numValue)
}

export function parseCurrency(value: string): number {
    return parseFloat(value.replace(/[^0-9.]/g, '')) || 0
}
