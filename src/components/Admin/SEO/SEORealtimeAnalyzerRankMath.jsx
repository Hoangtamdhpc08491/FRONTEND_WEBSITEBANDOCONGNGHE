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
            Điểm theo danh mục
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