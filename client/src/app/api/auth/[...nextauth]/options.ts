import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"

let authOptions: NextAuthOptions = {

    providers: [

        CredentialsProvider({
            name: "credentials",
            credentials: {
                name: { required: true, type: "text" },
                email: { required: true, type: "text" },
                image: { required: true, type: "text" },
                password: { required: true, type: "password" },
                operation: { required: true, type: "text" }
            },

            async authorize(credentials, request) {

                let name = credentials?.name
                let email = credentials?.email
                let image = credentials?.image
                let password = credentials?.password

                if (credentials?.operation === "SIGNUP") {

                    let response = await fetch("http:localhost:3000/api/signup", {
                        method: "POST", headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name, email, password, image })
                    })

                    let user = await response.json();

                    return user?.email ? user : null
                }

                return null
            }
        })
    ],

    // pages:{
    //     signIn:"/"
    // },

    // jwt:{
    //     maxAge: 60 * 60 * 24
    // },
    // session:{
    //     maxAge: 60 * 60 * 24,
    //     strategy:"jwt"
    // },

    // callbacks:{
    //     async session({session , token}){
    //         session.user = token as any
    //         return session
    //     }
    // }
}

export default authOptions