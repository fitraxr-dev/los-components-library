'use client';

import React, { useEffect } from 'react';

import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';

import { ActivityType } from '@/enums/Activity';
import useRecordLog from '@/hooks/useRecordLog';

import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder/EmptyPlaceholder';

import useProgressRatePage from './ProgressRatePage.hook';


interface ProgressRateDpopProps {
  filterValues: {
    direktorat: string;
    divisi1: string;
    divisi2: string;
  };
}

const ProgressRateDpop = ({ filterValues }: ProgressRateDpopProps) => {
  const { recordActivity } = useRecordLog();
  const theme = useTheme();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      remarks: 'view overview compare dashboard progress rate (DPOP type)',
    });
  }, [recordActivity]);

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

  const safeItems = data?.items ?? [];

  const isFilterEmpty =
    !filterValues.divisi1 || !filterValues.divisi2;

  const isDataEmpty = safeItems.length === 0;

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
    <Box
      sx={{
        display: 'flex',
        gap: 4,
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      {/* Divisi 1 */}
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            color: theme.palette.primary.dark,
            fontSize: '1rem',
            fontWeight: 700,
            mb: 1,
          }}
        >
          {getDivisiNames.divisi1}
        </Typography>

        <TableContainer
          sx={{
            border: 'none',
            boxShadow: 'none',
          }}
        >
          <Table size="small" sx={{ borderCollapse: 'collapse', width: '100%' }}>
            <TableBody>
              {safeItems.map((item, idx) => (
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
                </TableRow>
              ))}

              {/* Garis bawah */}
              <TableRow>
                <TableCell
                  colSpan={2}
                  sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    p: 0,
                  }}
                />
              </TableRow>

              {/* Total */}
              <TableRow>
                <TableCell
                  sx={{
                    border: 'none',
                    color: theme.palette.primary.main,
                    fontSize: 15,
                    fontWeight: 600,
                    p: '12px 8px',
                  }}
                >
                  Total in progress memo
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    border: 'none',
                    color: theme.palette.primary.main,
                    fontSize: 15,
                    fontWeight: 600,
                    p: '12px 8px',
                  }}
                >
                  {data.total1}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Divisi 2 */}
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            color: theme.palette.primary.dark,
            fontSize: '1rem',
            fontWeight: 700,
            mb: 1,
            textAlign: 'left',
          }}
        >
          {getDivisiNames.divisi2}
        </Typography>

        <TableContainer
          sx={{
            border: 'none',
            boxShadow: 'none',
          }}
        >
          <Table size="small" sx={{ borderCollapse: 'collapse', width: '100%' }}>
            <TableBody>
              {safeItems.map((item, idx) => (
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
                    {item.divisi2}
                  </TableCell>
                </TableRow>
              ))}

              {/* Garis bawah */}
              <TableRow>
                <TableCell
                  colSpan={2}
                  sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    p: 0,
                  }}
                />
              </TableRow>

              {/* Total */}
              <TableRow>
                <TableCell
                  sx={{
                    border: 'none',
                    color: theme.palette.primary.main,
                    fontSize: 15,
                    fontWeight: 600,
                    p: '12px 8px',
                  }}
                >
                  Total in progress memo
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    border: 'none',
                    color: theme.palette.primary.main,
                    fontSize: 15,
                    fontWeight: 600,
                    p: '12px 8px',
                  }}
                >
                  {data.total2}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ProgressRateDpop;
