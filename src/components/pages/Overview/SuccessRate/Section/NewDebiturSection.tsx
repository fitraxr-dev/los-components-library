'use client';

import React from 'react';

import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import Title from '@/components/shared/Title';


interface NewDebiturSectionProps {
  data: {
    color: string;
    name: string;
    value: number;
    plafond?: number;
  }[];
}

const NewDebiturSection: React.FC<NewDebiturSectionProps> = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      currency: 'IDR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      style: 'currency',
    }).format(value);
  };

  const formatCurrencyShort = (value: number) => {
    if (value >= 1_000_000_000) {
      return `IDR ${(value / 1_000_000_000).toFixed(1)} Miliar`;
    } else if (value >= 1_000_000) {
      return `IDR ${(value / 1_000_000).toFixed(1)} Juta`;
    }
    return formatCurrency(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            '&::after': {
              borderBottom: '12px solid transparent',
              borderRight: '10px solid #3b5a7d',
              borderTop: '12px solid transparent',
              content: '""',
              height: 0,
              left: '-10px',
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
            },
            backgroundColor: '#3b5a7d',
            borderRadius: '4px 4px 4px 4px',
            boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
            color: '#FFFFFF',
            fontSize: isMobile ? 12 : 14,
            fontWeight: 600,
            padding: '8px 12px',
            position: 'relative',
            whiteSpace: 'nowrap',
          }}
        >
          Total Plafond : {data.plafond !== undefined ? formatCurrencyShort(data.plafond) : 'N/A'}
        </Box>
      );
    }
    return null;
  };

  const outerRadius = isMobile ? 60 : isTablet ? 70 : 80;
  const height = isMobile ? 280 : isTablet ? 300 : 300;

  return (
    <Box
      sx={{
        '& path': { outline: 'none !important' },
        '& path:focus': { outline: 'none !important' },
        '& svg': { outline: 'none !important' },
        '& svg:focus': { outline: 'none !important' },
        '&:active': { border: 'none !important', outline: 'none !important' },
        '&:focus': { border: 'none !important', outline: 'none !important' },
        '&:focus-visible': { border: 'none !important', outline: 'none !important' },
        backgroundColor: 'white',
        border: 'none !important',
        borderRadius: 3,
        boxShadow: '0px 1px 4px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        height: height,
        outline: 'none !important',
        overflow: 'visible',
        p: isMobile ? 2 : 3,
        width: '100%',
      }}
    >
      <Title title="New Customer" />

      <Box
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 3,
          overflow: 'visible',
          width: '100%',
        }}
      >
        <Box
          sx={{
            '& path': { outline: 'none !important' },
            '& path:focus': { outline: 'none !important' },
            alignItems: 'center',
            display: 'flex',
            flex: isMobile ? 'initial' : 1,
            height: isMobile ? 150 : '100%',
            justifyContent: 'center',
            overflow: 'visible',
            width: isMobile ? '100%' : 'auto',
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart style={{ outline: 'none', overflow: 'visible' }}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={outerRadius}
                stroke="none"
                isAnimationActive={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={<CustomTooltip />}
                cursor={false}
                allowEscapeViewBox={{ x: true, y: true }}
                wrapperStyle={{
                  overflow: 'visible',
                  pointerEvents: 'none',
                  zIndex: 1000,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Legend */}
        <Box
          sx={{
            display: 'flex',
            flex: isMobile ? 'initial' : 1,
            flexDirection: 'column',
            gap: isMobile ? 1 : 1.5,
            justifyContent: 'center',
            width: isMobile ? '100%' : 'auto',
          }}
        >
          {data.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                alignItems: 'center',
                display: 'flex',
                gap: isMobile ? 1 : 2,
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    backgroundColor: item.color,
                    borderRadius: '50%',
                    flexShrink: 0,
                    height: 8,
                    width: 8,
                  }}
                />
                <Typography
                  sx={{
                    color: '#1F2937',
                    fontSize: isMobile ? 12 : 14,
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.name}
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: '#6B7280',
                  flexShrink: 0,
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: 500,
                }}
              >
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default NewDebiturSection;
