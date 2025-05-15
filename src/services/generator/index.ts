import { GENERATE_INIT_SHELL } from "../../constants/templates";
import { ShellCommandValidator } from "../../utils/validator";
import AIProvider from "../ai-agent/ai-provider";

export default class Generator {
  public static async generateInitialShell(
    projectName: string,
    framework: string,
    projectPath: string,
    additional?: string[],
  ) {
    try {
      const result = await new AIProvider().createChat(
        GENERATE_INIT_SHELL(projectName, framework, projectPath, additional),
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
