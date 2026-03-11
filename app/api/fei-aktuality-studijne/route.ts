import { NextResponse } from 'next/server';

const FEI_ARCHIVE_URL = 'https://www.fei.tuke.sk/sk/archive/clanky?category=aktuality_studijne_oddelenie&page=1';
const FEI_BASE = 'https://www.fei.tuke.sk/sk/archive/clanky';

function normalizeArticleLink(raw: string): string {
  if (!raw?.trim()) return FEI_ARCHIVE_URL;
  const s = raw.trim();
  const match = s.match(/archive\/clanky\/([^?#/]+)/);
  if (match) {
    return `${FEI_BASE}/${match[1]}`;
  }
  try {
    const u = new URL(s);
    if (u.hostname.replace(/^www\./, '') === 'fei.tuke.sk') {
      u.hostname = 'www.fei.tuke.sk';
      let path = u.pathname.replace(/^\/sk\/2\/sk/, '/sk');
      if (!path.startsWith('/')) path = '/sk' + path;
      u.pathname = path;
      return u.toString();
    }
  } catch {
    // ignore
  }
  return s;
}

const FEED_URLS = [
  'https://www.fei.tuke.sk/sk/archive/clanky?category=aktuality_studijne_oddelenie&format=feed',
  'https://api.prod.tuke.sk/feed/2/sk/articles-feed',
  'https://www.fei.tuke.sk/sk/archive/clanky?format=feed',
];

/** Patria položky do kategórie aktuality študijné oddelenie? */
function isStudijne(item: { categories?: string[] }): boolean {
  const c = (item.categories || []).map((x) => (x || '').toLowerCase());
  return c.some(
    (x) =>
      x.includes('studijne') ||
      x.includes('študijn') ||
      x.includes('studijné') ||
      x.includes('aktuality_studijne_oddelenie')
  );
}

export type FeiAktualityItem = {
  title: string;
  link: string;
  date: string;
  summary?: string;
};

export async function GET() {
  try {
    const Parser = (await import('rss-parser')).default;
    const parser = new Parser({ timeout: 8000 });

    for (const feedUrl of FEED_URLS) {
      try {
        const feed = await parser.parseURL(feedUrl);
        const raw = feed.items || [];
        const filtered =
          feedUrl.includes('category=aktuality_studijne') ? raw : raw.filter((item) => isStudijne(item));
        const use = filtered.length > 0 ? filtered : raw;
        const items: FeiAktualityItem[] = use.slice(0, 15).map((item) => ({
          title: item.title?.trim() || 'Bez názvu',
          link: normalizeArticleLink(item.link?.trim() || item.guid || ''),
          date: item.pubDate || item.isoDate || '',
          summary: item.contentSnippet?.trim() || item.content?.replace(/<[^>]*>/g, '').trim().slice(0, 200),
        }));

        if (items.length > 0) {
          return NextResponse.json({
            success: true,
            data: items,
            source: feedUrl,
            fallbackUrl: FEI_ARCHIVE_URL,
          });
        }
      } catch {
        continue;
      }
    }
  } catch (e) {
    console.error('FEI aktuality študijné oddelenie feed error:', e);
  }

  return NextResponse.json({
    success: false,
    fallbackUrl: FEI_ARCHIVE_URL,
    message: 'Feed nie je k dispozícii, použite odkaz na archív.',
  });
}
