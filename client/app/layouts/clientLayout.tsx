import "~/i18n";
import { init } from "@telegram-apps/sdk-react";

// It is important, to mock the environment only for development purposes. When building the
// application, import.meta.env.DEV will become false, and the code inside will be tree-shaken,
// so you will not see it in your final bundle.
if (import.meta.env.DEV) {
  await import("./mockEnv");

  import("eruda").then((eruda) => {
    eruda.default.init();
  });
}

init();
