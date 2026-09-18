import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FLOWER_IMAGES, FLOWER_NAMES } from "../utils/flowers";
import { playSparkleSound } from "../utils/audio";
import { Sparkles, Pencil, Trash2, X, Flower2 } from "./LucideIcons";

export default function Flower({
  gratitude,
  onDelete,
  onUpdate,
  isNew = false,
}) {
  const { id, text, flower = 1, createdAt } = gratitude;
  const flowerImg = FLOWER_IMAGES[flower] || FLOWER_IMAGES[1];

  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [isBooping, setIsBooping] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);

  const cardRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const formattedDate = () => {
    if (!createdAt) return "Planted in your garden";
    try {
      const date = new Date(createdAt);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Planted in your garden";
    }
  };

  const handleNourish = () => {
    setIsBooping(true);
    playSparkleSound();

    const newSparkles = Array.from({ length: 6 }).map((_, i) => {
      const angle = (i / 6) * Math.PI * 2;
      const dist = 35 + Math.random() * 25;
      return {
        id: Date.now() + i,
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist - 20,
        tr: Math.random() * 180,
      };
    });

    setSparkles(newSparkles);

    setTimeout(() => {
      setIsBooping(false);
    }, 450);

    setTimeout(() => {
      setSparkles([]);
    }, 1000);
  };

  const handleSaveEdit = () => {
    const trimmed = editText.trim();
    if (trimmed && onUpdate) {
      onUpdate(id, trimmed);
    }
    setIsEditing(false);
  };

  return (
    <div className="relative flex flex-col items-center group select-none">
      {/* Sparkle burst particles */}
      {sparkles.map((sp) => (
        <span
          key={sp.id}
          className="sparkle-burst-particle text-amber-300 pointer-events-none"
          style={{
            "--tx": `${sp.tx}px`,
            "--ty": `${sp.ty}px`,
            "--tr": `${sp.tr}deg`,
            top: "25%",
            left: "50%",
          }}
        >
          <Sparkles size={16} />
        </span>
      ))}

      {/* Flower plant element */}
      <button
        onClick={() => {
          setIsOpen(true);
          setShowTooltip(false);
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={`Flower: ${text}`}
        className="relative focus:outline-none transition-transform duration-200"
      >
        {/* Centered Speech Bubble Message Box directly over flower head */}
        {showTooltip && !isOpen && (
          <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-fadeIn flex flex-col items-center">
            <div className="max-w-[200px] sm:max-w-[240px] px-3 py-1.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-pink-200/90 text-xs font-medium text-stone-800 text-center whitespace-normal break-words leading-snug">
              “{text}”
            </div>
            {/* Centered speech-bubble caret pointing down to flower head */}
            <div className="w-2.5 h-2.5 bg-white border-r border-b border-pink-200/90 rotate-45 -mt-1.5 shadow-xs" />
          </div>
        )}

        <img
          src={flowerImg}
          alt="A blooming sakura flower"
          className={`w-16 h-28 sm:w-20 sm:h-36 object-contain cursor-pointer transition-all duration-300 drop-shadow-sm hover:scale-105 active:scale-95 ${
            isNew ? "flower-sprout" : isBooping ? "flower-boop" : "flower-animated"
          }`}
        />
        {/* Soft ground soil shadow */}
        <div className="w-10 h-2 -mt-1 mx-auto bg-[#4a2e1b]/15 rounded-full blur-[2px] pointer-events-none" />
      </button>

      {/* Detail Modal Dialog rendered via Portal to escape parent CSS transforms */}
      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-sm animate-fadeIn"
            onClick={() => {
              setIsOpen(false);
              setIsEditing(false);
            }}
          >
            <div
              ref={cardRef}
              className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl border border-pink-100 shadow-2xl p-6 text-[#77475e] relative animate-fadeIn mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Bar with Close Button */}
              <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-pink-100/70">
                <div className="flex items-center gap-2.5">
                  <Flower2 size={18} className="text-pink-400 shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold tracking-wide text-[#7d485e]">
                      {FLOWER_NAMES[flower] || "Sakura Blossom"}
                    </h3>
                    <p className="text-[11px] text-[#b38294]">{formattedDate()}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsEditing(false);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-50 text-[#8a576d] hover:bg-pink-100 transition text-sm touch-manipulation shrink-0"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Gratitude Message */}
              <div className="py-2">
                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      autoFocus
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      maxLength={200}
                      rows={3}
                      className="w-full p-3.5 text-base sm:text-sm rounded-2xl bg-white border border-pink-200 text-stone-800 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none font-sans"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditText(text);
                          setIsEditing(false);
                        }}
                        className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#9b7080] hover:bg-pink-100/60 transition touch-manipulation"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        disabled={!editText.trim()}
                        className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-sm hover:opacity-95 transition disabled:opacity-40 touch-manipulation"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="my-2 p-5 rounded-2xl bg-gradient-to-b from-pink-50/50 to-white/90 border border-pink-100/80 text-center shadow-xs">
                    <p className="font-sans text-base sm:text-lg font-medium text-stone-800 leading-relaxed break-words select-text">
                      “{text}”
                    </p>
                  </div>
                )}
              </div>

              {/* Clean Horizontal Action Bar */}
              {!isEditing && (
                <div className="flex items-center justify-between gap-3 pt-3.5 mt-2 border-t border-pink-100/70">
                  <button
                    onClick={handleNourish}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100/70 hover:bg-pink-200/80 text-xs font-semibold text-[#8f4762] transition-all hover:scale-105 active:scale-95 touch-manipulation"
                  >
                    <Sparkles size={14} className="text-amber-500 shrink-0" />
                    <span>Nourish</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditText(text);
                        setIsEditing(true);
                      }}
                      className="flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium text-[#8a576d] hover:bg-pink-50 transition touch-manipulation"
                      title="Edit gratitude text"
                    >
                      <Pencil size={12} className="shrink-0" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onDelete();
                      }}
                      className="flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium text-rose-500 hover:bg-rose-50 transition touch-manipulation"
                      title="Remove blossom"
                    >
                      <Trash2 size={12} className="shrink-0" />
                      <span>Uproot</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}