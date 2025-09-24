import { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import { rankMathEngine } from '../utils/seoScoring/rankMathEngineNew';

/**
 * Hook sử dụng Rank Math SEO Engine mới
 * Tương thích với cấu trúc error-counting của Rank Math thật
 */
export const useRankMathSEONew = ({
  title = '',
  content = '',
  metaDescription = '',
  url = '',
  focusKeyword = '',
  images = [],
  socialData = {},
  autoAnalyze = true,
  debounceDelay = 500
}) => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState(null);

  // Debounced analysis function
  const debouncedAnalyze = useMemo(
    () => debounce(async (data) => {
      setIsAnalyzing(true);
      try {
        const result = rankMathEngine.analyzeSEO(data);
        setAnalysis(result);
        setLastAnalysis(Date.now());
      } catch (error) {
        console.error('SEO Analysis Error:', error);
        setAnalysis(null);
      } finally {
        setIsAnalyzing(false);
      }
    }, debounceDelay),
    [debounceDelay]
  );

  // Manual analysis trigger
  const manualAnalyze = useCallback(() => {
    const data = {
      title,
      content,
      metaDescription,
      url,
      focusKeyword,
      images,
      socialData
    };

    debouncedAnalyze(data);
  }, [title, content, metaDescription, url, focusKeyword, images, socialData, debouncedAnalyze]);

  // Auto analysis when data changes
  useEffect(() => {
    if (autoAnalyze && (title || content || metaDescription || focusKeyword)) {
      manualAnalyze();
    }
  }, [title, content, metaDescription, url, focusKeyword, autoAnalyze, manualAnalyze]);

  // Get category details
  const getCategoryDetails = useCallback((categoryKey) => {
    if (!analysis?.categories?.[categoryKey]) return null;
    
    const categoryData = analysis.categories[categoryKey];
    const categoryErrors = analysis.errors?.[categoryKey] || [];
    
    // Tính toán passed tests cho category này với hệ thống điểm mới
    const passedTests = [];
    const failedTests = [];
    let categoryTests = [];
    
    if (analysis?.results && rankMathEngine.categories[categoryKey]) {
      categoryTests = rankMathEngine.categories[categoryKey].tests;
      
      categoryTests.forEach(testInfo => {
        const testName = testInfo.name;
        const testResult = analysis.results[testName];
        
        if (testResult) {
          const currentScore = testResult.score || 0;
          const maxScore = testInfo.maxScore;
          
          // Test được coi là passed khi đạt điểm tối đa
          if (currentScore === maxScore && testResult.passed) {
            passedTests.push({
              test: testName,
              message: rankMathEngine.getSuccessMessage(testName, testResult),
              score: testResult.score,
              maxScore: testInfo.maxScore,
              scoreText: testResult.scoreText
            });
          } else {
            failedTests.push({
              test: testName,
              message: testResult.message,
              score: testResult.score || 0,
              maxScore: testInfo.maxScore,
              scoreText: testResult.scoreText || `${currentScore}/${maxScore}`
            });
          }
        }
      });
    }
    
    return {
      name: categoryData.name,
      maxScore: categoryData.maxScore,
      score: categoryData.score,
      tests: categoryData.tests,
      errors: categoryErrors,
      passedTestsList: passedTests, // Danh sách chi tiết các test đã pass
      failedTestsList: failedTests, // Danh sách chi tiết các test đã fail
      passedCount: passedTests.length,
      failedCount: failedTests.length,
      totalTests: categoryTests.length,
      percentage: categoryData.maxScore > 0 ? Math.round((categoryData.score / categoryData.maxScore) * 100) : 0
    };
  }, [analysis]);

  // Get all categories summary
  const categoriesSummary = useMemo(() => {
    if (!analysis?.categories) return [];
    
    return Object.keys(analysis.categories).map(categoryKey => ({
      key: categoryKey,
      ...getCategoryDetails(categoryKey)
    }));
  }, [analysis, getCategoryDetails]);

  // Get errors by category
  const getErrorsByCategory = useCallback((categoryKey) => {
    return analysis?.errors?.[categoryKey] || [];
  }, [analysis]);

  // Get total errors count
  const totalErrors = useMemo(() => {
    if (!analysis?.errors) return 0;
    return Object.values(analysis.errors).reduce((total, categoryErrors) => total + categoryErrors.length, 0);
  }, [analysis]);

  // Get improvement suggestions with priority
  const suggestions = useMemo(() => {
    if (!analysis?.errors) return [];
    
    const allSuggestions = [];
    
    Object.entries(analysis.errors).forEach(([categoryKey, categoryErrors]) => {
      const categoryName = analysis.categories[categoryKey]?.name || categoryKey;
      
      categoryErrors.forEach(error => {
        allSuggestions.push({
          category: categoryKey,
          categoryName,
          test: error.test,
          message: error.message,
          score: error.score || 0,
          maxScore: error.maxScore,
          scoreText: `${error.score || 0}/${error.maxScore}`,
          priority: categoryKey === 'basicSEO' ? 'high' : 
                   categoryKey === 'additional' ? 'medium' : 'low'
        });
      });
    });
    
    // Sort by priority and score impact
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return allSuggestions.sort((a, b) => {
      // Sort by priority first
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by score impact (missing points)
      const aMissingPoints = (a.maxScore || 0) - (a.score || 0);
      const bMissingPoints = (b.maxScore || 0) - (b.score || 0);
      return bMissingPoints - aMissingPoints;
    });
  }, [analysis]);

  // Get high priority suggestions (Basic SEO errors)
  const highPrioritySuggestions = useMemo(() => {
    return suggestions.filter(s => s.priority === 'high');
  }, [suggestions]);

  // Check if analysis is ready
  const isReady = useMemo(() => {
    return title.length > 0 || content.length > 0;
  }, [title, content]);

  // Get test result by name
  const getTestResult = useCallback((testName) => {
    return analysis?.results?.[testName] || null;
  }, [analysis]);

  // Check if test passed
  const isTestPassed = useCallback((testName) => {
    const result = getTestResult(testName);
    return result?.passed === true;
  }, [getTestResult]);

  // Get analysis stats
  const stats = useMemo(() => {
    if (!analysis) return null;
    
    return {
      score: analysis.score || 0,
      rating: analysis.rating || 'poor',
      totalTests: analysis.totalTests || 0,
      passedTests: analysis.passedTests || 0,
      failedTests: (analysis.totalTests || 0) - (analysis.passedTests || 0),
      totalErrors,
      wordCount: analysis.stats?.wordCount || 0,
      keywordDensity: analysis.stats?.keywordDensity || 0,
      titleLength: analysis.stats?.titleLength || 0,
      keywordCount: analysis.stats?.keywordCount || 0
    };
  }, [analysis, totalErrors]);

  // Get rating details
  const getRatingInfo = useCallback((rating) => {
    const ratingMap = {
      excellent: { color: 'success', label: 'Xuất sắc', description: 'SEO rất tốt' },
      good: { color: 'info', label: 'Tốt', description: 'SEO khá ổn' },
      ok: { color: 'warning', label: 'Trung bình', description: 'Cần cải thiện' },
      poor: { color: 'warning', label: 'Kém', description: 'Cần cải thiện nhiều' },
      bad: { color: 'error', label: 'Rất kém', description: 'Cần cải thiện toàn bộ' }
    };
    
    return ratingMap[rating] || ratingMap.poor;
  }, []);

  // Reset analysis
  const resetAnalysis = useCallback(() => {
    setAnalysis(null);
    setLastAnalysis(null);
  }, []);

  return {
    // Analysis data
    analysis,
    stats,
    
    // Categories
    categoriesSummary,
    getCategoryDetails,
    getErrorsByCategory,
    
    // Suggestions
    suggestions,
    highPrioritySuggestions,
    totalErrors,
    
    // Test results
    getTestResult,
    isTestPassed,
    
    // Utilities
    getRatingInfo,
    isReady,
    isAnalyzing,
    lastAnalysis,
    
    // Actions
    manualAnalyze,
    resetAnalysis
  };
};

export { useRankMathSEONew as useRankMathSEO };
export default useRankMathSEONew;