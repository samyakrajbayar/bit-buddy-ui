import { createContext, useContext, useState, ReactNode } from "react";

export type Theme = "3ds" | "gameboy" | "nes" | "sega";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

const themeColors: Record<Theme, Record<string, string>> = {
  "3ds": {
    "--background": "220 30% 12%",
    "--foreground": "180 100% 90%",
    "--card": "220 25% 18%",
    "--card-foreground": "180 100% 90%",
    "--primary": "180 100% 50%",
    "--primary-foreground": "220 30% 12%",
    "--secondary": "320 100% 50%",
    "--secondary-foreground": "220 30% 12%",
    "--accent": "60 100% 50%",
    "--border": "180 100% 50%",
    "--muted": "220 20% 25%",
    "--input": "220 25% 18%",
  },
  "gameboy": {
    "--background": "60 9% 13%",
    "--foreground": "72 100% 80%",
    "--card": "60 12% 20%",
    "--card-foreground": "72 100% 80%",
    "--primary": "72 94% 45%",
    "--primary-foreground": "60 9% 13%",
    "--secondary": "72 60% 35%",
    "--secondary-foreground": "72 100% 80%",
    "--accent": "72 94% 55%",
    "--border": "72 94% 45%",
    "--muted": "60 15% 25%",
    "--input": "60 12% 20%",
  },
  "nes": {
    "--background": "0 0% 15%",
    "--foreground": "0 0% 95%",
    "--card": "0 0% 22%",
    "--card-foreground": "0 0% 95%",
    "--primary": "0 85% 58%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "0 0% 85%",
    "--secondary-foreground": "0 0% 15%",
    "--accent": "210 100% 50%",
    "--border": "0 85% 58%",
    "--muted": "0 0% 28%",
    "--input": "0 0% 22%",
  },
  "sega": {
    "--background": "210 100% 8%",
    "--foreground": "210 100% 95%",
    "--card": "210 80% 15%",
    "--card-foreground": "210 100% 95%",
    "--primary": "210 100% 50%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "40 100% 50%",
    "--secondary-foreground": "210 100% 8%",
    "--accent": "280 100% 60%",
    "--border": "210 100% 50%",
    "--muted": "210 60% 20%",
    "--input": "210 80% 15%",
  },
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("3ds");

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    const colors = themeColors[newTheme];
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
