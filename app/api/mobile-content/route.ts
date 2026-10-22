import { getMobileContent } from '@/lib/mobile-content';
export const dynamic = 'force-static';
export async function GET() {
  const data = await getMobileContent();
  return Response.json(data, { headers: {
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
    'Access-Control-Allow-Origin': '*', ETag: `"${data.version}"`,
  } });
}
