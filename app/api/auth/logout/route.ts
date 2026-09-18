import { NextResponse } from "next/server";

// 退出登录：清掉会话 cookie，回到首页。
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("wiki-session");
  response.cookies.delete("wiki-oauth-state");
  response.cookies.delete("wiki-return-to");
  return response;
}
