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
          <h1 className="w-full max-w-3xl text-center text-3xl font-bold leading-tight text-gray-50 sm:text-6xl sm:leading-tight">
            Explaining and generating
            <span className="text-violet-400"> crons</span> for you
          </h1>
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
