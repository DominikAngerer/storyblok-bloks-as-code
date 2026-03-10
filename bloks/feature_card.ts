import { defineComponent, asset, multilink, number, option, text, textarea } from "storyblok-bloks-as-code";

export const featureCard = defineComponent({
  name: "feature_card",
  display_name: "Feature Card",
  icon: "block-sticker",
  color: "#fbce41",
  preview_field: "title",
  schema: {
    icon: asset({
      display_name: "Icon",
      filetypes: ["images"],
      description: "Icon or illustration (SVG or PNG recommended).",
    }),
    title: text({ display_name: "Title", required: true, translatable: true, max_length: 80 }),
    description: textarea({
      display_name: "Description",
      translatable: true,
      max_length: 250,
      description: "Short feature description (2–3 sentences).",
    }),
    link: multilink({
      display_name: "Link",
      allow_target_blank: true,
      restrict_content_types: false,
      description: "Optional link — makes the entire card clickable.",
    }),
    link_label: text({
      display_name: "Link Label",
      translatable: true,
      default_value: "Read more",
      description: "Text for the card link (e.g. \"Read more\", \"Learn more\").",
      conditional_settings: [{"field":"link","operator":"is_not_empty"}],
    }),
    style: option({
      display_name: "Card Style",
      options: [{"name":"Default","value":"default"},{"name":"Outlined","value":"outlined"},{"name":"Elevated","value":"elevated"}],
      default_value: "default",
      exclude_empty_option: true,
    }),
    sort_order: number({
      display_name: "Sort Order",
      description: "Manual sort order within the grid. Lower = first.",
      min_value: 0,
      max_value: 100,
      steps: 1,
      default_value: "0",
    }),
  },
});
