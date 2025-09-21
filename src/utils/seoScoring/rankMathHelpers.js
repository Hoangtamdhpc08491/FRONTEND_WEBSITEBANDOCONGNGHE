/**
 * Utilities để hỗ trợ hiển thị SEO Score giống Rank Math
 */

/**
 * Lấy màu sắc dựa trên rating
 * @param {string} rating - Rating từ engine ('great', 'good', 'bad', 'unknown')
 * @returns {Object} - Object chứa các màu cần thiết
 */
export const getRatingColors = (rating) => {
  switch (rating) {
    case 'great':
      return {
        primary: '#4CAF50',
        gradient: 'linear-gradient(135deg, #99d484 0%, #83c97f 100%)',
        shadow: '1px 1px 1px #5ba857',
        light: '#E8F5E8',
        text: '#2E7D32'
      };
    case 'good':
      return {
        primary: '#FF9800',
        gradient: 'linear-gradient(135deg, #fdd07a 0%, #fcbe6c 100%)',
        shadow: '1px 1px 1px #efb463',
        light: '#FFF8E1',
        text: '#F57C00'
      };
    case 'bad':
      return {
        primary: '#f44336',
        gradient: 'linear-gradient(135deg, #f8b0a2 0%, #f1938c 100%)',
        shadow: '1px 1px 1px #e48982',
        light: '#FFEBEE',
        text: '#D32F2F'
      };
    default: // unknown
      return {
        primary: '#9E9E9E',
        gradient: 'linear-gradient(135deg, #b9b9b9 0%, #989898 100%)',
        shadow: '1px 1px 1px #bbb',
        light: '#F5F5F5',
        text: '#616161'
      };
  }
};

/**
 * Lấy text hiển thị dựa trên rating
 * @param {string} rating - Rating từ engine
 * @returns {string} - Text hiển thị
 */
export const getRatingText = (rating) => {
  switch (rating) {
    case 'great':
      return 'Xuất sắc';
    case 'good':
      return 'Tốt';
    case 'bad':
      return 'Cần cải thiện';
    default:
      return 'Chưa đánh giá';
  }
};

/**
 * Lấy mô tả chi tiết dựa trên rating
 * @param {string} rating - Rating từ engine
 * @returns {string} - Mô tả chi tiết
 */
export const getRatingDescription = (rating) => {
  switch (rating) {
    case 'great':
      return 'Nội dung của bạn đạt tiêu chuẩn SEO rất tốt. Tiếp tục duy trì chất lượng này!';
    case 'good':
      return 'Nội dung đạt tiêu chuẩn SEO khá tốt. Hãy cải thiện thêm một số điểm để đạt mức xuất sắc.';
    case 'bad':
      return 'Nội dung cần cải thiện đáng kể về SEO. Hãy theo dõi các gợi ý để tối ưu hóa.';
    default:
      return 'Chưa có đủ thông tin để đánh giá. Hãy thêm từ khóa chính và nội dung.';
  }
};

/**
 * Lấy severity cho Alert component dựa trên rating
 * @param {string} rating - Rating từ engine
 * @returns {string} - Severity cho Alert
 */
export const getRatingAlertSeverity = (rating) => {
  switch (rating) {
    case 'great':
      return 'success';
    case 'good':
      return 'warning';
    case 'bad':
      return 'error';
    default:
      return 'info';
  }
};

/**
 * Lấy icon dựa trên rating
 * @param {string} rating - Rating từ engine
 * @returns {string} - Emoji icon
 */
export const getRatingIcon = (rating) => {
  switch (rating) {
    case 'great':
      return '🏆';
    case 'good':
      return '👍';
    case 'bad':
      return '⚠️';
    default:
      return '❓';
  }
};

/**
 * Lấy màu sắc cho status của test
 * @param {string} status - Status từ test result ('ok', 'warning', 'fail', 'info')
 * @returns {Object} - Object chứa các màu cần thiết
 */
export const getTestStatusColors = (status) => {
  switch (status) {
    case 'ok':
      return {
        primary: '#4CAF50',
        light: '#E8F5E8',
        text: '#2E7D32',
        icon: '✅'
      };
    case 'warning':
      return {
        primary: '#FF9800',
        light: '#FFF8E1',
        text: '#F57C00',
        icon: '⚠️'
      };
    case 'fail':
      return {
        primary: '#f44336',
        light: '#FFEBEE',
        text: '#D32F2F',
        icon: '❌'
      };
    default: // info
      return {
        primary: '#2196F3',
        light: '#E3F2FD',
        text: '#1976D2',
        icon: 'ℹ️'
      };
  }
};

