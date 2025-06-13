import React from "react";
import SakuraBg from "./components/SakuraBg";
import GratitudeGarden from "./components/GratitudeGarden";

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#CDEFFD] via-[#FDF6F9] to-[#FFF1F7]">

      {/* Falling sakura petals */}
      <SakuraBg />

      {/* Gratitude garden panel (handles flowers too) */}
      <GratitudeGarden />
      

    </div>
  );
}
