import Script from 'next/script'
import React from 'react'
export const API = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOJSKEY}&libraries=services,clusterer&autoload=false`

function Layout({ children }: { children: React.ReactNode }) {
    console.log(process.env.NEXT_PUBLIC_KAKAOJSKEY)
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