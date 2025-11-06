import { useTheme, Theme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

const themes: { id: Theme; label: string; icon: string }[] = [
  { id: "3ds", label: "3DS", icon: "◆" },
  { id: "gameboy", label: "GB", icon: "●" },
  { id: "nes", label: "NES", icon: "■" },
  { id: "sega", label: "SEGA", icon: "★" },
];

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2 flex-wrap">
      {themes.map((t) => (
        <Button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={`pixel-border text-[10px] px-3 py-2 ${
            theme === t.id
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {t.icon} {t.label}
        </Button>
      ))}
    </div>
  );
};
