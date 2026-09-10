// MINGKA_ROBOTS_FALLBACK_V5
// robots.txt, sitemap.xml과 공통 하단 푸터를 Worker에서 처리합니다.
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
<url><loc>https://carpick-korea.carpick.workers.dev/</loc><lastmod>2026-09-11</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/long-term-rental-vs-lease.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/car-purchase-vs-rental.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/long-term-rental-guide.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/car-lease-guide.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/long-term-rental-cost-guide.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/car-buying-checklist.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/lease-contract-checklist.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/privacy.html</loc><lastmod>2026-09-11</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
<url><loc>https://carpick-korea.carpick.workers.dev/terms.html</loc><lastmod>2026-09-11</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
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

    // 정적 페이지를 가져온 뒤 모든 HTML 페이지 하단에 공통 푸터를 붙입니다.
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get("content-type") || "";

    // HTML이 아니면 원래 응답을 그대로 반환합니다.
    if (!contentType.includes("text/html")) {
      return response;
    }

    const html = await response.text();
    const footer = `
<footer class="mingka-footer">
  <div class="mingka-footer-brand">밍카</div>
  <nav aria-label="사이트 정보">
    <a href="/terms.html">이용약관</a>
    <span> | </span>
    <a href="/privacy.html">개인정보처리방침</a>
    <span> | </span>
    <span>문의하기</span>
  </nav>
  <div class="mingka-footer-copy">© 2026 밍카. All rights reserved.</div>
</footer>
<style>
.mingka-footer{margin-top:40px;padding:28px 20px 34px;border-top:1px solid #eeeaf3;background:#faf9fc;text-align:center;color:#999;font-size:12px;line-height:1.8}
.mingka-footer-brand{margin-bottom:5px;color:#7567e8;font-size:16px;font-weight:900}
.mingka-footer nav{margin-bottom:8px}
.mingka-footer nav a{color:#777;text-decoration:none}
.mingka-footer nav a:hover{text-decoration:underline}
.mingka-footer-copy{color:#aaa;font-size:11px}
</style>`;

    // 기존 페이지의 </body> 직전에 푸터를 삽입합니다.
    const updatedHtml = html.replace(/<\/body>/i, `${footer}\n</body>`);

    return new Response(updatedHtml, {
      status: response.status,
      headers: new Headers(response.headers)
    });
  }
};
