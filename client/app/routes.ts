import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/", "home/home.tsx"),
  route("/create", "create/create.tsx")
] satisfies RouteConfig;
