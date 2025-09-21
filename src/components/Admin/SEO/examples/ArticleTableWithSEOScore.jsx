/**
 * 📊 Ví dụ tích hợp RankMath Score Widget vào bảng danh sách News
 * 
 * Thêm cột SEO Score vào ArticleTable để hiển thị điểm số realtime
 */

import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  Chip,
  Box,
  Typography 
} from '@mui/material';
import { RankMathScoreWidget } from '@/components/Admin/SEO/RankMathScoreWidget';

// ===== COMPONENT TABLE CÓ SEO SCORE =====
const ArticleTableWithSEOScore = ({ articles, onSEOClick }) => {
  
  // Helper function để lấy màu chip theo rating
  const getRatingColor = (rating) => {
    switch(rating) {
      case 'great': return 'success';
      case 'good': return 'info'; 
      case 'bad': return 'warning';
      default: return 'default';
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tiêu đề</TableCell>
            <TableCell>Danh mục</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell align="center">SEO Score</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell>Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id} hover>
              
              {/* Tiêu đề */}
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Focus: {article.focusKeyword || 'Chưa đặt'}
                </Typography>
              </TableCell>

              {/* Danh mục */}
              <TableCell>
                <Chip 
                  label={article.category?.name || 'Không có'} 
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </TableCell>

              {/* Trạng thái */}
              <TableCell>
                <Chip 
                  label={article.status === 1 ? 'Đã xuất bản' : 'Nháp'} 
                  size="small"
                  color={article.status === 1 ? 'success' : 'default'}
                />
              </TableCell>

              {/* ✅ SEO Score Column - ĐIỂM MỚI */}
              <TableCell align="center">
                <Box 
                  onClick={() => onSEOClick?.(article)}
                  sx={{ cursor: 'pointer' }}
                >
                  <RankMathScoreWidget
                    title={article.title}
                    content={article.content}
                    focusKeyword={article.focusKeyword || ''}
                    size="small"
                    showDetails={false}
                    clickable={true}
                  />
                </Box>
              </TableCell>

              {/* Ngày tạo */}
              <TableCell>
                {new Date(article.createdAt).toLocaleDateString('vi-VN')}
              </TableCell>

              {/* Thao tác */}
              <TableCell>
                {/* Các button action... */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ArticleTableWithSEOScore;