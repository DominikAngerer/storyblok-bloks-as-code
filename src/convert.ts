import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import type { StoryblokComponent, SchemaField } from "./types.js";

// ---------------------------------------------------------------------------
// Convert — read a Storyblok CLI components.json and generate typed .ts files
// ---------------------------------------------------------------------------

export interface ConvertOptions {
  /** Path to the components.json file (pulled by Storyblok CLI) */
  inputFile: string;
  /** Output directory for generated .ts files (default: "./storyblok") */
  outputDir?: string;
}

export interface ConvertResult {
  files: string[];
  componentCount: number;
}

export async function convert(opts: ConvertOptions): Promise<ConvertResult> {
  const outDir = opts.outputDir ?? "./bloks";
  await mkdir(outDir, { recursive: true });

  const raw = await readFile(opts.inputFile, "utf-8");
  const components: StoryblokComponent[] = JSON.parse(raw);

  if (!Array.isArray(components)) {
    throw new Error(
      `Expected a JSON array in ${opts.inputFile}, got ${typeof components}`,
    );
  }

  const files: string[] = [];

  for (const component of components) {
    const code = generateComponentFile(component);
    const filename = `${component.name}.ts`;
    const filepath = join(outDir, filename);
    await writeFile(filepath, code, "utf-8");
    files.push(filepath);
    console.log(`  ${component.name} → ${filepath}`);
  }

  // Generate barrel index
  const indexCode = generateIndexFile(components);
  const indexPath = join(outDir, "index.ts");
  await writeFile(indexPath, indexCode, "utf-8");
  files.push(indexPath);

  return { files, componentCount: components.length };
}

// ---------------------------------------------------------------------------
// Code generation helpers
// ---------------------------------------------------------------------------

function generateComponentFile(component: StoryblokComponent): string {
  const lines: string[] = [];
  const usedFieldHelpers = new Set<string>();

  for (const field of Object.values(component.schema)) {
    usedFieldHelpers.add(fieldTypeToHelper(field as SchemaField));
  }

  // Imports
  lines.push(
    `import { defineComponent, ${[...usedFieldHelpers].sort().join(", ")} } from "storyblok-bloks-as-code";`,
  );
  lines.push("");

  // Component definition
  lines.push(`export const ${camelCase(component.name)} = defineComponent({`);
  lines.push(`  name: ${JSON.stringify(component.name)},`);

  if (component.display_name) {
    lines.push(`  display_name: ${JSON.stringify(component.display_name)},`);
  }
  if (component.is_root) {
    lines.push(`  is_root: true,`);
    lines.push(`  is_nestable: false,`);
  }
  if (component.icon) {
    lines.push(`  icon: ${JSON.stringify(component.icon)},`);
  }
  if (component.color) {
    lines.push(`  color: ${JSON.stringify(component.color)},`);
  }
  if (component.preview_field) {
    lines.push(`  preview_field: ${JSON.stringify(component.preview_field)},`);
  }
  if (component.component_group_uuid) {
    lines.push(
      `  component_group_uuid: ${JSON.stringify(component.component_group_uuid)},`,
    );
  }

  lines.push(`  schema: {`);

  // Sort fields by pos
  const sortedFields = Object.entries(component.schema).sort(
    ([, a], [, b]) => ((a as SchemaField).pos ?? 0) - ((b as SchemaField).pos ?? 0),
  );

  for (const [key, field] of sortedFields) {
    const f = field as SchemaField;
    const helper = fieldTypeToHelper(f);
    const opts = fieldToOpts(f);

    if (opts) {
      lines.push(`    ${key}: ${helper}(${opts}),`);
    } else {
      lines.push(`    ${key}: ${helper}(),`);
    }
  }

  lines.push(`  },`);
  lines.push(`});`);
  lines.push("");

  return lines.join("\n");
}

function generateIndexFile(components: StoryblokComponent[]): string {
  const lines: string[] = [];
  for (const c of components) {
    lines.push(`export { ${camelCase(c.name)} } from "./${c.name}.js";`);
  }
  lines.push("");
  return lines.join("\n");
}

function fieldTypeToHelper(field: SchemaField): string {
  if ("is_reference_type" in field && field.is_reference_type) {
    return "references";
  }
  switch (field.type) {
    case "text": return "text";
    case "textarea": return "textarea";
    case "number": return "number";
    case "boolean": return "boolean";
    case "datetime": return "datetime";
    case "markdown": return "markdown";
    case "richtext": return "richtext";
    case "option": return "option";
    case "options": return "options";
    case "bloks": return "bloks";
    case "asset": return "asset";
    case "multiasset": return "multiasset";
    case "multilink": return "multilink";
    case "table": return "table";
    case "section": return "section";
    case "tab": return "tab";
    case "custom": return "custom";
    case "image": return "text"; // deprecated, map to text
    case "file": return "text";  // deprecated, map to text
    default: return "text";
  }
}

function fieldToOpts(field: SchemaField): string | null {
  const opts: Record<string, unknown> = { ...field };
  delete opts.type;
  delete opts.pos;
  delete opts.id;

  // section/tab use positional keys arg
  if (field.type === "section" || field.type === "tab") {
    const keys = (opts.keys as string[]) ?? [];
    delete opts.keys;
    const remaining = Object.keys(opts).filter((k) => opts[k] !== undefined && opts[k] !== null);
    if (remaining.length > 0) {
      return `${JSON.stringify(keys)}, ${formatObj(opts)}`;
    }
    return JSON.stringify(keys);
  }

  // custom uses positional field_type arg
  if (field.type === "custom") {
    const ft = opts.field_type;
    delete opts.field_type;
    const remaining = Object.keys(opts).filter((k) => opts[k] !== undefined && opts[k] !== null);
    if (remaining.length > 0) {
      return `${JSON.stringify(ft)}, ${formatObj(opts)}`;
    }
    return JSON.stringify(ft);
  }

  // Keep explicit false (it's meaningful config), only strip undefined/null
  const cleaned: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(opts)) {
    if (v === undefined || v === null) continue;
    cleaned[k] = v;
  }

  if (Object.keys(cleaned).length === 0) return null;
  return formatObj(cleaned);
}

function formatObj(obj: Record<string, unknown>): string {
  const entries = Object.entries(obj).filter(
    ([, v]) => v !== undefined && v !== null,
  );
  if (entries.length === 0) return "";

  const parts = entries.map(([k, v]) => `${k}: ${JSON.stringify(v)}`);
  if (parts.join(", ").length < 80) {
    return `{ ${parts.join(", ")} }`;
  }
  return `{\n      ${parts.join(",\n      ")},\n    }`;
}

function camelCase(str: string): string {
  return str.replace(/[-_](.)/g, (_, c: string) => c.toUpperCase());
}
