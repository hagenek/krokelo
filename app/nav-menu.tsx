// NavMenu.tsx
import { useState } from "react";
import { Link } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";

const NavMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "forside", path: "/" },
    { name: "1v1", path: "/duel" },
    { name: "2v2", path: "/team" },
    { name: "stats 2v2", path: "/team-stats" },
    { name: "stats 1v1", path: "/duel-stats" },
    { name: "profilside", path: "/profile/0" },
    { name: "lagside", path: "/team-profile/0" },
  ];

  const menuVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  };

  return (
    <nav className="mb-4 flex justify-end mr-4 relative">
      <div className="hidden md:flex w-full justify-between items-center">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="dark:text-white hover:underline text-2xl"
          >
            {item.name.toLocaleUpperCase()}
          </Link>
        ))}
      </div>

      <button
        className="text-2xl flex justify-start dark:text-white md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12"
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
              style={{ zIndex: "41" }}
              className="absolute dark:text-white text-black top-0 right-0 m-8"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
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
              className="flex flex-col items-center justify-center fixed inset-0 bg-white dark:bg-gray-800 text-2xl z-40"
            >
              {menuItems.map((item) => (
                <motion.li
                  key={item.name}
                  className="mb-4"
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.path}
                    className="dark:text-white hover:underline"
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
