/**
 * Test Cases cho Rank Math SEO Engine
 * Đảm bảo logic chấm điểm hoạt động chính xác như Rank Math
 */

import { rankMathEngine } from '../utils/seoScoring/rankMathEngine';

// Test data mẫu
const testCases = [
  {
    name: 'Perfect SEO Content',
    description: 'Nội dung tối ưu SEO hoàn hảo',
    data: {
      title: 'iPhone 15 Pro Max chính hãng giá tốt nhất Hà Nội',
      content: `
        <h1>iPhone 15 Pro Max - Điện thoại flagship tốt nhất 2024</h1>
        
        <p>iPhone 15 Pro Max là chiếc điện thoại hàng đầu với nhiều tính năng vượt trội. Với chip A17 Pro mạnh mẽ và camera 48MP chuyên nghiệp, iPhone 15 Pro Max mang đến trải nghiệm tuyệt vời cho người dùng.</p>
        
        <h2>Tính năng nổi bật của iPhone 15 Pro Max</h2>
        
        <p>Điện thoại iPhone 15 Pro Max được trang bị nhiều công nghệ tiên tiến. Camera chính 48MP cho chất lượng ảnh sắc nét, chip A17 Pro xử lý mượt mà mọi tác vụ. iPhone 15 Pro Max cũng có thiết kế titanium cao cấp và màn hình Super Retina XDR 6.7 inch tuyệt đẹp.</p>
        
        <h3>So sánh iPhone 15 Pro Max với các dòng khác</h3>
        
        <p>Khi so sánh với iPhone 14 Pro Max, iPhone 15 Pro Max có nhiều cải tiến đáng kể. Cổng USB-C thay thế Lightning, khung titanium nhẹ hơn, và camera telephoto 5x zoom quang học. Đây là những lý do khiến iPhone 15 Pro Max trở thành lựa chọn hàng đầu.</p>
        
        <p>Để đặt mua iPhone 15 Pro Max, bạn có thể ghé thăm <a href="/cua-hang">cửa hàng của chúng tôi</a> hoặc xem thêm thông tin tại <a href="https://apple.com" target="_blank">trang chính thức Apple</a>.</p>
        
        <img src="/images/iphone-15-pro-max.jpg" alt="iPhone 15 Pro Max chính hãng giá tốt" title="Hình ảnh iPhone 15 Pro Max" />
        <img src="/images/iphone-15-pro-max-features.jpg" alt="Tính năng iPhone 15 Pro Max" title="Các tính năng của iPhone 15 Pro Max" />
      `,
      metaDescription: 'Mua iPhone 15 Pro Max chính hãng với giá tốt nhất. Chip A17 Pro, camera 48MP, màn hình 6.7 inch. Bảo hành chính hãng, giao hàng toàn quốc.',
      url: '/san-pham/iphone-15-pro-max-chinh-hang',
      focusKeyword: 'iPhone 15 Pro Max',
      images: [
        { alt: 'iPhone 15 Pro Max chính hãng giá tốt', title: 'Hình ảnh iPhone 15 Pro Max' },
        { alt: 'Tính năng iPhone 15 Pro Max', title: 'Các tính năng của iPhone 15 Pro Max' }
      ],
      socialData: {
        title: 'iPhone 15 Pro Max chính hãng - Giá tốt nhất',
        description: 'Khám phá iPhone 15 Pro Max với chip A17 Pro',
        image: '/images/iphone-15-social.jpg'
      }
    },
    expectedScore: 85 // Dự kiến đạt mức "great"
  },
  
  {
    name: 'Good SEO Content',
    description: 'Nội dung SEO tốt nhưng chưa hoàn hảo',
    data: {
      title: 'Samsung Galaxy S24 Ultra - Điện thoại cao cấp',
      content: `
        <h1>Samsung Galaxy S24 Ultra Review</h1>
        
        <p>Samsung Galaxy S24 Ultra là flagship mới nhất của Samsung với nhiều tính năng ấn tượng. Máy có camera 200MP và bút S Pen tích hợp.</p>
        
        <h2>Thiết kế và màn hình</h2>
        
        <p>Galaxy S24 Ultra có thiết kế vuông vắn đặc trưng với khung nhôm cao cấp. Màn hình Dynamic AMOLED 2X 6.8 inch hiển thị sắc nét.</p>
        
        <p>Để tìm hiểu thêm, bạn có thể xem <a href="https://samsung.com" target="_blank">trang chính thức Samsung</a>.</p>
        
        <img src="/images/galaxy-s24.jpg" alt="Samsung Galaxy S24 Ultra" />
      `,
      metaDescription: 'Samsung Galaxy S24 Ultra với camera 200MP và S Pen. Thiết kế cao cấp, hiệu năng mạnh mẽ.',
      url: '/dien-thoai/samsung-galaxy-s24-ultra',
      focusKeyword: 'Samsung Galaxy S24 Ultra',
      images: [
        { alt: 'Samsung Galaxy S24 Ultra', title: '' }
      ],
      socialData: {
        title: 'Samsung Galaxy S24 Ultra Review',
        description: '',
        image: ''
      }
    },
    expectedScore: 65 // Dự kiến đạt mức "good"
  },
  
  {
    name: 'Poor SEO Content',
    description: 'Nội dung SEO kém, nhiều vấn đề cần cải thiện',
    data: {
      title: 'Điện thoại mới',
      content: `
        <p>Đây là điện thoại mới. Nó rất tốt và đẹp. Mọi người nên mua.</p>
        
        <p>Giá cả phải chăng.</p>
      `,
      metaDescription: '',
      url: '/product123',
      focusKeyword: 'điện thoại Xiaomi',
      images: [],
      socialData: {}
    },
    expectedScore: 25 // Dự kiến đạt mức "bad"
  },
  
  {
    name: 'No Keyword Content',
    description: 'Nội dung không có từ khóa chính',
    data: {
      title: 'Bài viết hay về công nghệ',
      content: `
        <h1>Công nghệ hiện đại</h1>
        <p>Công nghệ đang phát triển rất nhanh...</p>
      `,
      metaDescription: 'Bài viết về công nghệ hiện đại',
      url: '/bai-viet/cong-nghe',
      focusKeyword: '',
      images: [],
      socialData: {}
    },
    expectedScore: 0 // Dự kiến đạt mức "unknown"
  }
];

