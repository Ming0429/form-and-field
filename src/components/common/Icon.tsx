import type { CSSProperties } from "react";
type IconName =
  | "search"
  | "bag"
  | "heart"
  | "arrow"
  | "close"
  | "plus"
  | "minus"
  | "check"
  | "truck"
  | "return"
  | "leaf"
  | "filter"
  | "chevron"
  | "box"
  | "star"
  | "globe";
const paths: Record<IconName, string> = {
  search: "m21 21-4.4-4.4 M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0",
  bag: "M5 7h14l1 14H4L5 7 M9 8V6a3 3 0 0 1 6 0v2",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
  arrow: "M4 12h16m-6-6 6 6-6 6",
  close: "m6 6 12 12M6 18 18 6",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  check: "m5 12 4 4L19 6",
  truck:
    "M1 5h13v12H1V5m13 4h4l4 4v4h-8M8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0m12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0",
  return: "M4 9h10a6 6 0 0 1 0 12h-3M4 9l5-5M4 9l5 5",
  leaf: "M20 3C10 1 2 7 5 15s15 5 15-12ZM5 20l10-10",
  filter: "M4 7h16M4 17h16M8 4v6m8 4v6",
  chevron: "m8 5 7 7-7 7",
  box: "m12 2 10 5v10l-10 5L2 17V7l10-5Zm0 10v10M2 7l10 5 10-5M7 4.5l10 5",
  star: "m12 2 3.1 6.3 6.9 1-5 4.8 1.2 6.9-6.2-3.3-6.2 3.3 1.2-6.9-5-4.8 6.9-1L12 2Z",
  globe:
    "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18",
};
export function Icon({
  name,
  size = 20,
  filled = false,
  style,
}: {
  name: IconName;
  size?: number;
  filled?: boolean;
  style?: CSSProperties;
}) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <path d={paths[name]} />
    </svg>
  );
}
