export const MAX_JSON_BODY_BYTES = 256 * 1024;

export type JsonBodyError =
  | "REQUEST_TOO_LARGE"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "INVALID_JSON";

function bodyError(reason: JsonBodyError): Error {
  return new Error(reason);
}

export async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  const mediaType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (mediaType !== "application/json") throw bodyError("UNSUPPORTED_MEDIA_TYPE");

  const declaredLength = request.headers.get("content-length");
  if (declaredLength) {
    const length = Number(declaredLength);
    if (Number.isFinite(length) && length > MAX_JSON_BODY_BYTES) {
      throw bodyError("REQUEST_TOO_LARGE");
    }
  }

  const reader = request.body?.getReader();
  if (!reader) throw bodyError("INVALID_JSON");

  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_JSON_BODY_BYTES) throw bodyError("REQUEST_TOO_LARGE");
      chunks.push(value);
    }
  } catch (error) {
    if (error instanceof Error && (error.message === "REQUEST_TOO_LARGE" || error.message === "INVALID_JSON")) {
      throw error;
    }
    throw bodyError("INVALID_JSON");
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw bodyError("INVALID_JSON");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw bodyError("INVALID_JSON");
  }
  return parsed as Record<string, unknown>;
}
