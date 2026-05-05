
"use server"

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirectTo: '/dashboard'
        })
    } catch (error) {
        if (error instanceof AuthError) {
            console.error("[AUTH] AuthError details:", error.type, error.message);
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Hatalı e-posta veya şifre.'
                default:
                    return 'Bir hata oluştu: ' + error.type
            }
        }
        // Next.js redirect errors should be re-thrown
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            throw error;
        }
        console.error("[AUTH] Unexpected error:", error);
        throw error
    }
}

export async function logout() {
    await signOut({ redirectTo: "/login" })
}
