import captions from "./sticker-captions.json";

export type StickerRole = "boy" | "girl";
export type StickerRoleFilter = "all" | StickerRole;
export const STICKER_PAGE_SIZE = 24;
export const STICKER_PACK_URL = "/stickers/sheep-stickers-40.zip";
export const STICKER_PACK_SIZE = "68.9 MB";
export const STICKER_COUNT_PER_ROLE = captions.length;
export const STICKER_TOTAL = captions.length * 2;
export const STICKER_ROLES = { boy: "小羊学长", girl: "小羊学姐" } as const;
export const STICKER_CATEGORIES = ["常用", "日常", "校园", "抽象", "心情"] as const;

export interface Sticker {
  id: string;
  number: string;
  caption: string;
  category: string;
  role: StickerRole;
  src: string;
}

export const STICKERS: readonly Sticker[] = captions.flatMap((caption) =>
  (["boy", "girl"] as const).map((role) => ({
    ...caption,
    id: `${role}-${caption.id}`,
    number: caption.id,
    role,
    src: `/stickers/${role}/${caption.id}.png`,
  })),
);

function normalizeQuery(value: string) {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, "");
}

export function getStickerPage({ role = "all", category = "全部", query = "", page = 1 }: {
  role?: StickerRoleFilter;
  category?: string;
  query?: string;
  page?: number;
} = {}) {
  const search = normalizeQuery(query);
  const matching = STICKERS.filter((sticker) =>
    (role === "all" || sticker.role === role)
    && (category === "全部" || sticker.category === category)
    && (!search || normalizeQuery(`${sticker.caption} ${STICKER_ROLES[sticker.role]} ${sticker.category}`).includes(search)),
  );
  const pageCount = Math.max(1, Math.ceil(matching.length / STICKER_PAGE_SIZE));
  const currentPage = Math.max(1, Math.min(pageCount, Number.isFinite(page) ? Math.trunc(page) : 1));
  return {
    items: matching.slice((currentPage - 1) * STICKER_PAGE_SIZE, currentPage * STICKER_PAGE_SIZE),
    total: matching.length,
    page: currentPage,
    pageCount,
  };
}

export function stickerDownloadName(sticker: Sticker) {
  return `${STICKER_ROLES[sticker.role]}-${sticker.number}-${sticker.caption.replace(/[\\/:*?"<>|]/g, "")}.png`;
}
