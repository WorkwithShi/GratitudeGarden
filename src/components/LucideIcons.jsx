import React from "react";

const createLucideIcon = (displayName, paths) => {
  const Component = ({
    size = 18,
    className = "",
    strokeWidth = 2,
    ...props
  }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {paths}
    </svg>
  );
  Component.displayName = displayName;
  return Component;
};

export const BookOpen = createLucideIcon("BookOpen", [
  <path key="1" d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />,
  <path key="2" d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />,
]);

export const Sun = createLucideIcon("Sun", [
  <circle key="1" cx="12" cy="12" r="4" />,
  <path key="2" d="M12 2v2" />,
  <path key="3" d="M12 20v2" />,
  <path key="4" d="m4.93 4.93 1.41 1.41" />,
  <path key="5" d="m17.66 17.66 1.41 1.41" />,
  <path key="6" d="M2 12h2" />,
  <path key="7" d="M20 12h2" />,
  <path key="8" d="m6.34 17.66-1.41 1.41" />,
  <path key="9" d="m19.07 4.93-1.41 1.41" />,
]);

export const Sunset = createLucideIcon("Sunset", [
  <path key="1" d="M12 10V2" />,
  <path key="2" d="m4.93 10.93 1.41 1.41" />,
  <path key="3" d="M2 18h2" />,
  <path key="4" d="M20 18h2" />,
  <path key="5" d="m19.07 10.93-1.41 1.41" />,
  <path key="6" d="M22 22H2" />,
  <path key="7" d="m8 6 4-4 4 4" />,
  <path key="8" d="M16 18a4 4 0 0 0-8 0" />,
]);

export const Moon = createLucideIcon("Moon", [
  <path key="1" d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
]);

export const Volume2 = createLucideIcon("Volume2", [
  <polygon key="1" points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />,
  <path key="2" d="M15.54 8.46a5 5 0 0 1 0 7.07" />,
  <path key="3" d="M19.07 4.93a10 10 0 0 1 0 14.14" />,
]);

export const VolumeX = createLucideIcon("VolumeX", [
  <polygon key="1" points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />,
  <line key="2" x1="22" x2="16" y1="9" y2="15" />,
  <line key="3" x1="16" x2="22" y1="9" y2="15" />,
]);

export const MoreHorizontal = createLucideIcon("MoreHorizontal", [
  <circle key="1" cx="12" cy="12" r="1" />,
  <circle key="2" cx="19" cy="12" r="1" />,
  <circle key="3" cx="5" cy="12" r="1" />,
]);

export const Pencil = createLucideIcon("Pencil", [
  <path key="1" d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />,
  <path key="2" d="m15 5 4 4" />,
]);

export const Trash2 = createLucideIcon("Trash2", [
  <path key="1" d="M3 6h18" />,
  <path key="2" d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />,
  <path key="3" d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />,
  <line key="4" x1="10" x2="10" y1="11" y2="17" />,
  <line key="5" x1="14" x2="14" y1="11" y2="17" />,
]);

export const Plus = createLucideIcon("Plus", [
  <path key="1" d="M5 12h14" />,
  <path key="2" d="M12 5v14" />,
]);

export const Sparkles = createLucideIcon("Sparkles", [
  <path key="1" d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />,
  <path key="2" d="M5 3v4" />,
  <path key="3" d="M19 17v4" />,
  <path key="4" d="M3 5h4" />,
  <path key="5" d="M17 19h4" />,
]);

export const Search = createLucideIcon("Search", [
  <circle key="1" cx="11" cy="11" r="8" />,
  <path key="2" d="m21 21-4.3-4.3" />,
]);

export const Copy = createLucideIcon("Copy", [
  <rect key="1" width="14" height="14" x="8" y="8" rx="2" ry="2" />,
  <path key="2" d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />,
]);

export const Download = createLucideIcon("Download", [
  <path key="1" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />,
  <polyline key="2" points="7 10 12 15 17 10" />,
  <line key="3" x1="12" x2="12" y1="15" y2="3" />,
]);

export const Upload = createLucideIcon("Upload", [
  <path key="1" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />,
  <polyline key="2" points="17 8 12 3 7 8" />,
  <line key="3" x1="12" x2="12" y1="3" y2="15" />,
]);

export const X = createLucideIcon("X", [
  <path key="1" d="M18 6 6 18" />,
  <path key="2" d="m6 6 12 12" />,
]);

export const Check = createLucideIcon("Check", [
  <path key="1" d="M20 6 9 17l-5-5" />,
]);

export const Shuffle = createLucideIcon("Shuffle", [
  <path key="1" d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />,
  <path key="2" d="m18 2 4 4-4 4" />,
  <path key="3" d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />,
  <path key="4" d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />,
  <path key="5" d="m18 14 4 4-4 4" />,
]);

export const ArrowRight = createLucideIcon("ArrowRight", [
  <path key="1" d="M5 12h14" />,
  <path key="2" d="m12 5 7 7-7 7" />,
]);

export const Sprout = createLucideIcon("Sprout", [
  <path key="1" d="M7 20h10" />,
  <path key="2" d="M10 20c5.5-2.5.8-6.4 3-13" />,
  <path key="3" d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />,
  <path key="4" d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />,
]);

export const Flower2 = createLucideIcon("Flower2", [
  <circle key="1" cx="12" cy="12" r="3" />,
  <path key="2" d="M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5" />,
  <path key="3" d="M12 7.5V9" />,
  <path key="4" d="M7.5 12H9" />,
  <path key="5" d="M16.5 12H15" />,
  <path key="6" d="M12 16.5V15" />,
]);
