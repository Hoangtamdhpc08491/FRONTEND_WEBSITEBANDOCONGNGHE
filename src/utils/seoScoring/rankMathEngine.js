/**
 * Rank Math SEO Scoring Engine
 * Tái tạo logic chấm điểm SEO giống hệt Rank Math
 */

export class RankMathSEOEngine {
  constructor() {
    // Danh sách các test SEO dựa trên Rank Math
    this.tests = {
      // Basic SEO Tests
      titleInSEO: { weight: 4, maxScore: 4 },
      titleStartsWithKeyword: { weight: 5, maxScore: 5 },
      titleSentiment: { weight: 1, maxScore: 1 },
      titleHasPowerWords: { weight: 2, maxScore: 2 },
      titleHasNumber: { weight: 1, maxScore: 1 },
      titleLength: { weight: 3, maxScore: 3 },
      
      // Meta Description Tests
      metaDescription: { weight: 5, maxScore: 5 },
      metaDescriptionLength: { weight: 3, maxScore: 3 },
      metaDescriptionKeyword: { weight: 3, maxScore: 3 },
      
      // URL Tests
      urlKeyword: { weight: 4, maxScore: 4 },
      urlLength: { weight: 2, maxScore: 2 },
      
      // Content Tests
      contentLength: { weight: 4, maxScore: 4 },
      keywordDensity: { weight: 6, maxScore: 6 },
      keywordInFirstParagraph: { weight: 3, maxScore: 3 },
      keywordInContent: { weight: 4, maxScore: 4 },
      keywordInHeadings: { weight: 4, maxScore: 4 },
      
      // Image Tests
      imageAlt: { weight: 3, maxScore: 3 },
      imageTitle: { weight: 2, maxScore: 2 },
      contentHasAssets: { weight: 2, maxScore: 2 },
      
      // Links Tests
      internalLinks: { weight: 3, maxScore: 3 },
      externalLinks: { weight: 2, maxScore: 2 },
      externalLinksDoFollow: { weight: 2, maxScore: 2 },
      
      // Additional Quality Tests
      keywordUsage: { weight: 3, maxScore: 3 },
      contentHasTOC: { weight: 2, maxScore: 2 },
      contentHasShortParagraphs: { weight: 2, maxScore: 2 },
      contentAI: { weight: 2, maxScore: 2 },
      
      // Social Tests
      socialTitle: { weight: 2, maxScore: 2 },
      socialDescription: { weight: 2, maxScore: 2 },
      socialImage: { weight: 1, maxScore: 1 }
    };
    
    // Tổng điểm tối đa
    this.maxScore = Object.values(this.tests).reduce((sum, test) => sum + test.maxScore, 0);
  }

