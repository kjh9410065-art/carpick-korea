// MINGKA_ROBOTS_FALLBACK_V1
// 정적 파일이 정상 배포되지 않는 경우에도 검색엔진이 robots.txt와 sitemap.xml을
// 확실하게 받을 수 있도록 Worker에서 해당 경로를 직접 응답합니다.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 검색엔진이 요청하는 robots.txt를 Worker에서 직접 반환합니다.
    if (url.pathname === "/robots.txt") {
      return new Response(
        "User-agent: *\nAllow: /\n\nSitemap: https://carpick-korea.carpick.workers.dev/sitemap.xml\n",
        {
          status: 200,
          headers: {
            "Content-Type": "text/plain; charset=UTF-8",
            "Cache-Control": "public, max-age=3600"
          }
        }
      );
    }

    // sitemap.xml도 같은 방식으로 직접 제공합니다.
    if (url.pathname === "/sitemap.xml") {
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://carpick-korea.carpick.workers.dev/</loc><lastmod>2026-09-08</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/long-term-rental-vs-lease.html</loc><lastmod>2026-09-08</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/car-purchase-vs-rental.html</loc><lastmod>2026-09-08</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/long-term-rental-guide.html</loc><lastmod>2026-09-08</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/car-lease-guide.html</loc><lastmod>2026-09-08</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/long-term-rental-cost-guide.html</loc><lastmod>2026-09-08</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/car-buying-checklist.html</loc><lastmod>2026-09-08</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/lease-contract-checklist.html</loc><lastmod>2026-09-08</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
</urlset>`;

      return new Response(sitemap, {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=UTF-8",
          "Cache-Control": "public, max-age=3600"
        }
      });
    }

    // 나머지 요청은 기존 정적 파일을 그대로 Cloudflare Assets에서 제공합니다.
    return env.ASSETS.fetch(request);
  }
};
