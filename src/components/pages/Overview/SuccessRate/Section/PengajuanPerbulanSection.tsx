'use client';

import React from 'react';

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
  ResponsiveContainer,
} from 'recharts';

import { useOverviewContext } from '@/components/layouts/OverviewLayout/Overview.context';


interface PengajuanPerbulanProps {
  data?: any[];
  isLoading?: boolean;
}

const PengajuanPerbulan: React.FC<PengajuanPerbulanProps> = ({
  data = [],
  isLoading,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { isBusinessDivision, isMaker, isDirektur, isChecker, isDti, isInternalGuest } = useOverviewContext();

  const colors = isBusinessDivision || isMaker || isDirektur || isChecker || isDti || isInternalGuest
    ? {
      Approve: '#A3CAE9',
      Decline: '#F57B58',
      'Efektif Pembiayaan': '#E3E3E3',
      'In Progress': '#6E9FC1',
      'Partial Efektif': '#ACACAC',
      Pipeline: '#395A7F',
    }
    : {
      Completed: '#A3CAE9',
      Decline: '#F57B58',
      'In Progress': '#6E9FC1',
    };

  const barKeys = isBusinessDivision || isMaker || isDirektur || isChecker || isDti || isInternalGuest
    ? [
      'Pipeline',
      'In Progress',
      'Approve',
      'Partial Efektif',
      'Efektif Pembiayaan',
      'Decline',
    ]
    : ['In Progress', 'Completed', 'Decline'];

  const chartDataWithTotal = React.useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((item) => {
      let totalValue = 0;
      barKeys.forEach((key) => {
        if (typeof item[key] === 'number') {
          totalValue += item[key];
        } else if (typeof item[key] === 'string' && !isNaN(Number(item[key]))) {
          totalValue += Number(item[key]);
        }
      });
      return { ...item, totalValue };
    });
  }, [data, barKeys]);

  const getHeight = () => {
    if (isMobile) return 300;
    if (isTablet) return 350;
    return 400;
  };

  const getMargin = () => {
    if (isMobile) return { bottom: 30, left: 0, right: 20, top: 10 };
    if (isTablet) return { bottom: 35, left: 0, right: 25, top: 10 };
    return { bottom: 40, left: 0, right: 30, top: 10 };
  };

  const getYAxisWidth = () => {
    if (isMobile) return 80;
    if (isTablet) return 95;
    return 110;
  };

  const getTickFontSize = () => {
    if (isMobile) return 11;
    if (isTablet) return 12;
    return 13;
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          alignItems: 'center',
          background: 'white',
          borderRadius: 2,
          boxShadow: '0px 1px 4px rgba(0,0,0,0.05)',
          color: 'text.secondary',
          display: 'flex',
          height: getHeight(),
          justifyContent: 'center',
          p: 2,
        }}
      >
        Loading chart...
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
          boxShadow: '0px 1px 4px rgba(0,0,0,0.05)',
          color: 'text.secondary',
          display: 'flex',
          height: getHeight(),
          justifyContent: 'center',
          p: 2,
        }}
      >
        No data available
      </Box>
    );
  }

  return (
    <Box
      sx={{
        '& svg': { outline: 'none' },
        background: 'white',
        borderRadius: 2,
        boxShadow: '0px 1px 4px rgba(0,0,0,0.05)',
        height: getHeight(),
        outline: 'none',
        p: isMobile ? 1.5 : 2,
        width: '100%',
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          style={{ outline: 'none' }}
          data={chartDataWithTotal}
          layout="vertical"
          margin={getMargin()}
          barCategoryGap="80%"
          stackOffset="expand"
        >
          <CartesianGrid horizontal={false} vertical={false} />
          <XAxis type="number" hide />
          <YAxis
            dataKey="month"
            type="category"
            width={getYAxisWidth()}
            axisLine={false}
            tickLine={false}
            tick={({ y, payload }) => (
              <text
                x={0}
                y={y + 4}
                textAnchor="start"
                fill="#4B5563"
                fontSize={getTickFontSize()}
                fontWeight={500}
                style={{ whiteSpace: 'nowrap' }}
              >
                {isMobile && payload.value.length > 8
                  ? payload.value.substring(0, 8) + '...'
                  : payload.value}
              </text>
            )}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            type="category"
            dataKey="month"
            width={isMobile ? 30 : 40}
            axisLine={false}
            tickLine={false}
            tick={({ x, y, index }) => {
              const item = chartDataWithTotal[index];
              return (
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="start"
                  fill="#4B5563"
                  fontSize={getTickFontSize()}
                  fontWeight={600}
                >
                  {item?.totalValue}
                </text>
              );
            }}
          />

          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
            contentStyle={{ display: 'none' }}
          />

          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: isMobile ? 10 : 15 }}
            iconType="circle"
            content={() => (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: isMobile ? 8 : 12,
                  justifyContent: 'center',
                }}
              >
                {barKeys
                  .filter((key) =>
                    Array.isArray(data) && data.some((item) => item[key] && item[key] !== 0)
                  )
                  .map((key) => (
                    <div
                      key={key}
                      style={{
                        alignItems: 'center',
                        display: 'flex',
                        fontSize: isMobile ? '12px' : '13px',
                        gap: 4,
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: colors[key],
                          borderRadius: '50%',
                          display: 'inline-block',
                          flexShrink: 0,
                          height: 8,
                          width: 8,
                        }}
                      />
                      <span
                        style={{
                          color: '#4B5563',
                          fontSize: isMobile ? 11 : 13,
                          fontWeight: 500,
                        }}
                      >
                        {key}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          />

          {barKeys.map((key) => {
            return (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={colors[key]}
                barSize={isMobile ? 6 : 10}
                radius={[5, 5, 5, 5]}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey={key}
                  position="top"
                  formatter={(value: number) => (value === 0 ? '' : value)}
                  offset={isMobile ? 4 : 6}
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

export default PengajuanPerbulan;
