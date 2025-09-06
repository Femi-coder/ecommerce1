import Head from "next/head";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { CartProvider } from "../context/CartContext";

export default function MyApp({ Component, pageProps }) {
  // If a page defines getLayout, use it; otherwise wrap with Layout
  const getLayout =
    Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <CartProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </CartProvider>
  );
}