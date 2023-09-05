import type { Metadata } from 'next'
import "@/style/style.css"
import NextAuthProvider from './providers/NextAuth'
import ReduxProvider from './providers/Redux'


export const metadata: Metadata = {
    title: "Messages",
    description: "This is a messages website"
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body >
                <ReduxProvider>
                    <NextAuthProvider>
                        {children}
                    </NextAuthProvider>
                </ReduxProvider>
            </body>
        </html>
    )
}
