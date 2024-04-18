import { createCookie } from '@remix-run/node';

import { Theme, isTheme } from './theme-provider';

const cookieSecret = process.env.COOKIE_SECRET;
if (!cookieSecret) {
  throw new Error('COOKIE_SECRET must be set in your environment variables');
}

const themeCookie = createCookie('krokelo_theme', {
  path: '/',
  sameSite: 'lax',
  httpOnly: true,
  secrets: [cookieSecret],
  secure: true,
  maxAge: 60 * 60 * 24 * 400, // 400 days expiration (which is max: https://chromestatus.com/feature/4887741241229312)
});

async function getCookieThemeHandler(request: Request) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await themeCookie.parse(cookieHeader)) || {};

  return {
    getTheme: async () => {
      return isTheme(cookie.theme) ? cookie.theme : null;
    },
    setTheme: async (theme: Theme) => {
      cookie.theme = theme;
      return await themeCookie.serialize(cookie);
    },
  };
}

export { getCookieThemeHandler };
