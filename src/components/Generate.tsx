import Button from "@/components/ui/Button";
import { useAppContext } from "@/context/AppProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy } from "lucide-react";
import { Fragment, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  description: z.string().min(1, { message: "Requirement is required" }),
});
type Inputs = z.infer<typeof schema>;

const Generate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { generatedData, setGeneratedData } = useAppContext();
  const [isCopied, setIsCopied] = useState(false);

  // react-hook-form
  const { register, handleSubmit, formState, reset } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    setGeneratedData("");
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

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedData((prev) => prev + chunkValue);
    }

    setIsLoading(false);
  };

  console.log(generatedData);

  return (
    <Fragment>
      <form
        aria-label="Generate cron expression"
        className="grid w-full max-w-xl gap-7"
        onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
      >
        <fieldset className="grid gap-4">
          <label
            htmlFor="description"
            className="text-sm font-medium sm:text-base"
          >
            Cron description
          </label>
          <input
            type="text"
            id="description"
            className="w-full rounded-md border-gray-400 bg-transparent px-4 py-2.5 text-base text-gray-50 transition-colors placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-gray-800"
            placeholder="e.g. Every 5 minutes"
            {...register("description")}
            onKeyDown={(e) => {
              if (!formState.isValid || isLoading) return;
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                handleSubmit(onSubmit)();
              }
            }}
          />
          {formState.errors.description ? (
            <p className="-mt-1.5 text-sm font-medium text-red-500">
              cron {formState.errors.description.message}
            </p>
          ) : null}
        </fieldset>
        <Button
          aria-label="Generate cron"
          className="w-full"
          isLoading={isLoading}
          loadingVariant="dots"
          disabled={isLoading}
        >
          Generate cron
        </Button>
      </form>
      {generatedData ? (
        <div className="mt-10 grid w-full place-items-center gap-2">
          <h2 className="text-2xl font-medium">Generated cron</h2>
          <div className="flex w-full items-center justify-between gap-2 rounded-md bg-gray-700 px-5 py-2.5">
            <p className="text-lg font-medium">{generatedData}</p>
            <button
              aria-label="Copy to clipboard"
              className="rounded-md bg-gray-800 p-2 transition-colors hover:bg-gray-900 disabled:pointer-events-auto disabled:opacity-70"
              onClick={() => {
                navigator.clipboard.writeText(generatedData);
                setIsCopied(true);
                toast.success("Copied to clipboard", {
                  icon: "✂️",
                });
                setTimeout(() => {
                  setIsCopied(false);
                }, 2000);
              }}
              disabled={isCopied}
            >
              <Copy className="h-4 w-4 text-gray-50" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default Generate;
