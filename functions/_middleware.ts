// Cloudflare Pages Function to inject dynamic canonical URLs
// This runs on the edge before the HTML is served

export const onRequestGet: PagesFunction = async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Skip asset files - only process HTML pages
  const isAsset = /\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|json|xml|txt|map|webp)$/i.test(path);
  if (isAsset) {
    return context.next();
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
    /\u003clink[^\u003e]*rel=["']canonical["'][^\u003e]*href=["'][^"']*["'][^\u003e]*\/?\u003e/gi,
    `\u003clink rel="canonical" href="${canonicalUrl}" /\u003e`
  );
  
  // Also replace og:url
  updatedHtml = updatedHtml.replace(
    /\u003cmeta[^\u003e]*property=["']og:url["'][^\u003e]*content=["'][^"']*["'][^\u003e]*\/?\u003e/gi,
    `\u003cmeta property="og:url" content="${canonicalUrl}" /\u003e`
  );
  
  // Return the modified response with proper headers
  const newHeaders = new Headers(response.headers);
  newHeaders.delete('content-length');
  newHeaders.set('cache-control', 'public, max-age=0, must-revalidate');
  
  return new Response(updatedHtml, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
};
