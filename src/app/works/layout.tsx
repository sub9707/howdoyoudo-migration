import ScrollToTop from '@/components/ui/ScrollToTop'
import React from 'react'

function Layout({ children}: {children: React.ReactNode}) {
    return (
        <>
            {children}
            <ScrollToTop/>
        </>
    )
}

export default Layout