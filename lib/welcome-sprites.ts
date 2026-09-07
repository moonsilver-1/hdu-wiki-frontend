import type { CSSProperties } from "react";

// Measured from the current 640 × 960 atlas. Rows have unequal heights.
// Keeping every crop inside its own row prevents neighbouring shoes leaking in.
export const spriteRows = [
  { top: 10, height: 128 }, { top: 139, height: 119 },
  { top: 258, height: 119 }, { top: 377, height: 120 },
  { top: 499, height: 122 }, { top: 621, height: 118 },
  { top: 739, height: 116 }, { top: 855, height: 105 },
];
export function spriteStyle(girl: boolean, facing: string, moon = false): CSSProperties {
  const directions: Record<string, number> = { down: 0, left: 1, right: 2, up: 3 };
  const crop = spriteRows[(directions[facing] ?? 0) + (girl && !moon ? 4 : 0)];
  return {
    "--sprite-y": `${crop.top / (960 - crop.height) * 100}%`,
    "--sprite-height": crop.height,
  } as CSSProperties;
}
