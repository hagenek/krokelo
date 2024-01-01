import { HtmlLinkDescriptor, type LinksFunction } from "@remix-run/node";
import stylesheet from "~/tailwind.css";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import Layout from "./layout";

/**
 * links
 * @returns {HtmlLinkDescriptor []}
 */
export const links: LinksFunction = (): HtmlLinkDescriptor[] => {
  return [{ rel: "stylesheet", href: stylesheet }];
};

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-800 w-full md:w-auto flex items-center justify-center h-screen">
        <div className="p-6 rounded-lg shadow-lg text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Noe gikk galt</h1>
          <p className="mb-4">
            Beklager, det oppstod en feil. Vi jobber med å løse det.
          </p>
          <Link
            to="/"
            className="text-blue-300 text-xl mb-4 font-bold hover:text-blue-500"
          >
            Tilbake til hovedsiden
          </Link>
          <img
            src="/img/404.png"
            alt="Feilbilde"
            className="mx-auto m-4 rounded w-1/2"
          />
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="dark:bg-gray-900">
        <Layout />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