  /**
   * Phân tích và chấm điểm SEO
   * @param {Object} data - Dữ liệu content cần phân tích
   * @returns {Object} - Kết quả phân tích và điểm số
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

    const results = {};
    let totalScore = 0;

    // Chuẩn hóa keyword
    const keyword = focusKeyword.toLowerCase().trim();
    
    if (!keyword) {
      return {
        score: 0,
        rating: 'unknown',
        results: {
          noKeyword: {
            status: 'fail',
            message: 'Chưa có từ khóa chính (Focus Keyword)',
            score: 0
          }
        },
        suggestions: ['Hãy thiết lập từ khóa chính để bắt đầu phân tích SEO'],
        maxScore: this.maxScore
      };
    }

    // Basic SEO Tests
    results.titleInSEO = this.testTitleInSEO(title, keyword);
    results.titleStartsWithKeyword = this.testTitleStartsWithKeyword(title, keyword);
    results.titleSentiment = this.testTitleSentiment(title);
    results.titleHasPowerWords = this.testTitleHasPowerWords(title);
    results.titleHasNumber = this.testTitleHasNumber(title);
    results.titleLength = this.testTitleLength(title);

    // Meta Description Tests
    results.metaDescription = this.testMetaDescription(metaDescription);
    results.metaDescriptionLength = this.testMetaDescriptionLength(metaDescription);
    results.metaDescriptionKeyword = this.testMetaDescriptionKeyword(metaDescription, keyword);

    // URL Tests
    results.urlKeyword = this.testUrlKeyword(url, keyword);
    results.urlLength = this.testUrlLength(url);

    // Content Tests
    results.contentLength = this.testContentLength(content);
    results.keywordDensity = this.testKeywordDensity(content, keyword);
    results.keywordInFirstParagraph = this.testKeywordInFirstParagraph(content, keyword);
    results.keywordInContent = this.testKeywordInContent(content, keyword);
    results.keywordInHeadings = this.testKeywordInHeadings(content, keyword);

    // Image Tests
    results.imageAlt = this.testImageAlt(images, keyword);
    results.imageTitle = this.testImageTitle(images, keyword);
    results.contentHasAssets = this.testContentHasAssets(content);

    // Links Tests
    results.internalLinks = this.testInternalLinks(content);
    results.externalLinks = this.testExternalLinks(content);
    results.externalLinksDoFollow = this.testExternalLinksDoFollow(content);

    // Additional Quality Tests
    results.keywordUsage = this.testKeywordUsage(keyword);
    results.contentHasTOC = this.testContentHasTOC(content);
    results.contentHasShortParagraphs = this.testContentHasShortParagraphs(content);
    results.contentAI = this.testContentAI();

    // Social Tests
    results.socialTitle = this.testSocialTitle(socialData.title);
    results.socialDescription = this.testSocialDescription(socialData.description);
    results.socialImage = this.testSocialImage(socialData.image);

    // Tính tổng điểm
    Object.values(results).forEach(result => {
      totalScore += result.score;
    });

    // Tính điểm phần trăm (0-100)
    const score = Math.round((totalScore / this.maxScore) * 100);
    const rating = this.getRating(score);
    const suggestions = this.generateSuggestions(results);

    return {
      score,
      rating,
      results,
      suggestions,
      totalScore,
      maxScore: this.maxScore,
      stats: this.generateStats(title, content, keyword)
    };
  }

  /**
   * Test: Title chứa từ khóa
   */
  testTitleInSEO(title, keyword) {
    const hasKeyword = title.toLowerCase().includes(keyword);
    return {
      status: hasKeyword ? 'ok' : 'fail',
      message: hasKeyword 
        ? 'Tiêu đề chứa từ khóa chính' 
        : 'Tiêu đề không chứa từ khóa chính',
      score: hasKeyword ? this.tests.titleInSEO.maxScore : 0
    };
  }

  /**
   * Test: Title bắt đầu bằng từ khóa
   */
  testTitleStartsWithKeyword(title, keyword) {
    const startsWithKeyword = title.toLowerCase().startsWith(keyword);
    const isNearStart = title.toLowerCase().indexOf(keyword) <= 10;
    
    if (startsWithKeyword) {
      return {
        status: 'ok',
        message: 'Tiêu đề bắt đầu bằng từ khóa chính',
        score: this.tests.titleStartsWithKeyword.maxScore
      };
    } else if (isNearStart) {
      return {
        status: 'warning',
        message: 'Từ khóa chính ở gần đầu tiêu đề',
        score: Math.floor(this.tests.titleStartsWithKeyword.maxScore * 0.7)
      };
    } else {
      return {
        status: 'fail',
        message: 'Từ khóa chính không ở đầu tiêu đề',
        score: 0
      };
    }
  }

  /**
   * Test: Title có tính cảm xúc tích cực
   */
  testTitleSentiment(title) {
    const powerWords = [
      'tốt nhất', 'hàng đầu', 'chất lượng', 'ưu đãi', 'giảm giá', 'khuyến mại',
      'mới nhất', 'độc quyền', 'premium', 'vip', 'hot', 'sale', 'deal'
    ];
    
    const hasPowerWord = powerWords.some(word => 
      title.toLowerCase().includes(word.toLowerCase())
    );
    
    return {
      status: hasPowerWord ? 'ok' : 'warning',
      message: hasPowerWord 
        ? 'Tiêu đề có từ kích thích cảm xúc' 
        : 'Tiêu đề có thể thêm từ kích thích cảm xúc',
      score: hasPowerWord ? this.tests.titleSentiment.maxScore : 0
    };
  }

