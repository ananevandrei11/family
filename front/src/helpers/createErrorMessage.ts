export function createErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : JSON.stringify(error);
  return message;
}
