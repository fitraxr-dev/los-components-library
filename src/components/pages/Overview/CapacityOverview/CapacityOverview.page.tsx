'use client';

import React, { useEffect } from 'react';

import { Box, useTheme, useMediaQuery, Tooltip } from '@mui/material';
import dayjs from 'dayjs';

import { ActivityType } from '@/enums/Activity';
import useRecordLog from '@/hooks/useRecordLog';

import { useOverviewContext } from '@/components/layouts/OverviewLayout/Overview.context';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import useCapacityOverview from './CapacityOverview.hook';
import CapacityOverviewFilter from './CapacityOverviewFilter/CapacityOverviewFilter';
import useCapacityOverviewFilter from './CapacityOverviewFilter/CapacityOverviewFilter.hook';
import CapacityOverviewSection from './Section/CapacityOverviewSection';


const CapacityOverviewPage = () => {
  const { isRM, isInternalGuest } = useOverviewContext();

  const { recordActivity } = useRecordLog();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      remarks: 'view capacity overview',
    });
  }, []);

  const { capacityData, loading, filter, setFilter } = useCapacityOverview();

  const {
    allProcess,
    staffOptions,
  } = useCapacityOverviewFilter({
    localValue: filter,
    onChangeValue: setFilter,
  });

  const getFormattedPeriode = () => {
    const endDate = dayjs();

    return endDate.format('DD MMMM YYYY');
  };

  const formattedPeriode = getFormattedPeriode();

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
          <Title title="Capacity Overview" />
          <Tooltip
            title={
              <Box>
                <TextStyle variant="body6">
                  Jumlah aktifitas/pekerjaan untuk progres/tahapan yang masih aktif
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

        <CapacityOverviewFilter localValue={filter} onChangeValue={setFilter} />
      </RowWrapper>

      <Box
        mb={2}
        display="flex"
        gap={isMobile ? 1 : 2}
        mt={2}
        flexWrap="wrap"
        color="text.secondary"
        fontSize={isMobile ? '0.6rem' : '0.75rem'}
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
        <span>Data as of: {formattedPeriode}</span>
        <span>Proses: {getLabel(filter?.filter?.process, allProcess)}</span>
        <span>
          Staff Name: {!isRM || isInternalGuest
            ? getLabel(filter?.filter?.staffId, staffOptions) || 'All'
            : capacityData?.[0]?.label || ''}
        </span>
      </Box>

      <ColumnWrapper sx={{ border: '2px solid #284A63', borderRadius: '5px', gap: theme.spacing(isMobile ? 2 : 3) }}>
        <CapacityOverviewSection
          data={capacityData}
          isLoading={loading}
          filters={{
            staff: '',
            team: '',
            year: '',
          }}
        />
      </ColumnWrapper>
    </>
  );
};

export default CapacityOverviewPage;
