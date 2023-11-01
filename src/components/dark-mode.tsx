import { createContext, useContext, useState, useEffect } from "react";

type DarkModeContextType = {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
};

const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
);

interface DarkModeProviderProps {
  children: React.ReactNode;
}

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({
  children,
}) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = (): DarkModeContextType => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};

const DarkModeToggle: React.FC = () => {
  const { darkMode, setDarkMode } = useDarkMode();

  return (
    <div
      onClick={() => setDarkMode(!darkMode)}
      className="w-20 h-7 p-1 rounded-full bg-gray-200 dark:bg-gray-800 cursor-pointer transition-all duration-300 relative overflow-hidden"
    >
      <div
        className={`absolute top-1 left-1 h-5 w-10 rounded-full bg-gray-800 dark:bg-gray-200 transform transition-transform duration-300 ${
          darkMode ? "translate-x-8" : ""
        }`}
      ></div>
    </div>
  );
};

export default DarkModeToggle;
