import { useState, useEffect } from "react";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider, Hydrate } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Layout from "../src/components/layout/layout";
import customTheme from "../src/utils/theme";
import { CartProvider } from "../src/context/cart-context";
// import { io } from 'socket.io-client'

function MyApp({ Component, pageProps }) {
  // Disable refetch on window focus for all queries
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Enable refetch on window focus for all queries
  // const [queryClient] = useState(() => new QueryClient());
  // let socket_url = process.env.NEXT_PUBLIC_SOCKET_URL;
  // const [socket, setSocket] = useState(io.connect(socket_url));
  // const [socket, setSocket] = useState({});
  // useEffect(() => {
  //   const tempSocket = io.connect(socket_url)
  //   setSocket(tempSocket)
  // }, [socket?.id])

  return (
    <ChakraProvider theme={customTheme}>
      <SessionProvider session={pageProps.sessionData}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <CartProvider>
              <Layout>
                <Head>
                  <title>Kridas - The Sports Platform</title>
                  <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                  ></meta>
                  <link rel="preconnect" href="https://fonts.googleapis.com" />
                  <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="true"
                  />
                  <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,300;0,400;0,500;0,700;1,100;1,300;1,400;1,500;1,700&family=Roboto:wght@300;400;500;700;900&family=Akshar:wght@700&display=swap"
                    rel="stylesheet"
                  />
                </Head>
                <Component {...pageProps} socket={null} />
              </Layout>
            </CartProvider>
          </Hydrate>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SessionProvider>
    </ChakraProvider>
  );
}

export default MyApp;
