import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";

const ThemeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >{darkMode ? (
        <SunIcon className="h-5 w-5" />
    ) : (
        <MoonIcon className="h-5 w-5" />
    )}</button>
  );
};

export default ThemeToggle;
