import { json, redirect } from '@remix-run/node';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';

import { getCookieThemeHandler } from '~/utils/theme.server';
import { isTheme } from '~/utils/theme-provider';

export const action: ActionFunction = async ({ request }) => {
  const cookieThemeHandler = await getCookieThemeHandler(request);
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);
  const theme = form.get('theme');

  if (!isTheme(theme)) {
    return json({
      success: false,
      message: `theme value of ${theme} is not a valid theme`,
    });
  }

  return json(
    { success: true },
    { headers: { 'Set-Cookie': await cookieThemeHandler.setTheme(theme) } }
  );
};

export const loader: LoaderFunction = () => redirect('/', { status: 404 });
