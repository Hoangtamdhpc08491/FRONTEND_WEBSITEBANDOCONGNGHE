/**
 * Rank Math SEO Scoring Engine
 * Tái tạo logic chấm điểm SEO giống hệt Rank Math Demo
 */

class RankMathSEOEngine {
  constructor() {
    // Rank Math Categories với trọng số thực tế
    this.categories = {
      basicSEO: {
        name: 'Basic SEO',
        maxScore: 35, // Tổng điểm tối đa cho Basic SEO
        tests: {
          'focusKeywordInTitle': { weight: 8, maxScore: 8 },
          'focusKeywordInMetaDescription': { weight: 6, maxScore: 6 }, 
          'focusKeywordInURL': { weight: 5, maxScore: 5 },
          'focusKeywordAtBeginning': { weight: 6, maxScore: 6 },
          'focusKeywordInContent': { weight: 5, maxScore: 5 },
          'contentLength': { weight: 5, maxScore: 5 }
        }
      },
      additional: {
        name: 'Additional',
        maxScore: 40, // Tổng điểm tối đa cho Additional
        tests: {
          'focusKeywordInSubheadings': { weight: 6, maxScore: 6 },
          'imageWithFocusKeyword': { weight: 4, maxScore: 6 }, // Có thể đạt 2-6 điểm tùy số ảnh
          'keywordDensity': { weight: 5, maxScore: 5 },
          'urlLength': { weight: 3, maxScore: 3 },
          'externalLinks': { weight: 3, maxScore: 5 }, // 1-5 điểm tùy số link
          'doFollowLinks': { weight: 3, maxScore: 4 },
          'internalLinks': { weight: 4, maxScore: 6 }, // 2-6 điểm tùy số link
          'focusKeywordSet': { weight: 3, maxScore: 3 },
          'contentAI': { weight: 2, maxScore: 2 }
        }
      },
      titleReadability: {
        name: 'Title Readability',
        maxScore: 15, // Tổng điểm tối đa cho Title Readability
        tests: {
          'focusKeywordNearBeginning': { weight: 4, maxScore: 4 },
          'titleSentiment': { weight: 4, maxScore: 4 },
          'titlePowerWords': { weight: 4, maxScore: 4 },
          'titleHasNumber': { weight: 3, maxScore: 3 }
        }
      },
      contentReadability: {
        name: 'Content Readability',
        maxScore: 10, // Tổng điểm tối đa cho Content Readability
        tests: {
          'tableOfContents': { weight: 3, maxScore: 3 },
          'shortParagraphs': { weight: 4, maxScore: 4 },
          'contentAssets': { weight: 3, maxScore: 5 } // 1-5 điểm tùy số media
        }
      }
    };

    // Messages giống Rank Math Demo
    this.messages = {
      // Basic SEO
      focusKeywordInTitle: 'Add Focus Keyword to the SEO title.',
      focusKeywordInMetaDescription: 'Add Focus Keyword to your SEO Meta Description.',
      focusKeywordInURL: 'Use Focus Keyword in the URL.',
      focusKeywordAtBeginning: 'Use Focus Keyword at the beginning of your content.',
      focusKeywordInContent: 'Use Focus Keyword in the content.',
      contentLength: 'Content should be 600-2500 words long.',
      
      // Additional
      focusKeywordInSubheadings: 'Use Focus Keyword in subheading(s) like H2, H3, H4, etc..',
      imageWithFocusKeyword: 'Add an image with your Focus Keyword as alt text.',
      keywordDensity: 'Keyword Density is 0. Aim for around 1% Keyword Density.',
      urlLength: 'URL is 28 characters long. Kudos!',
      externalLinks: 'Link out to external resources.',
      doFollowLinks: 'Add DoFollow links pointing to external resources.',
      internalLinks: 'Add internal links in your content.',
      focusKeywordSet: 'Set a Focus Keyword for this content.',
      contentAI: 'You are using Content AI to optimise this Post.',
      
      // Title Readability
      focusKeywordNearBeginning: 'Use the Focus Keyword near the beginning of SEO title.',
      titleSentiment: 'Titles with positive or negative sentiment work best for higher CTR.',
      titlePowerWords: 'Add power words to your title to increase CTR.',
      titleHasNumber: 'Add a number to your title to improve CTR.',
      
      // Content Readability
      tableOfContents: 'Use Table of Content to break-down your text.',
      shortParagraphs: 'Add short and concise paragraphs for better readability and UX.',
      contentAssets: 'Add a few images and/or videos to make your content appealing.'
    };

    // Tổng điểm tối đa = 100
    this.totalMaxScore = Object.values(this.categories)
      .reduce((total, category) => total + category.maxScore, 0);
  }

