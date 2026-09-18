const GARDEN_KEY = "shi-no-sakura-garden";
const GRATITUDES_KEY = "shi-no-sakura-gratitudes";

const THEME_KEY = "shi-no-sakura-theme";

export function loadGardenName() {
  return localStorage.getItem(GARDEN_KEY) || "";
}

export function saveGardenName(name) {
  localStorage.setItem(GARDEN_KEY, name);
}

export function loadGratitudes() {
  try {
    const saved = localStorage.getItem(GRATITUDES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Could not load gratitudes:", error);
    return [];
  }
}

export function saveGratitudes(gratitudes) {
  localStorage.setItem(
    GRATITUDES_KEY,
    JSON.stringify(gratitudes)
  );
}

export function loadTheme() {
  return localStorage.getItem(THEME_KEY) || "dawn";
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

export function deleteGarden() {
  localStorage.removeItem(GARDEN_KEY);
  localStorage.removeItem(GRATITUDES_KEY);
}

export function exportGardenData() {
  const data = {
    gardenName: loadGardenName(),
    gratitudes: loadGratitudes(),
    exportedAt: new Date().toISOString(),
    version: 1,
  };
  return JSON.stringify(data, null, 2);
}

export function importGardenData(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && Array.isArray(parsed.gratitudes)) {
      if (parsed.gardenName) saveGardenName(parsed.gardenName);
      saveGratitudes(parsed.gratitudes);
      return { success: true, gardenName: parsed.gardenName, count: parsed.gratitudes.length };
    }
    return { success: false, error: "Invalid backup format" };
  } catch (e) {
    return { success: false, error: e.message };
  }
}