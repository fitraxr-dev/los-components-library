'use client';

import { useEffect, Fragment } from 'react';

import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';

import { ActivityType } from '@/enums/Activity';
import useRecordLog from '@/hooks/useRecordLog';

import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';

import useSuccessRatePage from './SuccessRatePage.hook';


interface SuccessRatePageProps {
  filterValues: {
    direktorat: string;
    divisi1: string;
    divisi1Label?: string;
    divisi2: string;
    divisi2Label?: string;
  };
}

const SuccessRatePage = ({ filterValues }: SuccessRatePageProps) => {
  const { recordActivity } = useRecordLog();
  const theme = useTheme();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      remarks: 'view overview compare dashboard success rate',
    });
  }, []);

  const { data, getDivisiNames, isLoading } = useSuccessRatePage(filterValues);

  const isFilterEmpty =
    !filterValues.divisi1?.trim() || !filterValues.divisi2?.trim();

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

  if (isFilterEmpty || !data.length) {
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <TableContainer>
        <Table
          size="small"
          sx={{ borderCollapse: 'collapse', tableLayout: 'fixed', width: '100%' }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: 'none', width: '40%' }} />
              <TableCell
                align="center"
                sx={{
                  border: 'none',
                  color: theme.palette.primary.dark,
                  fontSize: '1rem',
                  fontWeight: 700,
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
                  width: '30%',
                }}
              >
                {getDivisiNames.divisi2}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((group, groupIdx) => (
              <Fragment key={groupIdx}>
                {/* Group Title */}
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
                    {group.category}
                  </TableCell>
                  <TableCell sx={{ border: 'none' }} />
                  <TableCell sx={{ border: 'none' }} />
                </TableRow>

                {/* Items */}
                {group.items.map((item, idx) => (
                  <TableRow
                    key={idx}
                    sx={{
                      backgroundColor:
                        idx % 2 === 1 ? theme.palette.action.hover : 'transparent',
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
                      sx={{ border: 'none', fontWeight: 500, p: '12px 8px' }}
                    >
                      {item.divisi1}
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{ border: 'none', fontWeight: 500, p: '12px 8px' }}
                    >
                      {item.divisi2}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Separator */}
                {groupIdx < data.length - 1 && (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ border: 'none', p: 0 }}>
                      <Box
                        sx={{
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          mt: 1,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SuccessRatePage;
