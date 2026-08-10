'use client';

import React, { useEffect } from 'react';

import { Box, useTheme, useMediaQuery, Tooltip } from '@mui/material';
import dayjs from 'dayjs';

import { roles } from '@/configs/constants/general';
import { ActivityType } from '@/enums/Activity';
import useApp from '@/hooks/useApp';
import useRecordLog from '@/hooks/useRecordLog';

import { useOverviewContext } from '@/components/layouts/OverviewLayout/Overview.context';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';


import TATOverviewSection from './Section/TurnAroundTimeSection';
import useTATOverview from './TurnAroundTime.hook';
import TATOverviewFilter from './TurnAroundTimeFilter/TurnAroundTimeFilter';
import useTurnAroundTimeFilter from './TurnAroundTimeFilter/TurnAroundTimeFilter.hook';


const TurnAroundTimePage = () => {
  const { recordActivity } = useRecordLog();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { tatData, barKeys, loading, filter, setFilter } = useTATOverview();
  const [state] = useApp();

  const isTL = state.currentRole.includes(roles.TL);
  const isKadiv = state.currentRole.includes(roles.KADIV);
  const { isMaker, isDirektur, isChecker, isTaskForce, divisionName } = useOverviewContext();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      remarks: 'view overview turn around time',
    });
  }, [recordActivity]);

  const {
    teamLeadOptions,
    staffOptions,
    divisionOptions,
    allProcess,
  } = useTurnAroundTimeFilter({
    localValue: filter,
    onChangeValue: setFilter,
  });

  const toArray = (v: any) =>
    Array.isArray(v) ? v :
      v ? [v] : [];

  const userDivisionName = (state.userData?.user as any)?.accessManagementActive?.userDivision?.name;

  const getLabel = (ids, options) =>
    toArray(ids)
      .map((id) => options.find((o) => o.value === id)?.label)
      .filter(Boolean)
      .join(', ') || (isKadiv && userDivisionName ? userDivisionName : 'All');

  return (
    <>
      <RowWrapper justifyContent="space-between" alignItems="center">
        <RowWrapper gap={1} alignItems="center">
          <Title
            title="Avg. Turn Around Time per Process"
          />
          <Tooltip
            title={
              <Box>
                <TextStyle variant="body6">
                  Avg. Turn Arround Time bedasarkan proses per bulan
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
          <TATOverviewFilter localValue={filter} onChangeValue={setFilter} />
        </RowWrapper>
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
        <span>
          Data as of: {dayjs(filter?.filter?.periode ?? new Date()).format('YYYY')}
        </span>
        <span>Proses: {getLabel(filter?.filter?.process, allProcess)}</span>
        <span>
          Divisi: {isMaker || isChecker || isTaskForce || isDirektur
            ? getLabel(filter?.filter?.divisionId, divisionOptions) || 'All'
            : divisionName}
        </span>
        <span>Team: {getLabel(filter?.filter?.tlId, teamLeadOptions)}</span>
        <span>Staff Name: {getLabel(filter?.filter?.staffId, staffOptions)}</span>
      </Box>

      <ColumnWrapper sx={{ gap: theme.spacing(isMobile ? 2 : 3) }}>
        <TATOverviewSection
          data={tatData}
          barKeys={barKeys}
          filters={{
            staff: getLabel(filter?.filter?.staffId, staffOptions),
            year: filter?.filter?.periode || '',
          }}
          isLoading={loading}
        />
      </ColumnWrapper>
    </>
  );
};

export default TurnAroundTimePage;
