// API endpoint để kiểm tra trạng thái keep-alive service
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Trả về thông tin về service keep-alive
    const status = {
      service: 'Keep-Alive Service',
      description: 'Pings backend every 14 minutes to prevent Render free tier from sleeping',
      backendUrl: 'https://backend-websitebandocongnghe-4rkw.onrender.com',
      pingInterval: '14 minutes',
      healthEndpoint: '/api/health',
      status: 'Running on client-side',
      timestamp: new Date().toISOString(),
      timezone: 'UTC+7'
    };

    res.setHeader('Cache-Control', 'public, max-age=300'); // Cache 5 minutes
    res.status(200).json(status);
  } catch (error) {
    console.error('Error in keep-alive status endpoint:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
