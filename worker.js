// MINGKA_ROBOTS_FALLBACK_V4
// robots.txt와 sitemap.xml을 Worker에서 직접 반환해 검색로봇이 항상 최신 내용을 받도록 합니다.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 네이버(Yeti)와 일반 검색로봇 모두 사이트 전체 수집을 허용합니다.
    if (url.pathname === "/robots.txt") {
      const robots =
        "User-agent: Yeti\nAllow: /\n\n" +
        "User-agent: *\nAllow: /\n\n" +
        "Sitemap: https://carpick-korea.carpick.workers.dev/sitemap.xml\n";

      return new Response(robots, {
        status: 200,
        headers: {
          // robots.txt가 UTF-8 일반 텍스트라는 것을 명확하게 전달합니다.
          "Content-Type": "text/plain; charset=UTF-8",
          // 검색로봇이 이전 404/오래된 응답을 계속 사용하지 않도록 캐시하지 않습니다.
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"
        }
      });
    }

    // sitemap.xml도 Worker에서 직접 반환해 정적 파일과 응답이 달라지는 문제를 방지합니다.
    if (url.pathname === "/sitemap.xml") {
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://carpick-korea.carpick.workers.dev/</loc><lastmod>2026-09-09</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/long-term-rental-vs-lease.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/car-purchase-vs-rental.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/long-term-rental-guide.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/car-lease-guide.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/long-term-rental-cost-guide.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/car-buying-checklist.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/lease-contract-checklist.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/privacy.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/terms.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/affiliate.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
</urlset>`;

      return new Response(sitemap, {
        status: 200,
        headers: {
          // XML 문서임을 명확하게 전달합니다.
          "Content-Type": "application/xml; charset=UTF-8",
          // 사이트맵도 항상 최신 Worker 응답을 사용하게 합니다.
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"
        }
      });
    }

    // 그 외 페이지는 기존 Cloudflare Assets 정적 파일을 그대로 제공합니다.
    return env.ASSETS.fetch(request);
  }
};
