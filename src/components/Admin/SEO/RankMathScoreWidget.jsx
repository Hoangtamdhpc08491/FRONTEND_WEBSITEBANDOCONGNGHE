import React from 'react';
import { Box, Typography, Tooltip, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getRatingColors, getRatingText, getRatingIcon, formatScore } from '../../../utils/seoScoring/rankMathHelpers';

// Styled component cho SEO score widget nhỏ gọn
const SEOScoreWidget = styled(Box)(({ theme, rating, size = 'medium' }) => {
  const colors = getRatingColors(rating);
  const dimensions = {
    small: { width: 60, height: 60, fontSize: 20 },
    medium: { width: 80, height: 80, fontSize: 28 },
    large: { width: 96, height: 96, fontSize: 36 }
  };
  
  const dim = dimensions[size] || dimensions.medium;
  
  return {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: dim.width,
    height: dim.height,
    borderRadius: '50%',
    background: colors.gradient,
    boxShadow: colors.shadow,
    color: '#fff',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    
    '&:hover': {
      transform: 'scale(1.05)',
    },
    
    '& .score-number': {
      fontSize: dim.fontSize,
      lineHeight: 1,
      fontWeight: 'bold'
    },
    
    '& .score-label': {
      fontSize: dim.fontSize * 0.3,
      opacity: 0.8,
      marginTop: 2
    }
  };
});

const RankMathScoreWidget = ({ 
  score = 0, 
  rating = 'unknown',
  size = 'medium',
  showTooltip = true,
  showLabel = true,
  onClick,
  className = '',
  style = {}
}) => {
  const colors = getRatingColors(rating);
  const ratingText = getRatingText(rating);
  const ratingIcon = getRatingIcon(rating);
  
  const scoreWidget = (
    <SEOScoreWidget 
      rating={rating} 
      size={size}
      onClick={onClick}
      className={className}
      style={style}
    >
      <Typography variant="span" className="score-number">
        {formatScore(score)}
      </Typography>
      {showLabel && (
        <Typography variant="span" className="score-label">
          /100
        </Typography>
      )}
    </SEOScoreWidget>
  );

  if (showTooltip) {
    return (
      <Tooltip 
        title={
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {ratingIcon} SEO Score: {score}/100
            </Typography>
            <Typography variant="caption">
              Đánh giá: {ratingText}
            </Typography>
          </Box>
        }
        arrow
        placement="top"
      >
        {scoreWidget}
      </Tooltip>
    );
  }

  return scoreWidget;
};

// Component hiển thị nhiều thông tin hơn
export const RankMathScoreBadge = ({ 
  score = 0, 
  rating = 'unknown',
  compact = false,
  showDetails = true
}) => {
  const colors = getRatingColors(rating);
  const ratingText = getRatingText(rating);
  const ratingIcon = getRatingIcon(rating);

  if (compact) {
    return (
      <Chip
        label={`${ratingIcon} ${score}/100`}
        sx={{
          backgroundColor: colors.primary,
          color: 'white',
          fontWeight: 'bold',
          '& .MuiChip-label': {
            fontSize: '0.875rem'
          }
        }}
      />
    );
  }

  return (
    <Box sx={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: 1,
      padding: '4px 12px',
      borderRadius: 2,
      backgroundColor: colors.light,
      border: `1px solid ${colors.primary}20`
    }}>
      <RankMathScoreWidget 
        score={score} 
        rating={rating} 
        size="small"
        showTooltip={false}
        showLabel={false}
      />
      
      {showDetails && (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: colors.text }}>
            {ratingIcon} {score}/100
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text, opacity: 0.8 }}>
            {ratingText}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Component inline cho hiển thị trong danh sách
export const RankMathScoreInline = ({ 
  score = 0, 
  rating = 'unknown',
  size = 'small'
}) => {
  const colors = getRatingColors(rating);
  const ratingIcon = getRatingIcon(rating);

  return (
    <Box sx={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: 0.5
    }}>
      <Box sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size === 'small' ? 24 : 32,
        height: size === 'small' ? 24 : 32,
        borderRadius: '50%',
        backgroundColor: colors.primary,
        color: 'white',
        fontSize: size === 'small' ? '0.75rem' : '0.875rem',
        fontWeight: 'bold'
      }}>
        {formatScore(score)}
      </Box>
      <Typography variant="caption" sx={{ color: colors.text }}>
        {ratingIcon}
      </Typography>
    </Box>
  );
};

export default RankMathScoreWidget;