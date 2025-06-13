import { useState, useRef, useEffect } from "react";
import Flower from "./Flower";

export default function GratitudeGarden() {
  const [gratitudes, setGratitudes] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const addGratitude = () => {
    if (!input.trim()) return;
    const newGratitude = { text: input, id: Date.now() };
    setGratitudes([newGratitude, ...gratitudes]);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") addGratitude();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-16 z-10">
      {/*Input Box*/}
      <div className="relative mt-auto and mb-44">

        <div className="w-full max-w-md mb-20 bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-xl border border-white/30 flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="I'm grateful for..."
            className="flex-1 rounded-full px-5 py-3 bg-white text-pink-700 placeholder-pink-300 shadow-inner focus:outline-none"
          />
          <button
            onClick={addGratitude}
            disabled={!input.trim()}
            className={`px-5 py-3 rounded-full text-white bg-pink-400 hover:bg-pink-500 transition ${
              !input.trim() ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            }`}
          >
            +
          </button>
        </div>

      </div>
      {/* Flower Row */}
      <div className="w-full flex flex-wrap justify-center gap-4 relative z-10" style={{ transform: 'translateY(20px)' }}>
        {gratitudes.map((g) => (
          <Flower key={g.id} message={g.text} />
        ))}
      </div>

      {/* Sakura Petal Heap */}
      <div id="sakura-heap" className="absolute bottom-4 w-full flex justify-center flex-wrap gap-1 z-10 pointer-events-none" />

      {/* Layered Soil */}
      <div className="absolute bottom-0 w-full h-28 z-0">
        <div className="absolute w-full h-20 bg-gradient-to-t from-[#7b5037] via-[#a97456] to-transparent rounded-t-[40%]" />
        <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-[#926547] via-[#7b5037] to-transparent rounded-t-[50%]" />
      </div>


      {/* Floating animation keyframe */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
        .floating {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
