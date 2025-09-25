// utils/slugify.js
export const slugify = (str) => {
  if (!str) return '';
  
  return str
    .toString()
    .normalize('NFKD')           // Unicode normalization
    .toLowerCase()               // chuyển thành chữ thường
    .trim()                      // bỏ khoảng trắng đầu cuối
    .replace(/\s+/g, '-')        // khoảng trắng → dấu gạch ngang
    .replace(/[^\w\-]+/g, '')    // bỏ ký tự không phải chữ/số/gạch ngang
    .replace(/\-\-+/g, '-')      // gộp nhiều gạch ngang thành một
    .replace(/^-+/, '')          // bỏ gạch ngang ở đầu
    .replace(/-+$/, '');         // bỏ gạch ngang ở cuối
};

// Utility để tạo slug từ tiếng Việt
export const vietnameseSlugify = (str) => {
  if (!str) return '';
  
  // Bảng chuyển đổi ký tự tiếng Việt
  const vietnameseMap = {
    'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
    'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
    'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
    'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
    'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
    'đ': 'd'
  };
  
  // Chuyển đổi ký tự tiếng Việt
  let result = str.toLowerCase();
  Object.keys(vietnameseMap).forEach(key => {
    result = result.replace(new RegExp(key, 'g'), vietnameseMap[key]);
  });
  
  return slugify(result);
};

// Alias functions để tương thích với import cũ
export const generateSlug = (str) => vietnameseSlugify(str);

// Hàm validate slug với thông tin chi tiết (integrated from EditSlugDialog)
export const validateSlug = (slug) => {
  if (!slug || !slug.trim()) {
    return {
      isValid: false,
      message: 'Slug không được để trống'
    };
  }
  
  if (slug.length < 3) {
    return {
      isValid: false,
      message: 'Slug phải có ít nhất 3 ký tự'
    };
  }
  
  // Kiểm tra slug có hợp lệ không (chỉ chứa chữ, số, dấu gạch ngang)
  const validSlugRegex = /^[a-z0-9-]+$/;
  if (!validSlugRegex.test(slug)) {
    return {
      isValid: false,
      message: 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang'
    };
  }
  
  if (slug.startsWith('-') || slug.endsWith('-')) {
    return {
      isValid: false,
      message: 'Slug không được bắt đầu hoặc kết thúc bằng dấu gạch ngang'
    };
  }
  
  if (slug.includes('--')) {
    return {
      isValid: false,
      message: 'Slug không được có nhiều dấu gạch ngang liên tiếp'
    };
  }
  
  return {
    isValid: true,
    message: '✅ Slug hợp lệ'
  };
};

// Hàm tự động tạo slug từ title
export const autoGenerateSlug = (title, currentSlug = '', isManuallyEdited = false) => {
  if (!title) return '';
  
  // Nếu slug đã được chỉnh sửa thủ công, không tự động generate
  if (isManuallyEdited && currentSlug) {
    return currentSlug;
  }
  
  // Nếu chưa có slug hoặc chưa được chỉnh sửa, generate mới
  return generateSlug(title);
};

// Export default để tương thích
export default slugify;