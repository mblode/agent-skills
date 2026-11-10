export type SpaceStep = 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16;

const BASE_PX = 4;

export function space(step: SpaceStep): string {
  return step === 0 ? "0" : `${(step * BASE_PX) / 16}rem`;
}

export interface TypeStyle {
  fontSize: string;
  lineHeight: number;
}

export const typeScale: Record<"caption" | "body" | "title" | "display", TypeStyle> = {
  caption: { fontSize: "0.75rem", lineHeight: 1.4 },
  body: { fontSize: "1rem", lineHeight: 1.5 },
  title: { fontSize: "1.5rem", lineHeight: 1.25 },
  display: { fontSize: "2.5rem", lineHeight: 1.1 },
};
