import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose"

export async function middleware(request: NextRequest) {

    let cookie = request.cookies.get("authToken")

    if (request.url.includes("main")) {
        if (!cookie) return NextResponse.redirect("http://localhost:3000/authentication/signup")
        try {
            let result = await jose.jwtVerify(cookie.value, new TextEncoder().encode(process.env.JWT_SECRET!))

            if (!result.payload.name) return NextResponse.redirect("http://localhost:3000/authentication/signup")

            //! The User is authenticated
            return NextResponse.next()
        }
        catch (err: any) {
            return NextResponse.redirect("http://localhost:3000/authentication/signup")
        }
    }

    else if (request.url.includes("authentication")) {

        if (cookie) {
            try {
                let result = await jose.jwtVerify(cookie.value, new TextEncoder().encode(process.env.JWT_SECRET!))
                if (!result.payload.name)   return NextResponse.next()

                return NextResponse.redirect("http://localhost:3000/main/messages")
            }
            catch (err: any) {
                return NextResponse.next()
            }
        }

        //! The User isn't authenticated
        return NextResponse.next()
    } 
    
    else {
        if (cookie) {
            try {
                let result = await jose.jwtVerify(cookie.value, new TextEncoder().encode(process.env.JWT_SECRET!))
                if (!result.payload.name) return NextResponse.next()

                return NextResponse.redirect("http://localhost:3000/main/messages")
            }
            catch (err: any) {
                return NextResponse.next()
            }
        }

        //! The User isn't authenticated
        return NextResponse.next()
    }
}

export const config = { matcher: ["/main/:path*", "/", "/authentication/:path*"] }