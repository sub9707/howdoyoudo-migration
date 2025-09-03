import React from 'react'

interface PageHeaderProps {
title:string;
description?:string;
}

function PageHeader({title, description}: PageHeaderProps) {
    return (
        <section className="pt-24 pb-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black tracking-tight">
                        {title}
                    </h1>
                    <p className="mt-6 text-lg text-gray-400 max-w-4xl mx-auto whitespace-pre-line">
                        {description}
                    </p>
                </div>
            </div>
        </section>
    )
}

export default PageHeader