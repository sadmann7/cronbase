import type { NextRequest } from "next/server";

export type OpenAIStreamPayload = {
  model: ChatGPTModel;
  messages: ChatGPTMessage[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  n: number;
};

export type ChatGPTModel =
  | "gpt-3.5-turbo"
  | "text-davinci-003"
  | "text-curie-001"
  | "text-babbage-001"
  | "text-ada-001";

export type ChatGPTAgent = "user" | "system";

export type ChatGPTMessage = {
  role: ChatGPTAgent;
  content: string;
};

export interface ExplainRequest extends NextRequest {
  json: () => Promise<{
    expression: string;
    detailed: boolean;
  }>;
}

export interface GenerateRequest extends NextRequest {
  json: () => Promise<{
    description: string;
  }>;
}

export type Generation = {
  description: string;
  expression: string;
  createdAt: string;
};
