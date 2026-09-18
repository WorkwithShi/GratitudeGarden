import React, { useState } from "react";
import SakuraBg from "./components/SakuraBg";
import GratitudeGarden from "./components/GratitudeGarden";
import { loadTheme, saveTheme } from "./utils/storage";

const THEMES = ["dawn", "sunset", "night"];

export default function App() {
  const [theme, setTheme] = useState(() => loadTheme());

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const currentIndex = THEMES.indexOf(prev);
      const nextTheme = THEMES[(currentIndex + 1) % THEMES.length];
      saveTheme(nextTheme);
      return nextTheme;
    });
  };

  const themeGradients = {
    dawn: "from-[#D8EEFB] via-[#FDF6F9] to-[#FFF1F6]",
    sunset: "from-[#FED7AA] via-[#FEE2E2] to-[#FCE7F3]",
    night: "from-[#090D16] via-[#1E1B4B] to-[#2E1065]",
  };

  return (
    <div
      className={`relative h-screen h-[100dvh] w-full overflow-hidden bg-gradient-to-b ${
        themeGradients[theme] || themeGradients.dawn
      } transition-colors duration-700 font-sans`}
    >
      {/* Falling sakura petals & night stars */}
      <SakuraBg theme={theme} />

      {/* Gratitude garden interface */}
      <GratitudeGarden theme={theme} onToggleTheme={handleToggleTheme} />
    </div>
  );
}
