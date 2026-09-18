import { createHmac, timingSafeEqual } from "node:crypto";

// 观猹登录的会话工具：用户信息经 HMAC 签名后放入 httpOnly cookie，
// 不引入数据库与服务端 session 存储。access_token 不落盘——
// 我们只需要"这个人是谁"，不需要代表用户调用观猹接口。

export interface WatchaSessionUser {
  uid: string; // 观猹 user_id
  nick: string;
  avatar: string;
  exp: number; // 会话过期时间（秒）
}

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function authSecret(): string {
  const secret = process.env.AUTH_SECRET ?? process.env.WATCHA_CLIENT_SECRET;
  if (!secret) {
    // 仅本地未配置时可能走到；生产环境必须在环境变量里配置 AUTH_SECRET
    console.warn("[auth] AUTH_SECRET 未配置，回退到不安全的开发密钥");
    return "hdu-wiki-dev-insecure-secret";
  }
  return secret;
}

function base64UrlEncode(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

function sign(payload: string): string {
  return createHmac("sha256", authSecret()).update(payload).digest("base64url");
}

export function createSessionCookieValue(user: Omit<WatchaSessionUser, "exp">): {
  value: string;
  maxAge: number;
} {
  const payload: WatchaSessionUser = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };
  const encoded = base64UrlEncode(JSON.stringify(payload));
  return { value: `${encoded}.${sign(encoded)}`, maxAge: SESSION_MAX_AGE_SECONDS };
}

// 校验签名与有效期；不合法一律返回 null（失效即视为未登录）。
export function verifySessionCookieValue(value: string | undefined | null): WatchaSessionUser | null {
  if (!value) return null;
  const dot = value.lastIndexOf(".");
  if (dot <= 0) return null;
  const encoded = value.slice(0, dot);
  const signature = value.slice(dot + 1);
  const expected = sign(encoded);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8")) as Partial<WatchaSessionUser>;
    if (typeof parsed.uid !== "string" || !parsed.uid) return null;
    if (typeof parsed.exp !== "number" || parsed.exp * 1000 < Date.now()) return null;
    return {
      uid: parsed.uid,
      nick: typeof parsed.nick === "string" ? parsed.nick : "杭电er",
      avatar: typeof parsed.avatar === "string" ? parsed.avatar : "",
      exp: parsed.exp,
    };
  } catch {
    return null;
  }
}

// 观猹 client_id 可能包含 + / = 等特殊字符，进 URL 必须编码
// （文档 FAQ：不编码会报「客户端不存在」）。
export function watchaAuthorizeUrl(params: {
  clientId: string;
  redirectUri: string;
  scope: string;
  state: string;
}): string {
  const query = new URLSearchParams({
    response_type: "code",
    client_id: params.clientId,
    redirect_uri: params.redirectUri,
    scope: params.scope,
    state: params.state,
  });
  return `https://watcha.cn/oauth/authorize?${query.toString()}`;
}

export function watchaRedirectUri(request: Request): string {
  if (process.env.WATCHA_REDIRECT_URI) return process.env.WATCHA_REDIRECT_URI;
  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ?? "http";
  const host = request.headers.get("host") ?? new URL(request.url).host;
  return `${proto}://${host}/api/auth/callback`;
}
