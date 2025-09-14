import type { Preview } from "@storybook/react-vite";
import { INITIAL_VIEWPORTS } from "storybook/viewport";
import { sb } from "storybook/test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "~/i18n";
import "~/app.css";

import { Buffer } from "buffer";
window.Buffer = Buffer;

sb.mock(import("../app/hooks/useCommitmentContract.ts"));
sb.mock(import("../app/hooks/useTonSender.tsx"));

const queryClient = new QueryClient();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      options: INITIAL_VIEWPORTS,
    },
  },
  initialGlobals: {
    viewport: { value: "iphone14", isRotated: false },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
};

export default preview;