/**
 * Lấy text hiển thị cho status
 * @param {string} status - Status từ test result
 * @returns {string} - Text hiển thị
 */
export const getTestStatusText = (status) => {
  switch (status) {
    case 'ok':
      return 'Đạt';
    case 'warning':
      return 'Cảnh báo';
    case 'fail':
      return 'Không đạt';
    default:
      return 'Thông tin';
  }
};

/**
 * Tính phần trăm cho progress bar
 * @param {number} score - Điểm hiện tại
 * @param {number} maxScore - Điểm tối đa
 * @returns {number} - Phần trăm (0-100)
 */
export const calculateProgress = (score, maxScore) => {
  if (maxScore === 0) return 0;
  return Math.min(100, Math.max(0, (score / maxScore) * 100));
};

/**
 * Format số điểm cho hiển thị
 * @param {number} score - Điểm số
 * @returns {string} - Điểm số đã format
 */
export const formatScore = (score) => {
  return Math.round(score).toString();
};

/**
 * Lấy class CSS cho Rank Math score circle
 * @param {string} rating - Rating từ engine
 * @returns {string} - Class name
 */
export const getRankMathScoreClass = (rating) => {
  return `rank-math-seo-score ${rating}-seo`;
};

/**
 * Tạo style object cho score circle
 * @param {string} rating - Rating từ engine
 * @param {number} size - Kích thước circle (px)
 * @returns {Object} - Style object
 */
export const getScoreCircleStyle = (rating, size = 96) => {
  const colors = getRatingColors(rating);
  
  return {
    position: 'relative',
    display: 'inline-block',
    height: size,
    width: size,
    textAlign: 'center',
    color: '#fff',
    borderRadius: '50%',
    background: colors.gradient,
    boxShadow: colors.shadow,
    fontFamily: 'sans-serif'
  };
};

/**
 * Lấy gợi ý cải thiện dựa trên rating và score
 * @param {string} rating - Rating từ engine
 * @param {number} score - Điểm số
 * @returns {Array} - Mảng gợi ý
 */
export const getImprovementTips = (rating, score) => {
  const tips = [];
  
  if (score < 50) {
    tips.push('Hãy thêm từ khóa chính vào tiêu đề và nội dung');
    tips.push('Viết meta description hấp dẫn (120-160 ký tự)');
    tips.push('Tăng độ dài nội dung (tối thiểu 300 từ)');
    tips.push('Thêm từ khóa vào URL và alt text của hình ảnh');
  } else if (score < 70) {
    tips.push('Tối ưu mật độ từ khóa (0.5-2.5%)');
    tips.push('Thêm liên kết nội bộ và ngoại');
    tips.push('Sử dụng từ khóa trong tiêu đề phụ (H2, H3)');
    tips.push('Cải thiện cấu trúc nội dung');
  } else if (score < 81) {
    tips.push('Hoàn thiện thông tin mạng xã hội');
    tips.push('Tối ưu hóa hình ảnh với alt text tốt hơn');
    tips.push('Thêm schema markup');
    tips.push('Kiểm tra và cải thiện tốc độ tải trang');
  } else {
    tips.push('Tiếp tục theo dõi và duy trì chất lượng SEO');
    tips.push('Cập nhật nội dung thường xuyên');
    tips.push('Theo dõi thống kê và điều chỉnh khi cần');
  }
  
  return tips;
};

/**
 * Lấy danh sách test quan trọng nhất cần ưu tiên
 * @param {Object} results - Kết quả phân tích từ engine
 * @returns {Array} - Mảng test cần ưu tiên
 */
export const getPriorityTests = (results) => {
  const priorityOrder = [
    'titleInSEO',
    'metaDescription', 
    'contentLength',
    'keywordDensity',
    'titleLength',
    'metaDescriptionLength',
    'keywordInFirstParagraph',
    'urlKeyword'
  ];
  
  const failedTests = [];
  const warningTests = [];
  
  priorityOrder.forEach(testName => {
    const result = results[testName];
    if (result) {
      if (result.status === 'fail') {
        failedTests.push({ test: testName, result });
      } else if (result.status === 'warning') {
        warningTests.push({ test: testName, result });
      }
    }
  });
  
  return [...failedTests, ...warningTests].slice(0, 5);
};

export default {
  getRatingColors,
  getRatingText,
  getRatingDescription,
  getRatingAlertSeverity,
  getRatingIcon,
  getTestStatusColors,
  getTestStatusText,
  calculateProgress,
  formatScore,
  getRankMathScoreClass,
  getScoreCircleStyle,
  getImprovementTips,
  getPriorityTests
};