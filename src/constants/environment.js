export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Frontend public URL - có thể cấu hình theo environment
export const FRONTEND_PUBLIC_URL = import.meta.env.VITE_FRONTEND_PUBLIC_URL || 'http://localhost:9999';

// Helper function để tạo URL xem bài viết
export const getArticleViewUrl = (slug) => `${FRONTEND_PUBLIC_URL}/tin-tuc/${slug}`;

// Helper function để kiểm tra xem link có phải internal không
export const isInternalLink = (url) => {
  if (!url) return false;
  
  // Loại bỏ protocol để so sánh
  const cleanUrl = url.replace(/^https?:\/\//, '');
  const cleanFrontendUrl = FRONTEND_PUBLIC_URL.replace(/^https?:\/\//, '');
  
  // Kiểm tra relative links (bắt đầu với /, không phải //, không có protocol)
  if (url.startsWith('/') && !url.startsWith('//')) {
    return true;
  }
  
  // Kiểm tra absolute links cùng domain
  if (cleanUrl.startsWith(cleanFrontendUrl)) {
    return true;
  }
  
  return false;
};
