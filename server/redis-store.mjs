import { counterError } from "./counter-errors.mjs";
export const LIKE_SCRIPT = `
redis.call('SETNX', KEYS[1], 117)
local added = 0
if ARGV[1] == 'like' then
  added = redis.call('SADD', KEYS[2], ARGV[2])
  if added == 1 then redis.call('INCR', KEYS[1]) end
end
return {tonumber(redis.call('GET', KEYS[1])), redis.call('SISMEMBER', KEYS[2], ARGV[2])}
`;
export function redisStore({ url, token, namespace = "bornfor:website:v1" }) {
  if (!url || !token)
    throw new Error("Shared counter storage is not configured.");
  return {
    async visit(id, like) {
      let response;
      try {
        response = await fetch(url.replace(/\/$/, ""), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify([
            "EVAL",
            LIKE_SCRIPT,
            "2",
            `${namespace}:count`,
            `${namespace}:visitors`,
            like ? "like" : "read",
            id,
          ]),
          signal: AbortSignal.timeout(8000),
        });
      } catch {
        throw counterError(
          "COUNTER_REDIS_CONNECTION_FAILED",
          "Counter storage connection failed",
        );
      }
      if (!response.ok)
        throw counterError(
          [401, 403].includes(response.status)
            ? "COUNTER_REDIS_AUTH_FAILED"
            : "COUNTER_REDIS_HTTP_FAILED",
          "Counter storage unavailable",
        );
      let payload;
      try {
        payload = await response.json();
      } catch {
        throw counterError(
          "COUNTER_REDIS_RESPONSE_INVALID",
          "Invalid counter response",
        );
      }
      const { result, error } = payload || {};
      if (error)
        throw counterError(
          "COUNTER_REDIS_COMMAND_FAILED",
          "Counter storage rejected the command",
        );
      if (
        error ||
        !Array.isArray(result) ||
        !Number.isSafeInteger(result[0]) ||
        result[0] < 117
      )
        throw counterError(
          "COUNTER_REDIS_RESPONSE_INVALID",
          "Invalid counter result",
        );
      return { count: result[0], liked: result[1] === 1 };
    },
  };
}
