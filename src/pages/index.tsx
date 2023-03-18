import Button from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  expression: z.string().min(1, { message: "Cron expression is required" }),
});
type Inputs = z.infer<typeof schema>;

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [generations, setGenerations] = useState<string>("");

  // react-hook-form
  const { register, handleSubmit, formState, control, reset } = useForm<Inputs>(
    { resolver: zodResolver(schema) }
  );
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    setGenerations("");
    setIsLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const responseData = response.body;
    if (!responseData) {
      return;
    }

    const reader = responseData.getReader();
    const decoder = new TextDecoder();
    let done = false;
    setIsDone(done);

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGenerations((prev) => prev + chunkValue);
      setIsDone(done);
    }

    reset();
    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Cronify</title>
      </Head>
      <main className="w-full pt-32 pb-32">
        <div className="container flex max-w-6xl flex-col items-center justify-center gap-10">
          <h1 className="max-w-3xl text-center text-3xl font-bold leading-tight text-gray-50 sm:text-5xl sm:leading-tight">
            Explaining and generating cron expressions for you
          </h1>
          <form
            aria-label="form for finding NPM packages"
            className="grid w-full max-w-xl gap-7"
            onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
          >
            <fieldset className="grid gap-5">
              <label
                htmlFor="expression"
                className="text-sm font-medium sm:text-base"
              >
                Enter your cron expression
              </label>
              <input
                type="text"
                id="expression"
                className="w-full rounded-md border-gray-400 bg-transparent px-4 pt-2.5 text-base text-gray-50 transition-colors placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="* * * * *"
                {...register("expression")}
                onKeyDown={(e) => {
                  if (!formState.isValid || isLoading) return;
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    handleSubmit(onSubmit)();
                  }
                }}
              />
              {formState.errors.expression ? (
                <p className="-mt-1.5 text-sm font-medium text-red-500">
                  {formState.errors.expression.message}
                </p>
              ) : null}
            </fieldset>

            <Button
              aria-label="Find packages"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Find packages
            </Button>
          </form>
        </div>
      </main>
    </>
  );
}
