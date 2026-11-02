const codes = new Set([
  "COUNTER_CONFIG_MISSING",
  "COUNTER_CONFIG_INVALID",
  "COUNTER_COOKIE_SECRET_INVALID",
  "COUNTER_REDIS_AUTH_FAILED",
  "COUNTER_REDIS_HTTP_FAILED",
  "COUNTER_REDIS_CONNECTION_FAILED",
  "COUNTER_REDIS_COMMAND_FAILED",
  "COUNTER_REDIS_RESPONSE_INVALID",
]);
export function counterError(code, message) {
  return Object.assign(new Error(message), { code });
}
export function counterFailure(error) {
  const code = codes.has(error?.code) ? error.code : "COUNTER_UNAVAILABLE";
  // Log only a known diagnostic code, never credentials or database responses.
  console.error(`Like counter: ${code}`);
  return {
    error: "The live count is temporarily unavailable. Please try again.",
    code,
  };
}
