// ---------------------------------------------------------------------------
// Storyblok Management API – Component & Schema Field Types
// Based on: https://www.storyblok.com/docs/api/management/components
// ---------------------------------------------------------------------------

// ---- Shared / Common --------------------------------------------------

export interface ConditionalSetting {
  /** UUID of the condition */
  _uid?: string;
  /** Field key to evaluate */
  field: string;
  /** Operator: "is" | "is_not" | "is_empty" | "is_not_empty" */
  operator: "is" | "is_not" | "is_empty" | "is_not_empty";
  /** Value to compare against */
  value?: string;
}

/** Properties shared by every schema field */
export interface BaseFieldProperties {
  /** Position within the component */
  pos?: number;
  /** Mark as required in the editor */
  required?: boolean;
  /** Description shown in the editor */
  description?: string;
  /** Show description as tooltip instead of inline */
  tooltip?: boolean;
  /** Display name in the editor (overrides the key) */
  display_name?: string;
  /** Default value (string or JSON‑escaped object) */
  default_value?: string;
  /** Enable translation */
  translatable?: boolean;
  /** Exclude from translation exports */
  no_translate?: boolean;
  /** Exclude from AI translations */
  exclude_from_ai_translation?: boolean;
  /** Exclude during merges (Dimensions App) */
  exclude_from_merge?: boolean;
  /** Exclude during overwrites (Dimensions App) */
  exclude_from_overwrite?: boolean;
  /** Overwrite on merges (Dimensions App) */
  force_merge?: boolean;
  /** Conditional visibility rules */
  conditional_settings?: ConditionalSetting[];
}

// ---- Field Types -------------------------------------------------------

export interface TextField extends BaseFieldProperties {
  type: "text";
  /** Client‑side regex validation */
  regex?: string;
  /** Maximum character length */
  max_length?: number;
  /** Right‑to‑left support */
  rtl?: boolean;
}

export interface TextareaField extends BaseFieldProperties {
  type: "textarea";
  /** Client‑side regex validation */
  regex?: string;
  /** Maximum character length */
  max_length?: number;
  /** Right‑to‑left support */
  rtl?: boolean;
}

export interface NumberField extends BaseFieldProperties {
  type: "number";
  /** Minimum allowed value */
  min_value?: number;
  /** Maximum allowed value */
  max_value?: number;
  /** Decimal places */
  decimals?: number;
  /** Step interval between values */
  steps?: number;
}

export interface BooleanField extends BaseFieldProperties {
  type: "boolean";
  /** Show label next to toggle */
  inline_label?: boolean;
}

export interface DatetimeField extends BaseFieldProperties {
  type: "datetime";
  /** Disable time selection (date only) */
  disable_time?: boolean;
}

export interface MarkdownField extends BaseFieldProperties {
  type: "markdown";
  /** Maximum character length */
  max_length?: number;
  /** Right‑to‑left support */
  rtl?: boolean;
  /** Display markdown as rich text */
  rich_markdown?: boolean;
  /** Customize toolbar buttons */
  customize_toolbar?: boolean;
  toolbar?: string[];
}

export interface RichtextStyleOption {
  _uid: string;
  name: string;
  value: string;
}

export interface RichtextField extends BaseFieldProperties {
  type: "richtext";
  /** Maximum character length */
  max_length?: number;
  /** Customize toolbar */
  customize_toolbar?: boolean;
  /** Enabled toolbar elements */
  toolbar?: string[];
  /** Allow links to open in new tab */
  allow_target_blank?: boolean;
  /** Allow link custom attributes */
  allow_custom_attributes?: boolean;
  /** Display markdown as rich text */
  rich_markdown?: boolean;
  /** Allow empty paragraphs */
  allow_multiline?: boolean;
  /** Custom CSS style options */
  style_options?: RichtextStyleOption[];
}

export type OptionSource =
  | ""               // self‑defined options
  | "internal"       // datasource
  | "internal_stories"
  | "internal_languages"
  | "external";      // external JSON URL

