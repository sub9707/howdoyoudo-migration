import Script from 'next/script'
import React from 'react'
export const API = `//dapi.kakao.com/v2/maps/sdk.js?appkey=567ff71073ba18f77afa29f39b180e6a&libraries=services,clusterer&autoload=false`

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