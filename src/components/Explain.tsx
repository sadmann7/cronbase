import { useAppContext } from "@/components/context/AppProvider";
import Button from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  expression: z
    .string()
    .min(1, { message: "Cron expression is required" })
    .max(100, {
      message: "Cron expression cannot be longer than 100 characters",
    })
    .regex(
      /^(\*|\d+(,\d+)*|\d+(?:-\d+)?(?:\/\d+)?|\*(?:\/\d+)?)\s+(\*|\d+(,\d+)*|\d+(?:-\d+)?(?:\/\d+)?|\*(?:\/\d+)?)\s+(\*|\d+(,\d+)*|\d+(?:-\d+)?(?:\/\d+)?|\*(?:\/\d+)?)\s+(\*|\d+(,\d+)*|\d+(?:-\d+)?(?:\/\d+)?|\*(?:\/\d+)?)\s+(\*|\d+(,\d+)*|\d+(?:-\d+)?(?:\/\d+)?|\*(?:\/\d+)?)\s*([\d\w\,\-\*\/]+)?$/,
      {
        message: "Invalid cron expression",
      }
    ),
});
type Inputs = z.infer<typeof schema>;

const Explain = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { explainedData, setExplainedData } = useAppContext();

  // react-hook-form
  const { register, handleSubmit, formState, control, reset } = useForm<Inputs>(
    { resolver: zodResolver(schema) }
  );
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    setExplainedData("");
    setIsLoading(true);
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
      setExplainedData((prev) => prev + chunkValue);
    }

    reset();
    setIsLoading(false);
  };

  console.log(explainedData);

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
          aria-label="Explain cron"
          className="w-full"
          isLoading={isLoading}
          loadingVariant="dots"
          disabled={isLoading}
        >
          Explain cron
        </Button>
      </form>
      {explainedData ? (
        <pre className="mt-4 whitespace-pre-wrap text-sm text-gray-50 sm:text-base">
          {explainedData}
        </pre>
      ) : null}
    </Fragment>
  );
};

export default Explain;
