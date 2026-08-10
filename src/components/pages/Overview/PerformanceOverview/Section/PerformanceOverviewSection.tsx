'use client';

import { useMemo } from 'react';

import { Box, useMediaQuery, useTheme } from '@mui/material';
import {
  Bar,
  BarChart,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { PerformanceOverviewData } from '../PerformanceOverView.types';


interface Props {
  data: PerformanceOverviewData[];
  filters: { year: string; team: string; staff: string };
  isLoading?: boolean;
  uniqueStatuses?: any[];
}

const PerformanceOverviewSection = ({ data, isLoading, uniqueStatuses }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const barKeys = useMemo(() => {
    return uniqueStatuses && uniqueStatuses.length > 0
      ? uniqueStatuses.map((s) => s.label)
      : [];
  }, [uniqueStatuses]);

  const dynamicColors = useMemo(() => {
    const colorMap: Record<string, string> = {};
    if (uniqueStatuses) {
      uniqueStatuses.forEach((s) => {
        colorMap[s.label] = s.color;
      });
    }
    return colorMap;
  }, [uniqueStatuses]);

  const yAxisDomain = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [0, 100];
    }

    let maxValue = 0;
    data.forEach((item: any) => {
      barKeys.forEach((key) => {
        const value = item[key];
        if (typeof value === 'number' && value > maxValue) {
          maxValue = value;
        }
      });
    });

    if (maxValue <= 100) {
      return [0, 100];
    }

    const paddedMax = maxValue * 1.15;
    const roundedMax = Math.ceil(paddedMax / 20) * 20;
    const finalMax = Math.max(roundedMax, 100);

    return [0, finalMax];
  }, [data, barKeys]);

  const yAxisTicks = useMemo(() => {
    const [, max] = yAxisDomain;
    const ticks = [];
    const step = 20;

    for (let i = 0; i <= max; i += step) {
      ticks.push(i);
    }

    return ticks;
  }, [yAxisDomain]);

  // Responsive dimensions
  const height = isMobile ? 400 : isTablet ? 500 : 600;
  const barSize = isMobile ? 12 : isTablet ? 14 : 18;
  const barGap = isMobile ? 4 : isTablet ? 5 : 6;
  const barCategoryGap = isMobile ? '15%' : '25%';
  const bottomMargin = isMobile ? 30 : 10;
  const topMargin = 10;
  const yAxisWidth = isMobile ? 40 : 50;
  const padding = isMobile ? 1 : 2;
  const legendGap = isMobile ? 8 : 12;
  const legendPaddingTop = isMobile ? 10 : 15;

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
          height: height,
          justifyContent: 'center',
          p: padding,
        }}
      >
        Loading performance overview...
      </Box>
    );
  }

  return (
    <Box
      sx={{
        '& svg': { outline: 'none !important' },
        background: 'white',
        borderRadius: 2,
        boxShadow: '0px 1px 4px rgba(255, 255, 255, 1)',
        display: 'flex',
        flexDirection: 'column',
        height: height,
        p: padding,
        width: '100%',
      }}
    >

      <Box sx={{ display: 'flex', flex: 1, minHeight: 0, position: 'relative' }}>

        <Box
          sx={{
            backgroundColor: 'white',
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            left: 0,
            paddingBottom: `${bottomMargin * 2 + 10}px`,
            paddingTop: `${topMargin}px`,
            position: 'absolute',
            top: 0,
            width: yAxisWidth,
            zIndex: 2,
          }}
        >
          <Box sx={{ flex: 1, position: 'relative' }}>
            {yAxisTicks.map((tick) => {
              const pctFromTop =
                (1 -
                  (tick - (yAxisDomain[0] as number)) /
                  ((yAxisDomain[1] as number) - (yAxisDomain[0] as number))) *
                100;
              return (
                <Box
                  key={tick}
                  sx={{
                    color: '#4B5563',
                    fontSize: isMobile ? 10 : 12,
                    fontWeight: 600,
                    lineHeight: 1,
                    position: 'absolute',
                    right: 4,
                    top: `${pctFromTop}%`,
                    transform: 'translateY(-50%)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tick}
                </Box>
              );
            })}
          </Box>
        </Box>


        <Box
          sx={{
            '&::-webkit-scrollbar': { height: 6 },
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#E5E7EB', borderRadius: 3 },
            flex: 1,
            marginLeft: `${yAxisWidth}px`,
            overflowX: 'auto',
            overflowY: 'hidden',
          }}
        >
          <Box sx={{ height: '100%', width: Math.max(data.length * (isMobile ? 100 : 160), 500) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                barCategoryGap={barCategoryGap}
                barGap={barGap}
                margin={{ bottom: bottomMargin, left: 0, right: 10, top: topMargin }}
              >
                {yAxisTicks.map((tick) => (
                  <ReferenceLine
                    key={tick}
                    y={tick}
                    stroke="#E5E7EB"
                    strokeDasharray="0"
                    ifOverflow="visible"
                  />
                ))}

                <XAxis
                  axisLine={false}
                  dataKey="month"
                  height={bottomMargin}
                  interval={0}
                  tick={{
                    fill: '#4B5563',
                    fontSize: isMobile ? 10 : isTablet ? 11 : 13,
                    fontWeight: 600,
                  }}
                  textAnchor={isMobile ? 'end' : 'middle'}
                  tickLine={false}
                  angle={isMobile ? -35 : 0}
                />

                <YAxis domain={yAxisDomain} hide ticks={yAxisTicks} />

                <Tooltip content={<></>} cursor={false} />

                {barKeys.map((key) => (
                  <Bar
                    key={key}
                    barSize={barSize}
                    dataKey={key}
                    fill={dynamicColors[key]}
                    isAnimationActive={false}
                    radius={[5, 5, 0, 0]}
                  >
                    <LabelList
                      dataKey={key}
                      formatter={(value: number) => (value === 0 ? '' : value)}
                      position="top"
                      style={{
                        fill: '#4B5563',
                        fontSize: isMobile ? 10 : 12,
                        fontWeight: 600,
                      }}
                    />
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: legendGap,
          justifyContent: 'center',
          paddingTop: legendPaddingTop,
        }}
      >
        {barKeys.map((key) => (
          <div
            key={key}
            style={{
              alignItems: 'center',
              display: 'flex',
              gap: 4,
            }}
          >
            <span
              style={{
                backgroundColor: dynamicColors[key],
                borderRadius: '50%',
                flexShrink: 0,
                height: isMobile ? 8 : 10,
                width: isMobile ? 8 : 10,
              }}
            />
            <span
              style={{
                color: '#4B5563',
                fontSize: isMobile ? 11 : 13,
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              {key}
            </span>
          </div>
        ))}
      </div>
    </Box>
  );
};

export default PerformanceOverviewSection;
