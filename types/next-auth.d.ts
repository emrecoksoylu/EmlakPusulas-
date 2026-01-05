import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's role. */
            role?: string | null
            /** The user's company name. */
            companyName?: string | null
        } & DefaultSession["user"]
    }

    interface User {
        role?: string | null
        companyName?: string | null
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        /** OpenID ID Token */
        role?: string | null
        companyName?: string | null
    }
}
