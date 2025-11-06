import React from "react";
import { X, ChevronRight, Settings } from "lucide-react";
import { ChatMessage } from "../lib/data/chatMessages";
import { getFlagUrl } from '../lib/utils/flags';
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatPanelProps {
  chatMessages: ChatMessage[];
  newMessage: string;
  setNewMessage: (msg: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  isLanguageDropdownOpen: boolean;
  setIsLanguageDropdownOpen: (open: boolean) => void;
}

const availableLanguages = [
  "English",
  "Español",
  "Français",
  "Deutsch",
  "中文",
  "日本語",
];

const ChatPanel: React.FC<ChatPanelProps> = ({
  chatMessages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  chatOpen,
  setChatOpen,
  selectedLanguage,
  setSelectedLanguage,
  isLanguageDropdownOpen,
  setIsLanguageDropdownOpen,
}) => (
  <div className="relative h-full">
    <button
      className="absolute top-2 right-2 z-10 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800"
      onClick={() => setChatOpen(false)}
      aria-label="Close chat"
    >
      <X size={20} />
    </button>
    <div className="flex flex-col w-full h-full lg:h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="p-2">
        <div className="flex items-center justify-between">
          <div className="relative">
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center bg-slate-200 dark:bg-zinc-800 p-1 rounded text-xs text-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-zinc-700 transition-colors"
            >
              <img
                src={getFlagUrl(selectedLanguage)}
                alt={`${selectedLanguage} flag`}
                className="w-5 h-auto mr-2"
              />
              <span>{selectedLanguage}</span>
              <ChevronRight
                className={`w-3 h-3 text-zinc-400 ml-2 transform transition-transform duration-200 ${isLanguageDropdownOpen ? "rotate-90" : "-rotate-90"
                  }`}
              />
            </button>
            {isLanguageDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 min-w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded shadow-lg z-10 py-1">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setIsLanguageDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-1.5 text-left text-xs text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <img
                      src={getFlagUrl(lang)}
                      alt={`${lang} flag`}
                      className="w-5 h-auto mr-2"
                    />
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto main-content-scrollable p-4 scrollbar-thin">
          <div className="flex flex-col gap-4">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="flex flex-col w-full">
                <div className="flex items-center mb-1">
                  <span className="text-yellow-500 font-medium mr-2 text-xs">
                    {msg.username}:
                  </span>
                  <span className="text-xs text-slate-800 dark:text-white break-words w-full">
                    {msg.message}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
          <form
            onSubmit={handleSendMessage}
            className="flex flex-col gap-2"
          >
            <div className="flex bg-slate-100 dark:bg-zinc-800 rounded-md overflow-hidden border border-slate-300 dark:border-transparent">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-transparent border-0 px-3 py-2 outline-none text-xs text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-zinc-400"
                placeholder="Write to message"
              />
              <button
                type="button"
                className="bg-transparent border-0 px-2 text-slate-500 dark:text-zinc-400"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 dark:text-zinc-500">
                Rules
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-zinc-500">
                  200
                </span>
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1 rounded-md text-xs"
                >
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);

export default ChatPanel;