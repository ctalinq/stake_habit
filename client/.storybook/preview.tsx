import type { Decorator, Preview } from "@storybook/react-vite";
import { INITIAL_VIEWPORTS } from "storybook/viewport";
import { sb } from "storybook/test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { ThemeProvider } from "../app/hooks/useTheme";
import "~/i18n";
import "~/app.css";
import mockEnv from "../app/layouts/mockEnv";

import { Buffer } from "buffer";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { Suspense } from "react";
window.Buffer = Buffer;

mockEnv();
sb.mock(import("../app/hooks/useWallet.ts"));
sb.mock(import("../app/hooks/useCommitments.ts"));
sb.mock(import("../app/hooks/useCommitmentVisitors.ts"));
sb.mock(import("../app/hooks/useCommitmentContract.ts"));
sb.mock(import("../app/hooks/useCommitmentUserData.ts"));
sb.mock(import("../app/hooks/useTonSender.tsx"));

const queryClient = new QueryClient();

export const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme;

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  document.body.classList.add("gradient-bg");
  return <Story />;
};

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
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        showName: true,
      },
    },
  },
  decorators: [
    withTheme,
    (Story) => (
      <Suspense>
        <MemoryRouter initialEntries={["/"]}>
          <QueryClientProvider client={queryClient}>
            <TonConnectUIProvider
              manifestUrl={"https://example.com/manifest.json"}
            >
              <ThemeProvider>
                <Story />
              </ThemeProvider>
            </TonConnectUIProvider>
          </QueryClientProvider>
        </MemoryRouter>
      </Suspense>
    ),
  ],
};

export default preview;
