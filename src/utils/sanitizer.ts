export const unmarkdownCode = (code: string) => {
  // Remove opening triple-backtick and optional language identifier
  const strippedCode = code.replace(/^```(?:bash|sh)?/, '');
  // Remove closing triple-backtick if present
  return strippedCode.replace(/```$/, '');
};
