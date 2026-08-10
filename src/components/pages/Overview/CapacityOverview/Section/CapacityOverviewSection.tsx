'use client';

import { useRef, useEffect, useState, useMemo } from 'react';

import { Box, useMediaQuery, useTheme } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from 'recharts';

import { useOverviewContext } from '@/components/layouts/OverviewLayout/Overview.context';

import { CapacityOverviewColor } from '../CapacityOverview.constants';

import type { CapacityOverviewData } from '../CapacityOverview.types';


interface Props {
  data: CapacityOverviewData[];
  filters: { year: string; team: string; staff: string };
  isLoading?: boolean;
}

const barKeys = ['newDebitur', 'existingDebitur'];
const barLabels: Record<string, string> = {
  existingDebitur: 'Existing Customer',
  newDebitur: 'New Customer',
};

const CustomXAxisTick = (props: any) => {
  const { x, y, payload, width, fontSize } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <line
        x1={-x}
        y1={-4}
        x2={width - x}
        y2={-4}
        stroke="#E5E7EB"
        strokeWidth={1}
      />
      <text
        dy={16}
        textAnchor="middle"
        fill="#4B5563"
        fontSize={fontSize}
        fontWeight={600}
      >
        {payload.value}
      </text>
    </g>
  );
};

const CapacityOverviewSection = ({ data, isLoading }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { isKadiv } = useOverviewContext();
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    if (chartRef.current) {
      setChartWidth(chartRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (chartRef.current) setChartWidth(chartRef.current.offsetWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const xAxisDomain = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [0, 10];
    }

    let maxValue = 0;
    data.forEach((item: any) => {
      const newDebitur = item.newDebitur || 0;
      const existingDebitur = item.existingDebitur || 0;

      const total = Math.max(newDebitur, existingDebitur);
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

    for (let i = 0; i <= (max as number); i += step) {
      ticks.push(i);
    }

    return ticks;
  }, [xAxisDomain]);

  const minHeight = isMobile ? 350 : isTablet ? 380 : 400;
  const barRowHeight = isMobile ? 60 : isTablet ? 70 : 80;
  const height = Math.max(minHeight, data.length * barRowHeight + (isMobile ? 100 : 120));
  const padding = isMobile ? 2 : 3;
  const leftMargin = isMobile ? 40 : isTablet ? 50 : 50;
  const barSize = isMobile ? 60 : isTablet ? 70 : 80;
  const yAxisWidth = isMobile ? 100 : isKadiv ? 120 : 100;
  const tickMarginY = isMobile ? 40 : 50;
  const barCategoryGap = isMobile ? '25%' : '20%';
  const barGap = isMobile ? 2 : 4;
  const legendGap = isMobile ? 8 : 12;
  const legendPaddingTop = isMobile ? 12 : 15;
  const xAxisTickFontSize = isMobile ? 10 : 12;

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
        Loading capacity overview...
      </Box>
    );
  }

  return (
    <Box
      ref={chartRef}
      sx={{
        '& svg': { outline: 'none !important', overflow: 'visible' },
        background: 'white',
        borderRadius: 2,
        boxShadow: '0px 1px 4px rgba(255, 255, 255, 1)',
        height: height,
        p: padding,
        position: 'relative',
        width: '100%',
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            bottom: isMobile ? 30 : 40,
            left: leftMargin,
            right: 20,
            top: 20,
          }}
          barCategoryGap={barCategoryGap}
          barGap={barGap}
        >
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={(props) => (
              <CustomXAxisTick
                {...props}
                width={chartWidth}
                fontSize={xAxisTickFontSize}
              />
            )}
            ticks={xAxisTicks}
            domain={xAxisDomain as [number, number]}
            allowDataOverflow={false}
            tickMargin={isMobile ? 6 : 8}
            interval={0}
          />

          <YAxis
            dataKey="label"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: '#4B5563',
              fontSize: isMobile ? 11 : 13,
              fontWeight: 600,
            }}
            tickMargin={tickMarginY}
            width={yAxisWidth}
            padding={{ bottom: 10, top: 10 }}
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
                        backgroundColor:
                          CapacityOverviewColor[
                            key as keyof typeof CapacityOverviewColor
                          ],
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
                      {barLabels[key]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          />

          {barKeys.map((key) => (
            <Bar
              key={key}
              dataKey={key}
              fill={CapacityOverviewColor[key as keyof typeof CapacityOverviewColor]}
              barSize={barSize}
              radius={[0, 5, 5, 0]}
              isAnimationActive={false}
            >
              <LabelList
                dataKey={key}
                position="right"
                formatter={(value: number) => (value === 0 ? '' : value)}
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
  );
};

export default CapacityOverviewSection;
