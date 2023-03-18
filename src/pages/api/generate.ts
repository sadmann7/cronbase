import {
  type ExtendedNextRequest,
  type OpenAIStreamPayload,
} from "@/types/globals";
import { openaiStream } from "@/utils/openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    "OPENAI_API_KEY is not defined in .env file. Please add it there (see README.md for more details)."
  );
}

export const config = {
  runtime: "edge",
};

export default async function handler(req: ExtendedNextRequest) {
  const { expression } = await req.json();

  console.log({
    expression,
  });

  const prompt = `Explain the following cron expression: ${expression}`;

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a cron expression explainer. I will give you a cron expression and you will explain it to me. You will just explain each part of the expression. For example, if I give you the expression 0 0 0 0 0, you will say: 'At 0 minutes past 0 hours on 0 day of the month, every month'.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 400,
    stream: true,
    n: 1,
  };

  const stream = await openaiStream(payload);
  return new Response(stream);
}
