import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose"

export async function middleware(request: NextRequest) {

    let cookie = request.cookies.get("authToken")

    if (request.url.includes("main")) {
        if (!cookie) return NextResponse.redirect("http://localhost:3000/authentication/signup")
        let { payload } = await jose.jwtVerify(cookie.value, new TextEncoder().encode(process.env.JWT_SECRET!))

        if (!payload.name) return NextResponse.redirect("http://localhost:3000/authentication/signup")

        //! The User is authenticated
        return NextResponse.next()
    }

    else if (request.url.includes("authentication")) {

        if (cookie) return NextResponse.redirect("http://localhost:3000/main")

        //! The User isn't authenticated
        return NextResponse.next()
    } else {
        //! The home page
        if (cookie) return NextResponse.redirect("http://localhost:3000/main")
        
        //! The User isn't authenticated
        return NextResponse.next()
    }
}

export const config = { matcher: ["/main/:path*", "/", "/authentication/:path*"] }