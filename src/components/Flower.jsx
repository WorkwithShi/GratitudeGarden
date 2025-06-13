import { useState, useEffect } from "react";

const flowerCount = 8;

export default function Flower({ message }) {
  const [showBubble, setShowBubble] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [randomImg, setRandomImg] = useState("");

  useEffect(() => {
    const n = Math.floor(Math.random() * flowerCount) + 1;
    import(`../assets/f${n}.png`).then((img) => {
      setRandomImg(img.default);
    });
  }, []);

  const handleClick = () => {
    setClicked(true);
    setShowBubble(!showBubble);
    setTimeout(() => setClicked(false), 300);
  };

  useEffect(() => {
    if (showBubble) {
      const timer = setTimeout(() => setShowBubble(false), 3000); // Hide after 3s
      return () => clearTimeout(timer); // Clear on unmount/update
    }
  }, [showBubble]);
  
  return (
    <div className="relative flex flex-col items-center">
      {showBubble && (
  <div className="absolute -top-28 z-20 animate-bubbleFade pointer-events-none">
    <div className="relative px-5 py-3 max-w-[240px] text-center text-sm font-medium text-[#77475e] rounded-3xl bg-gradient-to-br from-[#fff0f5]/80 via-[#ffe4ec]/70 to-[#fffafd]/70 backdrop-blur-md shadow-lg border border-white/50">
      <span className="inline-block">{message}</span>
    </div>
  </div>
)}




      {randomImg && (
        <img
          src={randomImg}
          alt="flower"
          onClick={handleClick}
          className={`w-20 h-35 cursor-pointer transition-transform duration-300 hover:scale-110 ${
            clicked ? "flower-boop" : "flower-animated"
          }`}
          
        />
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes floating {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }

        @keyframes boop {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .animate-floating {
          animation: floating 3s ease-in-out infinite;
        }

        .animate-boop {
          animation: boop 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
