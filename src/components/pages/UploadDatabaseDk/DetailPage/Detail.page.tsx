'use client';

import { Box, useTheme } from '@mui/material';
import dayjs from 'dayjs';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import TabDppspm from './components/TabDppspm';
import TabDttot from './components/TabDttot';
import { tab } from './Detail.constants';
import useDetail from './Detail.hook';

import type { ReactNode } from 'react';


const DetailPage = (props) => {
  const theme = useTheme();

  const {
    activeTab,
    handleChangeTab,
    tabs,
    uploadId,
    headerInfo,
    isLoadingHeader,
  } = useDetail(props);

  const TabWrapper = ({ children }: { children: ReactNode }) => {
    return (
      <ColumnWrapper gap={theme.spacing(3)}>
        {children}
      </ColumnWrapper>
    );
  };

  return (
    <>
      <ColumnWrapper mb={theme.spacing(8)}>
        <Title title="Detail Document" sx={{ mb: 3 }} />
        <RowWrapper
          sx={{
            display: 'grid',
            gridTemplateColumns: '0.5fr 1fr 1fr',
          }}
        >
          <ColumnWrapper sx={{ justifyContent: 'center' }}>
            <TextStyle variant="body3">File Name</TextStyle>
          </ColumnWrapper>
          <ColumnWrapper sx={{ justifyContent: 'center' }}>
            <TextStyle variant="body3" sx={{ py: 2 }}>
              : {isLoadingHeader ? 'Loading...' : headerInfo.fileName}
            </TextStyle>
          </ColumnWrapper>
        </RowWrapper>

        <RowWrapper
          sx={{
            display: 'grid',
            gridTemplateColumns: '0.5fr 1fr 1fr',
          }}
        >
          <ColumnWrapper sx={{ justifyContent: 'center' }}>
            <TextStyle variant="body3">Upload By</TextStyle>
          </ColumnWrapper>
          <ColumnWrapper sx={{ justifyContent: 'center' }}>
            <TextStyle variant="body3" sx={{ py: 2 }}>
              : {isLoadingHeader ? 'Loading...' : headerInfo.uploadedBy}
            </TextStyle>
          </ColumnWrapper>
        </RowWrapper>

        <RowWrapper
          sx={{
            display: 'grid',
            gridTemplateColumns: '0.5fr 1fr 1fr',
          }}
        >
          <ColumnWrapper sx={{ justifyContent: 'center' }}>
            <TextStyle variant="body3">Upload Date</TextStyle>
          </ColumnWrapper>
          <ColumnWrapper sx={{ justifyContent: 'center' }}>
            <TextStyle variant="body3" sx={{ mr: 2, py: 2 }}>
              : {isLoadingHeader
                ? 'Loading...'
                : headerInfo.uploadDate
                  ? dayjs(headerInfo.uploadDate).format('DD/MM/YY hh:mm A')
                  : '-'
              }
            </TextStyle>
          </ColumnWrapper>
        </RowWrapper>

        <Box>
          <RowWrapper>
            <hr style={{ color: theme.palette.custom.gray30, opacity: 0.3, width: '100%' }} />
          </RowWrapper>
        </Box>

        <Tabs
          activeTab={activeTab}
          onChange={(val: string) => handleChangeTab(val)}
          items={tabs}
        />

        <TabItem activeValue={activeTab} value={tab.DPPSPM}>
          <TabWrapper>
            <TabDppspm uploadId={uploadId} />
          </TabWrapper>
        </TabItem>

        <TabItem activeValue={activeTab} value={tab.DTTOT}>
          <TabWrapper>
            <TabDttot uploadId={uploadId} />
          </TabWrapper>
        </TabItem>
      </ColumnWrapper>
    </>
  );
};

export default DetailPage;
