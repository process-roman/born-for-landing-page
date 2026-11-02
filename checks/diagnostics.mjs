import { test } from "node:test";
import assert from "node:assert/strict";
import { counterError, counterFailure } from "../server/counter-errors.mjs";
import { counterConfig } from "../server/counter-config.mjs";
import { redisStore } from "../server/redis-store.mjs";

test("diagnostics distinguish missing configuration from an invalid optional secret", () => {
  assert.throws(() => counterConfig({}), { code: "COUNTER_CONFIG_MISSING" });
  assert.throws(
    () =>
      counterConfig({
        KV_REST_API_URL: "https://example.upstash.io",
        KV_REST_API_TOKEN: "private-token",
        LIKE_COOKIE_SECRET: "short",
      }),
    { code: "COUNTER_COOKIE_SECRET_INVALID" },
  );
});
test("diagnostics never return arbitrary error messages or credentials", () => {
  const safe = counterFailure(
    counterError("COUNTER_REDIS_AUTH_FAILED", "private-token"),
  );
  assert.equal(safe.code, "COUNTER_REDIS_AUTH_FAILED");
  assert.ok(!JSON.stringify(safe).includes("private-token"));
  assert.equal(
    counterFailure(counterError("private-token", "private-token")).code,
    "COUNTER_UNAVAILABLE",
  );
});
test("database diagnostics distinguish authentication, command and connection errors", async () => {
  const original = globalThis.fetch;
  const store = redisStore({
    url: "https://example.upstash.io",
    token: "private-token",
  });
  try {
    globalThis.fetch = async () => new Response("denied", { status: 401 });
    await assert.rejects(store.visit("visitor", false), {
      code: "COUNTER_REDIS_AUTH_FAILED",
    });
    globalThis.fetch = async () =>
      Response.json({ error: "private server message" });
    await assert.rejects(store.visit("visitor", false), {
      code: "COUNTER_REDIS_COMMAND_FAILED",
    });
    globalThis.fetch = async () => {
      throw new Error("private-token");
    };
    await assert.rejects(store.visit("visitor", false), {
      code: "COUNTER_REDIS_CONNECTION_FAILED",
    });
  } finally {
    globalThis.fetch = original;
  }
});