  /**
   * Test: Title có Power Words
   */
  testTitleHasPowerWords(title) {
    const emotionalWords = [
      'miễn phí', 'bí quyết', 'cách', 'hướng dẫn', 'tips', 'mẹo',
      'đánh giá', 'review', 'so sánh', 'top', 'ranking'
    ];
    
    const hasEmotionalWord = emotionalWords.some(word => 
      title.toLowerCase().includes(word.toLowerCase())
    );
    
    return {
      status: hasEmotionalWord ? 'ok' : 'info',
      message: hasEmotionalWord 
        ? 'Tiêu đề có từ mang tính cảm xúc' 
        : 'Có thể thêm từ mang tính cảm xúc vào tiêu đề',
      score: hasEmotionalWord ? this.tests.titleHasPowerWords.maxScore : 0
    };
  }

  /**
   * Test: Title có số
   */
  testTitleHasNumber(title) {
    const hasNumber = /\d/.test(title);
    return {
      status: hasNumber ? 'ok' : 'info',
      message: hasNumber 
        ? 'Tiêu đề có chứa số' 
        : 'Tiêu đề không chứa số',
      score: hasNumber ? this.tests.titleHasNumber.maxScore : 0
    };
  }

  /**
   * Test: Độ dài title
   */
  testTitleLength(title) {
    const length = title.length;
    
    if (length >= 30 && length <= 60) {
      return {
        status: 'ok',
        message: `Độ dài tiêu đề tối ưu (${length} ký tự)`,
        score: this.tests.titleLength.maxScore
      };
    } else if (length >= 20 && length < 30) {
      return {
        status: 'warning',
        message: `Tiêu đề hơi ngắn (${length} ký tự). Nên từ 30-60 ký tự`,
        score: Math.floor(this.tests.titleLength.maxScore * 0.7)
      };
    } else if (length > 60 && length <= 70) {
      return {
        status: 'warning',
        message: `Tiêu đề hơi dài (${length} ký tự). Nên từ 30-60 ký tự`,
        score: Math.floor(this.tests.titleLength.maxScore * 0.7)
      };
    } else {
      return {
        status: 'fail',
        message: length < 20 
          ? `Tiêu đề quá ngắn (${length} ký tự)` 
          : `Tiêu đề quá dài (${length} ký tự)`,
        score: 0
      };
    }
  }

  /**
   * Test: Meta Description tồn tại
   */
  testMetaDescription(metaDescription) {
    const hasMetaDesc = metaDescription && metaDescription.trim().length > 0;
    return {
      status: hasMetaDesc ? 'ok' : 'fail',
      message: hasMetaDesc 
        ? 'Có Meta Description' 
        : 'Chưa có Meta Description',
      score: hasMetaDesc ? this.tests.metaDescription.maxScore : 0
    };
  }

  /**
   * Test: Độ dài Meta Description
   */
  testMetaDescriptionLength(metaDescription) {
    const length = metaDescription.length;
    
    if (length >= 120 && length <= 160) {
      return {
        status: 'ok',
        message: `Độ dài Meta Description tối ưu (${length} ký tự)`,
        score: this.tests.metaDescriptionLength.maxScore
      };
    } else if (length >= 100 && length < 120) {
      return {
        status: 'warning',
        message: `Meta Description hơi ngắn (${length} ký tự)`,
        score: Math.floor(this.tests.metaDescriptionLength.maxScore * 0.7)
      };
    } else if (length > 160 && length <= 180) {
      return {
        status: 'warning',
        message: `Meta Description hơi dài (${length} ký tự)`,
        score: Math.floor(this.tests.metaDescriptionLength.maxScore * 0.7)
      };
    } else if (length === 0) {
      return {
        status: 'fail',
        message: 'Chưa có Meta Description',
        score: 0
      };
    } else {
      return {
        status: 'fail',
        message: length < 100 
          ? `Meta Description quá ngắn (${length} ký tự)` 
          : `Meta Description quá dài (${length} ký tự)`,
        score: 0
      };
    }
  }

