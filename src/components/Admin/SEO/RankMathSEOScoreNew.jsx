import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Alert,
  LinearProgress,
  Stack,
  Divider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  ExpandMore,
  Search,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useRankMathSEO } from '../../../hooks/useRankMathSEONew';

// Styled components giống Rank Math
const SEOScoreCircle = styled(Box)(({ theme, rating }) => {
  const getColors = () => {
    switch (rating) {
      case 'excellent':
        return {
          primary: '#4CAF50',
          secondary: '#E8F5E8'
        };
      case 'good':
        return {
          primary: '#2196F3',
          secondary: '#E3F2FD'
        };
      case 'ok':
        return {
          primary: '#FF9800',
          secondary: '#FFF3E0'
        };
      default:
        return {
          primary: '#f44336',
          secondary: '#FFEBEE'
        };
    }
  };

  const colors = getColors();

  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: '50%',
    backgroundColor: colors.secondary,
    border: `3px solid ${colors.primary}`,
    marginRight: theme.spacing(2),
    
    '& .score': {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: colors.primary,
      lineHeight: 1,
      
      '& .outof': {
        fontSize: '0.7rem',
        color: theme.palette.text.secondary
      }
    },
    
    '& .label': {
      fontSize: '0.6rem',
      color: theme.palette.text.secondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop: 2
    }
  };
});

const RankMathSEOScoreNew = ({ 
  title = '', 
  content = '', 
  metaDescription = '',
  url = '',
  focusKeyword = '', 
  images = [],
  socialData = {},
  autoAnalyze = true,
  showDetails = true,
  onScoreChange
}) => {
  const [expanded, setExpanded] = useState(false);

  // Use new hook
  const {
    analysis,
    stats,
    categoriesSummary,
    suggestions,
    isAnalyzing,
    manualAnalyze,
    getRatingInfo
  } = useRankMathSEO({
    title,
    content,
    metaDescription,
    url,
    focusKeyword,
    images,
    socialData,
    autoAnalyze
  });

  // Update parent when score changes
  useEffect(() => {
    if (analysis && onScoreChange) {
      onScoreChange(analysis.score, analysis.rating);
    }
  }, [analysis, onScoreChange]);

  if (isAnalyzing) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <CircularProgress size={24} sx={{ mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Đang phân tích SEO...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Chưa có kết quả phân tích SEO
          </Typography>
          {!autoAnalyze && (
            <IconButton 
              onClick={manualAnalyze}
              sx={{ 
                backgroundColor: 'primary.main', 
                color: 'white',
                '&:hover': { backgroundColor: 'primary.dark' }
              }}
            >
              <Search />
            </IconButton>
          )}
        </CardContent>
      </Card>
    );
  }

  const { score, rating } = analysis;
  const ratingInfo = getRatingInfo(rating);

  return (
    <Card sx={{ 
      mb: 2,
      borderRadius: 2,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      overflow: 'visible'
    }}>
      <CardContent>
        {/* Header với điểm số */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SEOScoreCircle rating={rating}>
            <span className="score">
              {score}
              <span className="outof">/ 100</span>
            </span>
            <span className="label">SEO Score</span>
          </SEOScoreCircle>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold' }}>
              Phân tích SEO Rank Math
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Điểm SEO: {score}/100 - {ratingInfo.label}
            </Typography>
            
            {/* Stats nhanh */}
            {stats && (
              <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  📝 {stats.wordCount} từ
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  🎯 Mật độ keyword: {stats.keywordDensity}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  🔤 Tiêu đề: {stats.titleLength} ký tự
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ❌ Lỗi: {stats.totalErrors}
                </Typography>
              </Stack>
            )}

            {/* Progress bar */}
            <LinearProgress 
              variant="determinate" 
              value={score} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: rating === 'excellent' ? '#4CAF50' : 
                                 rating === 'good' ? '#2196F3' : 
                                 rating === 'ok' ? '#FF9800' : '#f44336'
                }
              }} 
            />
          </Box>

          {showDetails && (
            <IconButton 
              onClick={() => setExpanded(!expanded)}
              sx={{ 
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s'
              }}
            >
              <ExpandMore />
            </IconButton>
          )}
        </Box>

        {/* Categories summary */}
        {categoriesSummary && categoriesSummary.length > 0 && (
          <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Tổng quan theo danh mục Rank Math:
            </Typography>
            <Grid container spacing={1}>
              {categoriesSummary.map(category => (
                <Grid item xs={12} sm={6} key={category.key}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {category.failedTests > 0 ? (
                      <ErrorIcon color="error" fontSize="small" />
                    ) : (
                      <CheckCircleIcon color="success" fontSize="small" />
                    )}
                    <Typography variant="body2">
                      <strong>{category.name}:</strong> {category.failedTests} errors / {category.totalTests} tests
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Alert>
        )}

        {/* Chi tiết theo category */}
        {showDetails && (
          <Collapse in={expanded}>
            <Divider sx={{ my: 2 }} />
            
            {/* Render categories với errors */}
            {categoriesSummary.map(category => {
              const hasErrors = category.failedTests > 0;
              
              return (
                <Accordion 
                  key={category.key}
                  defaultExpanded={hasErrors}
                  sx={{ 
                    mb: 2,
                    '&:before': { display: 'none' },
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <AccordionSummary 
                    expandIcon={<ExpandMore />}
                    sx={{ 
                      backgroundColor: hasErrors ? 'error.light' : 'success.light',
                      color: hasErrors ? 'error.contrastText' : 'success.contrastText',
                      '&:hover': {
                        backgroundColor: hasErrors ? 'error.main' : 'success.main'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      {hasErrors ? <ErrorIcon /> : <CheckCircleIcon />}
                      <Typography variant="subtitle2" sx={{ flex: 1 }}>
                        {category.name}
                      </Typography>
                      <Chip 
                        label={`${category.failedTests} errors`}
                        size="small"
                        color={hasErrors ? "error" : "success"}
                        variant="outlined"
                        sx={{ 
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'inherit',
                          borderColor: 'currentColor'
                        }}
                      />
                    </Box>
                  </AccordionSummary>
                  
                  <AccordionDetails sx={{ pt: 0 }}>
                    {category.errors && category.errors.length > 0 ? (
                      <List dense>
                        {category.errors.map((error, index) => (
                          <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CloseIcon color="error" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={error.message}
                              primaryTypographyProps={{ 
                                variant: 'body2',
                                color: 'text.primary'
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
                        <CheckCircleIcon color="success" fontSize="small" />
                        <Typography variant="body2" color="success.main">
                          All tests in this category passed!
                        </Typography>
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}

            <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Lưu ý:</strong> Điểm SEO được tính theo chuẩn Rank Math với 4 danh mục chính. 
                Hệ thống đếm số lỗi trong từng danh mục để đánh giá chất lượng SEO.
              </Typography>
            </Box>
          </Collapse>
        )}
      </CardContent>
    </Card>
  );
};

export default RankMathSEOScoreNew;