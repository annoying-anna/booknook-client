export const CATEGORIES = {
  Fiction: { color: "var(--spine-fiction)", blurb: "Novels, drama and thrillers" },
  Science: { color: "var(--spine-science)", blurb: "Physics, nature and technology" },
  History: { color: "var(--spine-history)", blurb: "Civilizations, biographies, turning points" },
  Kids: { color: "var(--spine-kids)", blurb: "Picture books and bedtime stories" },
  Others: { color: "var(--spine-others)", blurb: "Psychology, art, self-help, philosophy" },
} as const;

export type Category = keyof typeof CATEGORIES;
export const spineColor = (c?: string) => CATEGORIES[c as Category]?.color ?? CATEGORIES.Others.color;
