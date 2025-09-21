import React, { useState, useEffect, useMemo } from 'react';
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
  Tooltip,
  Alert,
  LinearProgress,
  Stack,
  Divider
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  Info,
  ExpandMore,
  ExpandLess,
  TrendingUp,
  Search,
  Lightbulb,
  Speed,
  Star
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { rankMathEngine } from '../../../utils/seoScoring/rankMathEngine';

// Styled components giống Rank Math
const SEOScoreCircle = styled(Box)(({ theme, rating }) => {
  const getColors = () => {
    switch (rating) {
      case 'great':
        return {
          background: 'linear-gradient(135deg, #99d484 0%, #83c97f 100%)',
          shadow: '1px 1px 1px #5ba857'
        };
      case 'good':
        return {
          background: 'linear-gradient(135deg, #fdd07a 0%, #fcbe6c 100%)',
          shadow: '1px 1px 1px #efb463'
        };
      case 'bad':
        return {
          background: 'linear-gradient(135deg, #f8b0a2 0%, #f1938c 100%)',
          shadow: '1px 1px 1px #e48982'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #b9b9b9 0%, #989898 100%)',
          shadow: '1px 1px 1px #bbb'
        };
    }
  };

  const colors = getColors();

  return {
    position: 'relative',
    display: 'inline-block',
    height: 96,
    width: 96,
    textAlign: 'center',
    color: '#fff',
    borderRadius: '50%',
    background: colors.background,
    boxShadow: colors.shadow,
    marginRight: theme.spacing(2),
    
    '& .score': {
      fontSize: 42,
      fontWeight: 'bold',
      lineHeight: '42px',
      display: 'block',
      marginTop: '22px'
    },
    
    '& .outof': {
      fontSize: 12,
      fontWeight: 'normal',
      lineHeight: '12px',
      display: 'block',
      color: 'rgba(255,255,255,0.7)'
    },
    
    '& .label': {
      fontSize: 12,
      position: 'absolute',
      top: 100,
      left: 0,
      display: 'block',
      width: '100%',
      color: '#979ea5',
      fontWeight: 500
    }
  };
});

const StatusIcon = ({ status }) => {
  const getIcon = () => {
    switch (status) {
      case 'ok':
        return <CheckCircle sx={{ color: '#4CAF50' }} />;
      case 'warning':
        return <Warning sx={{ color: '#FF9800' }} />;
      case 'fail':
        return <Error sx={{ color: '#f44336' }} />;
      default:
        return <Info sx={{ color: '#2196F3' }} />;
    }
  };
  
  return getIcon();
};

const TestResultItem = ({ testName, result, expanded, onToggle }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ok': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'fail': return '#f44336';
      default: return '#2196F3';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ok': return 'Đạt';
      case 'warning': return 'Cảnh báo';
      case 'fail': return 'Không đạt';
      default: return 'Thông tin';
    }
  };

  return (
    <ListItem
      sx={{
        border: `1px solid ${getStatusColor(result.status)}20`,
        borderRadius: 1,
        mb: 1,
        backgroundColor: `${getStatusColor(result.status)}05`,
        '&:hover': {
          backgroundColor: `${getStatusColor(result.status)}10`
        }
      }}
    >
      <ListItemIcon>
        <StatusIcon status={result.status} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {result.message}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={getStatusText(result.status)}
                size="small"
                sx={{
                  backgroundColor: getStatusColor(result.status),
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.75rem'
                }}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 45 }}>
                {result.score}/{rankMathEngine.tests[testName]?.maxScore || 0} điểm
              </Typography>
            </Box>
          </Box>
        }
      />
    </ListItem>
  );
};

