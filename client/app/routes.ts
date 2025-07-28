import { type RouteConfig, route, layout } from "@react-router/dev/routes";

export default [
  layout("layouts/clientLayout.tsx", [
    layout("layouts/initialRedirectLayout.tsx", [
      layout("layouts/navbarLayout.tsx", [
        route("/", "home/home.tsx"),
        route("/create", "create/create.tsx"),
        route("/commitments/:commitmentAddress", "commitments/commitments.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
