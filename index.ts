import { configDotenv } from "dotenv";
import AIProvider from "./src/services/ai-agent/ai-provider";
import Generator from "./src/services/generator";

configDotenv({ path: ".env.local" });

async function main() {
  const generate = await Generator.generateInitialShell("NextJS 15 App Router");

  console.log(generate);
}

main();
