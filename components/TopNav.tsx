import React from "react";
import { Sun, Moon, MessageCircle, PanelLeft, X } from "lucide-react";

interface TopNavProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  setChatOpen: (val: boolean) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (val: boolean | ((prevState: boolean) => boolean)) => void;
  isDesktopSidebarOpen: boolean;
  setIsDesktopSidebarOpen: (val: boolean) => void;
}

const TopNav: React.FC<TopNavProps> = ({
  darkMode,
  setDarkMode,
  isLoggedIn,
  setIsLoggedIn,
  setChatOpen,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  isDesktopSidebarOpen,
  setIsDesktopSidebarOpen,
}) => (
  <div className="flex items-center p-4">
    <button
      onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
      className="hidden lg:block text-slate-700 dark:text-white p-2 -ml-2 mr-2 rounded-md hover:bg-slate-200 dark:hover:bg-zinc-700"
      aria-label="Toggle sidebar"
    >
      <PanelLeft size={24} />
    </button>
    <button
      onClick={() => setIsMobileSidebarOpen(prev => !prev)}
      className="lg:hidden text-slate-700 dark:text-white p-2 -ml-2 mr-2 rounded-md hover:bg-slate-200 dark:hover:bg-zinc-700"
      aria-label="Toggle sidebar"
    >
       {isMobileSidebarOpen ? <X size={24} /> : <PanelLeft size={24} />}
    </button>
    <div className="flex items-center">
      <img
        src="https://juandata.github.io/publicAssets/images/jpg/casino_and_sports_app/6666logo.jpg"
        alt="6666Block Logo"
        className="h-8"
      />
    </div>

    <div className="flex items-center gap-x-2 sm:gap-x-4 ml-auto">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-[#1B1B1B] dark:hover:bg-zinc-700 dark:text-white p-2 rounded-md transition-colors flex items-center justify-center"
        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      {isLoggedIn ? (
        <div className="flex items-center gap-2">
          <span className="bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-white px-3 py-1 text-sm rounded-md">
            Connected
          </span>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-[#1B1B1B] dark:hover:bg-zinc-700 dark:text-white px-4 py-1.5 text-sm rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLoggedIn(true)}
            className="px-3 py-1 text-sm md:px-4 md:py-1.5 md:text-base rounded-md transition-colors text-slate-700 hover:bg-slate-200 dark:text-white dark:hover:bg-zinc-800"
          >
            Login
          </button>
          <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1 text-sm md:px-4 md:py-1.5 md:text-base rounded-md transition-colors">
            Sign Up
          </button>
        </div>
      )}
      <button
        onClick={() => setChatOpen(true)}
        className="bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-[#1B1B1B] dark:hover:bg-zinc-700 dark:text-white p-2 rounded-md transition-colors flex items-center justify-center"
        title="Open Chat"
        aria-label="Open chat"
      >
        <MessageCircle size={18} />
      </button>
    </div>
  </div>
);

export default TopNav;