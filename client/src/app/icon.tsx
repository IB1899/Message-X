import { ImageResponse } from 'next/server'

export const runtime = 'edge'

export const size = {
    width: 35,
    height: 35,
}
export const contentType = 'image/png'

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 28,
                    background: 'black',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight:"bold",
                    color: 'white',
                }}
            >
                X
            </div>
        ),
        { ...size, }
    )
}