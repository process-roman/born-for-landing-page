import { createLikesHandler } from "../server/likes.mjs";
import { redisStore } from "../server/redis-store.mjs";
import { counterConfig } from "../server/counter-config.mjs";
let handler;
export default async function likes(req, res) {
  try {
    if (!handler) {
      const config = counterConfig();
      handler = createLikesHandler({
        secret: config.secret,
        store: redisStore(config),
      });
    }
    return await handler(req, res);
  } catch (error) {
    console.error(error.message);
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.end(
      JSON.stringify({
        error: "The live count is temporarily unavailable. Please try again.",
      }),
    );
  }
}
