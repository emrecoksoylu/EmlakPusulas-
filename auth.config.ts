
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
        newUser: '/register',
    },
    providers: [],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

            if (isOnAdmin) {
                const user = auth?.user as any;
                if (isLoggedIn && (user?.role === 'admin' || user?.email === 'coksoyluemre@gmail.com')) return true;
                return false; // Redirect to login or dashboard
            }

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return true;
            }
            return true;
        },
    },
} satisfies NextAuthConfig;
