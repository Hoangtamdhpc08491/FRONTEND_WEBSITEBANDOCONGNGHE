export default async function handler(req, res) {
  try {
    // Fetch robots.txt từ backend
    const response = await fetch('https://backend-websitebandocongnghe-4rkw.onrender.com/robots.txt');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const robotsContent = await response.text();
    
    // Set headers
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    
    // Return the robots.txt content
    res.status(200).send(robotsContent);
  } catch (error) {
    console.error('Error fetching robots.txt:', error);
    
    // Fallback robots.txt nếu backend không available
    const fallbackRobots = `User-agent: *
Allow: /

# SEO-friendly URLs - Allow crawling
Allow: /san-pham/
Allow: /danh-muc/
Allow: /tin-tuc/
Allow: /lien-he/
Allow: /gioi-thieu/

# Disallow admin pages
Disallow: /admin/
Disallow: /api/

Sitemap: https://frontend-websitebandocongnghe-xi.vercel.app/sitemap.xml`;
    
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(fallbackRobots);
  }
}
