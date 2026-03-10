import type {
  TextField,
  TextareaField,
  NumberField,
  BooleanField,
  DatetimeField,
  MarkdownField,
  RichtextField,
  OptionField,
  OptionsField,
  BloksField,
  AssetField,
  MultiassetField,
  MultilinkField,
  TableField,
  SectionField,
  TabField,
  CustomField,
  ReferencesField,
} from "./types.js";

// ---------------------------------------------------------------------------
// Field builder helpers
//
// Each function creates a schema field object of the correct type. The `pos`
// field is intentionally omitted here — `defineComponent()` auto-assigns
// positions based on declaration order.
// ---------------------------------------------------------------------------

type Opts<T> = Omit<T, "type">;

export const text = (opts?: Opts<TextField>): TextField => ({
  type: "text",
  ...opts,
});

export const textarea = (opts?: Opts<TextareaField>): TextareaField => ({
  type: "textarea",
  ...opts,
});

export const number = (opts?: Opts<NumberField>): NumberField => ({
  type: "number",
  ...opts,
});

export const boolean = (opts?: Opts<BooleanField>): BooleanField => ({
  type: "boolean",
  ...opts,
});

export const datetime = (opts?: Opts<DatetimeField>): DatetimeField => ({
  type: "datetime",
  ...opts,
});

export const markdown = (opts?: Opts<MarkdownField>): MarkdownField => ({
  type: "markdown",
  ...opts,
});

export const richtext = (opts?: Opts<RichtextField>): RichtextField => ({
  type: "richtext",
  ...opts,
});

export const option = (opts?: Opts<OptionField>): OptionField => ({
  type: "option",
  ...opts,
});

export const options = (opts?: Opts<OptionsField>): OptionsField => ({
  type: "options",
  ...opts,
});

export const bloks = (opts?: Opts<BloksField>): BloksField => ({
  type: "bloks",
  ...opts,
});

export const asset = (opts?: Opts<AssetField>): AssetField => ({
  type: "asset",
  ...opts,
});

export const multiasset = (opts?: Opts<MultiassetField>): MultiassetField => ({
  type: "multiasset",
  ...opts,
});

export const multilink = (opts?: Opts<MultilinkField>): MultilinkField => ({
  type: "multilink",
  ...opts,
});

export const table = (opts?: Opts<TableField>): TableField => ({
  type: "table",
  ...opts,
});

export const section = (
  keys: string[],
  opts?: Omit<SectionField, "type" | "keys">,
): SectionField => ({
  type: "section",
  keys,
  ...opts,
});

export const tab = (
  keys: string[],
  opts?: Omit<TabField, "type" | "keys">,
): TabField => ({
  type: "tab",
  keys,
  ...opts,
});

export const custom = (
  fieldType: string,
  opts?: Omit<CustomField, "type" | "field_type">,
): CustomField => ({
  type: "custom",
  field_type: fieldType,
  ...opts,
});

export const references = (
  opts?: Omit<ReferencesField, "type" | "is_reference_type">,
): ReferencesField => ({
  type: "option",
  is_reference_type: true,
  ...opts,
});
