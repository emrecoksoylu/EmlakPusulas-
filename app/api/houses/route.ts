
import { NextResponse } from 'next/server';
import { scrapeHouses } from '@/lib/scraper';

export async function GET() {
    try {
        const houses = await scrapeHouses();
        return NextResponse.json(houses);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch houses' },
            { status: 500 }
        );
    }
}
