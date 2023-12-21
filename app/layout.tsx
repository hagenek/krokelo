// routes/index.tsx
import { useLoaderData, Link, Outlet } from "@remix-run/react";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavMenu from "./nav-menu";

export default function Index() {
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check if dark mode is set in localStorage
    let isDarkMode = false;
    if (localStorage) {
      isDarkMode = localStorage.getItem("theme") === "dark";
    }
    setDarkMode(isDarkMode);

    // Apply the appropriate class to the document
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    // Toggle dark mode state
    const newMode = !darkMode;
    setDarkMode(newMode);

    // Update localStorage and document class
    localStorage.setItem("theme", newMode ? "dark" : "light");
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="flex justify-center items-center text-center">
      <div
        className={`dark:text-white md:w-1/2 h-screen${darkMode ? "dark" : ""}`}
      >
        {/* Header with logo */}
        <header className="flex-col mb-4 md:mt-8 md:p-4">
          <div className="flex justify-center md:justify-start mb-4 ">
            <span className="mr-2">Light</span>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none ${
                darkMode ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`transform transition ease-in-out duration-200 ${
                  darkMode ? "translate-x-6" : "translate-x-1"
                } inline-block w-4 h-4 transform bg-white rounded-full`}
              />
            </button>
            <span className="ml-2">Dark</span>
          </div>
          <NavMenu />
          <div className="flex justify-center">
            <img
              src="img/krokelo-logo.png" // Update path to your logo image
              alt="Krokinole logo"
              className="h-16 mr-6 rounded w-auto"
            />
            <div className="self-center text-3xl font-semibold whitespace-nowrap dark:text-white">
              SB1U Krokinole
            </div>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
