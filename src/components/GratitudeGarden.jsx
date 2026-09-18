import { useState, useRef, useEffect } from "react";
import Flower from "./Flower";
import { FLOWER_IMAGES, FLOWER_NAMES } from "../utils/flowers";
import Memopad from "../Memopad";
import {
  loadGardenName,
  saveGardenName,
  loadGratitudes,
  saveGratitudes,
  deleteGarden,
} from "../utils/storage";
import {
  isSoundEnabled,
  setSoundEnabled,
  playBloomSound,
  startAmbientMusic,
  stopAmbientMusic,
  unlockAudio,
} from "../utils/audio";
import {
  BookOpen,
  Sun,
  Sunset,
  Moon,
  Volume2,
  VolumeX,
  MoreHorizontal,
  Pencil,
  Trash2,
  Plus,
  Shuffle,
  ArrowRight,
  Sprout,
} from "./LucideIcons";

export default function GratitudeGarden({ theme = "dawn", onToggleTheme }) {
  const [gardenName, setGardenName] = useState("");
  const [gardenNameInput, setGardenNameInput] = useState("");
  const [gratitudes, setGratitudes] = useState([]);
  const [input, setInput] = useState("");
  const [selectedFlowerType, setSelectedFlowerType] = useState("random");
  const [showFlowerPicker, setShowFlowerPicker] = useState(false);
  const [lastPlantedId, setLastPlantedId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const inputRef = useRef(null);
  const gardenNameRef = useRef(null);
  const flowerPickerRef = useRef(null);

  // --------------------------------------------------
  // INITIALIZATION
  // --------------------------------------------------

  useEffect(() => {
    const savedGardenName = loadGardenName();
    const savedGratitudes = loadGratitudes();

    setGardenName(savedGardenName);
    setGardenNameInput(savedGardenName);
    setGratitudes(savedGratitudes);
    setSoundOn(isSoundEnabled());

    if (!savedGardenName) {
      setShowWelcome(true);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveGratitudes(gratitudes);
    }
  }, [gratitudes, isLoading]);

  useEffect(() => {
    if (!showFlowerPicker) return;
    const handleClickOutside = (e) => {
      if (
        flowerPickerRef.current &&
        !flowerPickerRef.current.contains(e.target)
      ) {
        setShowFlowerPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFlowerPicker]);

  // Ambient background music & audio unlock management
  useEffect(() => {
    if (!soundOn) {
      stopAmbientMusic();
      return;
    }

    // Unlocks and starts audio on first user touch/click/keypress
    const handleFirstGesture = () => {
      unlockAudio();
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };

    window.addEventListener("pointerdown", handleFirstGesture, { passive: true });
    window.addEventListener("touchstart", handleFirstGesture, { passive: true });
    window.addEventListener("click", handleFirstGesture, { passive: true });
    window.addEventListener("keydown", handleFirstGesture, { passive: true });

    // Pause when tab is inactive, resume when active
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAmbientMusic();
      } else if (isSoundEnabled()) {
        startAmbientMusic();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopAmbientMusic();
    };
  }, [soundOn]);

  // --------------------------------------------------
  // ACTIONS
  // --------------------------------------------------

  const createGarden = () => {
    const trimmedName = gardenNameInput.trim();
    if (!trimmedName) return;

    saveGardenName(trimmedName);
    setGardenName(trimmedName);
    setShowWelcome(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  };

  const renameGarden = () => {
    const trimmedName = gardenNameInput.trim();
    if (!trimmedName) return;

    saveGardenName(trimmedName);
    setGardenName(trimmedName);
    setIsRenaming(false);
    setShowMenu(false);
  };

  const removeGratitude = (id) => {
    setGratitudes((prev) => prev.filter((g) => g.id !== id));
  };

  const updateGratitude = (id, newText) => {
    setGratitudes((prev) =>
      prev.map((g) => (g.id === id ? { ...g, text: newText } : g))
    );
  };

  const handleDeleteGarden = () => {
    setShowMenu(false);
    const confirmed = window.confirm(
      "Clear this garden and all planted blossoms?"
    );
    if (!confirmed) return;

    deleteGarden();
    setGardenName("");
    setGardenNameInput("");
    setGratitudes([]);
    setInput("");
    setShowWelcome(true);
  };

  const toggleSound = () => {
    unlockAudio();
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) {
      startAmbientMusic();
    } else {
      stopAmbientMusic();
    }
  };

  const addGratitude = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const chosenFlower =
      selectedFlowerType === "random"
        ? Math.floor(Math.random() * 8) + 1
        : Number(selectedFlowerType);

    const newId = Date.now();
    const newGratitude = {
      id: newId,
      text: trimmedInput,
      flower: chosenFlower,
      createdAt: new Date().toISOString(),
    };

    setGratitudes((prev) => [...prev, newGratitude]);
    setLastPlantedId(newId);
    setInput("");
    setShowFlowerPicker(false);

    playBloomSound();

    setTimeout(() => {
      setLastPlantedId(null);
    }, 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addGratitude();
    }
  };

  useEffect(() => {
    if (showWelcome) {
      setTimeout(() => {
        gardenNameRef.current?.focus();
      }, 100);
    }
  }, [showWelcome]);

  if (isLoading) {
    return null;
  }

  // --------------------------------------------------
  // WELCOME SCREEN (Clean & featuring user's mascot)
  // --------------------------------------------------

  if (showWelcome) {
    return (
      <div className="absolute inset-0 z-20 flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center animate-fadeIn bg-white/75 backdrop-blur-xl rounded-3xl p-8 border border-white/80 shadow-xl">
          {/* User's Adorable Mascot */}
          <div className="w-24 h-24 mx-auto mb-3">
            <img
              src="/shi-mascot.png"
              alt="Shi no Sakura Mascot"
              className="w-full h-full object-contain drop-shadow-sm"
            />
          </div>

          <h1 className="text-2xl font-serif font-bold text-[#6d3e53] mb-1">
            Shi no Sakura
          </h1>
          <p className="text-xs text-[#a37085] mb-6">
            A quiet sanctuary for your daily gratitudes.
          </p>

          <div className="flex items-center gap-2">
            <input
              ref={gardenNameRef}
              type="text"
              value={gardenNameInput}
              onChange={(e) => setGardenNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") createGarden();
              }}
              placeholder="Name your garden..."
              maxLength={40}
              className="flex-1 bg-white border border-pink-200/80 rounded-full px-4 py-2.5 text-center text-base sm:text-xs font-medium text-[#77475e] placeholder-[#c59aaa] focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-sm"
            />

            <button
              onClick={createGarden}
              disabled={!gardenNameInput.trim()}
              aria-label="Enter garden"
              className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md transition-all ${
                !gardenNameInput.trim()
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:scale-105 active:scale-95"
              }`}
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Theme styling
  const isNight = theme === "night";
  const headerTextColor = isNight ? "text-pink-100" : "text-[#6d3e53]";
  const glassBtn = isNight
    ? "bg-slate-900/60 border-slate-700/60 text-pink-200 hover:bg-slate-800/80"
    : "bg-white/60 border-white/70 text-[#77475e] hover:bg-white/80";

  // --------------------------------------------------
  // MAIN GARDEN VIEW
  // --------------------------------------------------

  return (
    <div
      className="absolute inset-0 z-10 flex flex-col justify-between overflow-hidden select-none"
      onClick={(e) => {
        if (showMenu && !e.target.closest(".garden-menu")) {
          setShowMenu(false);
        }
      }}
    >
      {/* -------------------------------------------- */}
      {/* MINIMAL TOP BAR */}
      {/* -------------------------------------------- */}

      <header className="relative z-40 w-full px-3 sm:px-6 pt-safe flex items-center justify-between pointer-events-auto">
        {/* Left: Minimal Journal Icon Button */}
        <button
          onClick={() => setIsJournalOpen(true)}
          className={`relative flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8 rounded-full backdrop-blur-md border shadow-sm transition-all hover:scale-105 active:scale-95 touch-manipulation ${glassBtn}`}
          aria-label="Open journal"
          title="Gratitude Journal"
        >
          <BookOpen size={16} />
          {gratitudes.length > 0 && (
            <span
              className={`absolute -top-1 -right-1 px-1.5 py-0.2 text-[9px] font-bold rounded-full ${
                isNight
                  ? "bg-pink-500 text-white"
                  : "bg-pink-400 text-white shadow-xs"
              }`}
            >
              {gratitudes.length}
            </span>
          )}
        </button>

        {/* Center: Delicate Garden Title */}
        <div
          className="flex items-center gap-1.5 cursor-pointer group px-2 max-w-[48%] truncate"
          onClick={() => {
            setGardenNameInput(gardenName);
            setIsRenaming(true);
          }}
          title="Click to rename"
        >
          <h1
            className={`text-sm sm:text-lg font-serif font-medium tracking-wide drop-shadow-sm transition-colors truncate ${headerTextColor}`}
          >
            {gardenName}
          </h1>
          <span className="opacity-0 group-hover:opacity-60 text-pink-400 transition-opacity shrink-0">
            <Pencil size={11} />
          </span>
        </div>

        {/* Right: Theme, Sound, Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme */}
          <button
            onClick={onToggleTheme}
            className={`w-9 h-9 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md border shadow-sm transition-all hover:scale-105 active:scale-95 touch-manipulation ${glassBtn}`}
            aria-label="Switch theme"
            title="Switch theme"
          >
            {theme === "dawn" ? (
              <Sun size={15} />
            ) : theme === "sunset" ? (
              <Sunset size={15} />
            ) : (
              <Moon size={15} />
            )}
          </button>

          {/* Sound & Music */}
          <button
            onClick={toggleSound}
            className={`w-9 h-9 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md border shadow-sm transition-all hover:scale-105 active:scale-95 touch-manipulation ${glassBtn}`}
            aria-label={soundOn ? "Mute music and sounds" : "Enable music and sounds"}
            title={soundOn ? "Sound & Music: On" : "Sound & Music: Off"}
          >
            {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* Options */}
          <div className="relative garden-menu">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              aria-label="Options"
              className={`w-9 h-9 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md border shadow-sm transition-all hover:scale-105 active:scale-95 touch-manipulation ${glassBtn}`}
            >
              <MoreHorizontal size={15} />
            </button>

            {showMenu && (
              <div
                className={`absolute right-0 top-10 w-40 rounded-2xl border shadow-xl p-1.5 animate-fadeIn backdrop-blur-xl z-50 ${
                  isNight
                    ? "bg-slate-900/95 border-slate-700 text-pink-100"
                    : "bg-white/95 border-white/80 text-[#77475e]"
                }`}
              >
                <button
                  onClick={() => {
                    setGardenNameInput(gardenName);
                    setIsRenaming(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-pink-50 transition flex items-center gap-2"
                >
                  <Pencil size={12} />
                  <span>Rename</span>
                </button>

                <button
                  onClick={() => {
                    setIsJournalOpen(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-pink-50 transition flex items-center gap-2"
                >
                  <BookOpen size={12} />
                  <span>Journal</span>
                </button>

                <div className="h-px bg-pink-100/50 my-1" />

                <button
                  onClick={handleDeleteGarden}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-50 transition flex items-center gap-2"
                >
                  <Trash2 size={12} />
                  <span>Clear garden</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* -------------------------------------------- */}
      {/* RENAME MODAL */}
      {/* -------------------------------------------- */}

      {isRenaming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-3xl border border-white/80 shadow-xl p-6 text-[#77475e]">
            <h2 className="text-center font-serif text-base font-semibold mb-3">
              Rename your garden
            </h2>

            <input
              autoFocus
              type="text"
              value={gardenNameInput}
              onChange={(e) => setGardenNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") renameGarden();
                if (e.key === "Escape") setIsRenaming(false);
              }}
              maxLength={40}
              className="w-full bg-white border border-pink-200 rounded-full px-4 py-2 text-center text-xs text-[#77475e] placeholder-[#c59aaa] focus:outline-none focus:ring-2 focus:ring-pink-300"
            />

            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setIsRenaming(false)}
                className="px-3.5 py-1.5 rounded-full text-xs text-[#9b7080] hover:bg-pink-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={renameGarden}
                disabled={!gardenNameInput.trim()}
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-sm hover:opacity-95 transition disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------- */}
      {/* SERENE EMPTY STATE (Clean, minimal, no text clutter) */}
      {/* -------------------------------------------- */}

      {gratitudes.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center z-20 pointer-events-none opacity-60">
          <Sprout size={24} className="text-pink-300/80 mb-1" />
          <p className={`font-serif text-xs italic tracking-wide ${headerTextColor}`}>
            Your garden awaits its first bloom
          </p>
        </div>
      )}

      {/* -------------------------------------------- */}
      {/* GROUNDED BLOOMING SAKURA MEADOW */}
      {/* -------------------------------------------- */}

      <div className="absolute left-0 right-0 bottom-12 sm:bottom-14 z-20 pointer-events-auto overflow-x-auto touch-pan-x scrollbar-none pt-24">
        <div className="min-w-full w-max mx-auto px-6 sm:px-12 flex items-end justify-center gap-2.5 sm:gap-5 pb-0">
          {gratitudes.map((gratitude, index) => {
            const isOdd = index % 2 === 1;
            return (
              <div
                key={gratitude.id}
                style={{
                  transform: isOdd ? "translateY(0px) scale(1)" : "translateY(5px) scale(0.96)",
                  zIndex: isOdd ? 22 : 18,
                }}
                className="shrink-0 transition-transform duration-300"
              >
                <Flower
                  gratitude={gratitude}
                  isNew={gratitude.id === lastPlantedId}
                  onDelete={() => removeGratitude(gratitude.id)}
                  onUpdate={updateGratitude}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* -------------------------------------------- */}
      {/* SOFT NATURAL SOIL */}
      {/* -------------------------------------------- */}

      <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-36 z-10 pointer-events-none overflow-hidden pb-safe">
        {/* Soft Mound */}
        <div
          className={`absolute -left-12 -right-12 bottom-3 h-26 sm:h-30 rounded-t-[50%] opacity-95 ${
            isNight
              ? "bg-gradient-to-t from-[#150f1d] via-[#221730] to-transparent"
              : "bg-gradient-to-t from-[#53331b] via-[#6f4528] to-transparent"
          }`}
        />
        {/* Foreground Soil Bedding (anchors stems firmly) */}
        <div
          className={`absolute left-0 right-0 bottom-0 h-12 sm:h-14 ${
            isNight ? "bg-[#0d0912]" : "bg-[#3e2411]"
          }`}
        />
      </div>

      {/* -------------------------------------------- */}
      {/* SLENDER MINIMALIST INPUT PILL */}
      {/* -------------------------------------------- */}

      <div className="absolute bottom-2 sm:bottom-4 pb-safe left-0 right-0 z-30 px-3 sm:px-4 pointer-events-auto">
        <div className="max-w-md mx-auto">
          <div
            className={`relative flex items-center gap-1.5 p-1 sm:p-1.5 rounded-full border shadow-sm backdrop-blur-xl transition-all ${
              isNight
                ? "bg-slate-900/85 border-slate-700/70 focus-within:border-pink-400/60"
                : "bg-white/85 border-white/90 focus-within:border-pink-300 shadow-md"
            }`}
          >
            {/* Flower Type Selector */}
            <div className="relative" ref={flowerPickerRef}>
              <button
                type="button"
                onClick={() => setShowFlowerPicker((prev) => !prev)}
                className={`w-9 h-9 sm:w-8 sm:h-8 rounded-full flex items-center justify-center p-1 border transition-transform hover:scale-105 active:scale-95 touch-manipulation ${
                  isNight
                    ? "bg-slate-800 border-slate-700 text-pink-300"
                    : "bg-white border-pink-100 text-[#8a576d]"
                }`}
                title="Choose bloom"
                aria-label="Choose bloom"
              >
                {selectedFlowerType === "random" ? (
                  <Shuffle size={14} />
                ) : (
                  <img
                    src={FLOWER_IMAGES[selectedFlowerType]}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                )}
              </button>

              {/* Minimal Flower Picker Popover */}
              {showFlowerPicker && (
                <div
                  className={`absolute left-0 bottom-12 w-60 sm:w-56 p-3 sm:p-2.5 rounded-2xl border shadow-xl backdrop-blur-xl z-50 animate-fadeIn ${
                    isNight
                      ? "bg-slate-900/95 border-slate-700 text-pink-100"
                      : "bg-white/95 border-pink-100 text-[#77475e]"
                  }`}
                >
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-pink-100/50">
                    <span className="text-[11px] font-medium text-[#9b7080]">Choose Bloom</span>
                    <button
                      onClick={() => {
                        setSelectedFlowerType("random");
                        setShowFlowerPicker(false);
                      }}
                      className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium transition ${
                        selectedFlowerType === "random"
                          ? "bg-pink-400 text-white"
                          : "bg-pink-50 text-[#77475e] hover:bg-pink-100"
                      }`}
                    >
                      <Shuffle size={10} />
                      <span>Surprise</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((fNum) => (
                      <button
                        key={fNum}
                        onClick={() => {
                          setSelectedFlowerType(fNum);
                          setShowFlowerPicker(false);
                        }}
                        className={`flex flex-col items-center p-1.5 rounded-xl border transition-all hover:scale-105 active:scale-95 ${
                          Number(selectedFlowerType) === fNum
                            ? "border-pink-400 bg-pink-50 ring-1 ring-pink-300"
                            : "border-transparent hover:bg-pink-50/50"
                        }`}
                        title={FLOWER_NAMES[fNum]}
                      >
                        <img
                          src={FLOWER_IMAGES[fNum]}
                          alt={FLOWER_NAMES[fNum]}
                          className="w-7 h-10 object-contain"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Gratitude Input (16px text-base on mobile prevents iOS viewport auto-zoom) */}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="I'm grateful for..."
              maxLength={200}
              className={`flex-1 min-w-0 bg-transparent px-2.5 py-1 text-base sm:text-sm font-medium focus:outline-none ${
                isNight
                  ? "text-pink-100 placeholder-pink-300/40"
                  : "text-stone-800 placeholder-[#b38294]"
              }`}
            />

            {/* Clean Circular Plant Button */}
            <button
              onClick={addGratitude}
              disabled={!input.trim()}
              aria-label="Plant"
              className={`w-9 h-9 sm:w-8 sm:h-8 shrink-0 rounded-full flex items-center justify-center bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-sm transition-all touch-manipulation ${
                !input.trim()
                  ? "opacity-35 cursor-not-allowed"
                  : "hover:scale-105 active:scale-95 shadow-md"
              }`}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------- */}
      {/* GRATITUDE JOURNAL DRAWER */}
      {/* -------------------------------------------- */}

      <Memopad
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        gratitudes={gratitudes}
        onDeleteGratitude={removeGratitude}
        onUpdateGratitude={updateGratitude}
        onReloadGarden={() => {
          setGardenName(loadGardenName());
          setGratitudes(loadGratitudes());
        }}
        gardenName={gardenName}
      />
    </div>
  );
}