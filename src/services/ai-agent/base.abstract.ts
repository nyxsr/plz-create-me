import OpenAI from "openai";

export default abstract class BaseAIAgent {
  public readonly ai: OpenAI;

  constructor({ baseURL, apiKey }: { baseURL: string; apiKey: string }) {
    this.ai = new OpenAI({ apiKey, baseURL });
  }
}
