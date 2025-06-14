import { init } from "@telegram-apps/sdk-react"

if (import.meta.env.DEV) {
  import("eruda").then((eruda) => {
    eruda.default.init();
  });
}

init()