import React from 'react';
import Head from 'next/head';
import '@/styles/globals.css';
import { PortfolioProvider } from '@/context/PortfolioContext';

export default function App({ Component, pageProps }) {
  return (
    <PortfolioProvider initialData={pageProps?.initialPortfolioData}>
      <Head>
        <title>Hloni — Portfolio</title>
        <meta name="description" content="Personal portfolio of Hloni — Robotics, Engineering & Digital Products" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#F6F5F1" />
        <meta name="color-scheme" content="light" />
        {/* Profile photo as website tab favicon */}
        <link rel="icon" type="image/jpeg" href="/media/profileimage.jpg" />
        <link rel="shortcut icon" href="/media/profileimage.jpg" />
        <link rel="apple-touch-icon" href="/media/profileimage.jpg" />
      </Head>
      <Component {...pageProps} />
    </PortfolioProvider>
  );
}
