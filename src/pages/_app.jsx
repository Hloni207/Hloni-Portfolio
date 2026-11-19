import React from 'react';
import Head from 'next/head';
import '@/styles/globals.css';
import { PortfolioProvider } from '@/context/PortfolioContext';

export default function App({ Component, pageProps }) {
  return (
    <PortfolioProvider>
      <Head>
        <title>Hloni — Portfolio</title>
        <meta name="description" content="Personal portfolio of Hloni — Robotics, Engineering & Digital Products" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </PortfolioProvider>
  );
}