export interface OptionEntry {
  _uid?: string;
  name: string;
  value: string;
}

/** Shared properties for option and options fields */
interface BaseOptionProperties extends BaseFieldProperties {
  /** Source of the options */
  source?: OptionSource;
  /** Self‑defined options (when source is empty / undefined) */
  options?: OptionEntry[];
  /** Datasource slug (when source = "internal") */
  datasource_slug?: string;
  /** External JSON URL (when source = "external") */
  external_datasource?: string;
  /** Folder path for internal_stories (supports {0} placeholder) */
  folder_slug?: string;
  /** Filter by content type blocks (for internal_stories) */
  filter_content_type?: string[];
  /** Use story UUID instead of ID (internal_stories), default true */
  use_uuid?: boolean;
}

export interface OptionField extends BaseOptionProperties {
  type: "option";
  /** Hide the empty / placeholder option */
  exclude_empty_option?: boolean;
}

export interface OptionsField extends BaseOptionProperties {
  type: "options";
  /** Minimum selectable options */
  min_options?: string;
  /** Maximum selectable options */
  max_options?: string;
}

export type BloksRestrictType = "" | "groups" | "tags" | "components";

export interface BloksField extends BaseFieldProperties {
  type: "bloks";
  /** Maximum number of nestable blocks */
  maximum?: number;
  /** Minimum number of nestable blocks */
  minimum?: number;
  /** Restriction type */
  restrict_type?: BloksRestrictType;
  /** Enable component restriction */
  restrict_components?: boolean;
  /** Allowed component names (when restrict_type = "components" or "") */
  component_whitelist?: string[];
  /** Denied component names */
  component_denylist?: string[];
  /** Allowed tag IDs (when restrict_type = "tags") */
  component_tag_whitelist?: number[];
  /** Denied tag IDs */
  component_tag_denylist?: number[];
  /** Allowed component group UUIDs (when restrict_type = "groups") */
  component_group_whitelist?: string[];
  /** Denied component group UUIDs */
  component_group_denylist?: string[];
}

export interface AssetField extends BaseFieldProperties {
  type: "asset";
  /** Allowed file types */
  filetypes?: ("images" | "videos" | "audios" | "texts")[];
  /** Restrict to specific asset folder */
  asset_folder_id?: number;
  /** Allow external URL assets */
  allow_external_url?: boolean;
}

export interface MultiassetField extends BaseFieldProperties {
  type: "multiasset";
  /** Allowed file types */
  filetypes?: ("images" | "videos" | "audios" | "texts")[];
  /** Restrict to specific asset folder */
  asset_folder_id?: number;
  /** Allow external URL assets */
  allow_external_url?: boolean;
}

export interface MultilinkField extends BaseFieldProperties {
  type: "multilink";
  /** Allow email addresses */
  email_link_type?: boolean;
  /** Allow asset URLs */
  asset_link_type?: boolean;
  /** Allow defining an anchor ID */
  show_anchor?: boolean;
  /** Allow links to open in new tab */
  allow_target_blank?: boolean;
  /** Allow custom link attributes */
  allow_custom_attributes?: boolean;
  /** Restrict to specific content type blocks */
  restrict_content_types?: boolean;
  /** Allowed content type block names */
  component_whitelist?: string[];
  /** Restrict to specific folder */
  force_link_scope?: boolean;
  /** Allowed folder path */
  link_scope?: string;
}

export interface TableField extends BaseFieldProperties {
  type: "table";
}

export interface SectionField extends BaseFieldProperties {
  type: "section";
  /** Field keys to group in this section */
  keys?: string[];
}

export interface TabField extends BaseFieldProperties {
  type: "tab";
  /** Field keys displayed in this tab */
  keys?: string[];
}

export interface CustomField extends BaseFieldProperties {
  type: "custom";
  /** Plugin field type name */
  field_type: string;
  /** Comma‑separated required field names */
  required_fields?: string;
  /** Additional plugin‑specific options (pass‑through) */
  options?: OptionEntry[];
  [key: string]: unknown;
}

