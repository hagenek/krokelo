// routes/index.tsx
import { useLoaderData, Link } from "@remix-run/react";
import { useState, useEffect } from 'react';

export function DarkModeToggle() {
    const [darkMode, setDarkMode] = useState(false);


    useEffect(() => {
        // Check if dark mode is set in localStorage
        let isDarkMode = false
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

        <div className="flex items-center justify-center mb-4">
            <span className="mr-2">Light</span>
            <button
                onClick={toggleDarkMode}
                className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none ${darkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
                <span
                    className={`transform transition ease-in-out duration-200 ${darkMode ? 'translate-x-6' : 'translate-x-1'
                        } inline-block w-4 h-4 transform bg-white rounded-full`}
                />
            </button>
            <span className="ml-2">Dark</span>
        </div>

    )
}

export default function Index() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Check if dark mode is set in localStorage
        let isDarkMode = false
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
        <div className={`container mx-auto p-4 max-w-2xl ${darkMode ? 'dark' : ''}`}>
            {/* Header with logo */}
            <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 mb-4">
                <div className="flex items-center">
                    <img
                        src="path_to.png" // Update path to your logo image
                        alt="Krokinole logo"
                        className="mr-3 h-6 sm:h-9"
                    />
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">SB1U Krokinole</span>
                </div>
                <nav>
                    <ul className="flex space-x-4">
                        <li><Link to="/individual" className="dark:text-white hover:underline">1v1</Link></li>
                        <li><Link to="/team" className="dark:text-white hover:underline">2v2</Link></li>
                        <li><Link to="/" className="dark:text-white hover:underline">Home</Link></li>
                    </ul>
                </nav>
            </header>

            <div className="flex items-center justify-center mb-4">
                <span className="mr-2">Light</span>
                <button
                    onClick={toggleDarkMode}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none ${darkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                    <span
                        className={`transform transition ease-in-out duration-200 ${darkMode ? 'translate-x-6' : 'translate-x-1'
                            } inline-block w-4 h-4 transform bg-white rounded-full`}
                    />
                </button>
                <span className="ml-2">Dark</span>
            </div>
        </div>
    );
}
