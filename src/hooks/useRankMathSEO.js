import { useState, useEffect, useCallback, useMemo } from 'react';
import { rankMathEngine } from '../utils/seoScoring/rankMathEngine';

/**
 * Hook để sử dụng Rank Math SEO Engine
 * Cung cấp phân tích SEO realtime và quản lý state
 */
export const useRankMathSEO = ({
  title = '',
  content = '',
  metaDescription = '',
  url = '',
  focusKeyword = '',
  images = [],
  socialData = {},
  autoAnalyze = true,
  debounceMs = 1000
}) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce function
  const debounce = useCallback((func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  // Analyze function
  const analyzeContent = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      
      const result = rankMathEngine.analyzeSEO({
        title,
        content,
        metaDescription,
        url,
        focusKeyword,
        images,
        socialData
      });
      
      setAnalysis(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }, [title, content, metaDescription, url, focusKeyword, images, socialData]);

  // Debounced analyze
  const debouncedAnalyze = useMemo(
    () => debounce(analyzeContent, debounceMs),
    [analyzeContent, debounceMs, debounce]
  );

  // Auto analyze effect
  useEffect(() => {
    if (autoAnalyze && (title || content)) {
      debouncedAnalyze();
    }
  }, [title, content, metaDescription, url, focusKeyword, images, socialData, autoAnalyze, debouncedAnalyze]);

  // Manual analyze
  const analyze = useCallback(() => {
    return analyzeContent();
  }, [analyzeContent]);

  // Get specific test result
  const getTestResult = useCallback((testName) => {
    return analysis?.results?.[testName] || null;
  }, [analysis]);

  // Get suggestions for specific status
  const getSuggestionsByStatus = useCallback((status) => {
    if (!analysis?.results) return [];
    
    return Object.entries(analysis.results)
      .filter(([_, result]) => result.status === status)
      .map(([_, result]) => result.message);
  }, [analysis]);

  // Get score for specific category
  const getCategoryScore = useCallback((category) => {
    if (!analysis?.results) return 0;
    
    const categoryTests = {
      basic: ['titleInSEO', 'titleStartsWithKeyword', 'titleLength', 'metaDescription', 'metaDescriptionLength', 'metaDescriptionKeyword'],
      content: ['contentLength', 'keywordDensity', 'keywordInFirstParagraph', 'keywordInHeadings'],
      technical: ['urlKeyword', 'urlLength', 'imageAlt', 'imageTitle', 'internalLinks', 'externalLinks'],
      social: ['socialTitle', 'socialDescription', 'socialImage']
    };
    
    const tests = categoryTests[category] || [];
    const totalScore = tests.reduce((sum, testName) => {
      const result = analysis.results[testName];
      return sum + (result?.score || 0);
    }, 0);
    
    const maxScore = tests.reduce((sum, testName) => {
      return sum + (rankMathEngine.tests[testName]?.maxScore || 0);
    }, 0);
    
    return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  }, [analysis]);

  // Check if content is ready for analysis
  const isReady = useMemo(() => {
    return title.length > 0 || content.length > 0;
  }, [title, content]);

  // Get improvement suggestions
  const getImprovementSuggestions = useCallback(() => {
    if (!analysis?.results) return [];
    
    const suggestions = [];
    
    Object.entries(analysis.results).forEach(([testName, result]) => {
      if (result.status === 'fail') {
        suggestions.push({
          priority: 'high',
          test: testName,
          message: result.message,
          type: 'error'
        });
      } else if (result.status === 'warning') {
        suggestions.push({
          priority: 'medium',
          test: testName,
          message: result.message,
          type: 'warning'
        });
      }
    });
    
    // Sort by priority
    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [analysis]);

  // Get content statistics
  const getContentStats = useCallback(() => {
    return analysis?.stats || {
      titleLength: 0,
      contentLength: 0,
      wordCount: 0,
      keywordCount: 0,
      keywordDensity: 0
    };
  }, [analysis]);

  // Check if passes basic SEO
  const passesBasicSEO = useMemo(() => {
    if (!analysis) return false;
    return analysis.score >= 50;
  }, [analysis]);

  // Check if passes good SEO
  const passesGoodSEO = useMemo(() => {
    if (!analysis) return false;
    return analysis.score >= 70;
  }, [analysis]);

  // Check if passes excellent SEO
  const passesExcellentSEO = useMemo(() => {
    if (!analysis) return false;
    return analysis.score >= 81;
  }, [analysis]);

  return {
    // Analysis results
    analysis,
    loading,
    error,
    
    // Actions
    analyze,
    
    // Getters
    getTestResult,
    getSuggestionsByStatus,
    getCategoryScore,
    getImprovementSuggestions,
    getContentStats,
    
    // Status checks
    isReady,
    passesBasicSEO,
    passesGoodSEO,
    passesExcellentSEO,
    
    // Shortcuts
    score: analysis?.score || 0,
    rating: analysis?.rating || 'unknown',
    suggestions: analysis?.suggestions || [],
    stats: analysis?.stats || {}
  };
};

export default useRankMathSEO;