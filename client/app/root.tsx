import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import "~/i18n"
import "./app.css";

import React, {Suspense} from "react";
import { Container, Card, GradientText } from "./components";
import HomeSkeleton from "~/home/homeSkeleton";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="gradient-bg min-h-screen">
        <Suspense fallback={<HomeSkeleton />}> {children} </Suspense>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <Container className="pt-16">
      <Card className="shadow-red-500/10 dark:shadow-red-500/10">
        <GradientText
          as="h1"
          size="2xl"
          variant="danger"
          className="mb-4 text-center"
        >
          {message}
        </GradientText>
        <p className="text-gray-700 dark:text-gray-300 text-center mb-4">
          {details}
        </p>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto bg-gray-100 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 text-sm">
            <code className="text-gray-800 dark:text-gray-200">{stack}</code>
          </pre>
        )}
      </Card>
    </Container>
  );
}
