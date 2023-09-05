//! Defining the NextAuth session type
import NextAuth from "next-auth"

declare module "next-auth" {

    //! When signing with OAuth tha response will be different
    interface Session {
        user: {
            //! You must only check the session with the email, 
            email: string,
            id: string,
            image: string,
            name: string,
        }
    }
}