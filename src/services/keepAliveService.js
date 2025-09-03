// Service để giữ backend luôn hoạt động bằng cách ping định kỳ
class KeepAliveService {
  constructor() {
    this.backendUrl = import.meta.env.VITE_API_BASE_URL || 'https://backend-websitebandocongnghe-4rkw.onrender.com';
    this.pingInterval = 14 * 60 * 1000; // 14 phút (trước khi Render tắt server sau 15 phút)
    this.healthEndpoint = '/api/health'; // endpoint health check
    this.intervalId = null;
    this.isActive = false;
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  // Bắt đầu ping backend
  start() {
    if (this.isActive) {
      console.log('Keep-alive service already running');
      return;
    }

    this.isActive = true;
    console.log('🚀 Starting backend keep-alive service...');
    
    // Ping ngay lập tức
    this.pingBackend();
    
    // Thiết lập ping định kỳ
    this.intervalId = setInterval(() => {
      this.pingBackend();
    }, this.pingInterval);
  }

  // Dừng ping backend
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isActive = false;
    console.log('🛑 Backend keep-alive service stopped');
  }

  // Ping backend để giữ server hoạt động
  async pingBackend() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      console.log('🏓 Pinging backend to keep alive...');
      
      const response = await fetch(`${this.backendUrl}${this.healthEndpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        console.log('✅ Backend ping successful');
        this.retryCount = 0; // Reset retry count on success
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.warn('⚠️ Backend ping failed:', error.message);
      
      // Retry logic
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`🔄 Retrying... (${this.retryCount}/${this.maxRetries})`);
        
        // Retry sau 30 giây
        setTimeout(() => {
          this.pingBackend();
        }, 30000);
      } else {
        console.error('❌ Max retries reached. Backend might be down.');
        this.retryCount = 0; // Reset for next interval
      }
    }
  }

  // Kiểm tra trạng thái
  getStatus() {
    return {
      isActive: this.isActive,
      pingInterval: this.pingInterval,
      backendUrl: this.backendUrl,
      retryCount: this.retryCount
    };
  }

  // Cập nhật cấu hình
  updateConfig(config) {
    if (config.backendUrl) {
      this.backendUrl = config.backendUrl;
    }
    if (config.pingInterval) {
      this.pingInterval = config.pingInterval;
      // Restart nếu đang chạy
      if (this.isActive) {
        this.stop();
        this.start();
      }
    }
    if (config.healthEndpoint) {
      this.healthEndpoint = config.healthEndpoint;
    }
  }
}

// Tạo instance duy nhất
const keepAliveService = new KeepAliveService();

// Export để sử dụng trong app
export default keepAliveService;
