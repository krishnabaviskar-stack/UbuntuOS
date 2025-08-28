import React from 'react'
import Head from 'next/head';

export default function Meta() {
    return (
        <Head>
           /* Primary Meta Tags */
            <title>Krishna Portfolio - Computer Engineering Student</title>
            <meta charSet="utf-8" />
            <meta name="title" content="Krishna Portfolio - Computer Engineering Student" />
            <meta name="description"
                content="Krishna's (KrishnaPortfolio) Personal Portfolio Website. Made with Ubuntu 20.4 (Linux) theme by Next.js and Tailwind CSS." />
            <meta name="author" content="Krishna (KrishnaPortfolio)" />
            <meta name="keywords"
                content="KrishnaPortfolio, KrishnaPortfolio's portfolio, KrishnaPortfolio linux, ubuntu portfolio, Krishna protfolio,Krishna computer, Krishna, Krishna ubuntu, Krishna ubuntu portfolio" />
            <meta name="robots" content="index, follow" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="language" content="English" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#E95420" />

            /* Search Engine */
            <meta name="image" content="images/logos/fevicon.png" />
            /* Schema.org for Google */
            <meta itemProp="name" content="Krishna Portfolio - Computer Engineering Student" />
            <meta itemProp="description"
                content="Krishna's (KrishnaPortfolio) Personal Portfolio Website. Made with Ubuntu 20.4 (Linux) theme by Next.js and Tailwind CSS." />
            <meta itemProp="image" content="images/logos/fevicon.png" />
            /* Twitter */
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="Krishna Portfolio - Computer Engineering Student" />
            <meta name="twitter:description"
                content="Krishna's (KrishnaPortfolio) Personal Portfolio Website. Made with Ubuntu 20.4 (Linux) theme by Next.js and Tailwind CSS." />
            <meta name="twitter:site" content="KrishnaPortfolio" />
            <meta name="twitter:creator" content="KrishnaPortfolio" />
            <meta name="twitter:image:src" content="images/logos/logo_1024.png" />
            /* Open Graph general (Facebook, Pinterest & Google+) */
            <meta name="og:title" content="Krishna Portfolio - Computer Engineering Student" />
            <meta name="og:description"
                content="Krishna's (KrishnaPortfolio) Personal Portfolio Website. Made with Ubuntu 20.4 (Linux) theme by Next.js and Tailwind CSS." />
            <meta name="og:image" content="images/logos/logo_1200.png" />
            <meta name="og:url" content="http://KrishnaPortfolio.github.io/" />
            <meta name="og:site_name" content="Krishna Personal Portfolio" />
            <meta name="og:locale" content="en_IN" />
            <meta name="og:type" content="website" />

            <link rel="icon" href="images/logos/fevicon.svg" />
            <link rel="apple-touch-icon" href="images/logos/logo.png" />
        </Head>
    )
}
