import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#F6F5F1" />
        <meta name="color-scheme" content="light" />
        <link rel="icon" type="image/jpeg" href="/media/profileimage.jpg" />
        <link rel="shortcut icon" href="/media/profileimage.jpg" />
        <link rel="apple-touch-icon" href="/media/profileimage.jpg" />
      </Head>
      <body className="bg-[#F6F5F1] text-[#111111] antialiased overflow-x-hidden selection:bg-neutral-900 selection:text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
