export type Tone = "ink" | "paper" | "tide" | "signal";
export type Shade = 100 | 300 | 500 | 700 | 900;

const HUE: Record<Tone, number> = {
  ink: 222,
  paper: 40,
  tide: 188,
  signal: 12,
};

const LIGHTNESS: Record<Shade, number> = {
  100: 95,
  300: 78,
  500: 56,
  700: 36,
  900: 16,
};

export function color(tone: Tone, shade: Shade = 500): string {
  const saturation = tone === "ink" || tone === "paper" ? 12 : 72;
  return `hsl(${HUE[tone]} ${saturation}% ${LIGHTNESS[shade]}%)`;
}
