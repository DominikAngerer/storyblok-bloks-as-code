#!/usr/bin/env node

import { resolve } from "node:path";
import { generate } from "./generate.js";
import { convert } from "./convert.js";
import type { StoryblokComponent } from "./types.js";

// ---------------------------------------------------------------------------
// CLI — sb-bac generate | import
// ---------------------------------------------------------------------------

async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (!command || command === "--help" || command === "-h") {
    printHelp();
    process.exit(0);
  }

  switch (command) {
    case "generate": {
      const spaceId = getSpaceId(args);
      const components = await loadComponents();
      const outputDir = args.find((a) => !a.startsWith("--")) ?? undefined;

      console.log(
        `\nGenerating Storyblok CLI files for ${components.length} component(s)...\n`,
      );

      const result = await generate({ components, spaceId, outputDir });

      console.log(`\nDone. ${result.componentCount} component(s) written.`);
      console.log(
        `\nNow push with the Storyblok CLI:\n  storyblok components push --space ${spaceId}\n`,
      );
      break;
    }

    case "import": {
      const inputFile = args.find((a) => !a.startsWith("--"));
      const outputDir =
        args.find((a, i) => !a.startsWith("--") && i > 0) ?? "./bloks";

      if (!inputFile) {
        console.error(
          "Error: Missing input file.\n" +
            "Usage: sb-bac import <components.json> [output-dir]\n\n" +
            "Pull first with the Storyblok CLI:\n" +
            "  storyblok components pull --space <id>",
        );
        process.exit(1);
      }

      console.log(
        `\nConverting ${inputFile} → typed .ts files in ${outputDir}/\n`,
      );

      const result = await convert({
        inputFile: resolve(process.cwd(), inputFile),
        outputDir,
      });

      console.log(`\nDone. ${result.componentCount} component(s) converted.`);
      break;
    }

    default:
      console.error(`Unknown command: "${command}"\n`);
      printHelp();
      process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getSpaceId(args: string[]): number {
  // --space <id> flag
  const spaceIdx = args.indexOf("--space");
  if (spaceIdx !== -1 && args[spaceIdx + 1]) {
    return parseInt(args[spaceIdx + 1], 10);
  }

  // STORYBLOK_SPACE_ID env var
  const envId = process.env.STORYBLOK_SPACE_ID;
  if (envId) {
    return parseInt(envId, 10);
  }

  console.error(
    "Error: No space ID found.\n" +
      "Use --space <id> or set STORYBLOK_SPACE_ID env var.",
  );
  process.exit(1);
}

async function loadComponents(): Promise<StoryblokComponent[]> {
  const dir = "./bloks";
  const indexPath = resolve(process.cwd(), dir, "index.ts");
  const distIndexPath = resolve(process.cwd(), "dist", dir, "index.js");

  const paths = [indexPath, indexPath.replace(/\.ts$/, ".js"), distIndexPath];

  for (const p of paths) {
    try {
      const mod = await import(p);
      const components: StoryblokComponent[] = [];
      for (const [, value] of Object.entries(mod)) {
        if (isComponent(value)) {
          components.push(value as StoryblokComponent);
        }
      }
      if (components.length > 0) return components;
    } catch {
      // Try next path
    }
  }

  console.error(
    `Error: Could not load components from ${dir}/index.ts (or .js).\n` +
      `Make sure your component files are compiled or use a TypeScript loader.`,
  );
  process.exit(1);
}

function isComponent(value: unknown): value is StoryblokComponent {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "schema" in value &&
    typeof (value as StoryblokComponent).name === "string" &&
    typeof (value as StoryblokComponent).schema === "object"
  );
}

// ---------------------------------------------------------------------------
// Help
// ---------------------------------------------------------------------------

function printHelp() {
  console.log(`
sb-bac — Storyblok Bloks-as-Code

Usage:
  sb-bac generate --space <id>
  sb-bac import <components.json> [output-dir]

Workflow (code → Storyblok):
  1. Define components in bloks/*.ts using defineComponent()
  2. npm run build
  3. sb-bac generate --space <id>
  4. storyblok components push --space <id>

Workflow (Storyblok → code):
  1. storyblok components pull --space <id>
  2. sb-bac import .storyblok/components/<id>/components.json

Commands:
  generate     Convert typed .ts definitions → Storyblok CLI JSON
  import       Convert Storyblok CLI JSON → typed .ts definitions

Options:
  --space <id>  Storyblok space ID (or set STORYBLOK_SPACE_ID env var)
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
