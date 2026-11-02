import { writeFile, copyFile, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { build } from "esbuild";
import { createRequire } from "node:module";
import { resolve, join } from "node:path";
const appRoot = resolve(process.argv[2] || "../born-for");
const require = createRequire(join(appRoot, "package.json"));
const { SIGNS, SIGN_IDS } = require("./src/content/signs.ts");
const {
  ATTRIBUTE_LABELS,
  ATTRIBUTE_DESCRIPTIONS,
  FAMILIES,
} = require("./src/content/attributes.ts");
const { CAREERS, CAREER_IDS } = require("./src/content/careers.ts");
const { LIVES } = require("./src/content/life.ts");
const { WORLDS } = require("./src/content/worlds.ts");
const root = new URL("../", import.meta.url);
await mkdir(new URL("src/generated/", root), { recursive: true });
await mkdir(new URL("public/art/", root), { recursive: true });
const data = {
  sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
    cwd: appRoot,
  }).trim(),
  signs: SIGNS,
  signIds: SIGN_IDS,
  labels: ATTRIBUTE_LABELS,
  descriptions: ATTRIBUTE_DESCRIPTIONS,
  families: FAMILIES,
  worlds: WORLDS,
  careers: CAREER_IDS.map((id) => {
    const c = CAREERS[id];
    const life = LIVES[id];
    return {
      id,
      name: c.name,
      oneLiner: c.oneLiner,
      worlds: c.worlds,
      requirements: c.requirements,
      dayToDay: c.dayToDay,
      opening: (() => {
        const e = life?.events.find(
          (e) =>
            e.kind === "opener" &&
            !e.conditions?.flagsAll?.includes("track_changer"),
        );
        return e
          ? {
              title: e.title,
              text: e.text,
              choices: e.choices.map(({ id, label, hint }) => ({
                id,
                label,
                hint,
              })),
            }
          : null;
      })(),
    };
  }),
};
await writeFile(
  new URL("src/generated/app-data.json", root),
  JSON.stringify(data),
);
await build({
  entryPoints: [join(appRoot, "src/logic/birthday.ts")],
  bundle: true,
  format: "esm",
  platform: "browser",
  outfile: new URL("src/generated/birthday.js", root).pathname,
  banner: {
    js: "// Generated from the app on main. Refresh with npm run sync:app.",
  },
});
await copyFile(
  join(appRoot, "assets/avatars/archetypes.webp"),
  new URL("public/art/archetypes.webp", root),
);
await copyFile(
  join(appRoot, "assets/scenery/life-mountains.webp"),
  new URL("public/art/mountains.webp", root),
);
console.log(
  `Synced ${SIGN_IDS.length} signs and ${CAREER_IDS.length} careers from ${data.sourceCommit.slice(0, 7)}`,
);

await copyFile(
  join(appRoot, "assets/images/Born for logo.png"),
  new URL("public/brand-logo.png", root),
);
