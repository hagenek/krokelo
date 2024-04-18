// NavMenu.tsx
import { useState } from 'react';
import { NavLink } from '@remix-run/react';
import { MdMenu, MdClose, MdDarkMode, MdLightMode } from 'react-icons/md';
import { Theme, useTheme } from '~/utils/theme-provider';

const NavMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    );
  };
  const isDarkTheme = theme === Theme.DARK;

  const menuItems = [
    { name: 'Forside', path: '/' },
    { name: '1v1', path: '/duel' },
    { name: '2v2', path: '/team-duel' },
    { name: 'Stats 1v1', path: '/duel-stats' },
    { name: 'Stats 2v2', path: '/team-stats' },
    { name: 'Profilside', path: '/profile/0' },
    { name: 'Lagside', path: '/team-profile/0' },
    { name: 'Sammenlign', path: '/compare-players' },
  ];

  return (
    <nav className="fixed start-0 top-0 z-20 w-full border-b border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-900">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <NavLink
          to={'/'}
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="/img/krokelo-logo.png"
            alt="Krokinole logo"
            className="h-8"
          />
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            SB1U Krokinole
          </span>
        </NavLink>
        <div className="flex space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            aria-label={
              isDarkTheme ? 'Aktiver mørk modus' : 'Aktiver lys modus'
            }
            className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:px-2 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={() => toggleTheme()}
          >
            {isDarkTheme ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-label={
              isMenuOpen ? 'Lukk navigasjonsmeny' : 'Åpne navigasjonsmeny'
            }
            aria-controls="navbar-sticky"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <MdClose size={30} /> : <MdMenu size={30} />}
          </button>
        </div>
        <div
          className={`${!isMenuOpen ? 'hidden' : ''} w-full items-center justify-between md:order-1 md:flex md:w-auto`}
          id="navbar-sticky"
        >
          <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 md:dark:bg-gray-900">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `${isActive ? 'font-bold underline' : ''} block rounded px-3 py-2 text-lg text-gray-900 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavMenu;
