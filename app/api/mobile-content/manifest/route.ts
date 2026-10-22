import { getMobileContent } from '@/lib/mobile-content';
export const dynamic = 'force-static';
export async function GET() {
  const { schemaVersion, version, generatedAt, total } = await getMobileContent();
  return Response.json({ schemaVersion, version, generatedAt, total }, { headers: {
    'Cache-Control': 'public, max-age=60, stale-while-revalidate=300', 'Access-Control-Allow-Origin': '*',
  } });
}
