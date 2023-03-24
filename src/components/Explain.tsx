import Button from "@/components/ui/Button";
import ToggleInput from "@/components/ui/ToggleInput";
import useLocalStorage from "@/hooks/useLocalStorage";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  expression: z
    .string()
    .regex(
      /^((\*|(\d+|\d+\/\d+|\d+-\d+|\d+-\d+\/\d+|\d+,\d+|\d+,\d+\/\d+|\d+-\d+,\d+|\d+-\d+,\d+\/\d+|\d+L|\d+L\/\d+|\d+W|\d+W\/\d+|\d+#\d+|\d+#\d+\/\d+|\d+-\d+L|\d+-\d+L\/\d+|\d+-\d+W|\d+-\d+W\/\d+|\d+-\d+#\d+|\d+-\d+#\d+\/\d+|\d+L-\d+|\d+L-\d+\/\d+|\d+W-\d+|\d+W-\d+\/\d+|\d+#\d+-\d+|\d+#\d+-\d+\/\d+))\s){4}(\*|(\d+|\d+\/\d+|\d+-\d+|\d+-\d+\/\d+|\d+,\d+|\d+,\d+\/\d+|\d+-\d+,\d+|\d+-\d+,\d+\/\d+|\d+L|\d+L\/\d+|\d+W|\d+W\/\d+|\d+#\d+|\d+#\d+\/\d+|\d+-\d+L|\d+-\d+L\/\d+|\d+-\d+W|\d+-\d+W\/\d+|\d+-\d+#\d+|\d+-\d+#\d+\/\d+|\d+L-\d+|\d+L-\d+\/\d+|\d+W-\d+|\d+W-\d+\/\d+|\d+#\d+-\d+|\d+#\d+-\d+\/\d+))$/,
      "Invalid cron expression"
    ),
  detailed: z.boolean().default(true),
});
type Inputs = z.infer<typeof schema>;

const Explain = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [explainedData, setExplainedData] = useState("");
  const [savedData, setSavedData] = useLocalStorage<Inputs>("savedData", {
    expression: "",
    detailed: true,
  });
  const generatedRef = useRef<HTMLDivElement>(null);

  // react-hook-form
  const { register, handleSubmit, formState, control, reset } = useForm<Inputs>(
    {
      resolver: zodResolver(schema),
    }
  );
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    setExplainedData("");
    setIsLoading(true);
    setSavedData({ ...data });
    const response = await fetch("/api/explain", {
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

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setExplainedData((prev) => prev + chunkValue);
    }

    reset({
      expression: "",
      detailed: savedData.detailed,
    });
    setIsLoading(false);
  };

  // scroll to generated data, but only when it's being generated
  useEffect(() => {
    if (!generatedRef.current) return;
    if (isLoading) {
      const offset = generatedRef.current.offsetTop - 100;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  }, [explainedData, isLoading]);

  // clear local storage
  useEffect(() => {
    window.addEventListener("beforeunload", () => localStorage.clear());

    return () => {
      window.removeEventListener("beforeunload", () => localStorage.clear());
    };
  }, []);

  return (
    <Fragment>
      <form
        aria-label="Explain cron expression"
        className="grid w-full max-w-xl gap-7"
        onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
      >
        <fieldset className="grid gap-4">
          <label
            htmlFor="expression"
            className="text-sm font-medium sm:text-base"
          >
            Cron expression
          </label>
          <input
            type="text"
            id="expression"
            className="w-full rounded-md border-gray-400 bg-transparent px-4 py-2.5 text-base text-gray-50 transition-colors placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-gray-800"
            placeholder="0 5 * * *"
            {...register("expression", { required: true })}
            onChange={(e) => {
              const value = e.target.value;
              e.target.value = value.replace(/(\S)(\S)/g, "$1 $2");
            }}
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
        <fieldset className="grid gap-4">
          <label htmlFor="detailed" className="sr-only">
            Long explanation
          </label>
          <ToggleInput
            control={control}
            name="detailed"
            label="Detailed explanation"
            description="Show a long explanation of the cron expression"
            defaultChecked={true}
          />
          {formState.errors.detailed ? (
            <p className="-mt-1.5 text-sm font-medium text-red-500">
              {formState.errors.detailed.message}
            </p>
          ) : null}
        </fieldset>
        <Button
          aria-label="Explain cron"
          className="w-full"
          isLoading={isLoading}
          loadingVariant="dots"
          disabled={isLoading}
        >
          Explain cron
        </Button>
      </form>
      <div ref={generatedRef}>
        {explainedData ? (
          savedData.detailed ? (
            <div className="mt-8 grid w-full place-items-center gap-4 rounded-lg bg-gray-800 p-4">
              <div className="w-full rounded-md bg-gradient-to-r from-violet-400 to-purple-500 px-4 py-3 text-center text-sm font-medium text-white sm:text-base">
                {savedData.expression}
              </div>
              <div className="w-full space-y-2">
                {explainedData
                  .split("\n")
                  .map((item) => {
                    const [character, range, meaning] = item
                      .split(" | ")
                      .map((item) => item.trim());
                    return {
                      character,
                      range,
                      meaning,
                    };
                  })
                  .filter(
                    (item) => item.character && item.range && item.meaning
                  )
                  .map((item) => (
                    <div
                      key={crypto.randomUUID()}
                      className="grid gap-1 rounded-lg bg-gray-700 px-5 py-3.5 shadow-md"
                    >
                      <div className="flex items-center gap-2 text-sm sm:text-base">
                        {item.character}{" "}
                        <span className="text-gray-400">{item.range}</span>
                      </div>
                      <p className="text-gray-400">{item.meaning}</p>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="mt-8 grid w-full place-items-center gap-4 rounded-lg bg-gray-800 p-4">
              <div className="w-full rounded-md bg-gradient-to-r from-violet-400 to-purple-500 px-4 py-3 text-center text-sm font-medium text-white sm:text-base">
                {savedData.expression}
              </div>
              <div className="w-full rounded-lg bg-gray-700 px-5 py-3.5 shadow-md">
                {explainedData}
              </div>
            </div>
          )
        ) : null}
      </div>
    </Fragment>
  );
};

export default Explain;
