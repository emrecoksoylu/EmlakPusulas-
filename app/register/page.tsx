
"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { register } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Building2, Loader2, UserPlus } from "lucide-react"

function RegisterButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full bg-green-600 hover:bg-green-700" type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
            Kayıt Ol
        </Button>
    )
}

export default function RegisterPage() {
    const [errorMessage, dispatch] = useActionState(register, undefined)

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-green-600 rounded-xl flex items-center justify-center text-white">
                        <Building2 className="h-8 w-8" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Hesap Oluşturun
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Emlak portföyünüzü yönetmeye başlayın
                    </p>
                </div>

                <div className="bg-white px-6 py-8 shadow-md rounded-lg border border-gray-100 sm:px-10">
                    <form action={dispatch} className="space-y-6">
                        <div>
                            <Label htmlFor="name">Ad Soyad</Label>
                            <Input id="name" name="name" type="text" autoComplete="name" required className="mt-1" />
                        </div>

                        <div>
                            <Label htmlFor="companyName">Şirket İsmi / Ünvan</Label>
                            <Input id="companyName" name="companyName" type="text" required className="mt-1" placeholder="Örn: Özden Gayrimenkul" />
                        </div>

                        <div>
                            <Label htmlFor="email">E-posta Adresi</Label>
                            <Input id="email" name="email" type="email" autoComplete="email" required className="mt-1" />
                        </div>

                        <div>
                            <Label htmlFor="password">Şifre</Label>
                            <Input id="password" name="password" type="password" autoComplete="new-password" required className="mt-1" minLength={6} />
                        </div>

                        {errorMessage && (
                            <div className="text-sm text-red-500 font-medium">
                                {errorMessage}
                            </div>
                        )}

                        <RegisterButton />
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-500">Zaten hesabınız var mı? </span>
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Giriş Yapın
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
