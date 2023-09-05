
declare module global {
    namespace NodeJs{
        interface ProcessEnv{
            NODE_ENV:"DEVELOPMENT" | "PRODUCTION"
        }
    }
}