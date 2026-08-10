'use client';

import React, { useEffect } from 'react';

import { Box, useTheme, useMediaQuery, Tooltip } from '@mui/material';

import { ActivityType } from '@/enums/Activity';
import useRecordLog from '@/hooks/useRecordLog';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import useAnnualReviewProgress from './AnnualReviewProgress.hook';
import AnnualReviewProgressFilter from './AnnualReviewProgressFilter/AnnualReviewProgressFilter';
import AnnualReviewProgressSection from './Section/AnnualReviewProgressSection';


const AnnualReviewProgressPage = () => {
  const { recordActivity } = useRecordLog();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      remarks: 'view overview annual review progress',
    });
  }, []);

  const { overviewData, loading, filter, setFilter } = useAnnualReviewProgress();

  return (
    <>
      <RowWrapper justifyContent="space-between" alignItems="center">
        <RowWrapper gap={1} alignItems="center">
          <Title
            title="Annual Review Progress"
          />
          <Tooltip
            title={
              <Box>
                <TextStyle variant="body6">
                  Annual review task in the past/next 6 months
                </TextStyle>
              </Box>
            }
            placement="right"
            slotProps={{
              tooltip: {
                sx: {
                  backgroundColor: theme.palette.primary.main,
                  color: '#fff',
                },
              },
            }}
          >
            <Box display="flex" alignItems="center" sx={{ color: theme.palette.primary.main, cursor: 'pointer' }}>
              <Icon iconName="tooltip-info" />
            </Box>
          </Tooltip>
        </RowWrapper>
        <RowWrapper>
          <AnnualReviewProgressFilter localValue={filter} onChangeValue={setFilter} />
        </RowWrapper>
      </RowWrapper>

      {/* Main content */}
      <ColumnWrapper sx={{ border: '2px solid #284A63', borderRadius: '5px', gap: theme.spacing(isMobile ? 2 : 3), mt: '10px' }}>
        <AnnualReviewProgressSection
          data={overviewData}
          isLoading={loading}
        />
      </ColumnWrapper>
    </>
  );
};

export default AnnualReviewProgressPage;
