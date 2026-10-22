export function isSafeMarkdownUrl(value: string, image = false): boolean {
  const normalized = value.replace(/%(?:0[0-9a-f]|1[0-9a-f]|20|7f)/gi, "").replace(/[\u0000-\u0020\u007f]/g, "");
  const scheme = /^([a-z][a-z\d+.-]*):/i.exec(normalized)?.[1]?.toLowerCase();
  if (!scheme) return true;
  if (scheme === "http" || scheme === "https") return true;
  if (image) return /^local:\d+$/.test(normalized);
  return scheme === "mailto" || scheme === "tel";
}
