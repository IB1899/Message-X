import { NextAuthOptions } from "next-auth";

import * as jose from "jose"
import { cookies } from "next/dist/client/components/headers";

import { MongoDBAdapter, MongoDBAdapterOptions } from "@next-auth/mongodb-adapter"
import clientPromise from "@/backend/config/mongoDBAdapter";

import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

let authOptions: NextAuthOptions = {

    adapter: MongoDBAdapter(clientPromise, {
        databaseName: "Call-Chat-app",
        collections: {
            Accounts: "accounts",
            users: "users"
        }
    } as MongoDBAdapterOptions),

    providers: [

        CredentialsProvider({
            name: "credentials",
            credentials: {
                operation: { required: true, type: "text" },

                name: { required: true, type: "text" },
                email: { required: true, type: "email" },
                image: { required: true, type: "text" },
                id: { required: true, type: "text" }
            },

            async authorize(credentials, request) {

                if (credentials?.operation === "SIGNUP" || credentials?.operation === "LOGIN") {
                    let { operation, ...rest } = credentials!
                    return rest
                }
                return null
            }
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],

    pages: {
        signIn: "/authentication/login",
        newUser: "/authentication/signup",
    },

    jwt: {
        maxAge: 60 * 60 * 24
    },

    session: {
        maxAge: 60 * 60 * 24,
        strategy: "jwt"
    },

    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user }
        },

        //! what the session data will be
        async session({ session, user, token }) {
            session.user = token as any;
            return session
        },

        //! This will run after a successful sign in
        async signIn({ user, account, credentials }) {

            //* I send the cookies here to ensure that even if the user sign's in with Oauth gets their cookie

            //! Protecting frontend pages in the middleware with more freedom than the next-auth middleware
            let authToken = await new jose.SignJWT({ name: user.name }).setProtectedHeader({ alg: "HS256" }).setIssuedAt()
                .setExpirationTime("1d").sign(new TextEncoder().encode(process.env.JWT_SECRET!))

            cookies().set("authToken", authToken, { maxAge: 1000 * 60 * 60 * 60})

            return true
        }
    }
}
export default authOptions