
//! defining the  next Auth session type
import NextAuth from "next-auth/next";

declare module "next-auth" {
    interface Session {
        user: {
            email: string,
            id: string
        }
    }
}