declare module global {
    namespace NodeJS {
        interface ProcessENV {
            NODE_ENV: "DEVELOPMENT" | "PRODUCTIONi"
        }
    }
}