import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,300;0,400;0,500;0,700;1,100;1,300;1,400;1,500;1,700&display=swap"
          rel="stylesheet"
        />
        <meta property="og:title" content="Kridas - The Sports Platform" />
        <meta property="og:image" content="https://kridas.com/small-logo.png" />
        <meta
          property="og:description"
          content="Global Sports Networking Platform"
        />
        <meta property="og:url" content="http://www.kridas.com" />
        <meta name="twitter:title" content="Kridas - The Sports Platform" />
        <meta
          name="twitter:description"
          content="Global Sports Networking Platform"
        />
        <meta
          name="twitter:image"
          content="https://kridas.com/small-logo.png"
        />
        <meta name="twitter:card" content="kridas-twitter-share" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
