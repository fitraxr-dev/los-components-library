'use client';

import { useEffect } from 'react';

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

import { LEGEND_LABELS } from './PerformanceOverview.constants';
import usePerformanceOverview from './PerformanceOverview.hook';
import PerformanceOverviewFilter from './PerformanceOverviewFilter/PerformanceOverviewFilter';
import usePerformanceOverviewFilter from './PerformanceOverviewFilter/PerformanceOverviewFilter.hook';
import PerformanceOverviewSection from './Section/PerformanceOverviewSection';


const PerformanceOverviewPage = () => {
  const { divisionName, divisionCode, targetDivisions } = useOverviewContext();
  const { recordActivity } = useRecordLog();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      remarks: 'view performance overview',
    });
  }, []);

  const { overviewData, loading, filter, setFilter, uniqueStatuses } = usePerformanceOverview();

  const selectedDivisions = (filter?.filter?.divisionId || []) as string[];
  const showLegend = selectedDivisions.length > 0
    ? selectedDivisions.some((div) => targetDivisions.includes(div))
    : targetDivisions.includes(divisionCode);

  const {
    teamLeadOptions,
    staffOptions,
    divisionOptions,
    allProcess,
  } = usePerformanceOverviewFilter({
    localValue: filter,
    onChangeValue: setFilter,
  });

  const toArray = (v: any) =>
    Array.isArray(v) ? v :
      v ? [v] : [];

  const getLabel = (ids, options) =>
    toArray(ids)
      .map((id) => options?.find((o) => o.value === id)?.label)
      .filter(Boolean)
      .join(', ') || 'All';

  const PREFERRED_ORDER = [
    'pipeline',
    'in progress',
    'approve',
    'completed',
    'partial efektif',
    'efektif pembiayaan',
    'decline'
  ];

  const displayLegends = uniqueStatuses && uniqueStatuses.length > 0
    ? [...uniqueStatuses].map((s: any) => {
      const fallback = LEGEND_LABELS.find((l) => l.label.toLowerCase() === s.name.toLowerCase()) || {} as any;
      return {
        color: s.color || fallback.color || '#CCC',
        description: s.description || fallback.description || '',
        label: s.name,
      };
    }).sort((a, b) => {
      const aName = a.label.toLowerCase();
      const bName = b.label.toLowerCase();
      const indexA = PREFERRED_ORDER.indexOf(aName);
      const indexB = PREFERRED_ORDER.indexOf(bName);

      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      if (aName === 'decline') return 1;
      if (bName === 'decline') return -1;

      return aName.localeCompare(bName);
    })
    : [];

  return (
    <>
      <RowWrapper justifyContent="space-between" alignItems="center">
        <RowWrapper gap={1} alignItems="center">
          <Title
            title="Performance Overview"
          />
          <Tooltip
            title={
              <Box>
                <TextStyle variant="body6">
                  Gambaran umum kinerja/hasil pencapaian per bulan
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
          <PerformanceOverviewFilter localValue={filter} onChangeValue={setFilter} />
        </RowWrapper>
      </RowWrapper>
      <ConfirmationInfo divisionId={filter?.filter?.divisionId} />

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
        <span>Data as of: {dayjs(filter?.filter?.periode ?? new Date()).format('YYYY')}</span>
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
        <PerformanceOverviewSection
          data={overviewData}
          uniqueStatuses={displayLegends}
          isLoading={loading}
          filters={{
            staff: '',
            team: '',
            year: '',
          }}
        />
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
              {displayLegends.map((legend: any, index: number) => (
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

export default PerformanceOverviewPage;
