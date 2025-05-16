/**
 * Generates a bash script to initialize a project with the specified framework and additional options.
 * @param projectName - The name of the project to create
 * @param framework - The framework to use (e.g., React, Next.js)
 * @param projectPath - The directory where the project should be created (defaults to current directory)
 * @param packageManager - The package manager to use (defaults to npm)
 * @param additional - Array of additional dependencies or configurations to include
 * @returns A prompt string for generating a bash initialization script
 */
export const generateInitShell = (
  projectName: string,
  framework: string,
  projectPath: string = ".",
  packageManager: string = "npm",
  additional: string[] = [],
): string => {
  // Format additional options as a bullet list if they exist
  const additionalOptions = additional.length > 0
    ? additional.map(option => `   - ${option}`).join('\n')
    : '';

  return `You are an expert bash script engineer specializing in JavaScript development environments. Create a comprehensive bash script that initializes a ReactJS project with the following specifications:
   Project Details:
   - Project name: ${projectName}
   - Base Directory: ${projectPath}
   - Package Manager: ${packageManager}

   Script Requirements:
1. Create the project directory structure.
2. Initializes a ${framework} project with modern best practices.
3. Configure essential project setting and files.
4. Install and configure the following dependencies:
${additionalOptions}

Implementation Instructions:
- Include detailed comments explaining each step in the script
- Ensure the script is non-interactive (no prompts requiring user input)
- The script should be executable with a simple bash script.sh command
- Modify the example/home page to include text indicating the project was created using the "plz-create-me" plugin
- Follow current React best practices for project structure and configuration
- Include error handling for common failure points
- Optimize installation steps for efficiency

Output Format:
Return ONLY the complete bash script with no additional explanations, disclaimers, or text outside the script itself. The script should be ready to execute without modification.
  `;
};
