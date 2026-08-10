'use client';

import { useEffect } from 'react';

import { useTheme, useMediaQuery } from '@mui/material';

import { ActivityType } from '@/enums/Activity';
import useRecordLog from '@/hooks/useRecordLog';

import BaseContainer from '@/components/shared/BaseContainer';
import Table from '@/components/shared/Table';
import TableV2 from '@/components/shared/TableV2';
import TextStyle from '@/components/shared/TextStyle';

import useTabHistoryDownload from './TabHistoryDownload.hook';


const TabHistoryDownload = () => {
  const { recordActivity } = useRecordLog();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      remarks: 'view history report laporan customer virtual account',
    });
  }, []);

  const {
    data,
    isLoading,
    page,
    setPage,
    setPageSize,
    tableHeader,
  } = useTabHistoryDownload();

  return (
    <BaseContainer
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.spacing(1),
        boxShadow: 7,
        p: theme.spacing(3),
      }}
    >
      <TextStyle
        variant="body1"
        weight={600}
        mb={theme.spacing(2)}
      >
        Download History
      </TextStyle>
      <TextStyle
        variant="body4"
        color="text.secondary"
        mb={theme.spacing(2)}
        sx={{
          fontSize: isMobile ? '0.45rem' : '0.75rem',
        }}
      >
        History of downloaded reports
      </TextStyle>
      <Table
        isLoading={isLoading}
        maxHeight="42vh"
        tableHeader={tableHeader}
        tableData={data?.contents || []}
        totalPage={data?.page?.totalPage ?? 1}
        currentPage={page}
        handlePageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </BaseContainer>
  );
};

export default TabHistoryDownload;
