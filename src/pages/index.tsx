import Explain from "@/components/Explain";
import Generate from "@/components/Generate";
import Tabs from "@/components/Tabs";
import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <>
      <Head>
        <title>Cronbase</title>
      </Head>
      <main className="w-full pt-32 pb-32">
        <div className="container flex max-w-6xl flex-col items-center justify-center gap-10">
          <div className="grid w-full max-w-3xl place-items-center gap-5">
            <h1 className="text-center text-3xl font-bold leading-tight text-gray-50 sm:text-5xl sm:leading-tight">
              Explaining and generating cron expressions for you
            </h1>
            <p className="text-center text-base text-gray-400 sm:text-lg">
              Cronbase is a tool that helps you understand and generate cron
              expressions. Click on a link below to get started
            </p>
          </div>
          <Tabs
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            tabs={[
              {
                name: "Explain cron",
                content: <Explain />,
              },
              {
                name: "Generate cron",
                content: <Generate />,
              },
            ]}
          />
        </div>
      </main>
    </>
  );
}
