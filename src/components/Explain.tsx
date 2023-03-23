import Button from "@/components/ui/Button";
import ToggleInput from "@/components/ui/ToggleInput";
import { useAppContext } from "@/context/AppProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  expression: z
    .string()
    .regex(
      /^((\*|(\d+|\d+\/\d+|\d+-\d+|\d+-\d+\/\d+|\d+,\d+|\d+,\d+\/\d+|\d+-\d+,\d+|\d+-\d+,\d+\/\d+|\d+L|\d+L\/\d+|\d+W|\d+W\/\d+|\d+#\d+|\d+#\d+\/\d+|\d+-\d+L|\d+-\d+L\/\d+|\d+-\d+W|\d+-\d+W\/\d+|\d+-\d+#\d+|\d+-\d+#\d+\/\d+|\d+L-\d+|\d+L-\d+\/\d+|\d+W-\d+|\d+W-\d+\/\d+|\d+#\d+-\d+|\d+#\d+-\d+\/\d+))\s){4}(\*|(\d+|\d+\/\d+|\d+-\d+|\d+-\d+\/\d+|\d+,\d+|\d+,\d+\/\d+|\d+-\d+,\d+|\d+-\d+,\d+\/\d+|\d+L|\d+L\/\d+|\d+W|\d+W\/\d+|\d+#\d+|\d+#\d+\/\d+|\d+-\d+L|\d+-\d+L\/\d+|\d+-\d+W|\d+-\d+W\/\d+|\d+-\d+#\d+|\d+-\d+#\d+\/\d+|\d+L-\d+|\d+L-\d+\/\d+|\d+W-\d+|\d+W-\d+\/\d+|\d+#\d+-\d+|\d+#\d+-\d+\/\d+))$/,
      "Invalid cron expression"
    ),
  detailed: z.boolean().default(false),
});
type Inputs = z.infer<typeof schema>;

const Explain = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { explainedData, setExplainedData } = useAppContext();

  // react-hook-form
  const { register, handleSubmit, formState, watch, control, reset } =
    useForm<Inputs>({
      resolver: zodResolver(schema),
    });
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

    setIsLoading(false);
  };

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
      {explainedData ? (
        watch("detailed") ? (
          <ExplanationCard
            expression={watch("expression")}
            data={explainedData
              .split("\n")
              .map((item) => {
                const [character, functionality, description] = item
                  .split(" | ")
                  .map((item) => item.trim());
                return {
                  character,
                  functionality,
                  description,
                };
              })
              .filter(
                (item) =>
                  item.character && item.functionality && item.description
              )}
          />
        ) : (
          <div className="mt-8 grid w-full place-items-center gap-4 rounded-lg bg-gray-800 p-4">
            <h2 className="bg-gradient-to-br from-violet-500 to-purple-500 bg-clip-text text-2xl font-bold text-transparent">
              {watch("expression")}
            </h2>
            <div className="w-full space-y-2">{explainedData}</div>
          </div>
        )
      ) : null}
    </Fragment>
  );
};

export default Explain;

type ExplanationCardProps = {
  expression: string;
  data: {
    character: string;
    functionality: string;
    description: string;
  }[];
};

const ExplanationCard = ({ expression, data }: ExplanationCardProps) => {
  console.log(expression);

  return (
    <div className="mt-8 grid w-full place-items-center gap-4 rounded-lg bg-gray-800 p-4">
      <h2 className="bg-gradient-to-br from-violet-500 to-purple-500 bg-clip-text text-2xl font-bold text-transparent">
        {expression}
      </h2>
      <div className="w-full space-y-2">
        {data.map((item) => (
          <div
            key={crypto.randomUUID()}
            className="flex items-center gap-4 rounded-lg bg-gray-700/80 p-4 shadow-md"
          >
            <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-purple-500 text-lg font-bold text-white">
              {item.character.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white sm:text-base">
                {item.functionality.charAt(0).toUpperCase() +
                  item.functionality.slice(1)}
              </span>
              <span className="text-sm text-gray-400 sm:text-base">
                {item.description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
