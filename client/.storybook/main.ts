import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../app/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
  addons: [],
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        viteConfigPath: "vite.storybook.config.ts",
      },
    },
  },
};

export default config;
