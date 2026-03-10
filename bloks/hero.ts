import {
  defineComponent,
  text,
  richtext,
  asset,
  multilink,
  option,
  boolean,
  section,
} from "../src/index.js";

/**
 * Hero — a full-width hero banner nestable block.
 *
 * Demonstrates: sections (field grouping), richtext with custom toolbar,
 * multilink, boolean toggle, asset with filetypes, and option with
 * self-defined values.
 */
export const hero = defineComponent({
  name: "hero",
  display_name: "Hero",
  is_nestable: true,
  icon: "block-text-img-l",
  color: "#00b3b0",

  schema: {
    // -- Content section -----------------------------------------------------
    section_content: section(
      ["headline", "subline", "cta_label", "cta_link"],
      { display_name: "Content" },
    ),

    headline: text({
      display_name: "Headline",
      required: true,
      translatable: true,
      max_length: 100,
    }),

    subline: richtext({
      display_name: "Subline",
      translatable: true,
      customize_toolbar: true,
      toolbar: ["bold", "italic", "link", "list"],
      allow_target_blank: true,
      description: "Short supporting text below the headline.",
    }),

    cta_label: text({
      display_name: "CTA Label",
      translatable: true,
      default_value: "Learn more",
    }),

    cta_link: multilink({
      display_name: "CTA Link",
      allow_target_blank: true,
      show_anchor: true,
      email_link_type: false,
      asset_link_type: false,
    }),

    // -- Media section -------------------------------------------------------
    section_media: section(
      ["background_image", "background_video"],
      { display_name: "Media" },
    ),

    background_image: asset({
      display_name: "Background Image",
      filetypes: ["images"],
      description: "Hero background — recommended 1920×1080 or larger.",
    }),

    background_video: asset({
      display_name: "Background Video",
      filetypes: ["videos"],
      description: "Optional background video (muted autoplay).",
    }),

    // -- Appearance section --------------------------------------------------
    section_appearance: section(
      ["theme", "height", "overlay"],
      { display_name: "Appearance" },
    ),

    theme: option({
      display_name: "Theme",
      options: [
        { name: "Light", value: "light" },
        { name: "Dark", value: "dark" },
      ],
      default_value: "dark",
      exclude_empty_option: true,
    }),

    height: option({
      display_name: "Height",
      options: [
        { name: "Auto", value: "auto" },
        { name: "Half Screen", value: "50vh" },
        { name: "Full Screen", value: "100vh" },
      ],
      default_value: "auto",
    }),

    overlay: boolean({
      display_name: "Dark Overlay",
      inline_label: true,
      default_value: "true",
      description: "Add a semi-transparent dark overlay on the background.",
    }),
  },
});
