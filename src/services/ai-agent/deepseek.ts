import BaseAIAgent from "./base.abstract";

export abstract class Deepseek extends BaseAIAgent {
  constructor() {
    super({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env.DEEPSEEK_KEY,
    });
  }

  public async createChat(content: string) {
    const completion = await this.ai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant specialized in generating shell scripts for Node.js project initialization.",
        },
        { role: "user", content },
      ],
      model: "deepseek-chat",
      temperature: 0.0,
      web_search_options: {
        search_context_size: "high",
      },
    });

    return completion.choices[0]?.message.content;
  }
}
