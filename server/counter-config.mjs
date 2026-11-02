import { createHmac } from "node:crypto";

export function counterConfig(env = process.env) {
  const credentials = [
    [env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN],
    [env.KV_REST_API_URL, env.KV_REST_API_TOKEN],
  ].find(([url, token]) => url && token);
  if (!credentials) {
    throw new Error(
      "Like counter: connect Upstash Redis in Vercel Storage. Expected UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN or KV_REST_API_URL / KV_REST_API_TOKEN.",
    );
  }
  const [url, token] = credentials;
  if (new URL(url).protocol !== "https:") {
    throw new Error("Like counter: the Redis REST URL must use HTTPS.");
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
