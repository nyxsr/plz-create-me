import { Command } from "commander";
const program = new Command();

program
  .name("plz-create-me")
  .description("Create your project easily using AI")
  .version("0.0.1");

program.parse()

export default program;
