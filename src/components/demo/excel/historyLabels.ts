export const timeLabel = (date = new Date()) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const pluralFile = (count: number) => `${count} file${count === 1 ? "" : "s"}`;
