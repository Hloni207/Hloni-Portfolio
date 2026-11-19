import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/jpeg" href="/media/profileimage.jpg" />
        <link rel="shortcut icon" href="/media/profileimage.jpg" />
        <link rel="apple-touch-icon" href="/media/profileimage.jpg" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
