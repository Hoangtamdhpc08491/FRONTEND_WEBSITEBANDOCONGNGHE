import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Alert,
  Collapse,
  IconButton,
  Divider,
  Grid,
  Stack
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Search,
  TrendingUp
} from '@mui/icons-material';
import RankMathSEOScore from './RankMathSEOScore';
import { useRankMathSEO } from '../../../hooks/useRankMathSEO';

const SEORealtimeAnalyzer = ({ 
  title = '', 
  content = '',
  metaDescription = '',
  url = '',
  focusKeyword = '', 
  onFocusKeywordChange,
  images = [],
  socialData = {},
  expanded = true,
  showAdvanced = false
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [localFocusKeyword, setLocalFocusKeyword] = useState(focusKeyword);
  const [localMetaDescription, setLocalMetaDescription] = useState(metaDescription);

  // Sử dụng Rank Math SEO hook
  const {
    analysis,
    loading,
    error,
    score,
    rating,
    suggestions,
    stats,
    getCategoryScore,
    getImprovementSuggestions,
    passesBasicSEO,
    passesGoodSEO,
    passesExcellentSEO
  } = useRankMathSEO({
    title,
    content,
    metaDescription: localMetaDescription,
    url,
    focusKeyword: localFocusKeyword,
    images,
    socialData,
    autoAnalyze: true,
    debounceMs: 800
  });

  // Update local state when props change
  useEffect(() => {
    setLocalFocusKeyword(focusKeyword);
  }, [focusKeyword]);

  useEffect(() => {
    setLocalMetaDescription(metaDescription);
  }, [metaDescription]);

  // Handle focus keyword change
  const handleFocusKeywordChange = (event) => {
    const newKeyword = event.target.value;
    setLocalFocusKeyword(newKeyword);
    if (onFocusKeywordChange) {
      onFocusKeywordChange(newKeyword);
    }
  };

  // Handle meta description change
  const handleMetaDescriptionChange = (event) => {
    setLocalMetaDescription(event.target.value);
  };

  // Get category scores
  const categoryScores = {
    basic: getCategoryScore('basic'),
    content: getCategoryScore('content'),
    technical: getCategoryScore('technical'),
    social: getCategoryScore('social')
  };

  const improvementSuggestions = getImprovementSuggestions();

  return (
    <Card sx={{ 
      mb: 3, 
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)'
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              Phân tích SEO Realtime (Rank Math Engine)
            </Typography>
          </Box>
          <IconButton 
            onClick={() => setIsExpanded(!isExpanded)}
            sx={{ 
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s'
            }}
          >
            <ExpandMore />
          </IconButton>
        </Box>

        {/* Focus Keyword Input */}
        <TextField
          fullWidth
          label="Focus Keyword (Từ khóa chính)"
          value={localFocusKeyword}
          onChange={handleFocusKeywordChange}
          placeholder="Nhập từ khóa chính cho nội dung"
          sx={{ mb: 2 }}
          size="small"
          helperText="Từ khóa chính sẽ được sử dụng để phân tích SEO"
        />

        {/* Meta Description Input */}
        {showAdvanced && (
          <TextField
            fullWidth
            label="Meta Description"
            value={localMetaDescription}
            onChange={handleMetaDescriptionChange}
            placeholder="Nhập mô tả meta cho trang"
            multiline
            rows={2}
            sx={{ mb: 2 }}
            size="small"
            helperText={`${localMetaDescription.length}/160 ký tự. Nên từ 120-160 ký tự`}
          />
        )}

        {/* Main SEO Score Component */}
        <RankMathSEOScore
          title={title}
          content={content}
          metaDescription={localMetaDescription}
          url={url}
          focusKeyword={localFocusKeyword}
          images={images}
          socialData={socialData}
          showDetails={isExpanded}
          autoAnalyze={true}
        />

        {/* Expanded Details */}
        <Collapse in={isExpanded}>
          <Divider sx={{ my: 2 }} />
          
          {/* Category Scores */}
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Điểm theo danh 
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ color: categoryScores.basic >= 70 ? 'success.main' : categoryScores.basic >= 50 ? 'warning.main' : 'error.main' }}>
                  {categoryScores.basic}%
                </Typography>
                <Typography variant="caption">Cơ bản</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ color: categoryScores.content >= 70 ? 'success.main' : categoryScores.content >= 50 ? 'warning.main' : 'error.main' }}>
                  {categoryScores.content}%
                </Typography>
                <Typography variant="caption">Nội dung</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ color: categoryScores.technical >= 70 ? 'success.main' : categoryScores.technical >= 50 ? 'warning.main' : 'error.main' }}>
                  {categoryScores.technical}%
                </Typography>
                <Typography variant="caption">Kỹ thuật</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ color: categoryScores.social >= 70 ? 'success.main' : categoryScores.social >= 50 ? 'warning.main' : 'error.main' }}>
                  {categoryScores.social}%
                </Typography>
                <Typography variant="caption">Mạng XH</Typography>
              </Box>
            </Grid>
          </Grid>

          {/* SEO Status Badges */}
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Alert 
              severity={passesExcellentSEO ? "success" : "info"} 
              variant={passesExcellentSEO ? "filled" : "outlined"}
              sx={{ flex: 1 }}
            >
              Xuất sắc (81+): {passesExcellentSEO ? '✅' : '❌'}
            </Alert>
            <Alert 
              severity={passesGoodSEO ? "success" : "warning"} 
              variant={passesGoodSEO ? "filled" : "outlined"}
              sx={{ flex: 1 }}
            >
              Tốt (70+): {passesGoodSEO ? '✅' : '❌'}
            </Alert>
            <Alert 
              severity={passesBasicSEO ? "success" : "error"} 
              variant={passesBasicSEO ? "filled" : "outlined"}
              sx={{ flex: 1 }}
            >
              Cơ bản (50+): {passesBasicSEO ? '✅' : '❌'}
            </Alert>
          </Stack>

          {/* Priority Improvements */}
          {improvementSuggestions.length > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Ưu tiên cải thiện ({improvementSuggestions.length} vấn đề):
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                {improvementSuggestions.slice(0, 5).map((suggestion, index) => (
                  <li key={index}>
                    <Typography variant="body2">
                      {suggestion.priority === 'high' ? '🔴' : '🟡'} {suggestion.message}
                    </Typography>
                  </li>
                ))}
              </Box>
            </Alert>
          )}

          {/* Content Statistics */}
          <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
            Thống kê nội dung
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Số từ: <strong>{stats.wordCount || 0}</strong>
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Độ dài tiêu đề: <strong>{stats.titleLength || 0}</strong>
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Mật độ keyword: <strong>{stats.keywordDensity || 0}%</strong>
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Lần xuất hiện: <strong>{stats.keywordCount || 0}</strong>
              </Typography>
            </Grid>
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default SEORealtimeAnalyzer;
        text: 'Tiêu đề quá dài. Nên có 30-60 ký tự', 
        icon: Warning
      });
      score += 10;
    } else {
      suggestions.push({
        type: 'success',
        text: 'Độ dài tiêu đề tốt',
        icon: CheckCircle
      });
      score += 25;
    }

    // Content length analysis
    if (stats.contentLength === 0) {
      suggestions.push({
        type: 'error',
        text: 'Nội dung không được để trống',
        icon: Error
      });
    } else if (stats.wordCount < 300) {
      suggestions.push({
        type: 'warning',
        text: 'Nội dung quá ngắn. Nên có ít nhất 300 từ',
        icon: Warning
      });
      score += 10;
    } else if (stats.wordCount > 2000) {
      suggestions.push({
        type: 'info',
        text: 'Nội dung rất dài. Hãy đảm bảo dễ đọc',
        icon: Lightbulb
      });
      score += 20;
    } else {
      suggestions.push({
        type: 'success',
        text: 'Độ dài nội dung phù hợp',
        icon: CheckCircle
      });
      score += 25;
    }

    // Focus keyword analysis
    if (!keyword) {
      suggestions.push({
        type: 'warning',
        text: 'Chưa có từ khóa focus. Hãy thêm từ khóa chính',
        icon: Warning
      });
    } else {
      const titleContainsKeyword = title.toLowerCase().includes(keyword.toLowerCase());
      const contentContainsKeyword = content.toLowerCase().includes(keyword.toLowerCase());

      if (titleContainsKeyword) {
        suggestions.push({
          type: 'success', 
          text: 'Từ khóa xuất hiện trong tiêu đề',
          icon: CheckCircle
        });
        score += 15;
      } else {
        suggestions.push({
          type: 'warning',
          text: 'Từ khóa chưa xuất hiện trong tiêu đề',
          icon: Warning
        });
      }

      if (contentContainsKeyword) {
        if (stats.keywordDensity >= 0.5 && stats.keywordDensity <= 3) {
          suggestions.push({
            type: 'success',
            text: `Mật độ từ khóa tốt (${stats.keywordDensity.toFixed(1)}%)`,
            icon: CheckCircle
          });
          score += 15;
        } else if (stats.keywordDensity > 3) {
          suggestions.push({
            type: 'warning',
            text: `Mật độ từ khóa quá cao (${stats.keywordDensity.toFixed(1)}%)`,
            icon: Warning
          });
          score += 5;
        } else {
          suggestions.push({
            type: 'warning',
            text: `Mật độ từ khóa thấp (${stats.keywordDensity.toFixed(1)}%)`,
            icon: Warning
          });
          score += 5;
        }
      } else {
        suggestions.push({
          type: 'error',
          text: 'Từ khóa không xuất hiện trong nội dung',
          icon: Error
        });
      }
    }

    // Structure analysis
    if (stats.paragraphCount < 3) {
      suggestions.push({
        type: 'warning',
        text: 'Nên chia nội dung thành nhiều đoạn văn hơn',
        icon: Warning
      });
    } else {
      suggestions.push({
        type: 'success',
        text: 'Cấu trúc đoạn văn tốt',
        icon: CheckCircle
      });
      score += 20;
    }

    setAnalysis({
      score: Math.min(score, 100),
      suggestions,
      stats
    });
  };

  const calculateKeywordDensity = (content, keyword) => {
    if (!keyword || !content) return 0;
    
    const words = content.toLowerCase().split(/\s+/);
    const keywordCount = words.filter(word => 
      word.includes(keyword.toLowerCase())
    ).length;
    
    return words.length > 0 ? (keywordCount / words.length) * 100 : 0;
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#4CAF50';
    if (score >= 50) return '#FF9800';
    return '#f44336';
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return 'Tốt';
    if (score >= 50) return 'Trung bình';
    return 'Cần cải thiện';
  };

  const handleFocusKeywordChange = (event) => {
    const value = event.target.value;
    setLocalFocusKeyword(value);
    onFocusKeywordChange?.(value);
  };

  return (
    <Card sx={{ 
      mb: 2,
      border: `2px solid ${getScoreColor(analysis.score)}`,
      borderRadius: 2,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <CardContent sx={{ py: 2 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp sx={{ color: getScoreColor(analysis.score) }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Phân tích SEO Real-time
            </Typography>
            <Chip 
              label={getScoreLabel(analysis.score)}
              sx={{ 
                background: getScoreColor(analysis.score),
                color: 'white',
                fontWeight: 'bold'
              }}
              size="small"
            />
          </Box>
          <IconButton size="small">
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        {/* SEO Score Progress */}
        <Box sx={{ mt: 2, mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="textSecondary">
              Điểm SEO
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: getScoreColor(analysis.score) }}>
              {analysis.score}/100
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={analysis.score}
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: '#f0f0f0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getScoreColor(analysis.score),
                borderRadius: 4
              }
            }}
          />
        </Box>

        <Collapse in={isExpanded}>
          {/* Focus Keyword Input */}
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Từ khóa chính (Focus Keyword)"
              value={localFocusKeyword}
              onChange={handleFocusKeywordChange}
              placeholder="vd: laptop gaming"
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              helperText="Từ khóa chính mà bài viết muốn tối ưu"
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* SEO Statistics */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Thống kê nội dung:
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Typography variant="caption" color="textSecondary">
                Tiêu đề: {analysis.stats.titleLength} ký tự
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Từ: {analysis.stats.wordCount} từ
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Đoạn văn: {analysis.stats.paragraphCount}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Mật độ: {analysis.stats.keywordDensity?.toFixed(1)}%
              </Typography>
            </Box>
          </Box>

          {/* SEO Suggestions */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Gợi ý cải thiện:
            </Typography>
            <List dense sx={{ py: 0 }}>
              {analysis.suggestions.map((suggestion, index) => (
                <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <suggestion.icon 
                      sx={{ 
                        fontSize: 16,
                        color: suggestion.type === 'success' ? '#4CAF50' :
                               suggestion.type === 'warning' ? '#FF9800' :
                               suggestion.type === 'error' ? '#f44336' : '#2196F3'
                      }} 
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={suggestion.text}
                    primaryTypographyProps={{ 
                      variant: 'caption',
                      sx: { lineHeight: 1.4 }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Quick Tips */}
          <Alert 
            severity="info" 
            sx={{ mt: 2 }}
            icon={<Lightbulb />}
          >
            <Typography variant="caption">
              <strong>Mẹo:</strong> Phân tích tự động cập nhật khi bạn nhập. 
              Điểm SEO ≥70 là tốt, 50-69 là trung bình.
            </Typography>
          </Alert>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default SEORealtimeAnalyzer;
