import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(req: Request) {
        console.log("the middleware has ran and user is protected");

    },
    {
        callbacks: {
            authorized({ token }) {
                return token ? true : false
            },
        }
    }
)



// export default function middleware() {
//     console.log("hi");

// }

export const config = { matcher: ["/main"] }