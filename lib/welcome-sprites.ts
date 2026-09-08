import type { CSSProperties } from "react";

// Measured from the current 1023 × 1537 atlas. Rows have unequal heights.
// Keeping every crop inside its own row prevents neighbouring shoes leaking in.
export const spriteRows = [
  { top: 18, height: 202 }, { top: 225, height: 183 },
  { top: 415, height: 183 }, { top: 605, height: 187 },
  { top: 801, height: 193 }, { top: 998, height: 181 },
  { top: 1186, height: 181 }, { top: 1370, height: 167 },
];
export function spriteStyle(girl: boolean, facing: string, moon = false): CSSProperties {
  const directions: Record<string, number> = { down: 0, left: 1, right: 2, up: 3 };
  const crop = spriteRows[(directions[facing] ?? 0) + (girl && !moon ? 4 : 0)];
  return {
    "--sprite-y": `${crop.top / (1537 - crop.height) * 100}%`,
    "--sprite-height": crop.height,
  } as CSSProperties;
}

