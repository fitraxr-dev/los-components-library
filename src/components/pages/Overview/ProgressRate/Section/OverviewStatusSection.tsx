'use client';

import React from 'react';

import {
  Box,
  Grid,
  Skeleton,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';


interface OverviewStatusSectionProps {
  overviewStatus: { name: string; value: number; processId: string; isSelected?: boolean }[];
  loading: boolean;
  onCardClick?: (processId: string) => void;
  onClearSelection?: () => void;
  filterSource?: 'card' | 'filter';
  hasProcessFilter: boolean;
}

const OverviewStatusSection: React.FC<OverviewStatusSectionProps> = ({
  overviewStatus,
  loading,
  onCardClick,
  onClearSelection,
  filterSource = 'card',
  hasProcessFilter = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // const contents = overviewStatus;
  const contents = (filterSource === 'filter' && hasProcessFilter)
    ? overviewStatus.filter((s) => s.isSelected)
    : overviewStatus;

  const labelHeight = isMobile ? 40 : 48;
  const fontSize = isMobile ? 13 : 15;
  const padding = isMobile ? 1.5 : 2;
  const spacing = isMobile ? 1.5 : 2;

  const gridColumns = isMobile ? 2 : isTablet ? 3 : 5;

  const handleCardClick = (processId: string) => {
    if (hasProcessFilter) {
      if (onClearSelection) {
        onClearSelection();
      }
    } else {
      if (onCardClick) {
        onCardClick(processId);
      }
    }
  };

  return (
    <BaseContainer>
      <Box sx={{ overflow: 'hidden', p: padding }}>
        <Title title="Progress Overview Status" />

        <Grid container spacing={spacing} columns={gridColumns}>
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => (
              <Grid item xs={1} key={idx} sx={{ minWidth: 0 }}>
                <Box
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    p: padding,
                    width: '100%',
                  }}
                >
                  <Skeleton width="80%" height={labelHeight} />
                  <Skeleton width="60%" height={isMobile ? 20 : 28} />
                </Box>
              </Grid>
            ))
            : contents.map((item) => (
              <Grid item xs={1} key={item.name} sx={{ minWidth: 0 }}>
                <Box
                  onClick={() => handleCardClick(item.processId)}
                  sx={{
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      boxShadow: theme.shadows[2],
                      transform: isMobile ? 'none' : 'translateY(-2px)',
                    },
                    backgroundColor: theme.palette.background.paper,
                    border: item.isSelected
                      ? `2px solid ${theme.palette.primary.main}`
                      : `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    p: padding,
                    transition: 'all 0.2s ease',
                    width: '100%',
                  }}
                >
                  <TextStyle
                    variant="body2"
                    sx={{
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: isMobile ? 2 : 2,
                      color: 'text.secondary',
                      display: '-webkit-box',
                      fontSize: fontSize,
                      height: isMobile ? 50 : 65,
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.name}
                  </TextStyle>
                  <TextStyle
                    sx={{
                      fontSize: isMobile ? 14 : 16,
                      fontWeight: 600,
                    }}
                  >
                    {item.value.toLocaleString()}
                  </TextStyle>
                </Box>
              </Grid>
            ))}
        </Grid>
      </Box>
    </BaseContainer>
  );
};

export default OverviewStatusSection;
