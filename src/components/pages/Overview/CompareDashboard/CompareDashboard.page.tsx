'use client';

import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material';

import { useOverviewContext } from '@/components/layouts/OverviewLayout/Overview.context';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import { tab, tabItems } from './CompareDashboard.constants';
import useCompareDashboard from './CompareDashboard.hook';
import FilterCompare from './FilterCompare/FilterCompare.page';
import ProgressRateDpop from './ListPage/ProgressRatePage/ProgressRateDpop.page';
import ProgressRatePage from './ListPage/ProgressRatePage/ProgressRatePage.page';
import SuccessRatePage from './ListPage/SuccessRatePage/SuccessRatePage.page';


const CompareDashboardPage = () => {
  const theme = useTheme();
  const { activeTab, handleChangeTab } = useCompareDashboard();
  const { isBusinessDivision, isNonBusinessDivision, isDirektur, isMaker, isChecker } = useOverviewContext();

  const [filterValues, setFilterValues] = useState({
    direktorat: '',
    divisi1: '',
    divisi2: '',
  });

  const handleFilterChange = (values: any) => {
    setFilterValues(values);
    console.log('Filter updated:', values);
  };

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
      <Title title="Dashboard Comparison" />

      <FilterCompare
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
      />

      <Tabs
        activeTab={activeTab}
        onChange={(val: string) => handleChangeTab(val)}
        items={tabItems}
      />

      <TabItem activeValue={activeTab} value={tab.SUCCESS_RATE}>
        <SuccessRatePage filterValues={filterValues} />
      </TabItem>

      <TabItem activeValue={activeTab} value={tab.PROGRESS_RATE}>
        {isBusinessDivision || isMaker || isDirektur || isChecker ? (
          <ProgressRatePage filterValues={filterValues} />
        ) : isNonBusinessDivision ? (
          <ProgressRateDpop filterValues={filterValues} />
        ) : null}
      </TabItem>
    </ColumnWrapper>
  );
};

export default CompareDashboardPage;
