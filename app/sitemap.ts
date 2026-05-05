import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://emlakpusulasi.com'

    // Static pages
    const routes = [
        '',
        '/login',
        '/register',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 1,
    }))

    // Dynamic listings
    const listings = await prisma.listing.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true, updatedAt: true },
        take: 5000, // Limit for safety
    })

    const listingUrls = listings.map((listing) => ({
        url: `${baseUrl}/ilan/${listing.id}`,
        lastModified: listing.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [...routes, ...listingUrls]
}
