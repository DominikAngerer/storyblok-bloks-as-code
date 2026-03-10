import { defineComponent, asset, bloks, option, tab, text, textarea } from "storyblok-bloks-as-code";

export const page = defineComponent({
  name: "page",
  display_name: "Page",
  is_root: true,
  is_nestable: false,
  icon: "block-doc",
  color: "#1b243f",
  preview_field: "title",
  schema: {
    tab_content: tab(["title","description","featured_image","body"]),
    title: text({
      display_name: "Title",
      required: true,
      translatable: true,
      max_length: 120,
      description: "The page title, used in <h1> and meta title.",
    }),
    description: textarea({
      display_name: "Description",
      translatable: true,
      max_length: 320,
      description: "Page meta description for SEO.",
    }),
    featured_image: asset({
      display_name: "Featured Image",
      filetypes: ["images"],
      description: "Hero/OG image for this page.",
    }),
    body: bloks({
      display_name: "Body",
      restrict_components: true,
      restrict_type: "components",
      component_whitelist: ["hero","feature_card"],
      minimum: 1,
    }),
    tab_settings: tab(["layout","seo_no_index"]),
    layout: option({
      display_name: "Layout",
      options: [{"name":"Default","value":"default"},{"name":"Full Width","value":"full-width"},{"name":"Sidebar","value":"sidebar"}],
      default_value: "default",
      description: "Choose the page layout variant.",
    }),
    seo_no_index: option({
      display_name: "Hide from search engines",
      source: "",
      options: [{"name":"No","value":"false"},{"name":"Yes","value":"true"}],
      default_value: "false",
      exclude_empty_option: true,
    }),
  },
});
