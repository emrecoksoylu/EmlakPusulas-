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
    providers: [
        Credentials({
            async authorize(credentials) {
                try {
                    console.log("Authorize attempt for:", credentials?.email);
                    const parsedCredentials = z
                        .object({ email: z.string().email(), password: z.string().min(6) })
                        .safeParse(credentials);

                    if (!parsedCredentials.success) {
                        console.log("Validation failed:", parsedCredentials.error.errors);
                        return null;
                    }

                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);

                    if (!user) {
                        console.log("User not found:", email);
                        return null;
                    }

                    if (!user.password) {
                        console.log("User has no password (old or incomplete account):", email);
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) {
                        console.log("Auth success for:", email);
                        return user;
                    }

                    console.log("Password mismatch for:", email);
                    return null;
                } catch (error) {
                    console.error("Critical error in authorize callback:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user }: { token: any; user?: any }) {
            if (user) {
                token.role = user.role;
                token.companyName = user.companyName;
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            if (session.user) {
                session.user.role = token.role;
                session.user.companyName = token.companyName;
            }
            return session;
        },
    },
});
