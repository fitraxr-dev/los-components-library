'use client';

import { useMemo } from 'react';

import { Box, useMediaQuery, useTheme } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

import { BAR_KEYS, COLORS } from '../AnnualReviewProgress.constants';

import type { AnnualReviewProgressData } from '../AnnualReviewProgress.types';


interface Props {
  data: AnnualReviewProgressData[];
  isLoading?: boolean;
}

const AnnualReviewProgressSection = ({ data, isLoading }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const xAxisDomain = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [0, 10];
    }

    let maxValue = 0;
    data.forEach((item: any) => {
      const notStarted = item.notStarted || 0;
      const inProgress = item.inProgress || 0;
      const completed = item.completed || 0;

      const total = notStarted + inProgress + completed;
      if (total > maxValue) {
        maxValue = total;
      }
    });
    const finalMax = Math.ceil(maxValue / 10) * 10;

    return [0, finalMax === 0 ? 10 : finalMax];
  }, [data]);

  const xAxisTicks = useMemo(() => {
    const [, max] = xAxisDomain;
    const ticks = [];
    const step = 10;

    for (let i = 0; i <= max; i += step) {
      ticks.push(i);
    }

    return ticks;
  }, [xAxisDomain]);

  const height = isMobile ? 500 : isTablet ? 600 : 700;
  const padding = isMobile ? 2 : 3;
  const yAxisWidth = isMobile ? 70 : 90;
  const barSize = isMobile ? 8 : 10;
  const legendGap = isMobile ? 8 : 12;
  const legendPaddingTop = isMobile ? 10 : 15;
  const barCategoryGap = isMobile ? '15%' : '10%';
  const barGap = isMobile ? 1 : 2;

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
        Loading annual review progress...
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
        height: height,
        p: padding,
        width: '100%',
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            bottom: isMobile ? 15 : 20,
            left: 0,
            right: 10,
            top: 10,
          }}
          barCategoryGap={barCategoryGap}
          barGap={barGap}
          onClick={() => { }}
        >
          <CartesianGrid horizontal={false} vertical={false} />

          {xAxisTicks.map((tick) => (
            <ReferenceLine
              key={tick}
              x={tick}
              stroke="#E5E7EB"
              strokeDasharray="0"
              ifOverflow="visible"
            />
          ))}

          <XAxis
            type="number"
            tick={{
              fill: '#4B5563',
              fontSize: isMobile ? 10 : 12,
            }}
            axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
            tickLine={false}
            domain={xAxisDomain}
            ticks={xAxisTicks}
            interval={0}
          />

          <YAxis
            dataKey="month"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: '#4B5563',
              fontSize: isMobile ? 11 : 13,
              fontWeight: 600,
            }}
            width={yAxisWidth}
            padding={{ bottom: 5, top: 5 }}
          />

          <Tooltip cursor={false} content={<></>} />

          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: legendPaddingTop }}
            iconType="circle"
            content={() => (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: legendGap,
                  justifyContent: 'center',
                }}
              >
                {BAR_KEYS.map((key) => (
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
                        backgroundColor: COLORS[key],
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
            )}
          />

          {BAR_KEYS.map((key) => {
            const dataKey = key === 'Not Started'
              ? 'notStarted'
              : key === 'In Progress'
                ? 'inProgress'
                : 'completed';

            return (
              <Bar
                key={key}
                dataKey={dataKey}
                fill={COLORS[key]}
                barSize={barSize}
                radius={[0, 5, 5, 0]}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey={dataKey}
                  position="right"
                  formatter={(value: number) => (value === 0 ? '' : value)}
                  style={{
                    fill: '#4B5563',
                    fontSize: isMobile ? 10 : 12,
                    fontWeight: 600,
                  }}
                />
              </Bar>
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default AnnualReviewProgressSection;
