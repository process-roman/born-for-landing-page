import { createHmac } from "node:crypto";
import { counterError } from "./counter-errors.mjs";

export function counterConfig(env = process.env) {
  const credentials = [
    [env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN],
    [env.KV_REST_API_URL, env.KV_REST_API_TOKEN],
  ].find(([url, token]) => url && token);
  if (!credentials) {
    throw counterError(
      "COUNTER_CONFIG_MISSING",
      "Like counter: connect Upstash Redis in Vercel Storage. Expected UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN or KV_REST_API_URL / KV_REST_API_TOKEN.",
    );
  }
  const [url, token] = credentials;
  try {
    if (new URL(url).protocol !== "https:") throw new Error();
  } catch {
    throw counterError(
      "COUNTER_CONFIG_INVALID",
      "Like counter: the Redis REST URL must use HTTPS.",
    );
  }
  if (env.LIKE_COOKIE_SECRET && env.LIKE_COOKIE_SECRET.length < 32) {
    throw counterError(
      "COUNTER_COOKIE_SECRET_INVALID",
      "Like counter: the optional cookie secret must have at least 32 characters.",
    );
  }
  return {
    url,
    token,
    namespace: env.LIKES_NAMESPACE || "bornfor:website:v1",
    // Derive a dedicated signing key when no explicit cookie key is configured.
    // Credentials and the signing key stay in the server function.
    secret:
      env.LIKE_COOKIE_SECRET ||
      createHmac("sha256", token)
        .update("born-for:like-cookie:v1")
        .digest("hex"),
  };
}
