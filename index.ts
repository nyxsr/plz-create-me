#!/usr/bin/env node

import { configDotenv } from "dotenv";
import { Command } from "commander";
import AIProvider from "./src/services/ai-agent/ai-provider";
import Generator from "./src/services/generator";
import { input, select, confirm } from "@inquirer/prompts";
import ora from "ora";
import FRAMEWORKS from "./src/constants/frameworks.ts";
import { unmarkdownCode } from "./src/utils/sanitizer.ts";
import Executor from "./src/services/executor/index.ts";
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

// Create a new Commander program
const program = new Command();

// Setup program information
program
  .name("plz-create-me")
  .description("Generate your project easily using AI.")
  .version("0.0.7");

program
  .command("create")
  .description("Create a new project")
  .option("-n, --name <name>", "Project name")
  .option("-f, --framework <framework>", "Framework to use")
  .option("-p, --path <path>", "Project path")
  .option("-d, --deps <dependencies>", "Additional dependencies (comma separated)")
  .option("-m, --manager <manager>", "Package manager (npm, yarn, pnpm, bun)")
  .action(async (options) => {
    await runProjectCreation(options);
  });

// Default command (if no command is specified)
program
  .action(async () => {
    await runProjectCreation({});
  });

async function runProjectCreation(options: any) {
  // Check API key
  const spinCheck = ora("Checking DEEPSEEK_API_KEY...").start();
  const deepseekApiKey = process.env.DEEPSEEK_API_KEY;

  if (!deepseekApiKey) {
    spinCheck.fail(
      "DEEPSEEK_API_KEY not found. Please set in your environment variables.",
    );
    process.exit(1);
  }

  spinCheck.succeed("DEEPSEEK_API_KEY found.");

  // Project name - use from options or prompt
  let projectName = options.name;
  if (!projectName) {
    projectName = await input({
      message: "What is your project name?",
      validate(value) {
        if (!value || value === "") {
          console.error("Project name is required");
          return false;
        }
        return true;
      },
    });
  }

  // Framework - use from options or prompt
  let framework = options.framework;
  if (!framework) {
    framework = await select({
      message: "What framework do you want to use?",
      choices: FRAMEWORKS,
    });
  } else {
    // Validate framework is in the list
    const frameworkExists = FRAMEWORKS.some(f => f.value === framework);
    if (!frameworkExists) {
      console.error(`Framework "${framework}" not found. Available frameworks: ${FRAMEWORKS.map(f => f.value).join(', ')}`);
      process.exit(1);
    }
  }

  // Additional dependencies
  let additional: string[] = [];
  if (options.deps) {
    additional = options.deps.split(',').map((dep: string) => dep.trim());
  } else {
    const addAdditional = await confirm({
      message: "Do you want to add any additional dependencies?",
    });

    if (addAdditional) {
      const additionalInput = await input({
        message: "What are the additional dependencies? (separated by comma ',')",
        transformer(value, { isFinal }) {
          if (isFinal) {
            additional = value.split(",").map(dep => dep.trim());
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
  }

  // Project path - use from options or prompt
  let projectPath = options.path;
  if (!projectPath) {
    projectPath = await input({
      message: "Where do you want to create the project?",
      async validate(value) {
        if (!value || value === "") {
          console.error("Project path is required");
          return false;
        }

        // Convert to absolute path if relative
        const absolutePath = path.isAbsolute(value) ? value : path.resolve(process.cwd(), value);

        const isPathExists = fs.existsSync(absolutePath);
        if (!isPathExists) {
          console.error("Project path does not exist");
          const createPath = await confirm({
            message: "Do you want to create the path?",
          });

          if (createPath) {
            const creating = ora(`Creating path ${absolutePath}...`).start();
            try {
              fs.mkdirSync(absolutePath, { recursive: true });
              creating.succeed(`Path ${absolutePath} created successfully.`);
              return true;
            } catch (error: any) {
              creating.fail(`Failed to create path ${absolutePath}: ${error.message}`);
              return false;
            }
          }
          return false;
        }
        return true;
      },
    });
  } else {
    // Convert to absolute path if relative
    projectPath = path.isAbsolute(projectPath) ? projectPath : path.resolve(process.cwd(), projectPath);

    // Check if path exists
    if (!fs.existsSync(projectPath)) {
      const creating = ora(`Creating path ${projectPath}...`).start();
      try {
        fs.mkdirSync(projectPath, { recursive: true });
        creating.succeed(`Path ${projectPath} created successfully.`);
      } catch (error: any) {
        creating.fail(`Failed to create path ${projectPath}: ${error.message}`);
        process.exit(1);
      }
    }
  }

  // Package manager - use from options or prompt
  let packageManager = options.manager;
  if (!packageManager) {
    packageManager = await select({
      message: "What package manager do you want to use?",
      choices: [
        { name: chalk.red('npm'), value: 'npm' },
        { name: chalk.green('yarn'), value: 'yarn' },
        { name: chalk.yellow('pnpm'), value: 'pnpm' },
        { name: chalk.white('bun'), value: 'bun' }
      ],
    });
  } else {
    // Validate package manager
    const validManagers = ['npm', 'yarn', 'pnpm', 'bun'];
    if (!validManagers.includes(packageManager)) {
      console.error(`Invalid package manager "${packageManager}". Available options: ${validManagers.join(', ')}`);
      process.exit(1);
    }
  }

  // Format package manager display with chalk
  const displayPackageManager = (() => {
    switch(packageManager) {
      case 'npm': return chalk.red('npm');
      case 'yarn': return chalk.green('yarn');
      case 'pnpm': return chalk.yellow('pnpm');
      case 'bun': return chalk.white('bun');
      default: return packageManager;
    }
  })();

  // Display project details
  const projectDetails = {
    "Project Name": projectName,
    Framework: framework,
    "Project Path": projectPath,
    "Additional Packages": additional.length > 0 ? additional.map((item) => `  - ${item}\n`).join('') : "None",
    "Package Manager": displayPackageManager,
  };

  console.info(
    `This will create a project with the following details:\n
      Project Name: ${chalk.bold(projectDetails["Project Name"])}
      Framework: ${chalk.bold(projectDetails.Framework)}
      Project Path: ${chalk.bold(projectDetails["Project Path"])}
      Additional Packages: ${chalk.bold(projectDetails["Additional Packages"])}
      Package Manager: ${chalk.bold(projectDetails["Package Manager"])}
      \n=================================================================
    `,
  );

  // If not running with all options provided, confirm continuation
  if (!options.name || !options.framework || !options.path || !options.manager) {
    const isOk = await confirm({
      message: "Do you want to continue?",
    });

    if (!isOk) {
      console.log("Aborting...");
      process.exit(0);
    }
  }

  // Generate project
  const generating = ora("Generating project...").start();

  try {
    const generate = await Generator.generateInitialShell(
      projectName,
      framework,
      projectPath,
      packageManager,
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
      generating.fail(`Failed to execute script: ${error.message}`);
      process.exit(1);
    }
  } catch (error: any) {
    generating.fail(`Failed to generate project: ${error.message}`);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  if (error instanceof Error && error.name === 'ExitPromptError') {
    console.log('👋 until next time!');
  } else {
    // Rethrow unknown errors
    throw error;
  }
});

// Parse command line arguments and execute
program.parse();
