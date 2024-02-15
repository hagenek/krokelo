// NavMenu.tsx
import { useState } from 'react';
import { Link } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';

const NavMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'forside', path: '/' },
    { name: '1v1', path: '/duel' },
    { name: '2v2', path: '/team' },
    { name: 'stats 1v1', path: '/duel-stats' },
    { name: 'stats 2v2', path: '/team-stats' },
    { name: 'profilside', path: '/profile/0' },
    { name: 'lagside', path: '/team-profile/0' },
  ];

  const menuVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: '-100%' },
  };

  return (
    <nav className="relative mb-4 mr-4 flex justify-end">
      <div className="hidden w-full items-center justify-between xl:flex">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="text-2xl hover:underline dark:text-white"
          >
            {item.name.toLocaleUpperCase()}
          </Link>
        ))}
      </div>

      <button
        className="flex justify-start text-2xl xl:hidden dark:text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-12 w-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <button
              onClick={() => setIsMenuOpen(false)}
              style={{ zIndex: '41' }}
              className="absolute right-0 top-0 m-8 text-black dark:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-12 w-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <motion.ul
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-white text-2xl dark:bg-gray-800"
            >
              {menuItems.map((item) => (
                <motion.li
                  key={item.name}
                  className="mb-4"
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.path}
                    className="hover:underline dark:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavMenu;
