import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import type { StoryblokComponent } from "./types.js";

// ---------------------------------------------------------------------------
// Generate — output Storyblok CLI-compatible JSON files
//
// Storyblok CLI v4 expects:
//   .storyblok/components/<space-id>/components.json  — plain array of components
//   .storyblok/components/<space-id>/groups.json       — plain array of groups
//   .storyblok/components/<space-id>/presets.json      — plain array of presets
//   .storyblok/components/<space-id>/tags.json         — plain array of tags
// ---------------------------------------------------------------------------

export interface GenerateOptions {
  /** Local component definitions */
  components: StoryblokComponent[];
  /** Space ID (used for the output directory path) */
  spaceId: number;
  /** Output base directory (default: ".storyblok/components") */
  outputDir?: string;
}

export interface GenerateResult {
  /** Path to generated components.json */
  componentsFile: string;
  /** Path to generated groups.json */
  groupsFile: string;
  /** Path to generated presets.json */
  presetsFile: string;
  /** Path to generated tags.json */
  tagsFile: string;
  /** Number of components written */
  componentCount: number;
}

export async function generate(opts: GenerateOptions): Promise<GenerateResult> {
  const baseDir = opts.outputDir ?? ".storyblok/components";
  const outDir = join(baseDir, String(opts.spaceId));
  await mkdir(outDir, { recursive: true });

  // Collect unique groups and tags from component definitions
  const groupsMap = new Map<string, { name: string; uuid: string }>();
  const tagsMap = new Map<string, { name: string; id?: number }>();
  const presets: unknown[] = [];

  for (const component of opts.components) {
    // Collect groups — use component_group_name if available, fall back to UUID
    if (component.component_group_uuid) {
      if (!groupsMap.has(component.component_group_uuid)) {
        groupsMap.set(component.component_group_uuid, {
          name: component.component_group_name ?? component.component_group_uuid,
          uuid: component.component_group_uuid,
        });
      }
    }

    // Collect tags
    if (component.internal_tags_list) {
      for (const tag of component.internal_tags_list) {
        if (!tagsMap.has(tag.name)) {
          tagsMap.set(tag.name, tag);
        }
      }
    }

    // Collect presets
    if (component.all_presets) {
      presets.push(...component.all_presets);
    }
  }

  // Build the tags array with object_type
  const tags = [...tagsMap.values()].map((t) => ({
    ...t,
    object_type: "component" as const,
  }));

  // Write all files
  const componentsFile = join(outDir, "components.json");
  const groupsFile = join(outDir, "groups.json");
  const presetsFile = join(outDir, "presets.json");
  const tagsFile = join(outDir, "tags.json");

  await Promise.all([
    writeFile(componentsFile, JSON.stringify(opts.components, null, 2) + "\n", "utf-8"),
    writeFile(groupsFile, JSON.stringify([...groupsMap.values()], null, 2) + "\n", "utf-8"),
    writeFile(presetsFile, JSON.stringify(presets, null, 2) + "\n", "utf-8"),
    writeFile(tagsFile, JSON.stringify(tags, null, 2) + "\n", "utf-8"),
  ]);

  console.log(`  Generated ${componentsFile}`);
  console.log(`  Generated ${groupsFile}`);
  console.log(`  Generated ${presetsFile}`);
  console.log(`  Generated ${tagsFile}`);

  return {
    componentsFile,
    groupsFile,
    presetsFile,
    tagsFile,
    componentCount: opts.components.length,
  };
}
