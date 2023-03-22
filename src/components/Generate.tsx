import Button from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  description: z.string().min(1, { message: "Requirement is required" }),
});
type Inputs = z.infer<typeof schema>;

const Generate = () => {
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

  console.log(generations);

  return (
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
          Enter your cron description
        </label>
        <input
          type="text"
          id="description"
          className="w-full rounded-md border-gray-400 bg-transparent px-4 pt-2.5 text-base text-gray-50 transition-colors placeholder:text-gray-400 focus:border-transparent focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. every 5 minutes"
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
        disabled={isLoading}
      >
        Generate cron
      </Button>
    </form>
  );
};

export default Generate;
