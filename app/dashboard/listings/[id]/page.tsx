
import { getListing } from "@/app/actions/listing-details"
import { getCustomers } from "@/app/actions/customers"
import ListingDetailClient from "@/components/ListingDetailClient"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function ListingDetailPage({ params }: PageProps) {
    const { id } = await params
    const listingData = getListing(id)
    const customersData = getCustomers()

    const [listing, customers] = await Promise.all([listingData, customersData])

    if (!listing) {
        notFound()
    }

    return <ListingDetailClient listing={listing} allCustomers={customers} />
}
