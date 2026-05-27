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
  
  // Clone the response to check content type without consuming the body
  const contentType = response.headers.get('content-type') || '';
  
  // Only process HTML responses
  if (!contentType.includes('text/html')) {
    return response;
  }
  
  // Read the HTML content
  const html = await response.text();
  
  // Build the canonical URL
  const canonicalUrl = `https://dunnluxuryselections.com${path === '/' ? '' : path}`;
  
  // Replace the canonical link tag - handle both self-closing and regular formats
  let updatedHtml = html.replace(
    /<link[^>]*rel=["']canonical["'][^>]*href=["'][^"']*["'][^>]*\/?>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );
  
  // Also replace og:url
  updatedHtml = updatedHtml.replace(
    /<meta[^>]*property=["']og:url["'][^>]*content=["'][^"']*["'][^>]*\/?>/i,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );
  
  // Return the modified response with original headers (except content-length which will change)
  const newHeaders = new Headers(response.headers);
  newHeaders.delete('content-length'); // Remove content-length as we're modifying the body
  newHeaders.set('cache-control', 'public, max-age=0, must-revalidate');
  
  return new Response(updatedHtml, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
};
