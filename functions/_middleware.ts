// Cloudflare Pages Function to inject dynamic canonical URLs
// This runs on the edge before the HTML is served

export const onRequestGet: PagesFunction = async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Fetch the original HTML
  const response = await context.next();
  const html = await response.text();
  
  // Build the canonical URL
  const canonicalUrl = `https://dunnluxuryselections.com${path === '/' ? '' : path}`;
  
  // Replace the canonical link tag
  const updatedHtml = html
    .replace(
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${canonicalUrl}" />`
    )
    .replace(
      /<meta property="og:url" content="[^"]*" \/>/,
      `<meta property="og:url" content="${canonicalUrl}" />`
    );
  
  return new Response(updatedHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
};
