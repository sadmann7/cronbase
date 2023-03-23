import Button from "@/components/ui/Button";
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
});
type Inputs = z.infer<typeof schema>;

const Explain = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { explainedData, setExplainedData } = useAppContext();
  const [explainations, setExplainations] = useState([
    {
      name: "",
      description: "",
    },
  ]);

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
        <div className="mt-10 grid gap-4 text-sm font-medium sm:text-base">
          {explainedData
            .split("\n")
            .map((item) => {
              const [value, description] = item
                .split(": ")
                .map((item) => item.trim());
              return {
                value,
                description,
              };
            })
            .filter((item) => item.value && item.description)
            .map((item) => (
              <Fragment key={crypto.randomUUID()}>
                <span className="font-medium">{item.value}</span>
                <span>{item.description}</span>
              </Fragment>
            ))}
        </div>
      ) : null}
    </Fragment>
  );
};

export default Explain;
