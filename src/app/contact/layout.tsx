import Script from 'next/script'
import React from 'react'
export const API = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAOJSKEY}&libraries=services,clusterer&autoload=false`

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Script
                src={API}
                strategy="beforeInteractive"
            />
            {children}
        </>
    )
}

export default Layout