// ---- Single‑Option with References (special case) ----------------------

export interface ReferencesField extends BaseFieldProperties {
  type: "option" | "options";
  /** Must be true for References fields */
  is_reference_type: true;
  source?: OptionSource;
  folder_slug?: string;
  filter_content_type?: string[];
  /** Display as "link" or "card" */
  entry_appearance?: string;
  /** Enable modal search */
  allow_advanced_search?: boolean;
  min_options?: string;
  max_options?: string;
}

// ---- Deprecated field types (still supported in API) -------------------

export interface ImageFieldDeprecated extends BaseFieldProperties {
  type: "image";
  image_crop?: boolean;
  keep_image_size?: boolean;
  image_width?: string;
  image_height?: string;
}

export interface FileFieldDeprecated extends BaseFieldProperties {
  type: "file";
}

// ---- Union of all field types ------------------------------------------

export type SchemaField =
  | TextField
  | TextareaField
  | NumberField
  | BooleanField
  | DatetimeField
  | MarkdownField
  | RichtextField
  | OptionField
  | OptionsField
  | BloksField
  | AssetField
  | MultiassetField
  | MultilinkField
  | TableField
  | SectionField
  | TabField
  | CustomField
  | ReferencesField
  | ImageFieldDeprecated
  | FileFieldDeprecated;

// ---- Component Schema --------------------------------------------------

export type ComponentSchema = Record<string, SchemaField>;

// ---- Component Icon (allowed values) -----------------------------------

export type ComponentIcon =
  | ""
  | "block-1-2"
  | "block-arrow-pointer"
  | "block-buildin"
  | "block-cart"
  | "block-center-m"
  | "block-comment"
  | "block-doc"
  | "block-email"
  | "block-image"
  | "block-keyboard"
  | "block-locked"
  | "block-map"
  | "block-mobile"
  | "block-monitor"
  | "block-paycard"
  | "block-resize-fc"
  | "block-sticker"
  | "block-suitcase"
  | "block-table"
  | "block-table-2"
  | "block-text-c"
  | "block-text-img-c"
  | "block-text-img-l"
  | "block-text-img-r"
  | "block-text-img-r-l"
  | "block-text-img-t-l"
  | "block-text-l"
  | "block-text-r"
  | "block-wallet";

// ---- Internal Tag -------------------------------------------------------

export interface InternalTag {
  id?: number;
  name: string;
}

// ---- Preset -------------------------------------------------------------

export interface ComponentPreset {
  id?: number;
  name: string;
  component_id?: number;
  image?: string | null;
  icon?: string;
  color?: string;
  description?: string;
  preset?: Record<string, unknown>;
}

// ---- The Component Object -----------------------------------------------

export interface StoryblokComponent {
  /** Numeric ID (assigned by Storyblok, omit when creating) */
  id?: number;
  /** Technical name – must be unique per space */
  name: string;
  /** Human‑readable name in the editor */
  display_name?: string | null;
  /** Component field schema */
  schema: ComponentSchema;
  /** URL to a component preview image */
  image?: string | null;
  /** Key of the field used for the preview in the editor */
  preview_field?: string;
  /** Use as content type (root) block */
  is_root?: boolean;
  /** Use as nestable block */
  is_nestable?: boolean;
  /** Template string for component preview (supports handlebars) */
  preview_tmpl?: string;
  /** Component group/folder UUID */
  component_group_uuid?: string;
  /** Human-readable group name (used when generating groups.json) */
  component_group_name?: string;
  /** Component icon */
  icon?: ComponentIcon;
  /** Icon colour (hex, e.g. "#00b3b0") */
  color?: string;
  /** Internal tag IDs */
  internal_tag_ids?: string[];
  /** Asset preview field for content type blocks */
  content_type_asset_preview?: string;

  // Read‑only (returned by API)
  created_at?: string;
  updated_at?: string;
  real_name?: string;
  all_presets?: ComponentPreset[];
  internal_tags_list?: InternalTag[];
}

