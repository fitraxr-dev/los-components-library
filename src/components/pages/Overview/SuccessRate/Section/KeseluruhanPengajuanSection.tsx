'use client';

import React from 'react';

import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

import Title from '@/components/shared/Title';


interface KeseluruhanPengajuanSectionProps {
  data: {
    color: string;
    name: string;
    value: number;
  }[];
}

const KeseluruhanPengajuanSection: React.FC<KeseluruhanPengajuanSectionProps> = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const chartHeight = isMobile ? 140 : isTablet ? 180 : 240;
  const height = isMobile ? 350 : isTablet ? 380 : 400;

  return (
    <Box
      sx={{
        '& rect': { outline: 'none !important', stroke: 'none !important' },
        '& svg': { outline: 'none !important' },
        '& svg:focus': { outline: 'none !important' },
        '&:active': { border: 'none !important', outline: 'none !important' },
        '&:focus': { border: 'none !important', outline: 'none !important' },
        '&:focus-visible': { border: 'none !important', outline: 'none !important' },
        alignItems: 'center',
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
      <Title title="Keseluruhan Pengajuan" />

      <Box
        sx={{
          '& path': { outline: 'none !important' },
          '& path:focus': { outline: 'none !important' },
          alignItems: 'center',
          display: 'flex',
          flex: isMobile ? 'initial' : 1,
          height: chartHeight,
          justifyContent: 'center',
          overflow: 'visible',
          width: '100%',
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
              outerRadius="100%"
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? 0.8 : 1.2,
          mt: isMobile ? 1.5 : 2,
          width: isMobile ? '100%' : '80%',
        }}
      >
        {data.map((item, idx) => (
          <Box
            key={idx}
            sx={{
              alignItems: 'center',
              display: 'flex',
              gap: 1,
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
  );
};

export default KeseluruhanPengajuanSection;
