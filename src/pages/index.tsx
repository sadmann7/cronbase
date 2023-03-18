import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Cronify</title>
      </Head>
      <main className="w-full pt-32 pb-32">
        <div className="container flex max-w-6xl flex-col items-center justify-center gap-10">
          <div className="grid w-full max-w-3xl place-items-center gap-5">
            <h1 className="text-center text-3xl font-bold leading-tight text-gray-50 sm:text-5xl sm:leading-tight">
              Explaining and generating cron expressions for you
            </h1>
            <p className="text-center text-base text-gray-400 sm:text-lg">
              Cronify is a tool that helps you understand and generate cron
              expressions. Click on a link below to get started
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 whitespace-nowrap">
            <Link
              aria-label="Navigate to explore page"
              href="/explain"
              className="flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-5 py-2.5 text-center text-base font-medium shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:pointer-events-none disabled:opacity-70"
            >
              Explain expression
            </Link>
            <Link
              aria-label="Navigate to generate page"
              href="/generate"
              className="flex items-center justify-center rounded-md border border-gray-400 bg-transparent px-5 py-2.5 text-center text-base font-medium shadow-sm transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:pointer-events-none disabled:opacity-70"
            >
              Generate expression
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
