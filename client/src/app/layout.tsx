import type { Metadata } from 'next'
import "@/style/style.css"
import NextAuthProvider from './providers/NextAuth'
import ReduxProvider from './providers/Redux'


export const metadata: Metadata = {
    title: "Messages X",
    description: "This is the Messages-X website that is used for messaging"
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