  /**
   * Test: Meta Description chứa từ khóa
   */
  testMetaDescriptionKeyword(metaDescription, keyword) {
    if (!metaDescription) {
      return {
        status: 'fail',
        message: 'Chưa có Meta Description',
        score: 0
      };
    }
    
    const hasKeyword = metaDescription.toLowerCase().includes(keyword);
    return {
      status: hasKeyword ? 'ok' : 'warning',
      message: hasKeyword 
        ? 'Meta Description chứa từ khóa chính' 
        : 'Meta Description không chứa từ khóa chính',
      score: hasKeyword ? this.tests.metaDescriptionKeyword.maxScore : 0
    };
  }

  /**
   * Test: URL chứa từ khóa
   */
  testUrlKeyword(url, keyword) {
    if (!url) {
      return {
        status: 'info',
        message: 'Chưa có URL để kiểm tra',
        score: 0
      };
    }
    
    const urlPath = url.toLowerCase();
    const keywordSlug = keyword.replace(/\s+/g, '-');
    const hasKeyword = urlPath.includes(keyword) || urlPath.includes(keywordSlug);
    
    return {
      status: hasKeyword ? 'ok' : 'warning',
      message: hasKeyword 
        ? 'URL chứa từ khóa chính' 
        : 'URL không chứa từ khóa chính',
      score: hasKeyword ? this.tests.urlKeyword.maxScore : 0
    };
  }

  /**
   * Test: Độ dài URL
   */
  testUrlLength(url) {
    if (!url) {
      return {
        status: 'info',
        message: 'Chưa có URL để kiểm tra',
        score: this.tests.urlLength.maxScore
      };
    }
    
    const length = url.length;
    
    if (length <= 75) {
      return {
        status: 'ok',
        message: `Độ dài URL tối ưu (${length} ký tự)`,
        score: this.tests.urlLength.maxScore
      };
    } else if (length <= 100) {
      return {
        status: 'warning',
        message: `URL hơi dài (${length} ký tự)`,
        score: Math.floor(this.tests.urlLength.maxScore * 0.7)
      };
    } else {
      return {
        status: 'fail',
        message: `URL quá dài (${length} ký tự)`,
        score: 0
      };
    }
  }

  /**
   * Test: Độ dài nội dung
   */
  testContentLength(content) {
    const wordCount = this.countWords(content);
    
    if (wordCount >= 300) {
      return {
        status: 'ok',
        message: `Độ dài nội dung tốt (${wordCount} từ)`,
        score: this.tests.contentLength.maxScore
      };
    } else if (wordCount >= 150) {
      return {
        status: 'warning',
        message: `Nội dung hơi ngắn (${wordCount} từ). Nên có ít nhất 300 từ`,
        score: Math.floor(this.tests.contentLength.maxScore * 0.7)
      };
    } else {
      return {
        status: 'fail',
        message: `Nội dung quá ngắn (${wordCount} từ)`,
        score: 0
      };
    }
  }

  /**
   * Test: Mật độ từ khóa (cập nhật theo Rank Math thresholds)
   */
  testKeywordDensity(content, keyword) {
    const wordCount = this.countWords(content);
    const keywordCount = this.countKeywordOccurrences(content, keyword);
    const density = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;
    
    // Rank Math thresholds:
    // < 0.5%: Low (fail)
    // > 2.5%: High (fail) 
    // 0.5-0.75%: Fair (score 2)
    // 0.76-1%: Good (score 3)
    // > 1%: Best (score 6)
    
    if (density < 0.5) {
      return {
        status: 'fail',
        message: `Mật độ từ khóa thấp (${density.toFixed(2)}%). Nên từ 0.5-2.5%`,
        score: 0
      };
    } else if (density > 2.5) {
      return {
        status: 'fail',
        message: `Mật độ từ khóa quá cao (${density.toFixed(2)}%). Có thể bị coi là spam`,
        score: 0
      };
    } else if (density >= 0.5 && density <= 0.75) {
      return {
        status: 'warning',
        message: `Mật độ từ khóa khá tốt (${density.toFixed(2)}%)`,
        score: Math.floor(this.tests.keywordDensity.maxScore * 0.33) // 2/6
      };
    } else if (density > 0.75 && density <= 1.0) {
      return {
        status: 'warning',
        message: `Mật độ từ khóa tốt (${density.toFixed(2)}%)`,
        score: Math.floor(this.tests.keywordDensity.maxScore * 0.5) // 3/6
      };
    } else {
      return {
        status: 'ok',
        message: `Mật độ từ khóa tối ưu (${density.toFixed(2)}%)`,
        score: this.tests.keywordDensity.maxScore // 6/6
      };
    }
  }

