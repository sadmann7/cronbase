import DefaultLayout from "@/components/layouts/DefaultLayout";
import ToastWrapper from "@/components/ui/ToastWrapper";
import { AppProvider } from "@/context/AppProvider";
import "@/styles/globals.css";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import type { ReactElement, ReactNode } from "react";

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  return (
    <AppProvider>
      <Head>
        <title>Cronbase</title>
      </Head>
      {getLayout(<Component {...pageProps} />)}
      <ToastWrapper />
    </AppProvider>
  );
}
