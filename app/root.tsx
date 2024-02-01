import { HtmlLinkDescriptor, type LinksFunction } from '@remix-run/node';
import stylesheet from '~/tailwind.css';
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from '@remix-run/react';
import Layout from './layout';

/**
 * links
 * @returns {HtmlLinkDescriptor []}
 */
export const links: LinksFunction = (): HtmlLinkDescriptor[] => {
  return [
    { rel: 'stylesheet', href: stylesheet },
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/img/favicon.ico',
    },
  ];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-white dark:bg-gray-900">
        <Layout />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html lang="nb">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="flex h-screen w-full items-center justify-center bg-gray-800 md:w-auto">
        <div className="rounded-lg p-6 text-center text-white shadow-lg">
          <h1 className="mb-4 text-2xl font-bold">Noe gikk galt</h1>
          <p className="mb-4">
            Beklager, det oppstod en feil. Vi jobber med å løse det.
          </p>
          <Link
            to="/"
            className="mb-4 text-xl font-bold text-blue-300 hover:text-blue-500"
          >
            Tilbake til hovedsiden
          </Link>
          <img
            src="/img/404.png"
            alt="Feilbilde"
            className="m-4 mx-auto w-1/2 rounded"
          />
        </div>
        <Scripts />
      </body>
    </html>
  );
}