  /**
   * Phân tích SEO theo chuẩn Rank Math với trọng số thực tế
   */
  analyzeSEO(data) {
    const {
      title = '',
      content = '',
      metaDescription = '',
      url = '',
      focusKeyword = '',
      images = [],
      socialData = {}
    } = data;

    const keyword = focusKeyword.toLowerCase().trim();
    const results = {};
    const errors = {};
    const categoryScores = {};
    
    // Thực hiện tất cả tests với trọng số
    Object.keys(this.categories).forEach(categoryKey => {
      const category = this.categories[categoryKey];
      errors[categoryKey] = [];
      categoryScores[categoryKey] = 0;
      
      category.tests.forEach(testName => {
        const testConfig = this.testConfigs[testName];
        const testResult = this.runTest(testName, {
          title, content, metaDescription, url, keyword, images, socialData
        });
        
        // Tính điểm thực tế dựa trên kết quả và trọng số
        const actualScore = this.calculateTestScore(testResult, testConfig, {
          title, content, metaDescription, url, keyword, images, socialData
        });
        
        results[testName] = {
          ...testResult,
          score: actualScore,
          maxScore: testConfig.maxScore,
          weight: testConfig.weight
        };
        
        categoryScores[categoryKey] += actualScore;
        
        // Nếu test fail hoặc không đạt điểm tối đa -> thêm vào errors
        if (actualScore < testConfig.maxScore) {
          errors[categoryKey].push({
            test: testName,
            message: this.messages[testName] || testResult.message,
            score: actualScore,
            maxScore: testConfig.maxScore
          });
        }
      });
    });

    // Tính điểm tổng
    const totalScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0);
    
    // Tính summary cho từng category
    const categorySummaries = {};
    Object.keys(this.categories).forEach(categoryKey => {
      const category = this.categories[categoryKey];
      categorySummaries[categoryKey] = {
        name: category.name,
        score: categoryScores[categoryKey],
        maxScore: category.maxScore,
        errors: errors[categoryKey],
        passed: category.tests.length - errors[categoryKey].length,
        failed: errors[categoryKey].length
      };
    });