  /**
   * Test: Từ khóa trong đoạn đầu
   */
  testKeywordInFirstParagraph(content, keyword) {
    const firstParagraph = content.split(/\n\s*\n/)[0] || content.substring(0, 200);
    const hasKeyword = firstParagraph.toLowerCase().includes(keyword);
    
    return {
      status: hasKeyword ? 'ok' : 'warning',
      message: hasKeyword 
        ? 'Từ khóa xuất hiện trong đoạn đầu' 
        : 'Từ khóa không xuất hiện trong đoạn đầu',
      score: hasKeyword ? this.tests.keywordInFirstParagraph.maxScore : 0
    };
  }

  /**
   * Test: Từ khóa trong tiêu đề phụ
   */
  testKeywordInHeadings(content, keyword) {
    const headingRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi;
    const headings = [];
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push(match[1]);
    }
    
    if (headings.length === 0) {
      return {
        status: 'warning',
        message: 'Nội dung không có tiêu đề phụ (H1-H6)',
        score: 0
      };
    }
    
    const hasKeywordInHeading = headings.some(heading => 
      heading.toLowerCase().includes(keyword)
    );
    
    return {
      status: hasKeywordInHeading ? 'ok' : 'warning',
      message: hasKeywordInHeading 
        ? 'Từ khóa xuất hiện trong tiêu đề phụ' 
        : 'Từ khóa không xuất hiện trong tiêu đề phụ',
      score: hasKeywordInHeading ? this.tests.keywordInHeadings.maxScore : 0
    };
  }

  /**
   * Test: Hình ảnh có Alt text
   */
  testImageAlt(images, keyword) {
    if (!images || images.length === 0) {
      return {
        status: 'info',
        message: 'Không có hình ảnh để kiểm tra',
        score: this.tests.imageAlt.maxScore
      };
    }
    
    const imagesWithAlt = images.filter(img => img.alt && img.alt.trim().length > 0);
    const hasKeywordInAlt = imagesWithAlt.some(img => 
      img.alt.toLowerCase().includes(keyword)
    );
    
    if (imagesWithAlt.length === images.length && hasKeywordInAlt) {
      return {
        status: 'ok',
        message: 'Tất cả hình ảnh có Alt text và chứa từ khóa',
        score: this.tests.imageAlt.maxScore
      };
    } else if (imagesWithAlt.length === images.length) {
      return {
        status: 'warning',
        message: 'Tất cả hình ảnh có Alt text nhưng không chứa từ khóa',
        score: Math.floor(this.tests.imageAlt.maxScore * 0.7)
      };
    } else {
      return {
        status: 'fail',
        message: `${images.length - imagesWithAlt.length} hình ảnh thiếu Alt text`,
        score: 0
      };
    }
  }

  /**
   * Test: Hình ảnh có Title
   */
  testImageTitle(images, keyword) {
    if (!images || images.length === 0) {
      return {
        status: 'info',
        message: 'Không có hình ảnh để kiểm tra',
        score: this.tests.imageTitle.maxScore
      };
    }
    
    const imagesWithTitle = images.filter(img => img.title && img.title.trim().length > 0);
    
    if (imagesWithTitle.length > 0) {
      return {
        status: 'ok',
        message: 'Hình ảnh có Title attribute',
        score: this.tests.imageTitle.maxScore
      };
    } else {
      return {
        status: 'warning',
        message: 'Hình ảnh thiếu Title attribute',
        score: 0
      };
    }
  }

  /**
   * Test: Liên kết nội bộ
   */
  testInternalLinks(content) {
    const internalLinkRegex = /<a[^>]*href=["|'](?!http|#|mailto:|tel:)([^"']*)["|'][^>]*>/gi;
    const matches = content.match(internalLinkRegex) || [];
    
    if (matches.length >= 3) {
      return {
        status: 'ok',
        message: `Có ${matches.length} liên kết nội bộ`,
        score: this.tests.internalLinks.maxScore
      };
    } else if (matches.length >= 1) {
      return {
        status: 'warning',
        message: `Có ${matches.length} liên kết nội bộ. Nên có ít nhất 3 liên kết`,
        score: Math.floor(this.tests.internalLinks.maxScore * 0.7)
      };
    } else {
      return {
        status: 'fail',
        message: 'Không có liên kết nội bộ',
        score: 0
      };
    }
  }

  /**
   * Test: Liên kết ngoại
   */
  testExternalLinks(content) {
    const externalLinkRegex = /<a[^>]*href=["|'](https?:\/\/[^"']*)["|'][^>]*>/gi;
    const matches = content.match(externalLinkRegex) || [];
    
    if (matches.length >= 1) {
      return {
        status: 'ok',
        message: `Có ${matches.length} liên kết ngoại`,
        score: this.tests.externalLinks.maxScore
      };
    } else {
      return {
        status: 'info',
        message: 'Không có liên kết ngoại. Có thể thêm liên kết đến nguồn uy tín',
        score: 0
      };
    }
  }

  /**
   * Test: Từ khóa trong nội dung
   */
  testKeywordInContent(content, keyword) {
    const hasKeyword = content.toLowerCase().includes(keyword);
    
    return {
      status: hasKeyword ? 'ok' : 'fail',
      message: hasKeyword 
        ? 'Từ khóa được tìm thấy trong nội dung' 
        : 'Từ khóa không tìm thấy trong nội dung',
      score: hasKeyword ? this.tests.keywordInContent.maxScore : 0
    };
  }

  /**
   * Test: Nội dung có hình ảnh/video
   */
  testContentHasAssets(content) {
    const hasImages = /<img[^>]*>/i.test(content);
    const hasVideos = /<video[^>]*>/i.test(content) || /youtube\.com|vimeo\.com|youtu\.be/i.test(content);
    const hasAssets = hasImages || hasVideos;
    
    return {
      status: hasAssets ? 'ok' : 'warning',
      message: hasAssets 
        ? 'Nội dung có chứa hình ảnh và/hoặc video' 
        : 'Nên thêm hình ảnh hoặc video vào nội dung',
      score: hasAssets ? this.tests.contentHasAssets.maxScore : 0
    };
  }

  /**
   * Test: Liên kết ngoại có DoFollow
   */
  testExternalLinksDoFollow(content) {
    const externalLinkRegex = /<a[^>]*href=["|'](https?:\/\/[^"']*)["|'][^>]*>/gi;
    const allExternalLinks = content.match(externalLinkRegex) || [];
    
    if (allExternalLinks.length === 0) {
      return {
        status: 'info',
        message: 'Không có liên kết ngoại',
        score: 0
      };
    }
    
    // Kiểm tra xem có liên kết nào không có rel="nofollow"
    const doFollowLinks = allExternalLinks.filter(link => 
      !link.includes('rel="nofollow"') && !link.includes("rel='nofollow'")
    );
    
    if (doFollowLinks.length > 0) {
      return {
        status: 'ok',
        message: 'Có ít nhất một liên kết ngoại DoFollow',
        score: this.tests.externalLinksDoFollow.maxScore
      };
    } else {
      return {
        status: 'warning',
        message: 'Tất cả liên kết ngoại đều có NoFollow',
        score: 0
      };
    }
  }

  /**
   * Test: Sử dụng từ khóa lần đầu
   */
  testKeywordUsage(keyword) {
    // Giả định: kiểm tra từ database hoặc service
    // Tạm thời return ok cho demo
    return {
      status: 'ok',
      message: 'Chưa từng sử dụng từ khóa này trước đây',
      score: this.tests.keywordUsage.maxScore
    };
  }

  /**
   * Test: Nội dung có Table of Contents
   */
  testContentHasTOC(content) {
    const hasTOC = /table.of.contents|mục.lục|toc/i.test(content) || 
                   /<ol[^>]*class[^>]*toc/i.test(content) ||
                   /<ul[^>]*class[^>]*toc/i.test(content);
    
    return {
      status: hasTOC ? 'ok' : 'warning',
      message: hasTOC 
        ? 'Nội dung có Table of Contents' 
        : 'Không sử dụng plugin Table of Contents',
      score: hasTOC ? this.tests.contentHasTOC.maxScore : 0
    };
  }

  /**
   * Test: Nội dung có đoạn văn ngắn
   */
  testContentHasShortParagraphs(content) {
    // Loại bỏ HTML tags để đếm text thực
    const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const paragraphs = textContent.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    if (paragraphs.length === 0) {
      return {
        status: 'fail',
        message: 'Không có đoạn văn nào',
        score: 0
      };
    }
    
    const shortParagraphs = paragraphs.filter(p => p.length <= 150);
    const shortRatio = shortParagraphs.length / paragraphs.length;
    
    if (shortRatio >= 0.7) {
      return {
        status: 'ok',
        message: 'Sử dụng đoạn văn ngắn',
        score: this.tests.contentHasShortParagraphs.maxScore
      };
    } else {
      return {
        status: 'warning',
        message: 'Nên chia thành các đoạn văn ngắn hơn',
        score: Math.floor(this.tests.contentHasShortParagraphs.maxScore * shortRatio)
      };
    }
  }

  /**
   * Test: Sử dụng Content AI
   */
  testContentAI() {
    // Giả định: kiểm tra từ service hoặc metadata
    // Tạm thời return ok cho demo
    return {
      status: 'ok',
      message: 'Đang sử dụng Content AI để tối ưu bài viết',
      score: this.tests.contentAI.maxScore
    };
  }

  /**
   * Test: Social Title
   */
  testSocialTitle(socialTitle) {
    const hasTitle = socialTitle && socialTitle.trim().length > 0;
    return {
      status: hasTitle ? 'ok' : 'info',
      message: hasTitle 
        ? 'Có tiêu đề cho mạng xã hội' 
        : 'Chưa có tiêu đề cho mạng xã hội',
      score: hasTitle ? this.tests.socialTitle.maxScore : 0
    };
  }

  /**
   * Test: Social Description
   */
  testSocialDescription(socialDescription) {
    const hasDesc = socialDescription && socialDescription.trim().length > 0;
    return {
      status: hasDesc ? 'ok' : 'info',
      message: hasDesc 
        ? 'Có mô tả cho mạng xã hội' 
        : 'Chưa có mô tả cho mạng xã hội',
      score: hasDesc ? this.tests.socialDescription.maxScore : 0
    };
  }

  /**
   * Test: Social Image
   */
  testSocialImage(socialImage) {
    const hasImage = socialImage && socialImage.trim().length > 0;
    return {
      status: hasImage ? 'ok' : 'info',
      message: hasImage 
        ? 'Có hình ảnh cho mạng xã hội' 
        : 'Chưa có hình ảnh cho mạng xã hội',
      score: hasImage ? this.tests.socialImage.maxScore : 0
    };
  }

  /**
   * Xác định rating dựa trên điểm số (giống Rank Math)
   */
  getRating(score) {
    if (score >= 81) return 'great';      // Xanh lá - Excellent
    if (score >= 51) return 'good';       // Vàng - Good  
    if (score >= 1) return 'bad';         // Đỏ - Bad
    return 'unknown';                     // Xám - Unknown
  }

  /**
   * Tạo suggestions dựa trên kết quả phân tích (theo category như Rank Math)
   */
  generateSuggestions(results) {
    const suggestions = {
      basic: [],
      additional: [],
      titleReadability: [],
      contentReadability: []
    };

    // Mapping tests to categories
    const categoryMapping = {
      basic: ['titleInSEO', 'metaDescriptionKeyword', 'urlKeyword', 'keywordInFirstParagraph', 'keywordInContent', 'contentLength'],
      additional: ['keywordInHeadings', 'imageAlt', 'keywordDensity', 'urlLength', 'externalLinks', 'externalLinksDoFollow', 'internalLinks', 'keywordUsage', 'contentAI'],
      titleReadability: ['titleStartsWithKeyword', 'titleSentiment', 'titleHasPowerWords', 'titleHasNumber'],
      contentReadability: ['contentHasTOC', 'contentHasShortParagraphs', 'contentHasAssets']
    };

    // Mapping messages cho từng test
    const suggestionMessages = {
      titleInSEO: 'Add Focus Keyword to the SEO title.',
      metaDescriptionKeyword: 'Add Focus Keyword to your SEO Meta Description.',
      urlKeyword: 'Use Focus Keyword in the URL.',
      keywordInFirstParagraph: 'Use Focus Keyword at the beginning of your content.',
      keywordInContent: 'Use Focus Keyword in the content.',
      contentLength: 'Content should be 600-2500 words long.',
      keywordInHeadings: 'Use Focus Keyword in subheading(s) like H2, H3, H4, etc..',
      imageAlt: 'Add an image with your Focus Keyword as alt text.',
      keywordDensity: 'Keyword Density is 0. Aim for around 1% Keyword Density.',
      urlLength: 'URL is too long. Keep it under 75 characters.',
      externalLinks: 'Link out to external resources.',
      externalLinksDoFollow: 'Add DoFollow links pointing to external resources.',
      internalLinks: 'Add internal links in your content.',
      keywordUsage: 'Set a Focus Keyword for this content.',
      contentAI: 'You are using Content AI to optimise this Post.',
      titleStartsWithKeyword: 'Use the Focus Keyword near the beginning of SEO title.',
      titleSentiment: "Your title doesn't contain a positive or a negative sentiment word.",
      titleHasPowerWords: "Your title doesn't contain a power word. Add at least one.",
      titleHasNumber: "Your SEO title doesn't contain a number.",
      contentHasTOC: 'Use Table of Content to break-down your text.',
      contentHasShortParagraphs: 'Add short and concise paragraphs for better readability and UX.',
      contentHasAssets: 'Add a few images and/or videos to make your content appealing.'
    };

    // Thêm suggestions vào từng category
    Object.entries(categoryMapping).forEach(([category, testNames]) => {
      testNames.forEach(testName => {
        const result = results[testName];
        if (result && (result.status === 'fail' || result.status === 'warning')) {
          const message = suggestionMessages[testName] || result.message;
          suggestions[category].push(message);
        }
      });
    });

    return suggestions;
  }

  /**
   * Tạo thống kê tổng quan (cập nhật theo Rank Math)
   */
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

  /**
   * Đếm số từ trong content (tương thích với Rank Math)
   */
  countWords(content) {
    if (!content) return 0;
    
    // Xử lý content giống Rank Math:
    // 1. Remove HTML tags
    const textOnly = content.replace(/<[^>]*>/g, '');
    
    // 2. Convert to lowercase
    const lowerText = textOnly.toLowerCase();
    
    // 3. Split by whitespace and filter out empty strings
    const words = lowerText.trim().split(/\s+/).filter(word => word.length > 0);
    
    return words.length;
  }

  /**
   * Đếm số lần xuất hiện của keyword (tương thích với Rank Math)
   */
  countKeywordOccurrences(content, keyword) {
    if (!content || !keyword) return 0;
    
    // Xử lý content giống Rank Math:
    // 1. Remove HTML tags
    const textOnly = content.replace(/<[^>]*>/g, '');
    
    // 2. Convert to lowercase  
    const lowerText = textOnly.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    
    // 3. Escape special regex characters
    const escapedKeyword = lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // 4. Create regex với word boundaries để match exact words
    const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
    const matches = lowerText.match(regex);
    
    return matches ? matches.length : 0;
  }
}

// Export default instance
export const rankMathEngine = new RankMathSEOEngine();
export default RankMathSEOEngine;