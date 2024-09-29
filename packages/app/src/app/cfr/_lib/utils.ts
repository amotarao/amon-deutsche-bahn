export function parseDelay(text: string): number | null {
  if (text === "") return null;
  if (text === "on time") return 0;
  if (text === "on time*") return 0;
  if (text.startsWith("+")) {
    return Number(text.replace(/^\+/, "").replace(/ min.+$/, ""));
  }
  if (text.startsWith("-")) {
    return Number(text.replace(/^-/, "").replace(/ min.+$/, "")) * -1;
  }
  return null;
}

export function parsePlatform(text: string): string | null {
  if (text === "") return null;
  return text.replace("platform ", "");
}
