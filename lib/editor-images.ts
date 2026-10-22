/** Image IDs stay stable while editing. Compact them only at the API boundary. */
export function prepareSubmissionImages<T extends { id: number }>(body: string, images: T[]) {
  const indexById = new Map(images.map((image, index) => [image.id, index]));
  return {
    body: body.replace(/(!\[[^\]]*\]\(\s*)local:(\d+)(\s*\))/g, (whole, prefix, id, suffix) => {
      const index = indexById.get(Number(id));
      return index === undefined ? whole : `${prefix}local:${index}${suffix}`;
    }),
    images: images.map((image) => {
      const result: Omit<T, "id"> & { id?: number } = { ...image };
      delete result.id;
      return result;
    }),
  };
}
