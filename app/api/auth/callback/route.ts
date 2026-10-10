import { NextResponse } from "next/server";
import { createSessionCookieValue, watchaRedirectUri } from "@/lib/auth";

// 观猹回调：校验 state → code 换 token → 拉 userinfo → 签发本地会话 cookie。
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");
  const stateCookie = readCookie(request, "wiki-oauth-state");
  const returnToCookie = readCookie(request, "wiki-return-to");

  const failure = (message?: string) => {
    const target = new URL("/", url.origin);
    if (message) target.searchParams.set("login_error", message);
    const res = NextResponse.redirect(target.toString());
    res.cookies.delete("wiki-oauth-state");
    res.cookies.delete("wiki-return-to");
    return res;
  };

  // 用户在观猹侧拒绝授权等异常
  if (oauthError) return failure(oauthError === "access_denied" ? "cancelled" : oauthError);
  if (!code || !state) return failure("missing_code");
  // state 与发起时写入的 cookie 必须一致（防 CSRF）
  if (!stateCookie || stateCookie !== state) return failure("state_mismatch");

  const clientId = process.env.WATCHA_CLIENT_ID ?? "1p9Mcr+CNLPAMFC0";
  const clientSecret = process.env.WATCHA_CLIENT_SECRET ?? "aqkUs+5ZGLSVG6A/L/I0ib9uownWxH+w";
  const redirectUri = watchaRedirectUri(request);

  try {
    // 1. 授权码换 access_token（服务端携带 client_secret）
    const tokenRes = await fetch("https://watcha.cn/oauth/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    if (!tokenRes.ok) return failure("token_exchange_failed");
    const tokenData = (await tokenRes.json()) as { access_token?: string };
    const accessToken = tokenData.access_token;
    if (!accessToken) return failure("token_exchange_failed");

    // 2. 拉取用户信息（scope=read：user_id / nickname / avatar_url）
    const userinfoRes = await fetch("https://watcha.cn/oauth/api/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!userinfoRes.ok) return failure("userinfo_failed");
    const userinfoData = (await userinfoRes.json()) as {
      data?: { user_id?: number | string; nickname?: string; avatar_url?: string };
    };
    const profile = userinfoData.data;
    if (!profile?.user_id) return failure("userinfo_failed");

    // 3. 签发本地会话 cookie（30 天），不保存观猹的 access_token
    const session = createSessionCookieValue({
      uid: String(profile.user_id),
      nick: profile.nickname?.slice(0, 40) || "杭电er",
      avatar: profile.avatar_url?.slice(0, 500) ?? "",
    });
    const target = returnToCookie?.startsWith("/") && !returnToCookie.startsWith("//")
      ? new URL(returnToCookie, url.origin)
      : new URL("/", url.origin);
    const response = NextResponse.redirect(target.toString());
    const secure = (request.headers.get("x-forwarded-proto")?.split(",")[0] ?? "http").trim() === "https";
    response.cookies.set("wiki-session", session.value, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure,
      maxAge: session.maxAge,
    });
    response.cookies.delete("wiki-oauth-state");
    response.cookies.delete("wiki-return-to");
    return response;
  } catch {
    return failure("network_error");
  }
}

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return null;
}
