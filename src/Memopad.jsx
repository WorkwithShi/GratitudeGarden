import React, { useState, useMemo } from "react";
import { FLOWER_IMAGES, FLOWER_NAMES } from "./utils/flowers";
import { exportGardenData, importGardenData } from "./utils/storage";
import {
  BookOpen,
  Search,
  Copy,
  Download,
  Upload,
  X,
  Check,
  Pencil,
  Trash2,
  Sprout,
} from "./components/LucideIcons";

export default function Memopad({
  isOpen,
  onClose,
  gratitudes = [],
  onDeleteGratitude,
  onUpdateGratitude,
  onReloadGarden,
  gardenName = "My Garden",
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Filtered gratitudes based on search query and flower type
  const filteredGratitudes = useMemo(() => {
    return gratitudes.filter((item) => {
      const matchesSearch = item.text
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFlower =
        selectedFilter === "all" || String(item.flower) === String(selectedFilter);
      return matchesSearch && matchesFlower;
    });
  }, [gratitudes, searchQuery, selectedFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = gratitudes.length;
    const today = new Date().toDateString();
    const plantedToday = gratitudes.filter((g) => {
      if (!g.createdAt) return false;
      return new Date(g.createdAt).toDateString() === today;
    }).length;
    return { total, plantedToday };
  }, [gratitudes]);

  if (!isOpen) return null;

  const handleCopyAll = () => {
    if (gratitudes.length === 0) return;
    const textLines = gratitudes.map((g, i) => {
      const dateStr = g.createdAt
        ? new Date(g.createdAt).toLocaleDateString()
        : "";
      return `${i + 1}. ${g.text} ${dateStr ? `(${dateStr})` : ""}`;
    });
    const fullText = `${gardenName} — Gratitude Journal\n\n` + textLines.join("\n");

    navigator.clipboard?.writeText(fullText).then(() => {
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2200);
    });
  };

  const handleDownloadBackup = () => {
    const json = exportGardenData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sakura-garden-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        const result = importGardenData(content);
        if (result.success) {
          alert(`Successfully imported ${result.count} blossoms!`);
          if (onReloadGarden) onReloadGarden();
        } else {
          alert("Could not import file: " + result.error);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/25 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full h-[100dvh] bg-[#fdf9fb] shadow-2xl flex flex-col text-[#77475e] border-l border-pink-100/60 animate-fadeIn overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Clean Header */}
        <div className="pt-safe px-5 pb-3 border-b border-pink-100/60 flex items-center justify-between bg-white/70 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <BookOpen size={18} className="text-pink-400" />
            <div>
              <h2 className="font-serif text-base font-semibold text-[#6d3e53]">
                Gratitude Journal
              </h2>
              <p className="text-[11px] text-[#a06b80]">
                {stats.total} blossoms • {stats.plantedToday} today
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close journal"
            className="w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-[#8a576d] transition touch-manipulation"
          >
            <X size={16} />
          </button>
        </div>

        {/* Minimal Search & Filter Bar */}
        <div className="p-3.5 border-b border-pink-100/50 space-y-2.5 bg-white/40">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memories..."
              className="w-full bg-white border border-pink-200/70 rounded-full pl-8 pr-7 py-1.5 text-base sm:text-xs text-[#77475e] placeholder-[#c59aaa] focus:outline-none focus:ring-1 focus:ring-pink-300"
            />
            <span className="absolute left-2.5 top-2 text-[#c59aaa]">
              <Search size={13} />
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2 text-[#b38294] hover:text-[#77475e]"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter Flower Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-2.5 py-0.5 rounded-full whitespace-nowrap text-[11px] transition-all ${
                selectedFilter === "all"
                  ? "bg-[#e88ba7] text-white font-medium shadow-sm"
                  : "bg-white text-[#8f5d71] hover:bg-pink-50"
              }`}
            >
              All ({gratitudes.length})
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((fNum) => {
              const count = gratitudes.filter((g) => g.flower === fNum).length;
              if (count === 0) return null;
              return (
                <button
                  key={fNum}
                  onClick={() => setSelectedFilter(fNum)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full whitespace-nowrap text-[11px] transition-all ${
                    selectedFilter === fNum
                      ? "bg-[#e88ba7] text-white font-medium shadow-sm"
                      : "bg-white text-[#8f5d71] hover:bg-pink-50"
                  }`}
                >
                  <img
                    src={FLOWER_IMAGES[fNum]}
                    alt=""
                    className="w-3.5 h-3.5 object-contain"
                  />
                  <span>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredGratitudes.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Sprout size={32} className="text-pink-300 mx-auto mb-2 opacity-60" />
              <h3 className="font-serif text-sm font-semibold text-[#8f5d71]">
                {gratitudes.length === 0
                  ? "Your journal is waiting for its first blossom"
                  : "No memories match your search"}
              </h3>
              <p className="text-xs text-[#b38294] mt-1 max-w-xs mx-auto">
                {gratitudes.length === 0
                  ? "Plant a gratitude seed in your garden to watch it bloom here."
                  : "Try searching with a different term or select 'All'."}
              </p>
            </div>
          ) : (
            filteredGratitudes.map((item) => {
              const isEditing = editingId === item.id;
              const formattedTime = item.createdAt
                ? new Date(item.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Planted memory";

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3 border border-pink-100/70 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={FLOWER_IMAGES[item.flower] || FLOWER_IMAGES[1]}
                      alt=""
                      className="w-8 h-14 object-contain shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-semibold text-[#a85f7a] uppercase tracking-wide">
                          {FLOWER_NAMES[item.flower] || "Sakura"}
                        </span>
                        <span className="text-[10px] text-[#b38294]">
                          {formattedTime}
                        </span>
                      </div>

                      {isEditing ? (
                        <div className="mt-1 space-y-2">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={2}
                            maxLength={200}
                            className="w-full text-xs p-2 rounded-xl border border-pink-200 bg-pink-50/30 text-stone-800 focus:outline-none focus:ring-1 focus:ring-pink-300 resize-none font-sans"
                          />
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-2.5 py-1 text-[11px] rounded-lg text-[#9b7080] hover:bg-pink-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                if (editText.trim() && onUpdateGratitude) {
                                  onUpdateGratitude(item.id, editText.trim());
                                }
                                setEditingId(null);
                              }}
                              className="px-3 py-1 text-[11px] font-semibold bg-[#e88ba7] text-white rounded-lg shadow-sm hover:bg-[#df7897]"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="font-sans text-sm font-medium text-stone-800 leading-relaxed break-words select-text">
                          {item.text}
                        </p>
                      )}

                      {!isEditing && (
                        <div className="flex justify-end items-center gap-2 mt-1.5 pt-1.5 border-t border-pink-50/60 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingId(item.id);
                              setEditText(item.text);
                            }}
                            className="flex items-center gap-1 text-[10px] text-[#9b7080] hover:text-[#77475e] transition"
                          >
                            <Pencil size={10} />
                            <span>Edit</span>
                          </button>
                          <span className="text-pink-200">•</span>
                          <button
                            onClick={() => onDeleteGratitude(item.id)}
                            className="flex items-center gap-1 text-[10px] text-rose-400 hover:text-rose-600 transition"
                          >
                            <Trash2 size={10} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Minimal Footer: Copy / Backup */}
        <div className="p-3.5 pb-safe border-t border-pink-100/60 bg-white/70 backdrop-blur-md flex flex-col gap-2">
          {copiedNotification && (
            <div className="flex items-center justify-center gap-1 text-center text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg py-1 border border-emerald-200 animate-fadeIn">
              <Check size={12} />
              <span>Copied to clipboard</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              disabled={gratitudes.length === 0}
              className="flex-1 py-1.5 rounded-xl text-xs font-medium bg-white border border-pink-200/60 text-[#7a4c5f] hover:bg-pink-50 transition shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <Copy size={12} />
              <span>Copy All</span>
            </button>

            <button
              onClick={handleDownloadBackup}
              disabled={gratitudes.length === 0}
              className="flex-1 py-1.5 rounded-xl text-xs font-medium bg-white border border-pink-200/60 text-[#7a4c5f] hover:bg-pink-50 transition shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <Download size={12} />
              <span>Backup</span>
            </button>

            <label className="py-1.5 px-3 rounded-xl text-xs font-medium bg-white border border-pink-200/60 text-[#7a4c5f] hover:bg-pink-50 transition shadow-sm cursor-pointer flex items-center gap-1">
              <Upload size={12} />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
