import { GENERATE_INIT_SHELL } from "../../constants/templates";
import { ShellCommandValidator } from "../../utils/validator";
import AIProvider from "../ai-agent/ai-provider";

export default class Generator {
  public static async generateInitialShell(
    framework: string,
    additionals?: string[],
  ) {
    try {
      const result = await new AIProvider().createChat(
        GENERATE_INIT_SHELL(framework, additionals),
      );

      if (result) {
        ShellCommandValidator.validateSyntax(result);
      } else {
        throw new Error("Result invalid");
      }

      return result;
    } catch (err) {
      console.error(err);
    }
  }
}
