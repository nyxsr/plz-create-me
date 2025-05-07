import { exec } from "child_process";
import * as util from "util";

const execPromise = util.promisify(exec);

export class ShellCommandValidator {
  /**
   * Checks if a string contains valid shell commands by using shell's syntax check
   * @param commands The shell commands to validate
   * @param shellType The shell to use for validation (default: bash)
   * @returns Promise<{isValid: boolean, error?: string}> Result of validation
   */
  public static async validateSyntax(
    commands: string,
    shellType: "bash" | "sh" | "zsh" = "bash",
  ): Promise<{ isValid: boolean; error?: string }> {
    try {
      // Create a temporary file with the commands
      const checkCommand = `echo ${JSON.stringify(commands)} | ${shellType} -n`;

      await execPromise(checkCommand);
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Checks if specific commands exist in the system
   * @param commandsToCheck Array of command names to check
   * @returns Promise<{[command: string]: boolean}> Map of commands and their existence
   */
  public static async checkCommandsExist(
    commandsToCheck: string[],
  ): Promise<{ [command: string]: boolean }> {
    const result: { [command: string]: boolean } = {};

    for (const cmd of commandsToCheck) {
      try {
        await execPromise(`command -v ${cmd}`);
        result[cmd] = true;
      } catch (error) {
        result[cmd] = false;
      }
    }

    return result;
  }

  /**
   * Analyzes a string of shell commands and extracts the main commands used
   * @param commandString The shell commands to analyze
   * @returns string[] Array of command names found
   */
  public static extractCommands(commandString: string): string[] {
    // Split by lines and then by pipes
    const lines = commandString
      .split("\n")
      .filter((line) => line.trim() !== "");
    const commands: string[] = [];

    for (const line of lines) {
      // Skip comments
      if (line.trim().startsWith("#")) continue;

      // Split by pipes and semicolons to get individual commands
      const segments = line
        .split(/[|;]/)
        .map((segment) => segment.trim())
        .filter((segment) => segment !== "");

      for (const segment of segments) {
        // Extract the first word as the command name
        const match = segment.match(/^([a-zA-Z0-9_\-\.]+)/);
        if (match && match[1]) {
          commands.push(match[1]);
        }
      }
    }

    return [...new Set(commands)]; // Remove duplicates
  }

  /**
   * Validates if a string contains valid npm/npx commands
   * @param commandString The commands to validate
   * @returns Promise<{isValid: boolean, missingCommands?: string[], syntaxError?: string}>
   */
  public static async validateNodeCommands(
    commandString: string,
  ): Promise<{
    isValid: boolean;
    missingCommands?: string[];
    syntaxError?: string;
  }> {
    // First check syntax
    const syntaxCheck = await this.validateSyntax(commandString);
    if (!syntaxCheck.isValid) {
      return { isValid: false, syntaxError: syntaxCheck.error };
    }

    // Extract commands and check if they exist
    const commands = this.extractCommands(commandString);
    const nodeSpecificCommands = commands.filter((cmd) =>
      ["npm", "npx", "node", "yarn", "pnpm"].includes(cmd),
    );

    if (nodeSpecificCommands.length > 0) {
      const existCheck = await this.checkCommandsExist(nodeSpecificCommands);
      const missingCommands = Object.entries(existCheck)
        .filter(([_, exists]) => !exists)
        .map(([cmd]) => cmd);

      return {
        isValid: missingCommands.length === 0,
        missingCommands:
          missingCommands.length > 0 ? missingCommands : undefined,
      };
    }

    return { isValid: true };
  }
}
