
"use client"

import { useFormState, useFormStatus } from "react-dom"
import { authenticate } from "@/app/actions/authenticate"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Building2, Loader2, KeyRound } from "lucide-react"
import { SplashIntro } from "@/components/SplashIntro"
import { useState, useEffect } from "react"

function LoginButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
            Giriş Yap
        </Button>
    )
}

export function LoginForm() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined)
    const [showSplash, setShowSplash] = useState(false)

    useEffect(() => {
        // Only show splash if it hasn't been shown in this session
        const hasShown = sessionStorage.getItem("splashShown")
        if (!hasShown) {
            setShowSplash(true)
        }
    }, [])

    const handleSplashComplete = () => {
        setShowSplash(false)
        sessionStorage.setItem("splashShown", "true")
    }

    return (
        <>
            {showSplash && <SplashIntro onComplete={handleSplashComplete} />}
            <div className={`flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 transition-opacity duration-1000 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                            <Building2 className="h-8 w-8" />
                        </div>
                        <h2 className="mt-6 text-3xl font-bold tracking-tight text-blue-900">
                            Emlak<span className="text-blue-600">Pusulası</span>
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Hesabınıza giriş yapın
                        </p>
                    </div>

                    <div className="bg-white px-6 py-8 shadow-md rounded-lg border border-gray-100 sm:px-10">
                        <form action={dispatch} className="space-y-6">
                            <div>
                                <Label htmlFor="email">E-posta Adresi</Label>
                                <Input id="email" name="email" type="email" autoComplete="email" required className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="password">Şifre</Label>
                                <Input id="password" name="password" type="password" autoComplete="current-password" required className="mt-1" />
                            </div>

                            {errorMessage && (
                                <div className="text-sm text-red-500 font-medium">
                                    {errorMessage}
                                </div>
                            )}

                            <LoginButton />
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-500">Hesabınız yok mu? </span>
                            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                                Kayıt Olun
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
