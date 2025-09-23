/**
 * Rank Math SEO Scoring Engine
 * Tái tạo logic chấm điểm SEO giống hệt Rank Math Demo
 */

export class RankMathSEOEngine {
  constructor() {
    // Rank Math Categories - đếm errors giống demo thực tế
    this.categories = {
      basicSEO: {
        name: 'Basic SEO',
        tests: [
          'focusKeywordInTitle',
          'focusKeywordInMetaDescription', 
          'focusKeywordInURL',
          'focusKeywordAtBeginning',
          'focusKeywordInContent',
          'contentLength'
        ]
      },
      additional: {
        name: 'Additional',
        tests: [
          'focusKeywordInSubheadings',
          'imageWithFocusKeyword',
          'keywordDensity',
          'urlLength',
          'externalLinks',
          'doFollowLinks',
          'internalLinks',
          'focusKeywordSet',
          'contentAI'
        ]
      },
      titleReadability: {
        name: 'Title Readability',
        tests: [
          'focusKeywordNearBeginning',
          'titleSentiment',
          'titlePowerWords',
          'titleHasNumber'
        ]
      },
      contentReadability: {
        name: 'Content Readability', 
        tests: [
          'tableOfContents',
          'shortParagraphs',
          'contentAssets'
        ]
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

    // Tổng số tests = 20
    this.totalTests = Object.values(this.categories)
      .reduce((total, category) => total + category.tests.length, 0);
  }

  /**
   * Phân tích SEO theo chuẩn Rank Math
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
    
    // Thực hiện tất cả tests
    Object.keys(this.categories).forEach(categoryKey => {
      const category = this.categories[categoryKey];
      errors[categoryKey] = [];
      
      category.tests.forEach(testName => {
        const testResult = this.runTest(testName, {
          title, content, metaDescription, url, keyword, images, socialData
        });
        
        results[testName] = testResult;
        
        // Nếu test fail -> thêm vào errors
        if (!testResult.passed) {
          errors[categoryKey].push({
            test: testName,
            message: this.messages[testName] || testResult.message
          });
        }
      });
    });

    // Tính điểm theo % tests passed
    const totalPassed = Object.values(results).filter(r => r.passed).length;
    const score = Math.round((totalPassed / this.totalTests) * 100);
    const rating = this.getRating(score);

    return {
      score,
      rating,
      results,
      errors,
      categories: this.getCategorySummary(errors),
      totalTests: this.totalTests,
      passedTests: totalPassed,
      stats: this.generateStats(title, content, keyword)
    };
  }

  /**
   * Chạy test cụ thể
   */
  runTest(testName, data) {
    const { title, content, metaDescription, url, keyword, images } = data;
    
    switch (testName) {
      case 'focusKeywordInTitle':
        return this.testFocusKeywordInTitle(title, keyword);
      case 'focusKeywordInMetaDescription':
        return this.testFocusKeywordInMetaDescription(metaDescription, keyword);
      case 'focusKeywordInURL':
        return this.testFocusKeywordInURL(url, keyword);
      case 'focusKeywordAtBeginning':
        return this.testFocusKeywordAtBeginning(content, keyword);
      case 'focusKeywordInContent':
        return this.testFocusKeywordInContent(content, keyword);
      case 'contentLength':
        return this.testContentLength(content);
      case 'focusKeywordInSubheadings':
        return this.testFocusKeywordInSubheadings(content, keyword);
      case 'imageWithFocusKeyword':
        return this.testImageWithFocusKeyword(images, keyword);
      case 'keywordDensity':
        return this.testKeywordDensity(content, keyword);
      case 'urlLength':
        return this.testUrlLength(url);
      case 'externalLinks':
        return this.testExternalLinks(content);
      case 'doFollowLinks':
        return this.testDoFollowLinks(content);
      case 'internalLinks':
        return this.testInternalLinks(content);
      case 'focusKeywordSet':
        return this.testFocusKeywordSet(keyword);
      case 'contentAI':
        return this.testContentAI();
      case 'focusKeywordNearBeginning':
        return this.testFocusKeywordNearBeginning(title, keyword);
      case 'titleSentiment':
        return this.testTitleSentiment(title);
      case 'titlePowerWords':
        return this.testTitlePowerWords(title);
      case 'titleHasNumber':
        return this.testTitleHasNumber(title);
      case 'tableOfContents':
        return this.testTableOfContents(content);
      case 'shortParagraphs':
        return this.testShortParagraphs(content);
      case 'contentAssets':
        return this.testContentAssets(content);
      default:
        return { passed: false, message: 'Unknown test' };
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

  getCategorySummary(errors) {
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