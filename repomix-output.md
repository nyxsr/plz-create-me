This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where comments have been removed, content has been compressed (code blocks are separated by ⋮---- delimiter).

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
4. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Code comments have been removed from supported file types
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

## Additional Info

# Directory Structure
```
src/
  config/
    program.ts
  constants/
    frameworks.ts
    templates.ts
  services/
    ai-agent/
      ai-provider.ts
      base.abstract.ts
      deepseek.ts
    executor/
      index.ts
    generator/
      index.ts
  utils/
    sanitizer.ts
    validator.ts
.gitignore
bunfig.toml
env.d.ts
index.ts
package.json
README.md
tsconfig.json
```

# Files

## File: bunfig.toml
```toml
entrypoints = ["index.ts"]
outdir = "dist"
target = "node"
```

## File: src/config/program.ts
```typescript
import { Command } from "commander";
```

## File: src/constants/frameworks.ts
```typescript

```

## File: src/services/ai-agent/ai-provider.ts
```typescript
import { Deepseek } from "./deepseek";
⋮----
export default class AIProvider extends Deepseek
⋮----
constructor()
⋮----
async main(content: string)
```

## File: src/services/ai-agent/base.abstract.ts
```typescript
import OpenAI from "openai";
⋮----
export default abstract class BaseAIAgent
⋮----
constructor(
```

## File: src/services/executor/index.ts
```typescript
import { ShellCommandValidator } from "../../utils/validator";
import { spawn } from "child_process";
⋮----
export default class Executor
⋮----
static async executeSh(command: string): Promise<void>
```

## File: src/utils/sanitizer.ts
```typescript
export const unmarkdownCode = (code: string) =>
⋮----
// Remove closing triple-backtick if present
```

## File: src/utils/validator.ts
```typescript
import { exec } from "child_process";
⋮----
export class ShellCommandValidator
⋮----
public static async validateSyntax(
    commands: string,
    shellType: "bash" | "sh" | "zsh" = "bash",
): Promise<
⋮----
public static async checkCommandsExist(
    commandsToCheck: string[],
): Promise<
⋮----
public static extractCommands(commandString: string): string[]
⋮----
// Skip comments
⋮----
// Split by pipes and semicolons to get individual commands
⋮----
// Extract the first word as the command name
⋮----
return [...new Set(commands)]; // Remove duplicates
⋮----
/**
   * Validates if a string contains valid npm/npx commands
   * @param commandString The commands to validate
   * @returns Promise<{isValid: boolean, missingCommands?: string[], syntaxError?: string}>
   */
public static async validateNodeCommands(
    commandString: string,
): Promise<
⋮----
// First check syntax
⋮----
// Extract commands and check if they exist
```

## File: .gitignore
```
# dependencies (bun install)
node_modules

# output
out
dist
*.tgz

# code coverage
coverage
*.lcov

# logs
logs
_.log
report.[0-9]_.[0-9]_.[0-9]_.[0-9]_.json

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# caches
.eslintcache
.cache
*.tsbuildinfo

# IntelliJ based IDEs
.idea

# Finder (MacOS) folder config
.DS_Store
```

## File: env.d.ts
```typescript
interface ProcessEnv {
    DEEPSEEK_KEY: string;
  }
```

## File: README.md
```markdown
# plz-create-me

Your project generator companion.

Reqirements:

- Node.js (v20.0.0 or higher)
```

## File: tsconfig.json
```json
{
  "compilerOptions": {
    // Environment setup & latest features
    "lib": ["ESNext"],
    "target": "ESNext",
    "module": "ESNext",
    "moduleDetection": "force",
    "jsx": "react-jsx",
    "allowJs": true,

    // Bundler mode
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,

    // Best practices
    "strict": true,
    "skipLibCheck": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,

    // Some stricter flags (disabled by default)
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noPropertyAccessFromIndexSignature": false
  }
}
```

## File: src/constants/templates.ts
```typescript
export const generateInitShell = (
  projectName: string,
  framework: string,
  projectPath: string = ".",
  packageManager: string = "npm",
  additional: string[] = [],
): string =>
```

## File: src/services/ai-agent/deepseek.ts
```typescript
import BaseAIAgent from "./base.abstract";
⋮----
export abstract class Deepseek extends BaseAIAgent
⋮----
constructor()
⋮----
public async createChat(content: string)
```

## File: src/services/generator/index.ts
```typescript
import { generateInitShell } from "../../constants/templates";
import { ShellCommandValidator } from "../../utils/validator";
import AIProvider from "../ai-agent/ai-provider";
import fs from "fs";
import { dirname, join } from 'path'
⋮----
export default class Generator
⋮----
public static async generateInitialShell(
    projectName: string,
    framework: string,
    projectPath: string,
    packageManager: string,
    additional: string[],
)
```

## File: index.ts
```typescript
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
⋮----
async function runProjectCreation(options: any)
⋮----
validate(value)
⋮----
transformer(value,
⋮----
async validate(value)
⋮----
// If not running with all options provided, confirm continuation
⋮----
// Generate project
⋮----
// Handle uncaught exceptions
```

## File: package.json
```json
{
  "name": "plz-create-me",
  "module": "index.ts",
  "version": "0.0.3",
  "type": "module",
  "bin": {
    "plz-create-me": "./dist/index.js"
  },
  "files": [
    "dist/**/*"
  ],
  "scripts": {
    "build": "bun build ./index.ts --outdir ./dist --target bun",
    "postbuild": "chmod +x ./dist/index.js",
    "prepublishOnly": "bun run build"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "@types/node": "^22.15.13"
  },
  "peerDependencies": {
    "typescript": "^5"
  },
  "dependencies": {
    "@inquirer/prompts": "^7.5.1",
    "chalk": "^5.4.1",
    "commander": "^13.1.0",
    "dotenv": "^16.5.0",
    "inquirer": "^12.6.0",
    "openai": "^4.97.0",
    "ora": "^8.2.0",
    "winston": "^3.17.0"
  }
}
```
