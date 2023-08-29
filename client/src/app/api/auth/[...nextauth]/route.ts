import NextAuth from "next-auth/next";
import authOptions from "./options";

let handler = NextAuth(authOptions)
export { handler as GET, handler as POST }