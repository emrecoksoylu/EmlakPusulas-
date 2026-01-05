export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/dashboard', '/api'],
            },
        ],
        sitemap: 'https://emlakpusulası.com/sitemap.xml',
    }
}
