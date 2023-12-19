// routes/index.tsx
import { useLoaderData, Link, Outlet } from "@remix-run/react";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Index() {
  const [darkMode, setDarkMode] = useState(false);

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
        className={`dark:text-white md:w-3/4 h-screen${darkMode ? "dark" : ""}`}
      >
        {/* Header with logo */}
        <header className="flex-col justify-between items-center md:p-4 border-b border-gray-200 dark:border-gray-700 mb-4">
          <div className="flex items-center justify-center mb-4">
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
          <nav className="mb-4">
            <ul
              className="flex text-2xl"
              style={{
                justifyContent: "space-between",
                marginLeft: "12px",
                marginRight: "12px",
              }}
            >
              <li>
                <Link to="/" className="dark:text-white hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/individual"
                  className="dark:text-white hover:underline"
                >
                  1v1
                </Link>
              </li>
              <li>
                <Link to="/team" className="dark:text-white hover:underline">
                  2v2
                </Link>
              </li>
            </ul>
          </nav>
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
