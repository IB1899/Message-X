"use client"

import { JellyTriangle } from '@uiball/loaders'


export default function loading() {

    return (
        <div className="Loading-Page"
            style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >

            <JellyTriangle
                size={120}
                speed={1}
                color="#9D00BB"
            />
        </div>
    )
}