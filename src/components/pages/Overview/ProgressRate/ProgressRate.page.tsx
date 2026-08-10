'use client';

import { useEffect, useMemo } from 'react';

import { Box, useTheme, useMediaQuery, Tooltip } from '@mui/material';

import { ActivityType } from '@/enums/Activity';
import useRecordLog from '@/hooks/useRecordLog';

import { useOverviewContext } from '@/components/layouts/OverviewLayout/Overview.context';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import ConfirmationInfo from '../Components/ConfirmationInfo';

import useProgressRate from './ProgressRate.hook';
import ProgressRateFilter from './ProgressRateFilter/ProgressRateFilter';
import useProgressRateFilter from './ProgressRateFilter/ProgressRateFilter.hook';
import OverviewListSection from './Section/OverviewListSection';
import OverviewStatusSection from './Section/OverviewStatusSection';


const ProgressRatePage = () => {
  const { divisionName } = useOverviewContext();
  const { recordActivity } = useRecordLog();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      remarks: 'view overview progress rate',
    });
  }, []);

  const {
    additionalData,
    overviewStatus,
    overviewList,
    loading,
    filter,
    setFilter,
    currentPage,
    totalPage,
    setPage,
    setPageSize,
    tableHeader,
    handleStatusCardClick,
    handleClearCardSelection,
    filterSource,
    hasProcessFilter,
  } = useProgressRate();

  const {
    teamLeadOptions,
    staffOptions,
    allProcess,
    divisionOptions,
  } = useProgressRateFilter({
    localValue: filter,
    onChangeValue: setFilter,
  });


  const toArray = (v: any) =>
    Array.isArray(v) ? v :
      v ? [v] : [];

  const getLabel = (ids, options) =>
    toArray(ids)
      .map((id) => options.find((o) => o.value === id)?.label)
      .filter(Boolean)
      .join(', ') || 'All';

  return (
    <>
      <RowWrapper justifyContent="space-between" alignItems="center">
        <RowWrapper gap={1} alignItems="center">
          <Title title="Progress Rate Overview" />
          <Tooltip
            title={
              <Box>
                <TextStyle variant="body6">
                  Jumlah proposal/pengajuan/pekerjaan pada setiap progres/tahapan saat ini
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
        <ProgressRateFilter localValue={filter} onChangeValue={setFilter} />
      </RowWrapper>
      <ConfirmationInfo divisionId={filter?.filter?.divisionId} />

      <Box
        mb={2}
        display="flex"
        gap={isMobile ? 1 : 2}
        mt={2}
        flexWrap="wrap"
        color="text.secondary"
        fontSize={isMobile ? '0.5rem' : '0.75rem'}
        sx={{
          '& span': {
            maxWidth: isMobile ? '100%' : 'auto',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
          lineHeight: isMobile ? 1.4 : 1.5,
        }}
      >
        <span>Data as of: {additionalData}</span>
        <span>Proses: {getLabel(filter?.filter?.process, allProcess)}</span>
        <span>
          Divisi: {filter?.filter?.divisionId && filter.filter.divisionId.length > 0
            ? getLabel(filter.filter.divisionId, divisionOptions)
            : divisionName || 'All'}
        </span>
        <span>Team: {getLabel(filter?.filter?.tlId, teamLeadOptions)}</span>
        <span>Staff Name: {getLabel(filter?.filter?.staffId, staffOptions)}</span>
      </Box>

      <ColumnWrapper sx={{ gap: theme.spacing(isMobile ? 2 : 3) }}>
        <OverviewStatusSection
          overviewStatus={overviewStatus}
          loading={loading}
          onCardClick={handleStatusCardClick}
          onClearSelection={handleClearCardSelection}
          filterSource={filterSource}
          hasProcessFilter={hasProcessFilter}
        />
        <OverviewListSection
          overviewListData={overviewList}
          loading={loading}
          currentPage={currentPage}
          totalPage={totalPage}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          tableHeader={tableHeader}
        />
      </ColumnWrapper>
    </>
  );
};

export default ProgressRatePage;
