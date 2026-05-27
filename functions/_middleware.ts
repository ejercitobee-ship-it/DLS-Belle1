// Cloudflare Pages Function to inject dynamic canonical URLs and cache busting
// This runs on the edge before the HTML is served

export const onRequestGet: PagesFunction = async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Skip asset files - only process HTML pages
  const isAsset = /\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|json|xml|txt|map|webp)$/i.test(path);
  if (isAsset) {
    const response = await context.next();
    // Add cache-busting headers to assets
    const newHeaders = new Headers(response.headers);
    newHeaders.set('cache-control', 'public, max-age=0, must-revalidate');
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  }
  
  // Get the original response
  const response = await context.next();
  
  // Only process HTML responses
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return response;
  }
  
  // Read the HTML content
  const html = await response.text();
  
  // Build the canonical URL
  const canonicalUrl = `https://dunnluxuryselections.com${path === '/' ? '' : path}`;
  
  // Replace the canonical link tag
  let updatedHtml = html.replace(
    /\<link[^\>]*rel=["']canonical["'][^\>]*href=["'][^"']*["'][^\>]*\/?\>/i,
    `\<link rel="canonical" href="${canonicalUrl}" /\>`
  );
  
  // Also replace og:url
  updatedHtml = updatedHtml.replace(
    /\<meta[^\>]*property=["']og:url["'][^\>]*content=["'][^"']*["'][^\>]*\/?\>/i,
    `\<meta property="og:url" content="${canonicalUrl}" /\>`
  );
  
  // Add cache-busting meta tags
  updatedHtml = updatedHtml.replace(
    /\<head\>/i,
    `\<head\>\n    \<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"\>\n    \<meta http-equiv="Pragma" content="no-cache"\>\n    \<meta http-equiv="Expires" content="0"\>`
  );
  
  // Return the modified response
  const newHeaders = new Headers(response.headers);
  newHeaders.delete('content-length');
  newHeaders.set('cache-control', 'no-cache, no-store, must-revalidate');
  
  return new Response(updatedHtml, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
};
