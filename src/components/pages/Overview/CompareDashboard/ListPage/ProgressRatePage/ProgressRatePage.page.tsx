'use client';

import React, { useEffect } from 'react';

import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  Paper,
} from '@mui/material';

import { ActivityType } from '@/enums/Activity';
import useRecordLog from '@/hooks/useRecordLog';

import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder/EmptyPlaceholder';

import useProgressRatePage from './ProgressRatePage.hook';


interface ProgressRatePageProps {
  filterValues: {
    direktorat: string;
    divisi1: string;
    divisi2: string;
  };
}

const ProgressRatePage = ({ filterValues }: ProgressRatePageProps) => {
  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      remarks: 'view overview compare dashboard progress rate',
    });
  }, []);

  const theme = useTheme();
  const { data, getDivisiNames, isLoading } = useProgressRatePage(filterValues);

  if (isLoading) {
    return (
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          height: '60vh',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const isFilterEmpty =
    !filterValues.divisi1 || !filterValues.divisi2;

  const isDataEmpty = !data || data.items.length === 0;

  if (isFilterEmpty || isDataEmpty) {
    return (
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          height: '60vh',
          justifyContent: 'center',
        }}
      >
        <EmptyPlaceholder status="compare-empty" />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <TableContainer component={Paper} elevation={0}>
        <Table
          size="small"
          sx={{
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
            width: '100%',
          }}
        >
          {/* Header Divisi */}
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  border: 'none',
                  p: '12px 8px',
                  width: '40%',
                }}
              />
              <TableCell
                align="center"
                sx={{
                  border: 'none',
                  color: theme.palette.primary.dark,
                  fontSize: '1rem',
                  fontWeight: 700,
                  p: '12px 8px',
                  width: '30%',
                }}
              >
                {getDivisiNames.divisi1}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  border: 'none',
                  color: theme.palette.primary.dark,
                  fontSize: '1rem',
                  fontWeight: 700,
                  p: '12px 8px',
                  width: '30%',
                }}
              >
                {getDivisiNames.divisi2}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Judul Kategori */}
            <TableRow>
              <TableCell
                sx={{
                  border: 'none',
                  color: theme.palette.text.secondary,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  p: '12px 8px',
                }}
              >
                Progress Overview Status
              </TableCell>
              <TableCell sx={{ border: 'none' }} />
              <TableCell sx={{ border: 'none' }} />
            </TableRow>

            {/* Daftar Item */}
            {data.items.map((item, idx) => (
              <TableRow
                key={idx}
                sx={{
                  backgroundColor:
                    idx % 2 === 1
                      ? theme.palette.action.hover
                      : 'transparent',
                }}
              >
                <TableCell
                  sx={{
                    border: 'none',
                    fontSize: 14,
                    fontWeight: 500,
                    p: '12px 8px',
                  }}
                >
                  {item.name}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    border: 'none',
                    fontSize: 14,
                    fontWeight: 500,
                    p: '12px 8px',
                  }}
                >
                  {item.divisi1}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    border: 'none',
                    fontSize: 14,
                    fontWeight: 500,
                    p: '12px 8px',
                  }}
                >
                  {item.divisi2}
                </TableCell>
              </TableRow>
            ))}

            {/* Baris Total */}
            <TableRow
              sx={{
                backgroundColor: theme.palette.action.hover,
              }}
            >
              <TableCell
                sx={{
                  border: 'none',
                  fontSize: 17,
                  fontWeight: 600,
                  p: '14px 8px',
                }}
              >
                Total in progress memo
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  border: 'none',
                  color: theme.palette.primary.main,
                  fontSize: 17,
                  fontWeight: 600,
                  p: '14px 8px',
                }}
              >
                {data.total1}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  border: 'none',
                  color: theme.palette.primary.main,
                  fontSize: 17,
                  fontWeight: 600,
                  p: '14px 8px',
                }}
              >
                {data.total2}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProgressRatePage;
