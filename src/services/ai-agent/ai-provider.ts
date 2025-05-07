import { Deepseek } from "./deepseek";

export default class AIProvider extends Deepseek {
  constructor() {
    super();
  }

  async main(content: string) {
    const chat = await this.createChat(content);

    console.log(chat);
  }
}
