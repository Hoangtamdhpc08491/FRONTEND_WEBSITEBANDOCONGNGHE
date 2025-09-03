import { useState, useEffect } from 'react';
import keepAliveService from '@/services/keepAliveService';

const KeepAliveMonitor = () => {
  const [status, setStatus] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Chỉ hiển thị trong development hoặc khi có flag debug
    const shouldShow = 
      !import.meta.env.PROD || 
      import.meta.env.VITE_DEBUG_KEEP_ALIVE === 'true';

    setIsVisible(shouldShow);

    if (shouldShow) {
      const updateStatus = () => {
        setStatus(keepAliveService.getStatus());
      };

      // Cập nhật trạng thái ngay lập tức
      updateStatus();

      // Cập nhật trạng thái mỗi 30 giây
      const interval = setInterval(updateStatus, 30000);

      return () => clearInterval(interval);
    }
  }, []);

  if (!isVisible || !status) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px',
        fontFamily: 'monospace'
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
        🚀 Keep-Alive Monitor
      </div>
      <div>Status: {status.isActive ? '✅ Active' : '❌ Inactive'}</div>
      <div>Backend: {status.backendUrl}</div>
      <div>Interval: {Math.round(status.pingInterval / 60000)}min</div>
      <div>Retries: {status.retryCount}/3</div>
      <div style={{ marginTop: '5px', fontSize: '10px', opacity: 0.7 }}>
        Last update: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default KeepAliveMonitor;
