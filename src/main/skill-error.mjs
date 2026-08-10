export function createSkillError(code, message, options = undefined) {
  const error = new Error(message, options);
  error.code = code;
  return error;
}

export function normalizeSkillError(error, fallbackCode, fallbackMessage) {
  if (isSkillError(error)) return error;
  const message = error instanceof Error ? error.message : String(error || fallbackMessage);
  return createSkillError(fallbackCode, message || fallbackMessage, {
    cause: error instanceof Error ? error : undefined
  });
}

export function isSkillError(error) {
  return typeof error?.code === "string" && /^skill_[a-z0-9_]+$/.test(error.code);
}
