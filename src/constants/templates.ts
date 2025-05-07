/**
 * Generates a bash script to initialize a project with the specified framework and additional options.
 */
export const GENERATE_INIT_SHELL = (
  framework: string,
  additionals?: string[],
) => {
  let others;

  if (additionals && additionals?.length > 0) {
    const startNum = 6;
    others = additionals.map(
      (option, index) => `${startNum + index}. ${option}\n`,
    );
  }
  return `Generate a bash script to initialize a project using ${framework}. The project name is "testing-god".
  The script should:
  1. Create the project directory
  2. Initialize the project with standard configurations
  3. Install the specified dependencies
  4. Set up appropriate file structure and configurations
  5. Include helpful comments explaining each step
  ${others}

  Return ONLY the bash script with no additional text or explanations.
  `;
};
