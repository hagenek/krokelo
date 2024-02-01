// routes/index.tsx
import { Outlet } from '@remix-run/react';
import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import NavMenu from './nav-menu';

export default function Index() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is set in localStorage
    let isDarkMode = false;
    if (localStorage) {
      isDarkMode = localStorage.getItem('theme') === 'dark';
    }
    setDarkMode(isDarkMode);

    // Apply the appropriate class to the document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    // Toggle dark mode state
    const newMode = !darkMode;
    setDarkMode(newMode);

    // Update localStorage and document class
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="flex w-full items-center justify-center  text-center md:w-auto">
      <div
        className={`w-full md:w-2/3 xl:w-1/2 dark:text-white h-screen${
          darkMode ? 'dark' : ''
        }`}
      >
        {/* Header with logo */}
        <header className="mb-4 flex-col md:mt-8 md:p-4">
          <div className="mb-4 flex justify-center md:justify-start ">
            <span className="mr-2">Lys</span>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none ${
                darkMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`transform transition duration-200 ease-in-out ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white`}
              />
            </button>
            <span className="ml-2">Mørk</span>
          </div>
          <NavMenu />
          <div className="flex justify-center">
            <img
              src="/img/krokelo-logo.png" // Update path to your logo image
              alt="Krokinole logo"
              className="mr-6 h-16 w-auto rounded"
            />
            <div className="self-center whitespace-nowrap text-3xl font-semibold dark:text-white">
              SB1U Krokinole
            </div>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