const RankMathSEOScore = ({ 
  title = '', 
  content = '', 
  metaDescription = '',
  url = '',
  focusKeyword = '', 
  images = [],
  socialData = {},
  onScoreChange,
  showDetails = true,
  autoAnalyze = true 
}) => {
  const [analysis, setAnalysis] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  // Memoized analysis để tránh tính toán lại không cần thiết
  const seoAnalysis = useMemo(() => {
    if (!autoAnalyze) return null;
    
    setLoading(true);
    const result = rankMathEngine.analyzeSEO({
      title,
      content,
      metaDescription,
      url,
      focusKeyword,
      images,
      socialData
    });
    setLoading(false);
    return result;
  }, [title, content, metaDescription, url, focusKeyword, images, socialData, autoAnalyze]);

  useEffect(() => {
    if (seoAnalysis) {
      setAnalysis(seoAnalysis);
      if (onScoreChange) {
        onScoreChange(seoAnalysis.score, seoAnalysis.rating);
      }
    }
  }, [seoAnalysis, onScoreChange]);

  const manualAnalyze = () => {
    setLoading(true);
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
    
    if (onScoreChange) {
      onScoreChange(result.score, result.rating);
    }
  };

  if (loading) {
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

  const { score, rating, results, suggestions, stats = {} } = analysis;

  // Tách các test theo nhóm giống Rank Math
  const basicTests = ['titleInSEO', 'titleStartsWithKeyword', 'titleLength', 'metaDescription', 'metaDescriptionLength', 'metaDescriptionKeyword'];
  const contentTests = ['contentLength', 'keywordDensity', 'keywordInFirstParagraph', 'keywordInHeadings'];
  const technicalTests = ['urlKeyword', 'urlLength', 'imageAlt', 'imageTitle', 'internalLinks', 'externalLinks'];
  const socialTests = ['socialTitle', 'socialDescription', 'socialImage'];

  const renderTestGroup = (groupName, testNames, groupResults) => {
    const groupTests = testNames.filter(name => groupResults[name]);
    if (groupTests.length === 0) return null;

    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1, color: 'primary.main', fontSize: '1rem', fontWeight: 'bold' }}>
          {groupName}
        </Typography>
        <List dense>
          {groupTests.map(testName => (
            <TestResultItem
              key={testName}
              testName={testName}
              result={groupResults[testName]}
              expanded={expanded}
            />
          ))}
        </List>
      </Box>
    );
  };

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
              Phân tích SEO Realtime
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Điểm SEO: {score}/100 - {rating === 'great' ? 'Xuất sắc' : rating === 'good' ? 'Tốt' : rating === 'bad' ? 'Cần cải thiện' : 'Chưa đánh giá'}
            </Typography>
            
            {/* Stats nhanh */}
            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                📝 {stats.wordCount || 0} từ
              </Typography>
              <Typography variant="caption" color="text.secondary">
                🎯 Mật độ keyword: {stats.keywordDensity || 0}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                🔤 Tiêu đề: {stats.titleLength || 0} ký tự
              </Typography>
            </Stack>

            {/* Progress bar */}
            <LinearProgress 
              variant="determinate" 
              value={score} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: rating === 'great' ? '#4CAF50' : 
                                 rating === 'good' ? '#FF9800' : 
                                 rating === 'bad' ? '#f44336' : '#9E9E9E'
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

        {/* Suggestions nhanh */}
        {suggestions && suggestions.length > 0 && (
          <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Gợi ý cải thiện:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <li key={index}>
                  <Typography variant="body2">{suggestion}</Typography>
                </li>
              ))}
            </Box>
          </Alert>
        )}

        {/* Chi tiết phân tích */}
        {showDetails && (
          <Collapse in={expanded}>
            <Divider sx={{ my: 2 }} />
            
            {renderTestGroup('📊 Cơ bản', basicTests, results)}
            {renderTestGroup('📝 Nội dung', contentTests, results)}
            {renderTestGroup('⚙️ Kỹ thuật', technicalTests, results)}
            {renderTestGroup('📱 Mạng xã hội', socialTests, results)}

            <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Lưu ý:</strong> Điểm SEO được tính dựa trên thuật toán của Rank Math. 
                Điểm từ 81-100 là xuất sắc, 51-80 là tốt, dưới 50 cần cải thiện.
              </Typography>
            </Box>
          </Collapse>
        )}
      </CardContent>
    </Card>
  );
};

export default RankMathSEOScore;