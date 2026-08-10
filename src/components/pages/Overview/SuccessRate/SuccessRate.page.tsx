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

import ConfirmationInfo from '../Components/ConfirmationInfo';

import ExistingDebiturSection from './Section/ExistingDebiturSection';
import KeseluruhanPengajuanSection from './Section/KeseluruhanPengajuanSection';
import NewDebiturSection from './Section/NewDebiturSection';
import PengajuanPerbulanSection from './Section/PengajuanPerbulanSection';
import { LEGEND_LABELS } from './SuccessRate.constants';
import useSuccessRate from './SuccessRate.hook';
import SuccessRateFilter from './SuccessRateFilter/SuccessRateFilter';
import useSuccessRateFilter from './SuccessRateFilter/SuccessRateFilter.hook';


const SuccessRatePage = () => {
  const { divisionName, divisionCode, targetDivisions } = useOverviewContext();

  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      remarks: 'view overview success rate',
    });
  }, []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const {
    existingDebiturData,
    keseluruhanPengajuanData,
    newDebiturData,
    pengajuanPerbulanData,
    filter,
    setFilter,
  } = useSuccessRate();

  const selectedDivisions = (filter?.filter?.divisionId || []) as string[];
  const showLegend = selectedDivisions.length > 0
    ? selectedDivisions.some((div) => targetDivisions.includes(div))
    : targetDivisions.includes(divisionCode);

  const {
    teamLeadOptions,
    staffOptions,
    allProcess,
    divisionOptions,
  } = useSuccessRateFilter({
    localValue: filter,
    onChangeValue: setFilter,
  });

  const getFormattedPeriodeRange = () => {
    const periodeValue = filter?.filter?.periode;
    // If no filter, use current month as default
    const endDate = periodeValue
      ? dayjs(periodeValue, 'MM/YYYY')
      : dayjs();
    // Calculate 6 months before (5 months back + current = 6 months total)
    const startDate = endDate.subtract(5, 'month');

    return `${startDate.format('MMMM YYYY')} - ${endDate.format('MMMM YYYY')}`;
  };

  const formattedPeriode = getFormattedPeriodeRange();

  const toArray = (v: any) =>
    Array.isArray(v) ? v :
      v ? [v] : [];

  const getLabel = (ids, options) =>
    toArray(ids)
      .map((id) => options?.find((o) => o.value === id)?.label)
      .filter(Boolean)
      .join(', ') || 'All';

  return (
    <>
      <RowWrapper justifyContent="space-between" alignItems="center">
        <RowWrapper gap={1} alignItems="center">
          <Title title="Success Rate Overview" />
          <Tooltip
            title={
              <Box>
                <TextStyle variant="body6">
                  Jumlah proposal/pengajuan/pekerjaan bedasarkan status per 6 bulan
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

        <SuccessRateFilter
          localValue={filter}
          onChangeValue={setFilter}
        />
      </RowWrapper>
      <ConfirmationInfo divisionId={filter?.filter?.divisionId} />

      <Box
        mb={2}
        display="flex"
        gap={isMobile ? 1.5 : 3}
        mt={2}
        flexWrap="wrap"
        color="text.secondary"
        fontSize={isMobile ? '0.65rem' : '0.75rem'}
      >
        <span>Data as of: {formattedPeriode}</span>
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
        <RowWrapper
          alignItems="stretch"
          sx={{
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 2 : 3,
          }}
        >
          <Box
            sx={{
              flex: isLargeScreen ? 2 : isMobile ? '1' : 1.5,
              minWidth: 0,
            }}
          >
            <PengajuanPerbulanSection data={pengajuanPerbulanData} />
          </Box>
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <KeseluruhanPengajuanSection data={keseluruhanPengajuanData} />
          </Box>
        </RowWrapper>

        <RowWrapper
          alignItems="stretch"
          sx={{
            flexDirection: isMobile ? 'column' : isTablet ? 'column' : 'row',
            gap: isMobile ? 2 : 3,
          }}
        >
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <NewDebiturSection data={newDebiturData} />
          </Box>
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <ExistingDebiturSection data={existingDebiturData} />
          </Box>
        </RowWrapper>

        {showLegend && (
          <Box
            sx={{
              backgroundColor: theme.palette.common.white,
              borderRadius: 2,
              p: 3,
            }}
          >
            <TextStyle variant="body3" sx={{ display: 'block', fontWeight: 600, mb: 1.5 }}>
              Keterangan Status:
            </TextStyle>
            <Box display="flex" flexDirection="column" gap={0.5}>
              {LEGEND_LABELS.map((legend, index) => (
                <RowWrapper key={index} alignItems="flex-start" sx={{ gap: 1 }}>
                  <RowWrapper alignItems="center" sx={{ flexShrink: 0, gap: 1, width: isMobile ? '150px' : '180px' }}>
                    <Box
                      sx={{
                        backgroundColor: legend.color,
                        borderRadius: '50%',
                        flexShrink: 0,
                        height: 12,
                        width: 12,
                      }}
                    />
                    <TextStyle variant="body5">{legend.label}</TextStyle>
                  </RowWrapper>
                  <TextStyle variant="body5" sx={{ color: 'text.secondary', flexShrink: 0 }}>
                    :
                  </TextStyle>
                  <TextStyle variant="body5" sx={{ color: 'text.secondary' }}>
                    {legend.description}
                  </TextStyle>
                </RowWrapper>
              ))}
            </Box>
          </Box>
        )}
      </ColumnWrapper>
    </>
  );
};

export default SuccessRatePage;
