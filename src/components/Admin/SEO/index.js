/**
 * Rank Math SEO Integration for Frontend
 * 
 * Tái tạo logic chấm điểm SEO giống hệt Rank Math WordPress Plugin
 * Bao gồm:
 * - SEO Scoring Engine với 20+ test criteria
 * - Realtime analysis components
 * - Score widgets và displays
 * - React hooks và utilities
 */

// Core Engine
export { RankMathSEOEngine, rankMathEngine } from '../../utils/seoScoring/rankMathEngine';

// React Hook
export { useRankMathSEO } from '../../hooks/useRankMathSEO';

// Components
export { default as RankMathSEOScore } from './RankMathSEOScore';
export { default as SEORealtimeAnalyzerRankMath } from './SEORealtimeAnalyzerRankMath';
export { default as RankMathSEODemo } from './RankMathSEODemo';
export { 
  default as RankMathScoreWidget,
  RankMathScoreBadge,
  RankMathScoreInline
} from './RankMathScoreWidget';

// Utilities & Helpers
export * from '../../utils/seoScoring/rankMathHelpers';

// Re-export commonly used items with aliases
export { rankMathEngine as seoEngine } from '../../utils/seoScoring/rankMathEngine';
export { useRankMathSEO as useSEOAnalysis } from '../../hooks/useRankMathSEO';

/**
 * Quick usage examples:
 * 
 * // Basic usage with hook
 * const { score, rating, suggestions } = useRankMathSEO({
 *   title: 'My Page Title',
 *   content: '<p>Content here</p>',
 *   focusKeyword: 'main keyword'
 * });
 * 
 * // Display score widget
 * <RankMathScoreWidget score={score} rating={rating} />
 * 
 * // Full analysis component
 * <RankMathSEOScore 
 *   title={title}
 *   content={content}
 *   focusKeyword={keyword}
 *   showDetails={true}
 * />
 * 
 * // Realtime analyzer
 * <SEORealtimeAnalyzerRankMath 
 *   title={title}
 *   content={content}
 *   focusKeyword={keyword}
 *   expanded={true}
 * />
 */