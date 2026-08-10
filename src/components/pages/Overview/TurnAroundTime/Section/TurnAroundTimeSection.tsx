'use client';

import { useMemo } from 'react';

import { Box, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

import useDivision from '@/hooks/useDivision';

import TextStyle from '@/components/shared/TextStyle';


import { DivisionTATBarKeysMap, TATBarLabels } from '../TurnAroundTime.constants';

import type { TATOverviewData } from '../TurnAroundTime.types';


const FULL_MONTH_MAP: Record<string, string> = {
  Agu: 'Agustus',
  Apr: 'April',
  Des: 'Desember',
  Feb: 'Februari',
  Jan: 'Januari',
  Jul: 'Juli',
  Jun: 'Juni',
  Mar: 'Maret',
  Mei: 'Mei',
  Nov: 'November',
  Okt: 'Oktober',
  Sep: 'September',
};


interface Props {
  data: TATOverviewData[];
  barKeys: string[];
  filters: { year: string; staff: string };
  isLoading?: boolean;
}

const TATOverviewSection = ({ data, barKeys: apiBarKeys, isLoading }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { divisionCode } = useDivision();

  const sortedBarKeys = useMemo(() => {
    if (!apiBarKeys?.length || !divisionCode) return [];

    const orderReference = DivisionTATBarKeysMap[divisionCode] || [];

    return [...apiBarKeys].sort((a, b) => {
      const indexA = orderReference.indexOf(a);
      const indexB = orderReference.indexOf(b);
      return (indexA === -1 ? orderReference.length : indexA) - (indexB === -1 ? orderReference.length : indexB);
    });
  }, [apiBarKeys, divisionCode]);

  const yAxisDomain = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [0, 150];
    }

    let maxValue = 0;
    data.forEach((item: any) => {
      let stackedTotal = 0;
      sortedBarKeys.forEach((key) => {
        const value = item[key];
        if (typeof value === 'number') {
          stackedTotal += value;
        }
      });

      if (stackedTotal > maxValue) {
        maxValue = stackedTotal;
      }
    });

    const paddedMax = maxValue * 1.15;

    const roundedMax = Math.ceil(paddedMax / 25) * 25;
    const finalMax = Math.max(roundedMax, 150);

    return [0, finalMax];
  }, [data, sortedBarKeys]);

  const yAxisTicks = useMemo(() => {
    const [, max] = yAxisDomain;
    const ticks = [];
    const step = max <= 150 ? 25 : Math.ceil(max / 6 / 25) * 25;

    for (let i = 0; i <= max; i += step) {
      ticks.push(i);
    }

    return ticks;
  }, [yAxisDomain]);

  const chartHeight = isMobile ? 350 : isTablet ? 450 : 560;
  const padding = isMobile ? 2 : 3;
  const barCategoryGap = isMobile ? '35%' : '25%';
  const legendGap = isMobile ? 8 : 12;
  const topMargin = isMobile ? 20 : 10;

  if (isLoading) {
    return (
      <Box
        sx={{
          alignItems: 'center',
          background: 'white',
          borderRadius: 2,
          boxShadow: '0px 1px 4px rgba(255, 255, 255, 1)',
          color: 'text.secondary',
          display: 'flex',
          fontSize: isMobile ? 12 : 14,
          justifyContent: 'center',
          minHeight: isMobile ? 450 : isTablet ? 550 : 700,
          p: padding,
        }}
      >
        Loading TAT overview...
      </Box>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Box
        sx={{
          alignItems: 'center',
          background: 'white',
          borderRadius: 2,
          boxShadow: '0px 1px 4px rgba(255, 255, 255, 1)',
          color: 'text.secondary',
          display: 'flex',
          justifyContent: 'center',
          minHeight: isMobile ? 450 : isTablet ? 550 : 700,
          p: padding,
        }}
      >
        No data available
      </Box>
    );
  }

  return (
    <Box
      sx={{
        '& svg': {
          outline: 'none !important',
        },
        background: 'white',
        borderRadius: 2,
        boxShadow: '0px 1px 4px rgba(255, 255, 255, 1)',
        display: 'flex',
        flexDirection: 'column',
        p: padding,
        width: '100%',
      }}
    >
      <Box sx={{ height: chartHeight, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ bottom: 10, left: 0, right: 10, top: topMargin }}
            barCategoryGap={barCategoryGap}
          >
            <CartesianGrid stroke="#E5E7EB" strokeDasharray="0" horizontal={true} vertical={false} />

            <XAxis
              dataKey="month"
              tick={{
                fill: '#4B5563',
                fontSize: isMobile ? 10 : isTablet ? 11 : 12,
              }}
              axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
              tickLine={false}
              interval={0}
              dy={isMobile ? 8 : 10}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? 'end' : 'middle'}
              height={isMobile ? 80 : 40}
            />

            <YAxis
              domain={yAxisDomain}
              ticks={yAxisTicks}
              tick={{
                fill: '#4B5563',
                fontSize: isMobile ? 10 : 12,
              }}
              axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
              tickLine={false}
              width={isMobile ? 35 : 45}
            />

            {sortedBarKeys.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="tat"
                isAnimationActive={false}
                shape={(props: any) => {
                  const { x, y, width, height, payload } = props;
                  if (!width || !height || height <= 0) return null;
                  const fill = payload?.colors?.[key];
                  const value = payload?.[key] ?? 0;
                  const average = payload?.averages?.[key] ?? 0;
                  const monthShort = payload?.month ?? '';
                  const fullMonth = FULL_MONTH_MAP[monthShort] || monthShort;

                  return (
                    <Tooltip
                      title={
                        <Box display="flex" flexDirection="column" gap={0.5}>
                          <Box><TextStyle variant="body6">{TATBarLabels[key] || key}</TextStyle></Box>
                          <Box><TextStyle variant="body6">Bulan : {fullMonth}</TextStyle></Box>
                          <Box><TextStyle variant="body6">Jumlah Data : {value}</TextStyle></Box>
                          <Box><TextStyle variant="body6">Avg : {average}</TextStyle></Box>
                        </Box>
                      }
                      placement="top"
                      slotProps={{
                        tooltip: {
                          sx: {
                            backgroundColor: theme.palette.primary.main,
                            color: '#fff',
                            padding: 1.25,
                          },
                        },
                      }}
                      arrow
                    >
                      <rect x={x} y={y} width={width} height={height} fill={fill} />
                    </Tooltip>
                  );
                }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Legend rendered outside of BarChart to prevent layout collision on resize/zoom */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: `${legendGap}px`,
          justifyContent: 'center',
          pb: isMobile ? 1.25 : 0,
          pt: isMobile ? 1.5 : 2,
        }}
      >
        {sortedBarKeys.map((key) => (
          <Box
            key={key}
            sx={{ alignItems: 'center', display: 'flex', gap: 0.5 }}
          >
            <Box
              component="span"
              sx={{
                backgroundColor: data.find((d) => d.colors[key])?.colors[key],
                borderRadius: '50%',
                flexShrink: 0,
                height: isMobile ? 8 : 10,
                width: isMobile ? 8 : 10,
              }}
            />
            <Box
              component="span"
              sx={{
                color: '#4B5563',
                fontSize: isMobile ? 11 : 13,
                whiteSpace: 'nowrap',
              }}
            >
              {TATBarLabels[key] || key}
            </Box>
          </Box>
        ))}
      </Box>
    </Box >
  );
};

export default TATOverviewSection;
