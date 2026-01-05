
import NextAuth from 'next-auth';
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
    secret: process.env.AUTH_SECRET,
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                console.log("Authorize called with:", credentials?.email);
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) {
                        console.log("User not found:", email);
                        return null;
                    }

                    // Allow login for old demo user (no password) or verify password
                    if (!user.password) {
                        console.log("User has no password set (old account)");
                        // This is insecure, should migrate old usage. For now strict:
                        // return null; 
                        // Actually, let's treat it as failure if no password set.
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) {
                        console.log("Login successful for:", email);
                        return user;
                    } else {
                        console.log("Password mismatch for:", email);
                    }
                } else {
                    console.log("Zod validation failed:", parsedCredentials.error);
                }

                console.log('Invalid credentials return');
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.companyName = (user as any).companyName;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).companyName = token.companyName;
            }
            return session;
        },
    },
});
