/**
 * Generates a bash script to initialize a project with the specified framework and additional options.
 */
export const GENERATE_INIT_SHELL = (
  projectName: string,
  framework: string,
  projectPath: string = ".",
  additional?: string[],
) => {
  const START_INDEX = 7;
  let others;

  if (additional && additional?.length > 0) {
    others = additional.map(
      (option, index) => `${START_INDEX + index}. ${option}\n`,
    );
  }

  return `Generate a bash script to initialize a project using ${framework}. The project name is "${projectName}".
  The script should:
  1. Create the project directory
  2. Initialize the project with standard configurations
  3. Install the specified dependencies
  4. Set up appropriate file structure and configurations
  5. Include helpful comments explaining each step
  6. The project should be created in the "${projectPath}" directory
  ${others}
  ${(additional?.length || 0) + START_INDEX + 1}. If it haves another additional dependencies, install them
  ${(additional?.length || 0) + START_INDEX + 2}. Modify the example page to display if this project created using 'plz-create-me' plugin.

  Return ONLY the bash script with no additional text or explanations.
  `;
};
