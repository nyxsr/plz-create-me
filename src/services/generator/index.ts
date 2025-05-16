import { generateInitShell } from "../../constants/templates";
import { ShellCommandValidator } from "../../utils/validator";
import AIProvider from "../ai-agent/ai-provider";
import fs from "fs";
import { dirname, join } from 'path'

export default class Generator {
  public static async generateInitialShell(
    projectName: string,
    framework: string,
    projectPath: string,
    packageManager: string,
    additional: string[],
  ) {
    try {
      const prompt = generateInitShell(
        projectName,
        framework,
        projectPath,
        packageManager,
        additional,
      );
      const result = await new AIProvider().createChat(prompt);

      if (result) {
        ShellCommandValidator.validateSyntax(result);

        // INFO: Save the result as a file.
        fs.writeFileSync(`./prompt.txt`, prompt);
        fs.writeFileSync(`./init.sh`, result);
      } else {
        throw new Error("Result invalid");
      }

      return result;
    } catch (err) {
      console.error(err);
    }
  }
}
