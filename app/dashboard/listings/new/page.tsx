
import { ListingForm } from "@/components/ListingForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddListingPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Yeni İlan Ekle</h1>
                <p className="text-gray-500 mt-2">
                    İlan bilgilerini girin, yapay zeka sizin için etkileyici bir açıklama yazsın.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>İlan Detayları</CardTitle>
                    <CardDescription>
                        Temel bilgileri doldurduktan sonra EmlakPusulası yapay zekasını kullanabilirsiniz.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ListingForm />
                </CardContent>
            </Card>
        </div>
    )
}
