
"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    companyName: z.string().min(2),
})

export async function register(prevState: string | undefined, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse(Object.fromEntries(formData.entries()))

    if (!validatedFields.success) {
        const errorMap = validatedFields.error.flatten().fieldErrors;
        let errorMessage = "Lütfen bilgilerinizi kontrol edin:";
        if (errorMap.name) errorMessage += ` İsim: ${errorMap.name[0]}`;
        if (errorMap.email) errorMessage += ` E-posta: ${errorMap.email[0]}`;
        if (errorMap.password) errorMessage += ` Şifre: ${errorMap.password[0]}`;
        return errorMessage;
    }

    const { email, password, name, companyName } = validatedFields.data

    try {
        const existingUser = await prisma.agent.findUnique({
            where: { email },
        })

        if (existingUser) {
            return "Bu e-posta adresi ile zaten bir hesap mevcut."
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.agent.create({
            data: {
                email,
                name,
                companyName,
                password: hashedPassword,
            },
        })

    } catch (error) {
        console.error("Registration error:", error)
        return "Bir hata oluştu. Lütfen daha sonra tekrar deneyin."
    }

    redirect("/login")
}
