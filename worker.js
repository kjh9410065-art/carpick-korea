// MINGKA_ROBOTS_FALLBACK_V2
// 정적 파일보다 Worker가 먼저 실행되도록 설정된 경로에서
// 검색엔진용 robots.txt와 sitemap.xml을 확실하게 직접 반환합니다.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // robots.txt는 항상 200 OK + text/plain으로 반환해 검색엔진이 정상적으로 읽도록 합니다.
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

    // sitemap.xml도 Worker에서 직접 반환해 정적 파일 라우팅 여부와 관계없이 제공합니다.
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
<url><loc>https://carpick-korea.carpick.workers.dev/privacy.html</loc><lastmod>2026-09-08</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/terms.html</loc><lastmod>2026-09-08</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/affiliate.html</loc><lastmod>2026-09-08</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
</urlset>`;

      return new Response(sitemap, {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=UTF-8",
          "Cache-Control": "public, max-age=3600"
        }
      });
    }

    // 그 외 페이지는 기존 Cloudflare Assets 정적 파일을 그대로 제공합니다.
    return env.ASSETS.fetch(request);
  }
};
