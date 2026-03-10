import type { StoryblokComponent, ComponentSchema, SchemaField } from "./types.js";

// ---------------------------------------------------------------------------
// defineComponent — the main entry point for declaring a Storyblok component
// ---------------------------------------------------------------------------

type ComponentInput = Omit<StoryblokComponent, "id" | "created_at" | "updated_at" | "real_name" | "all_presets" | "internal_tags_list">;

/**
 * Define a Storyblok component with full type safety.
 *
 * - Auto-assigns `pos` to each field based on declaration order.
 * - Defaults to `is_nestable: true` if neither `is_root` nor `is_nestable` is set.
 */
export function defineComponent(input: ComponentInput): StoryblokComponent {
  const schema: ComponentSchema = {};
  let pos = 0;

  for (const [key, field] of Object.entries(input.schema)) {
    const f = { ...field } as SchemaField & { pos: number };
    // Only assign pos if not explicitly set
    if (f.pos === undefined) {
      f.pos = pos;
    }
    schema[key] = f;
    pos++;
  }

  // Default to nestable if neither is set
  const isRoot = input.is_root ?? false;
  const isNestable = input.is_nestable ?? !isRoot;

  return {
    ...input,
    schema,
    is_root: isRoot,
    is_nestable: isNestable,
  };
}
