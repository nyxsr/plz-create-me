import { ShellCommandValidator } from "../../utils/validator";
import { spawn } from "bun";

export default class Executor {
  static async executeSh(command: string): Promise<void> {
    // Bun's spawn returns a Subprocess object
    const process = spawn(["sh", "-c", command], {
      stdout: "pipe",
      stderr: "pipe",
      stdin: "pipe",
    });

    // For stdout, we need to use the readable stream properly
    const stdout = process.stdout;
    const reader = stdout.getReader();
    (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          console.log(new TextDecoder().decode(value));
        }
      } catch (error) {
        console.error("Error reading stdout:", error);
      }
    })();

    // For stderr, similar approach but with error output
    if (process.stderr) {
      const stderrReader = process.stderr.getReader();
      (async () => {
        try {
          while (true) {
            const { done, value } = await stderrReader.read();
            if (done) break;
            console.error(new TextDecoder().decode(value));
          }
        } catch (error) {
          console.error("Error reading stderr:", error);
        }
      })();
    }

    // Create a promise to handle the process completion
    return new Promise<void>((resolve, reject) => {
      // We need to use exited promise instead of 'on' event
      process.exited.then((exitCode: number) => {
        console.log(`Process exited with code ${exitCode}`);
        if (exitCode === 0) {
          resolve();
        } else {
          reject(new Error(`Process exited with code ${exitCode}`));
        }
      }).catch((error: Error) => {
        reject(error);
      });
  });
  }
}
