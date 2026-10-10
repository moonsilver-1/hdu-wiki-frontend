import { NextResponse } from "next/server";
import { verifySessionCookieValue } from "@/lib/auth";

// 前端获取当前登录用户（无登录返回 { user: null }，不报错）。
export async function GET(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const sessionCookie = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("wiki-session="));
  const user = verifySessionCookieValue(sessionCookie?.slice("wiki-session=".length));
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({
    user: { uid: user.uid, nick: user.nick, avatar: user.avatar },
  });
}
