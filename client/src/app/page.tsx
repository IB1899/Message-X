
import { Bebas_Neue } from "next/font/google"
// npm i @next/font

/* 
! 1- You can use fonts through this way (recommended)
! 2- you can import the google font import-link in the css.
*/

const BebasNeue = Bebas_Neue({
    subsets: ["latin"],
    weight: ["400"]
})

//! Fonts optimization in Next.js 
export default function Home() {

    return (
        <main className={BebasNeue.className}>
            <h1> hello this is a test </h1>

            <code>
                let this is code;
                log(this is code)
                f()
            </code>

        </main>
    )
}

