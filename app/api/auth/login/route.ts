import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

// 发起观猹登录：生成 state（防 CSRF）写入临时 cookie，
// 302 跳到观猹授权页。支持 ?next=/path 指定登录后回到的站内页面。
export async function GET(request: Request) {
  const url = new URL(request.url);

  // returnTo 只允许站内相对路径，防止开放重定向
  const nextParam = url.searchParams.get("next");
  const returnTo = nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/";

  const state = randomBytes(16).toString("hex");
  const clientId = process.env.WATCHA_CLIENT_ID ?? "1p9Mcr+CNLPAMFC0";
  const scope = process.env.WATCHA_SCOPE ?? "read";
  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ?? "http";
  const host = request.headers.get("host") ?? url.host;
  const redirectUri = process.env.WATCHA_REDIRECT_URI ?? `${proto}://${host}/api/auth/callback`;

  const authorizeUrl = new URL("https://watcha.cn/oauth/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  // client_id 含 + / = 等字符，必须编码（URLSearchParams 会自动处理）
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", scope);
  authorizeUrl.searchParams.set("state", state);

  const secure = proto === "https";
  const response = NextResponse.redirect(authorizeUrl.toString());
  const common = { path: "/", httpOnly: true, sameSite: "lax" as const, secure };
  response.cookies.set("wiki-oauth-state", state, { ...common, maxAge: 600 });
  response.cookies.set("wiki-return-to", returnTo, { ...common, maxAge: 600 });
  return response;
}