    return {
      totalScore: Math.round(totalScore),
      maxScore: this.totalMaxScore,
      percentage: Math.round((totalScore / this.totalMaxScore) * 100),
      results,
      errors,
      categorySummaries,
      categoryScores,
      // Backward compatibility
      summary: categorySummaries,
      stats: this.generateStats(title, content, keyword)
    };
  }

  /**
   * Tính điểm thực tế cho test dựa trên mức độ hoàn thành
   */
  calculateTestScore(testResult, testConfig, data) {
    const { title, content, metaDescription, url, keyword, images } = data;
    const { maxScore } = testConfig;
    
    // Nếu test hoàn toàn fail
    if (!testResult.passed) {
      return 0;
    }
    
    // Các test có điểm số linh hoạt theo số lượng/chất lượng
    switch (testResult.testName || '') {
      case 'imageWithFocusKeyword':
        // 2 điểm cho 1 ảnh, 4 điểm cho 2-3 ảnh, 6 điểm cho 4+ ảnh có keyword
        const keywordImages = images.filter(img => 
          img.alt && img.alt.toLowerCase().includes(keyword.toLowerCase())
        ).length;
        if (keywordImages >= 4) return 6;
        if (keywordImages >= 2) return 4;
        if (keywordImages >= 1) return 2;
        return 0;
        
      case 'externalLinks':
        // 1-5 điểm tùy số external links
        const externalLinkRegex = /<a[^>]*href=["|'](https?:\/\/[^"']*)["|'][^>]*>/gi;
        const externalCount = (content.match(externalLinkRegex) || []).length;
        return Math.min(5, Math.max(1, externalCount));
        
      case 'internalLinks':
        // 2-6 điểm tùy số internal links
        const internalLinkRegex = /<a[^>]*href=["|'](?!http|#|mailto:|tel:)([^"']*)["|'][^>]*>/gi;
        const internalCount = (content.match(internalLinkRegex) || []).length;
        if (internalCount >= 5) return 6;
        if (internalCount >= 3) return 4;
        if (internalCount >= 1) return 2;
        return 0;
        
      case 'contentAssets':
        // 1-5 điểm tùy số media assets
        const imageCount = (content.match(/<img[^>]*>/gi) || []).length;
        const videoCount = (content.match(/<video[^>]*>|<iframe[^>]*>/gi) || []).length;
        const totalAssets = imageCount + videoCount;
        if (totalAssets >= 10) return 5;
        if (totalAssets >= 6) return 4;
        if (totalAssets >= 3) return 3;
        if (totalAssets >= 1) return 2;
        return 0;
        
      case 'keywordDensity':
        // Điểm dựa trên mức độ gần với ideal density (1%)
        const wordCount = this.countWords(content);
        const keywordCount = this.countKeywordOccurrences(content, keyword);
        const density = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;
        
        // Ideal = 1%, acceptable = 0.5-2.5%
        if (density >= 0.8 && density <= 1.2) return 5; // Perfect
        if (density >= 0.5 && density <= 2.5) return 3; // Good
        if (density > 0) return 1; // Some keywords
        return 0;
        
      case 'contentLength':
        // Điểm dựa trên độ dài content
        const words = this.countWords(content);
        if (words >= 1000 && words <= 2000) return 5; // Ideal
        if (words >= 600 && words <= 2500) return 3; // Good
        if (words >= 300) return 2; // Acceptable
        return 0;
        
      case 'shortParagraphs':
        // Điểm dựa trên tỷ lệ đoạn văn ngắn
        const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        const longParagraphs = paragraphs.filter(p => this.countWords(p) > 150);
        const shortParaRatio = paragraphs.length > 0 ? (paragraphs.length - longParagraphs.length) / paragraphs.length : 0;
        
        if (shortParaRatio >= 0.8) return 4; // 80%+ short paragraphs
        if (shortParaRatio >= 0.6) return 3; // 60%+ short paragraphs
        if (shortParaRatio >= 0.4) return 2; // 40%+ short paragraphs
        return 1;
        
      default:
        // Test pass/fail đơn giản, trả về điểm tối đa
        return maxScore;
    }
  }

  /**
   * Tính summary cho category dựa trên weighted scores
   */
  getCategorySummary(categoryName, testResults) {
    const category = this.categories[categoryName];
    if (!category) return { score: 0, maxScore: 0, passed: 0, failed: 0, errors: [] };

    let totalScore = 0;
    let totalMaxScore = category.maxScore;
    let passed = 0;
    let failed = 0;
    const errors = [];

    // Tính điểm cho từng test trong category
    category.tests.forEach(testName => {
      const result = testResults.find(r => r.testName === testName);
      if (!result) return;

      totalScore += result.score;
      
      if (result.passed) {
        passed++;
      } else {
        failed++;
        errors.push(result.message);
      }
    });

    return {
      score: totalScore,
      maxScore: totalMaxScore,
      passed,
      failed,
      errors
    };
  }

  /**
   * Chạy test cụ thể
   */
  runTest(testName, data) {
    const { title, content, metaDescription, url, keyword, images } = data;
    
    switch (testName) {
      case 'focusKeywordInTitle':
        return { ...this.testFocusKeywordInTitle(title, keyword), testName };
      case 'focusKeywordInMetaDescription':
        return { ...this.testFocusKeywordInMetaDescription(metaDescription, keyword), testName };
      case 'focusKeywordInURL':
        return { ...this.testFocusKeywordInURL(url, keyword), testName };
      case 'focusKeywordAtBeginning':
        return { ...this.testFocusKeywordAtBeginning(content, keyword), testName };
      case 'focusKeywordInContent':
        return { ...this.testFocusKeywordInContent(content, keyword), testName };
      case 'contentLength':
        return { ...this.testContentLength(content), testName };
      case 'focusKeywordInSubheadings':
        return { ...this.testFocusKeywordInSubheadings(content, keyword), testName };
      case 'imageWithFocusKeyword':
        return { ...this.testImageWithFocusKeyword(images, keyword), testName };
      case 'keywordDensity':
        return { ...this.testKeywordDensity(content, keyword), testName };
      case 'urlLength':
        return { ...this.testUrlLength(url), testName };
      case 'externalLinks':
        return { ...this.testExternalLinks(content), testName };
      case 'doFollowLinks':
        return { ...this.testDoFollowLinks(content), testName };
      case 'internalLinks':
        return { ...this.testInternalLinks(content), testName };
      case 'focusKeywordSet':
        return { ...this.testFocusKeywordSet(keyword), testName };
      case 'contentAI':
        return { ...this.testContentAI(), testName };
      case 'focusKeywordNearBeginning':
        return { ...this.testFocusKeywordNearBeginning(title, keyword), testName };
      case 'titleSentiment':
        return { ...this.testTitleSentiment(title), testName };
      case 'titlePowerWords':
        return { ...this.testTitlePowerWords(title), testName };
      case 'titleHasNumber':
        return { ...this.testTitleHasNumber(title), testName };
      case 'tableOfContents':
        return { ...this.testTableOfContents(content), testName };
      case 'shortParagraphs':
        return { ...this.testShortParagraphs(content), testName };
      case 'contentAssets':
        return { ...this.testContentAssets(content), testName };
      default:
        return { passed: false, message: 'Unknown test', testName };
    }
  }

  // =================================
  // BASIC SEO TESTS
  // =================================

  testFocusKeywordInTitle(title, keyword) {
    if (!keyword) return { passed: false, message: 'No focus keyword set' };
    const passed = title.toLowerCase().includes(keyword.toLowerCase());
    return { 
      passed, 
      message: passed ? 'Focus keyword found in title' : 'Add Focus Keyword to the SEO title.'
    };
  }

  testFocusKeywordInMetaDescription(metaDescription, keyword) {
    if (!keyword) return { passed: false, message: 'No focus keyword set' };
    if (!metaDescription) return { passed: false, message: 'No meta description' };
    const passed = metaDescription.toLowerCase().includes(keyword.toLowerCase());
    return { 
      passed, 
      message: passed ? 'Focus keyword found in meta description' : 'Add Focus Keyword to your SEO Meta Description.'
    };
  }

  testFocusKeywordInURL(url, keyword) {
    if (!keyword) return { passed: false, message: 'No focus keyword set' };
    if (!url) return { passed: false, message: 'No URL provided' };
    const keywordSlug = keyword.replace(/\s+/g, '-').toLowerCase();
    const passed = url.toLowerCase().includes(keyword.toLowerCase()) || 
                   url.toLowerCase().includes(keywordSlug);
    return { 
      passed, 
      message: passed ? 'Focus keyword found in URL' : 'Use Focus Keyword in the URL.'
    };
  }

  testFocusKeywordAtBeginning(content, keyword) {
    if (!keyword) return { passed: false, message: 'No focus keyword set' };
    const firstParagraph = content.split(/\n\s*\n/)[0] || content.substring(0, 300);
    const passed = firstParagraph.toLowerCase().includes(keyword.toLowerCase());
    return { 
      passed, 
      message: passed ? 'Focus keyword found at beginning' : 'Use Focus Keyword at the beginning of your content.'
    };
  }

  testFocusKeywordInContent(content, keyword) {
    if (!keyword) return { passed: false, message: 'No focus keyword set' };
    const passed = content.toLowerCase().includes(keyword.toLowerCase());
    return { 
      passed, 
      message: passed ? 'Focus keyword found in content' : 'Use Focus Keyword in the content.'
    };
  }

  testContentLength(content) {
    const wordCount = this.countWords(content);
    const passed = wordCount >= 600 && wordCount <= 2500;
    return { 
      passed, 
      message: passed ? `Content length is good (${wordCount} words)` : 'Content should be 600-2500 words long.'
    };
  }

  // =================================
  // ADDITIONAL TESTS
  // =================================

  testFocusKeywordInSubheadings(content, keyword) {
    if (!keyword) return { passed: false, message: 'No focus keyword set' };
    const headingRegex = /<h[2-6][^>]*>(.*?)<\/h[2-6]>/gi;
    const headings = [];
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push(match[1].replace(/<[^>]*>/g, ''));
    }
    
    const passed = headings.some(heading => 
      heading.toLowerCase().includes(keyword.toLowerCase())
    );
    
    return { 
      passed, 
      message: passed ? 'Focus keyword found in subheadings' : 'Use Focus Keyword in subheading(s) like H2, H3, H4, etc..'
    };
  }

  testImageWithFocusKeyword(images, keyword) {
    if (!keyword) return { passed: false, message: 'No focus keyword set' };
    if (!images || images.length === 0) {
      return { passed: false, message: 'Add an image with your Focus Keyword as alt text.' };
    }
    
    const passed = images.some(img => 
      img.alt && img.alt.toLowerCase().includes(keyword.toLowerCase())
    );
    
    return { 
      passed, 
      message: passed ? 'Image with focus keyword alt text found' : 'Add an image with your Focus Keyword as alt text.'
    };
  }

  testKeywordDensity(content, keyword) {
    if (!keyword) return { passed: false, message: 'No focus keyword set' };
    const wordCount = this.countWords(content);
    const keywordCount = this.countKeywordOccurrences(content, keyword);
    const density = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;
    
    const passed = density >= 0.5 && density <= 2.5;
    return { 
      passed, 
      message: passed ? `Keyword density is good (${density.toFixed(2)}%)` : `Keyword Density is ${density.toFixed(1)}%. Aim for around 1% Keyword Density.`
    };
  }

  testUrlLength(url) {
    if (!url) return { passed: false, message: 'No URL provided' };
    const length = url.length;
    const passed = length <= 75;
    return { 
      passed, 
      message: passed ? `URL is ${length} characters long. Kudos!` : `URL is too long (${length} characters)`
    };
  }

  testExternalLinks(content) {
    const externalLinkRegex = /<a[^>]*href=["|'](https?:\/\/[^"']*)["|'][^>]*>/gi;
    const matches = content.match(externalLinkRegex) || [];
    const passed = matches.length > 0;
    return { 
      passed, 
      message: passed ? `Found ${matches.length} external links` : 'Link out to external resources.'
    };
  }

  testDoFollowLinks(content) {
    const externalLinkRegex = /<a[^>]*href=["|'](https?:\/\/[^"']*)["|'][^>]*>/gi;
    const noFollowRegex = /<a[^>]*rel=["|'][^"']*nofollow[^"']*["|'][^>]*>/gi;
    
    const totalExternal = (content.match(externalLinkRegex) || []).length;
    const noFollow = (content.match(noFollowRegex) || []).length;
    const doFollow = totalExternal - noFollow;
    
    const passed = doFollow > 0;
    return { 
      passed, 
      message: passed ? `Found ${doFollow} DoFollow links` : 'Add DoFollow links pointing to external resources.'
    };
  }

  testInternalLinks(content) {
    const internalLinkRegex = /<a[^>]*href=["|'](?!http|#|mailto:|tel:)([^"']*)["|'][^>]*>/gi;
    const matches = content.match(internalLinkRegex) || [];
    const passed = matches.length > 0;
    return { 
      passed, 
      message: passed ? `Found ${matches.length} internal links` : 'Add internal links in your content.'
    };
  }

  testFocusKeywordSet(keyword) {
    const passed = keyword && keyword.trim().length > 0;
    return { 
      passed, 
      message: passed ? 'Focus keyword is set' : 'Set a Focus Keyword for this content.'
    };
  }

  testContentAI() {
    // Giả định content AI được sử dụng
    return { 
      passed: true, 
      message: 'You are using Content AI to optimise this Post.'
    };
  }

  // =================================
  // TITLE READABILITY TESTS
  // =================================

  testFocusKeywordNearBeginning(title, keyword) {
    if (!keyword) return { passed: false, message: 'No focus keyword set' };
    const keywordIndex = title.toLowerCase().indexOf(keyword.toLowerCase());
    const passed = keywordIndex >= 0 && keywordIndex <= 10;
    return { 
      passed, 
      message: passed ? 'Focus keyword near beginning of title' : 'Use the Focus Keyword near the beginning of SEO title.'
    };
  }

  testTitleSentiment(title) {
    const positiveWords = [
      'best', 'amazing', 'incredible', 'outstanding', 'excellent', 'perfect',
      'ultimate', 'superior', 'fantastic', 'wonderful', 'great', 'awesome'
    ];
    
    const negativeWords = [
      'worst', 'terrible', 'horrible', 'awful', 'bad', 'failed', 'disaster',
      'avoid', 'never', 'don\'t', 'stop', 'quit', 'end', 'kill'
    ];
    
    const titleLower = title.toLowerCase();
    const hasPositive = positiveWords.some(word => titleLower.includes(word));
    const hasNegative = negativeWords.some(word => titleLower.includes(word));
    
    const passed = hasPositive || hasNegative;
    return { 
      passed, 
      message: passed ? 'Title has emotional sentiment' : 'Titles with positive or negative sentiment work best for higher CTR.'
    };
  }

  testTitlePowerWords(title) {
    const powerWords = [
      'free', 'new', 'proven', 'results', 'easy', 'step', 'guide', 'how',
      'ultimate', 'complete', 'essential', 'exclusive', 'limited', 'secret',
      'powerful', 'effective', 'advanced', 'professional', 'expert'
    ];
    
    const titleLower = title.toLowerCase();
    const passed = powerWords.some(word => titleLower.includes(word));
    return { 
      passed, 
      message: passed ? 'Title contains power words' : 'Add power words to your title to increase CTR.'
    };
  }

  testTitleHasNumber(title) {
    const passed = /\d/.test(title);
    return { 
      passed, 
      message: passed ? 'Title contains numbers' : 'Add a number to your title to improve CTR.'
    };
  }

  // =================================
  // CONTENT READABILITY TESTS
  // =================================

  testTableOfContents(content) {
    const tocPatterns = [
      /table\s+of\s+contents/i,
      /mục\s+lục/i,
      /toc/i,
      /<div[^>]*class=["|'][^"']*toc[^"']*["|']/i
    ];
    
    const passed = tocPatterns.some(pattern => pattern.test(content));
    return { 
      passed, 
      message: passed ? 'Table of contents found' : 'Use Table of Content to break-down your text.'
    };
  }

  testShortParagraphs(content) {
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const longParagraphs = paragraphs.filter(p => this.countWords(p) > 150);
    const passed = longParagraphs.length < paragraphs.length * 0.3; // Tối đa 30% đoạn dài
    
    return { 
      passed, 
      message: passed ? 'Paragraphs are appropriately sized' : 'Add short and concise paragraphs for better readability and UX.'
    };
  }

  testContentAssets(content) {
    const hasImages = /<img[^>]*>/i.test(content);
    const hasVideos = /<video[^>]*>|<iframe[^>]*>/i.test(content);
    const passed = hasImages || hasVideos;
    
    return { 
      passed, 
      message: passed ? 'Content has visual assets' : 'Add a few images and/or videos to make your content appealing.'
    };
  }

  // =================================
  // HELPER METHODS
  // =================================

  getCategorySummaryOld(errors) {
    const summary = {};
    Object.keys(this.categories).forEach(categoryKey => {
      const category = this.categories[categoryKey];
      summary[categoryKey] = {
        name: category.name,
        totalTests: category.tests.length,
        errors: errors[categoryKey].length,
        passed: category.tests.length - errors[categoryKey].length
      };
    });
    return summary;
  }

  getRating(score) {
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'ok';
    if (score >= 30) return 'poor';
    return 'bad';
  }

  generateStats(title, content, keyword) {
    return {
      titleLength: title.length,
      contentLength: content.length,
      wordCount: this.countWords(content),
      keywordCount: this.countKeywordOccurrences(content, keyword),
      keywordDensity: this.countWords(content) > 0 
        ? ((this.countKeywordOccurrences(content, keyword) / this.countWords(content)) * 100).toFixed(2)
        : 0
    };
  }

  countWords(content) {
    if (!content) return 0;
    const textOnly = content.replace(/<[^>]*>/g, '');
    const normalizedText = textOnly
      .replace(/[^\w\s\u00C0-\u024F\u1E00-\u1EFF]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const words = normalizedText.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    return words.length;
  }

  countKeywordOccurrences(content, keyword) {
    if (!content || !keyword) return 0;
    const textOnly = content.replace(/<[^>]*>/g, '');
    const normalizedText = textOnly.replace(/[^\w\s\u00C0-\u024F\u1E00-\u1EFF]/g, ' ');
    const lowerText = normalizedText.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    const escapedKeyword = lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
    const matches = lowerText.match(regex);
    return matches ? matches.length : 0;
  }
}

// Export default instance
export const rankMathEngine = new RankMathSEOEngine();
export default RankMathSEOEngine;
module.exports = RankMathSEOEngine;