/**
 * Chạy test cases
 */
export const runSEOTests = () => {
  console.log('🚀 Bắt đầu test Rank Math SEO Engine...\n');
  
  const results = testCases.map(testCase => {
    console.log(`📝 Test: ${testCase.name}`);
    console.log(`📄 Mô tả: ${testCase.description}`);
    
    const analysis = rankMathEngine.analyzeSEO(testCase.data);
    const passed = Math.abs(analysis.score - testCase.expectedScore) <= 10; // Cho phép sai lệch 10 điểm
    
    console.log(`📊 Điểm số: ${analysis.score}/100 (${analysis.rating})`);
    console.log(`🎯 Dự kiến: ${testCase.expectedScore}/100`);
    console.log(`✅ Kết quả: ${passed ? 'PASS' : 'FAIL'}`);
    
    if (analysis.suggestions.length > 0) {
      console.log(`💡 Gợi ý cải thiện:`);
      analysis.suggestions.slice(0, 3).forEach((suggestion, index) => {
        console.log(`   ${index + 1}. ${suggestion}`);
      });
    }
    
    console.log('─'.repeat(50));
    
    return {
      testCase: testCase.name,
      score: analysis.score,
      rating: analysis.rating,
      expected: testCase.expectedScore,
      passed,
      analysis
    };
  });
  
  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;
  
  console.log(`\n🏁 Kết quả tổng kết:`);
  console.log(`✅ Đã pass: ${passedTests}/${totalTests} tests`);
  console.log(`📈 Tỷ lệ thành công: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  return results;
};

/**
 * Test specific functionality
 */
export const testSpecificFeatures = () => {
  console.log('\n🔧 Test các tính năng cụ thể...\n');
  
  // Test keyword density calculation
  const testContent = 'iPhone 15 Pro Max là điện thoại tốt. iPhone 15 Pro Max có camera đẹp. Mua iPhone 15 Pro Max ngay.';
  const keywordCount = rankMathEngine.countKeywordOccurrences(testContent, 'iPhone 15 Pro Max');
  const wordCount = rankMathEngine.countWords(testContent);
  const density = ((keywordCount / wordCount) * 100).toFixed(1);
  
  console.log(`📊 Test Keyword Density:`);
  console.log(`   Nội dung: "${testContent}"`);
  console.log(`   Từ khóa: "iPhone 15 Pro Max"`);
  console.log(`   Số từ: ${wordCount}`);
  console.log(`   Xuất hiện: ${keywordCount} lần`);
  console.log(`   Mật độ: ${density}%`);
  
  // Test rating thresholds
  console.log(`\n🎯 Test Rating Thresholds:`);
  [0, 25, 50, 70, 85, 100].forEach(score => {
    const rating = rankMathEngine.getRating(score);
    console.log(`   ${score} điểm → ${rating}`);
  });
  
  console.log('─'.repeat(50));
};

/**
 * Performance test
 */
export const testPerformance = () => {
  console.log('\n⚡ Test Performance...\n');
  
  const largeContent = {
    title: 'iPhone 15 Pro Max chính hãng giá tốt nhất Hà Nội TPHCM',
    content: `<h1>iPhone 15 Pro Max</h1>` + '<p>iPhone 15 Pro Max là điện thoại tốt nhất. '.repeat(1000) + '</p>',
    metaDescription: 'Mua iPhone 15 Pro Max chính hãng với giá tốt nhất tại Hà Nội và TPHCM. Bảo hành chính hãng 12 tháng.',
    url: '/san-pham/iphone-15-pro-max-chinh-hang-gia-tot',
    focusKeyword: 'iPhone 15 Pro Max',
    images: Array(50).fill().map((_, i) => ({ alt: `iPhone 15 Pro Max image ${i}`, title: `Image ${i}` })),
    socialData: {
      title: 'iPhone 15 Pro Max chính hãng',
      description: 'Điện thoại iPhone 15 Pro Max tốt nhất',
      image: '/images/iphone.jpg'
    }
  };
  
  const startTime = performance.now();
  const analysis = rankMathEngine.analyzeSEO(largeContent);
  const endTime = performance.now();
  
  console.log(`⏱️  Thời gian phân tích: ${(endTime - startTime).toFixed(2)}ms`);
  console.log(`📊 Điểm số: ${analysis.score}/100`);
  console.log(`📈 Rating: ${analysis.rating}`);
  console.log(`🔍 Số lượng test: ${Object.keys(analysis.results).length}`);
  
  console.log('─'.repeat(50));
};

// Export để sử dụng trong console hoặc components khác
export { testCases, rankMathEngine };

// Auto-run tests khi import (có thể comment lại nếu không muốn)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Chỉ chạy khi đang ở môi trường development
  setTimeout(() => {
    console.log('🧪 Auto-running SEO Engine Tests...');
    runSEOTests();
    testSpecificFeatures();
    testPerformance();
  }, 1000);
}