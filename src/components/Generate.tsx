import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";
import { useAppContext } from "@/context/AppProvider";
import type { Generation, SetState } from "@/types/globals";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  description: z.string().min(1, { message: "Requirement is required" }),
});
type Inputs = z.infer<typeof schema>;

const Generate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const { generatedData, setGeneratedData } = useAppContext();
  const [isCopied, setIsCopied] = useState(false);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isHistoryEnabled, setIsHistoryEnabled] = useState(false);

  // react-hook-form
  const { register, handleSubmit, formState, watch, reset } = useForm<Inputs>({
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
    if (!responseData) return;

    const reader = responseData.getReader();
    const decoder = new TextDecoder();
    let done = false;
    setIsDone(done);

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedData((prev) => prev + chunkValue);
      setIsDone(done);
    }

    setIsLoading(false);
  };

  console.log(generatedData);

  // history of generations
  useEffect(() => {
    if (!isDone || !watch("description") || !generatedData) return;
    setGenerations((prev) => [
      ...prev,
      {
        description: watch("description"),
        expression: generatedData,
        createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      },
    ]);
  }, [generatedData, isDone, watch]);

  return (
    <div className="grid place-items-center gap-5">
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
        <div className="mt-5 grid w-full place-items-center gap-5">
          <h2 className="text-2xl font-medium">Generated cron</h2>
          <div className="flex w-full items-center justify-between gap-2 rounded-lg bg-gray-600 px-5 py-2.5">
            <p className="text-lg font-medium text-gray-50">{generatedData}</p>
            <CopyButton
              data={generatedData}
              isCopied={isCopied}
              setIsCopied={setIsCopied}
            />
          </div>
        </div>
      ) : null}
      <Toggle
        enabled={isHistoryEnabled}
        setEnabled={setIsHistoryEnabled}
        enabledLabel="Show history"
        disabledLabel="Hide history"
        className="grid place-items-center"
      />
      {isHistoryEnabled ? (
        generations.length > 0 ? (
          <div className="grid w-full gap-2">
            {generations
              .sort((a, b) => dayjs(b.createdAt).diff(dayjs(a.createdAt)))
              .map((generation, i) => (
                <div
                  key={i}
                  className="flex w-full items-center justify-between gap-2 rounded-lg bg-gray-600 px-5 py-2.5"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-lg font-medium text-gray-50">
                      {generation.expression}
                    </p>
                    <p className="text-sm font-medium text-gray-400">
                      {generation.description}
                    </p>
                  </div>
                  <CopyButton
                    data={generation.expression}
                    isCopied={isCopied}
                    setIsCopied={setIsCopied}
                  />
                </div>
              ))}
          </div>
        ) : null
      ) : null}
    </div>
  );
};

export default Generate;

type CopyButtonProps = {
  data: string;
  isCopied: boolean;
  setIsCopied: SetState<boolean>;
};

const CopyButton = ({ data, isCopied, setIsCopied }: CopyButtonProps) => {
  return (
    <button
      aria-label="Copy to clipboard"
      className="rounded-md bg-gray-800/80 p-2 transition-colors hover:bg-gray-800 active:scale-95 disabled:pointer-events-none disabled:opacity-70"
      onClick={() => {
        navigator.clipboard.writeText(data);
        setIsCopied(true);
        toast.success("Copied to clipboard", {
          icon: "✂️",
        });
        setTimeout(() => {
          setIsCopied(false);
        }, 3000);
      }}
      disabled={isCopied}
    >
      <Copy className="h-4 w-4 text-gray-50" aria-hidden="true" />
    </button>
  );
};
