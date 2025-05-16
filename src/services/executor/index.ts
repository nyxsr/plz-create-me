import { ShellCommandValidator } from "../../utils/validator";
import { spawn } from "child_process"; // Use Node.js's spawn

export default class Executor {
  static async executeSh(command: string): Promise<void> {
    // Use Node.js's spawn instead of Bun's spawn
    const process = spawn("sh", ["-c", command], {
      stdio: ["pipe", "pipe", "pipe"], // stdin, stdout, stderr
    });

    // Handle stdout
    process.stdout.on("data", (data: Buffer) => {
      console.log(data.toString());
    });

    // Handle stderr
    process.stderr.on("data", (data: Buffer) => {
      console.error(data.toString());
    });

    // Handle process completion
    return new Promise<void>((resolve, reject) => {
      process.on("close", (code: number) => {
        console.log(`Process exited with code ${code}`);
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Process exited with code ${code}`));
        }
      });

      process.on("error", (error: Error) => {
        reject(error);
      });
    });
  }
}
