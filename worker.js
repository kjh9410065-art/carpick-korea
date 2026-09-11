// MINGKA_SEO_DOMAIN_V6
// 새 공식 도메인(mingka.tcflick.com)을 기준으로 robots/sitemap과 HTML의 SEO 주소를 통일합니다.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 예전 workers.dev 주소로 들어온 방문자는 새 공식 도메인으로 안내합니다.
    if (url.hostname === "carpick-korea.carpick.workers.dev") {
      const newUrl = `https://mingka.tcflick.com${url.pathname}${url.search}`;
      return Response.redirect(newUrl, 301);
    }

    // 네이버(Yeti)와 일반 검색로봇 모두 사이트 전체 수집을 허용합니다.
    if (url.pathname === "/robots.txt") {
      const robots =
        "User-agent: Yeti\nAllow: /\n\n" +
        "User-agent: *\nAllow: /\n\n" +
        "Sitemap: https://mingka.tcflick.com/sitemap.xml\n";

      return new Response(robots, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=UTF-8",
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"
        }
      });
    }

    // 사이트맵의 모든 주소를 새 공식 도메인으로 통일합니다.
    if (url.pathname === "/sitemap.xml") {
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://mingka.tcflick.com/</loc><lastmod>2026-09-11</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
<url><loc>https://mingka.tcflick.com/long-term-rental-vs-lease.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://mingka.tcflick.com/car-purchase-vs-rental.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://mingka.tcflick.com/long-term-rental-guide.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://mingka.tcflick.com/car-lease-guide.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://mingka.tcflick.com/long-term-rental-cost-guide.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://mingka.tcflick.com/car-buying-checklist.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://mingka.tcflick.com/lease-contract-checklist.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://mingka.tcflick.com/privacy.html</loc><lastmod>2026-09-11</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
<url><loc>https://mingka.tcflick.com/terms.html</loc><lastmod>2026-09-11</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
<url><loc>https://mingka.tcflick.com/affiliate.html</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
</urlset>`;

      return new Response(sitemap, {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=UTF-8",
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"
        }
      });
    }

    // 정적 페이지를 가져온 뒤 HTML 안에 남아 있는 예전 도메인을 새 도메인으로 바꿉니다.
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get("content-type") || "";

    // HTML이 아니면 원래 응답을 그대로 반환합니다.
    if (!contentType.includes("text/html")) {
      return response;
    }

    let html = await response.text();

    // canonical, OG URL 등 HTML에 직접 적힌 예전 도메인을 일괄 교체합니다.
    html = html.replaceAll(
      "https://carpick-korea.carpick.workers.dev",
      "https://mingka.tcflick.com"
    );

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

    // HTML 본문을 수정했으므로 오래된 Content-Length 헤더는 제거합니다.
    const headers = new Headers(response.headers);
    headers.delete("content-length");

    return new Response(updatedHtml, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
