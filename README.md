# storyblok-bloks-as-code

Define Storyblok components as fully-typed TypeScript files, then generate Storyblok CLI-compatible JSON to push them to your space. Also supports the reverse: convert a pulled `components.json` back into typed `.ts` definitions.

## Why?

- **Type safety** — every field type, option, and config property is typed
- **Version control** — component schemas live in your repo, reviewable in PRs
- **No vendor lock-in** — uses the official [Storyblok CLI](https://www.storyblok.com/docs/libraries/storyblok-cli) for all API communication
- **Zero runtime dependencies** — only TypeScript as a build dependency

## Install

```bash
npm install github:DominikAngerer/storyblok-bloks-as-code
```

## Quick start

### 1. Define components

Create a `bloks/` directory and define your components:

```ts
// bloks/hero.ts
import { defineComponent, text, richtext, asset, option, section } from "storyblok-bloks-as-code";

export const hero = defineComponent({
  name: "hero",
  display_name: "Hero",
  is_nestable: true,
  icon: "block-text-img-l",
  color: "#00b3b0",

  schema: {
    section_content: section(["headline", "subline"], { display_name: "Content" }),

    headline: text({
      display_name: "Headline",
      required: true,
      translatable: true,
      max_length: 100,
    }),

    subline: richtext({
      display_name: "Subline",
      translatable: true,
    }),

    background_image: asset({
      display_name: "Background Image",
      filetypes: ["images"],
    }),

    theme: option({
      display_name: "Theme",
      options: [
        { name: "Light", value: "light" },
        { name: "Dark", value: "dark" },
      ],
      default_value: "dark",
    }),
  },
});
```

Create a barrel export:

```ts
// bloks/index.ts
export { hero } from "./hero.js";
```

### 2. Generate JSON

```bash
npx sb-bac generate --space <your-space-id>
```

This writes Storyblok CLI-compatible files to `.storyblok/components/<space-id>/`:

```
.storyblok/components/<space-id>/
  components.json
  groups.json
  presets.json
  tags.json
```

### 3. Push to Storyblok

```bash
storyblok components push --space <your-space-id>
```

## Reverse workflow: Storyblok to code

Pull your existing components and convert them to typed `.ts` files:

```bash
storyblok components pull --space <your-space-id>
npx sb-bac import .storyblok/components/<space-id>/components.json ./bloks
```

This generates one `.ts` file per component plus a barrel `index.ts`.

## CLI reference

```
npx sb-bac generate --space <id>     # Convert .ts definitions → Storyblok CLI JSON
npx sb-bac import <file> [output-dir] # Convert Storyblok JSON → typed .ts definitions
```

The space ID can also be set via the `STORYBLOK_SPACE_ID` environment variable.

## Field types

All 18 Storyblok field types are supported:

| Helper | Storyblok type | Notes |
|---|---|---|
| `text()` | Text | |
| `textarea()` | Textarea | |
| `number()` | Number | Supports `min_value`, `max_value`, `steps` |
| `boolean()` | Boolean | |
| `datetime()` | Datetime | |
| `markdown()` | Markdown | |
| `richtext()` | Richtext | Supports `customize_toolbar`, `toolbar` |
| `option()` | Single option | Self-defined or datasource |
| `options()` | Multi option | Self-defined or datasource |
| `bloks()` | Blocks | Supports `restrict_components`, `component_whitelist` |
| `asset()` | Asset | Supports `filetypes` filter |
| `multiasset()` | Multi-asset | |
| `multilink()` | Link | Supports `allow_target_blank`, `show_anchor` |
| `table()` | Table | |
| `section()` | Section | `section(keys, opts?)` — groups fields visually |
| `tab()` | Tab | `tab(keys, opts?)` — organizes fields into tabs |
| `custom()` | Custom field | `custom(fieldType, opts?)` |
| `references()` | References | Datasource reference type |

Every helper accepts the full set of field properties (e.g. `required`, `translatable`, `description`, `default_value`, `conditional_settings`).

## Component options

```ts
defineComponent({
  name: "my_block",           // required — the Storyblok component name
  display_name: "My Block",   // human-readable name
  is_root: true,              // content type (default: false → nestable)
  is_nestable: true,          // nestable block (default: true)
  icon: "block-doc",          // Storyblok icon name
  color: "#1b243f",           // hex color in the component list
  preview_field: "title",     // field shown as preview in the editor
  component_group_name: "Content", // assign to a component group
  schema: { ... },
});
```

Field positions (`pos`) are auto-assigned based on declaration order — no need to set them manually.

## Project scripts

```bash
npm run build       # Compile TypeScript
npm run typecheck   # Type-check without emitting
npm run generate    # Shortcut for sb-bac generate
npm run import      # Shortcut for sb-bac import
```

## License

ISC
