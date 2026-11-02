import { test } from "node:test";
import assert from "node:assert/strict";
import { counterConfig } from "../server/counter-config.mjs";

test("Upstash and Vercel Marketplace credentials configure the same persistent counter", () => {
  const url = "https://example.upstash.io";
  const token = "test-server-token";
  const upstash = counterConfig({
    UPSTASH_REDIS_REST_URL: url,
    UPSTASH_REDIS_REST_TOKEN: token,
  });
  const marketplace = counterConfig({
    KV_REST_API_URL: url,
    KV_REST_API_TOKEN: token,
  });
  assert.deepEqual(upstash, marketplace);
  assert.equal(upstash.secret.length, 64);
  assert.notEqual(upstash.secret, token);
  assert.equal(upstash.namespace, "bornfor:website:v1");
});
test("existing cookie secrets and counter namespaces survive the configuration update", () => {
  const secret = "existing-cookie-secret-with-32-characters";
  const config = counterConfig({
    KV_REST_API_URL: "https://example.upstash.io",
    KV_REST_API_TOKEN: "token",
    LIKE_COOKIE_SECRET: secret,
    LIKES_NAMESPACE: "existing-counter",
  });
  assert.equal(config.secret, secret);
  assert.equal(config.namespace, "existing-counter");
});
test("missing, partial or insecure database configuration fails clearly", () => {
  assert.throws(() => counterConfig({}), /connect Upstash/);
  assert.throws(
    () => counterConfig({ KV_REST_API_URL: "https://example.upstash.io" }),
    /connect Upstash/,
  );
  assert.throws(
    () =>
      counterConfig({
        KV_REST_API_URL: "http://example.upstash.io",
        KV_REST_API_TOKEN: "token",
      }),
    /HTTPS/,
  );
});
