const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

// Debug log for Vercel
if (!secret) {
    console.error("[AUTH] MIDDLEWARE ERROR: AUTH_SECRET is missing from environment variables!");
}

export default NextAuth({
    ...authConfig,
    secret: secret,
}).auth;

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
