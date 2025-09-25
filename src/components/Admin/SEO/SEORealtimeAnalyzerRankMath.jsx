import React, { useState, useEffect, useRef } from 'react';
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
  Stack,
  Button,
  Tooltip
} from '@mui/material';
import {
  ExpandMore,
  TrendingUp,
  Link as LinkIcon,
  AutoAwesome,
  Restore
} from '@mui/icons-material';
import RankMathSEOScore from './RankMathSEOScoreNew';
import { useRankMathSEO } from '../../../hooks/useRankMathSEONew';
import { generateSlug, validateSlug, autoGenerateSlug } from '../../../utils/slugify';
import { FRONTEND_PUBLIC_URL } from '../../../constants/environment';

const SEORealtimeAnalyzer = ({ 
  title = '', 
  content = '',
  metaDescription = '',
  slug = '',
  focusKeyword = '', 
  onFocusKeywordChange,
  onMetaDescriptionChange,
  onSlugChange,
  images = [],
  socialData = {},
  expanded = true,
  isSlugFromDatabase = false,
  mode = 'add'
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [localFocusKeyword, setLocalFocusKeyword] = useState(focusKeyword);
  const [localMetaDescription, setLocalMetaDescription] = useState(metaDescription);
  const [localSlug, setLocalSlug] = useState(slug);
  const [originalSlug, setOriginalSlug] = useState(slug); // Lưu slug gốc từ database
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(true); // Luôn để true để không tự động generate
  const [showAllIssues, setShowAllIssues] = useState(false);
  const hasManualSlugEditRef = useRef(false);

  // Calculate full URL from slug using environment URL
  const fullUrl = localSlug ? `${FRONTEND_PUBLIC_URL}/tin-tuc/${localSlug}` : `${FRONTEND_PUBLIC_URL}/tin-tuc/`;

  // Sử dụng Rank Math SEO hook mới
  const {
    analysis,
    stats,
    suggestions,
    categoriesSummary,
    isAnalyzing
  } = useRankMathSEO({
    title,
    content,
    metaDescription: localMetaDescription,
    url: fullUrl,
    focusKeyword: localFocusKeyword,
    images,
    socialData,
    autoAnalyze: true
  });

  // Update local state when props change
  useEffect(() => {
    setLocalFocusKeyword(focusKeyword);
  }, [focusKeyword]);

  useEffect(() => {
    setLocalMetaDescription(metaDescription);
  }, [metaDescription]);

  useEffect(() => {
    const safeSlug = slug || '';
    setLocalSlug(safeSlug);
    if (!hasManualSlugEditRef.current) {
      setOriginalSlug(safeSlug);
    }

    hasManualSlugEditRef.current = false;
  }, [slug]);





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
    const newMetaDescription = event.target.value;
    setLocalMetaDescription(newMetaDescription);
    if (onMetaDescriptionChange) {
      onMetaDescriptionChange(newMetaDescription);
    }
  };

  // Handle slug change
  const handleSlugChange = (event) => {
    const newSlug = event.target.value;
    hasManualSlugEditRef.current = true;
    setLocalSlug(newSlug);
    setIsSlugManuallyEdited(true);
    if (onSlugChange) {
      onSlugChange(newSlug);
    }
  };

  // Generate slug from title manually
  const handleGenerateSlug = () => {
    if (title) {
      const newSlug = generateSlug(title);
      hasManualSlugEditRef.current = true;
      setLocalSlug(newSlug);
      setIsSlugManuallyEdited(true); // Đánh dấu là đã được chỉnh sửa thủ công
      if (onSlugChange) {
        onSlugChange(newSlug);
      }
    }
  };

  // Restore original slug from database
  const handleRestoreOriginalSlug = () => {
    hasManualSlugEditRef.current = true;
    setLocalSlug(originalSlug);
    setIsSlugManuallyEdited(true);
    if (onSlugChange) {
      onSlugChange(originalSlug);
    }
  };

  // Get category scores from new data structure
  const categoryScores = {
    basic: categoriesSummary?.find(c => c.key === 'basicSEO')?.score || 0,
    content: categoriesSummary?.find(c => c.key === 'contentReadability')?.score || 0,
    technical: categoriesSummary?.find(c => c.key === 'additional')?.score || 0,
    title: categoriesSummary?.find(c => c.key === 'titleReadability')?.score || 0
  };

  // Get suggestions from new hook
  const improvementSuggestions = suggestions || [];

  // Calculate passes status from score
  const currentScore = analysis?.score || 0;
  const passesExcellentSEO = currentScore >= 90;
  const passesGoodSEO = currentScore >= 70;
  const passesBasicSEO = currentScore >= 50;

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

        {/* Meta Description Input - Always show */}
        <TextField
          fullWidth
          label="Meta Description"
          value={localMetaDescription}
          onChange={handleMetaDescriptionChange}
          placeholder="Nhập mô tả meta cho trang (120-160 ký tự)"
          multiline
          rows={2}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: localMetaDescription.length === 0 ? 'error.main' :
                           localMetaDescription.length < 120 ? 'warning.main' :
                           localMetaDescription.length > 160 ? 'warning.main' : 'success.main'
              }
            }
          }}
          size="small"
          error={localMetaDescription.length > 160}
          helperText={
            `${localMetaDescription.length}/160 ký tự. ` +
            (localMetaDescription.length === 0 ? '❌ Thiếu Meta Description' :
             localMetaDescription.length < 120 ? '⚠️ Nên từ 120-160 ký tự' :
             localMetaDescription.length > 160 ? '❌ Quá dài (>160 ký tự)' : '✅ Độ dài tốt')
          }
        />

        {/* Permalink/Slug Input - Always show */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
            <TextField
              fullWidth
              label="Permalink (Slug)"
              value={localSlug}
              onChange={handleSlugChange}
              placeholder="duong-dan-url-bai-viet"
              InputProps={{
                startAdornment: (
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                    <LinkIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  </Box>
                )
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: validateSlug(localSlug).isValid ? 'success.main' : 'error.main'
                  }
                }
              }}
              size="small"
              error={!validateSlug(localSlug).isValid}
              helperText={validateSlug(localSlug).message}
            />
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleGenerateSlug}
                disabled={!title}
                startIcon={<AutoAwesome />}
                sx={{ minWidth: 120 }}
              >
                Tự động
              </Button>
              {mode === 'edit' && originalSlug && (
                <Tooltip title={`Khôi phục slug gốc từ database: "${originalSlug}"`}>
                  <span>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleRestoreOriginalSlug}
                      disabled={!originalSlug || localSlug === originalSlug}
                      startIcon={<Restore />}
                      sx={{ minWidth: 120 }}
                      color="secondary"
                    >
                      Khôi phục
                    </Button>
                  </span>
                </Tooltip>
              )}
            </Stack>
          </Box>
          
          {/* Google Search Preview */}
          {(title || localMetaDescription) && (
            <Box sx={{ 
              p: 2, 
              border: '1px solid', 
              borderColor: 'divider', 
              borderRadius: 2, 
              backgroundColor: 'grey.50',
              fontFamily: 'Arial, sans-serif'
            }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '12px', mb: 0.5 }}>
                🔍 Preview Google Search
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#1a0dab', 
                  fontSize: '20px', 
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  lineHeight: 1.2,
                  '&:hover': { textDecoration: 'none' }
                }}
              >
                {title || 'Tiêu đề trang'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#006621', fontSize: '14px', mt: 0.5 }}>
                {fullUrl}
              </Typography>
              <Typography variant="body2" sx={{ color: '#4d5156', fontSize: '14px', mt: 0.5, lineHeight: 1.4 }}>
                {localMetaDescription || 'Meta description sẽ hiển thị ở đây...'}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Main SEO Score Component */}
        <RankMathSEOScore
          title={title}
          content={content}
          metaDescription={localMetaDescription}
          url={fullUrl}
          focusKeyword={localFocusKeyword}
          images={images}
          socialData={socialData}
          showDetails={isExpanded}
          autoAnalyze={true}
        />

        {/* Expanded Details */}
        <Collapse in={isExpanded}>
          <Divider sx={{ my: 2 }} />
          
          {/* Category Scores
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Điểm theo danh mục
          </Typography> */}
          {/* <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ color: categoryScores.basic >= 70 ? 'success.main' : categoryScores.basic >= 50 ? 'warning.main' : 'error.main' }}>
                  {categoryScores.basic}%
                </Typography>
                <Typography variant="caption">Basic SEO</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ color: categoryScores.content >= 70 ? 'success.main' : categoryScores.content >= 50 ? 'warning.main' : 'error.main' }}>
                  {categoryScores.content}%
                </Typography>
                <Typography variant="caption">Content Readability</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ color: categoryScores.technical >= 70 ? 'success.main' : categoryScores.technical >= 50 ? 'warning.main' : 'error.main' }}>
                  {categoryScores.technical}%
                </Typography>
                <Typography variant="caption">Additional</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ color: categoryScores.title >= 70 ? 'success.main' : categoryScores.title >= 50 ? 'warning.main' : 'error.main' }}>
                  {categoryScores.title}%
                </Typography>
                <Typography variant="caption">Title Readability</Typography>
              </Box>
            </Grid>
          </Grid> */}

          {/* SEO Status Badges */}
          {/* <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
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
          </Stack> */}

          {/* Priority Improvements */}
          {improvementSuggestions.length > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Ưu tiên cải thiện ({improvementSuggestions.length} vấn đề):
                </Typography>
                {improvementSuggestions.length > 5 && (
                  <Button 
                    size="small" 
                    variant="text" 
                    color="inherit" 
                    onClick={() => setShowAllIssues(!showAllIssues)}
                  >
                    {showAllIssues ? 'Ẩn bớt' : 'Xem tất cả'}
                  </Button>
                )}
              </Box>
              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                {(showAllIssues ? improvementSuggestions : improvementSuggestions.slice(0, 5)).map((suggestion, index) => (
                  <li key={index}>
                    <Typography variant="body2">
                      {suggestion.priority === 'high' ? '🔴' : '🟡'} {suggestion.message}
                    </Typography>
                  </li>
                ))}
              </Box>
              {!showAllIssues && improvementSuggestions.length > 5 && (
                <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1, color: 'text.secondary' }}>
                  ...và {improvementSuggestions.length - 5} vấn đề khác
                </Typography>
              )}
            </Alert>
          )}

         
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default SEORealtimeAnalyzer;
