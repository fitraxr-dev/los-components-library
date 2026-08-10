'use client';

import { useTheme, useMediaQuery } from '@mui/material';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import TabHistoryDownload from './components/TabHistoryDownload';
import TabListData from './components/TabListData';
import { tab, tabItems } from './List.constants';
import useList from './List.hook';


const ListPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { activeTab, handleChangeTab } = useList();

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(isMobile ? 2 : 3) }}>
      <Title title="Laporan Detail Customer - Pipeline" />
      <Tabs
        activeTab={activeTab}
        onChange={(val: string) => handleChangeTab(val)}
        items={tabItems}
      />

      <TabItem activeValue={activeTab} value={tab.LIST_DATA}>
        <TabListData />
      </TabItem>

      <TabItem activeValue={activeTab} value={tab.HISTORY_DOWNLOAD}>
        <TabHistoryDownload />
      </TabItem>
    </ColumnWrapper>
  );
};

export default ListPage;
