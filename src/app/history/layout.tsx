import React from 'react'
import YearBar from './_components/YearBar'

function Layout({ children}: {children: React.ReactNode}) {
    return (
        <>
            {children}
            <YearBar/>
        </>
    )
}

export default Layout