import NextAuth, { DefaultSession } from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';


async function getUser(email: string) {
    try {
        const user = await prisma.agent.findUnique({ where: { email } });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    trustHost: true,
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            async authorize(credentials) {
                try {
                    console.log("[AUTH] Authorize attempt for:", credentials?.email);
                    const parsedCredentials = z
                        .object({ email: z.string().email(), password: z.string().min(6) })
                        .safeParse(credentials);

                    if (!parsedCredentials.success) {
                        console.log("[AUTH] Validation failed:", parsedCredentials.error.flatten());
                        return null;
                    }

                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);

                    if (!user) {
                        console.log("[AUTH] User not found in DB:", email);
                        return null;
                    }

                    if (!user.password) {
                        console.log("[AUTH] User has no password set:", email);
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) {
                        console.log("[AUTH] Success:", email);
                        return user;
                    }

                    console.log("[AUTH] Password mismatch:", email);
                    return null;
                } catch (error: any) {
                    console.error("[AUTH] Critical error in authorize:", error?.message || error);
                    // Throwing the error instead of returning null might show up better in Vercel logs
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user }: { token: any; user?: any }) {
            try {
                if (user) {
                    token.role = user.role;
                    token.companyName = user.companyName;
                }
                return token;
            } catch (error) {
                console.error("[AUTH] Error in jwt callback:", error);
                return token;
            }
        },
        async session({ session, token }: { session: any; token: any }) {
            try {
                if (session.user) {
                    session.user.role = token.role;
                    session.user.companyName = token.companyName;
                }
                return session;
            } catch (error) {
                console.error("[AUTH] Error in session callback:", error);
                return session;
            }
        },
    },
});
