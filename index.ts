import { configDotenv } from "dotenv";
import AIProvider from "./src/services/ai-agent/ai-provider";
import Generator from "./src/services/generator";
import { input, select, confirm } from "@inquirer/prompts";
import "./src/config/program.ts";
import ora from "ora";
import FRAMEWORKS from "./src/constants/frameworks.ts";
import { unmarkdownCode } from "./src/utils/sanitizer.ts";
import Executor from "./src/services/executor/index.ts";

configDotenv({ path: ".env.local" });

async function main() {
  const spinCheck = ora("Checking DEEPSEEK_API_KEY...").start();
  const deepseekApiKey = process.env.DEEPSEEK_API_KEY;

  if (!deepseekApiKey) {
    spinCheck.fail(
      "DEEPSEEK_API_KEY not found. Please set in you environment variables.",
    );
    process.exit(1);
  }

  spinCheck.succeed("DEEPSEEK_API_KEY found.");

  const projectName = await input({
    message: "What is your project name ?",
    validate(value) {
      if (!value || value === "") {
        console.error("Project name is required");
        return false;
      }
      return true;
    },
  });

  const framework = await select({
    message: "What framework do you want to use ?",
    choices: FRAMEWORKS,
  });

  let additional: string[] = [];

  const addAdditional = await confirm({
    message: "Do you want to add any additional dependencies ?",
  });

  if (addAdditional) {
    const additionalInput = await input({
      message:
        "What are the additional dependencies ? (separated by comma ',')",
      transformer(value, { isFinal }) {
        if (isFinal) {
          additional = value.split(",");
        }
        return value;
      },
      validate(value) {
        if (!value || value === "") {
          console.error("Additional dependencies are required");
          return false;
        }
        return true;
      },
    });
  }

  const projectPath = await input({
    message: "Where do you want to create the project ?",
    transformer(value, { isFinal }) {
      if (isFinal) {
        console.log(`Creating project in ${value}`);
      }
      return value;
    },
    async validate(value) {
      if (!value || value === "") {
        console.error("Project path is required");
        return false;
      }
      const isPathExists = require("fs").existsSync(value);
      if (!isPathExists) {
        console.error("Project path does not exist");
        const createPath = await confirm({
          message: "Do you want to create the path ?",
        });

        if (createPath) {
          const creating = ora(`Creating path ${value}...`).start();
          try {
            require("fs").mkdirSync(value);
            creating.succeed(`Path ${value} created successfully.`);
          } catch (error: any) {
            creating.fail(`Failed to create path ${value}: ${error.message}`);
            return false;
          }
        }
        return false;
      }
      return true;
    },
  });

  const projectDetails = {
    "Project Name": projectName,
    Framework: framework,
    "Project Path": projectPath,
    "Additional Packages": additional.map((item) => `  - ${item}\n`),
  };

  console.info(
    `This will create a project with the following details:\n ${JSON.stringify(
      projectDetails,
      null,
      2,
    )}`,
  );

  const isOk = await confirm({
    message: "Do you want to continue ?",
  });

  if (!isOk) {
    console.log("Aborting...");
    process.exit(0);
  }

  const generating = ora("Generating project...").start();

  try {
    const generate = await Generator.generateInitialShell(
      projectName,
      framework,
      projectPath,
      additional,
    );

    if (!generate) {
      generating.fail("Failed to generate project");
      process.exit(1);
    }

    const sanitized = unmarkdownCode(generate);

    try {
      generating.text = "Executing script...";
      await Executor.executeSh(sanitized);

      generating.succeed("Project created successfully.");
    } catch (error: any) {
      generating.fail(`Failed to generate project: ${error.message}`);
      process.exit(1);
    }
  } catch (error: any) {
    generating.fail(`Failed to generate project: ${error.message}`);
    process.exit(1);
  }
}

main();
