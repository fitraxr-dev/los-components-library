'use client';

import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import {
  Dialog,
  Box,
  Grid,
  Button as MuiButton,
  useTheme,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalTransition from '@/components/shared/SmiModal/ModalTransition';
import TextStyle from '@/components/shared/TextStyle';

import useGetAuditTrailDetail from '../hooks/useGetAuditTrailDetail';


interface AuditTrailDetailModalProps {
  logId: number;
  logData?: any;
}

const AuditTrailDetailModal = NiceModal.create(({ logId, logData }: AuditTrailDetailModalProps) => {
  const theme = useTheme();
  const modal = useModal();
  const modalId = MODAL.FAST_TRACK.AUDIT_TRAIL_DETAIL;
  const { processId, bucketProcessId } = useIdentity();
  const { recordActivity } = useRecordLog();

  // Fetch detail data from API
  const { data: detailData, isLoading } = useGetAuditTrailDetail({ logId });

  const header = detailData?.header ?? {};
  const currentChange = detailData?.currentChange ?? {};
  const changeHistory = detailData?.changeHistory ?? [];

  const handleViewChanges = () => {
    recordActivity({
      activity: ActivityType.PREVIEW,
      bucketProcessId: String(processId ?? bucketProcessId),
      module: TypeModule.FAST_TRACK,
      process: TypeProcess.FAST_TRACK,
      remarks: 'view changes in audit trail detail',
    });
    NiceModal.show(MODAL.FAST_TRACK.AUDIT_TRAIL_COMPARE, { logData: detailData, logId });
  };

  const renderTlConfirmation = (value: string) => {
    const isConfirmed = value === 'Sudah dikonfirmasi';
    if (isConfirmed) {
      return (
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: '#005b82',
              borderRadius: '4px',
              display: 'flex',
              height: 16,
              justifyContent: 'center',
              width: 16,
            }}
          >
            <Box component="span" sx={{ color: '#fff', fontSize: '10px', fontWeight: 'bold', lineHeight: 1 }}>
              ✓
            </Box>
          </Box>
          <TextStyle variant="body4" color="#005b82" weight={600}>
            Sudah dikonfirmasi
          </TextStyle>
        </Box>
      );
    } else {
      return (
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
          <Box
            sx={{
              alignItems: 'center',
              border: '1.5px solid #d32f2f',
              borderRadius: '4px',
              display: 'flex',
              height: 16,
              justifyContent: 'center',
              width: 16,
            }}
          />
          <TextStyle variant="body4" color="#d32f2f" weight={600}>
            Belum Di Konfirmasi
          </TextStyle>
        </Box>
      );
    }
  };

  const isTlConfirmationParam = (parameter: string) => {
    return parameter?.toLowerCase()?.includes('tl confirmation');
  };

  return (
    <Dialog
      TransitionComponent={ModalTransition}
      open={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      PaperProps={{
        sx: {
          borderRadius: theme.radius(2),
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          maxWidth: '80vw',
          minWidth: '70vw',
          padding: theme.spacing(4),
        },
      }}
    >
      {/* Title */}
      <RowWrapper
        sx={{
          borderBottom: 1,
          borderColor: theme.palette.custom.gray30,
          borderWidth: '0.02vw',
          justifyContent: 'flex-start',
          marginBottom: theme.spacing(3),
          paddingBottom: theme.spacing(1),
        }}
      >
        <TextStyle
          variant="title2"
          weight={700}
          color={theme.palette.primary.main}
        >
          Detail Log Audit Trail
        </TextStyle>
      </RowWrapper>

      {/* Main Content */}
      <Box sx={{ flex: 1, mb: 3, overflowY: 'auto', pr: 1 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Header Info Panel */}
            <Box
              sx={{
                border: '1px solid',
                borderColor: theme.palette.custom.gray30,
                borderRadius: theme.radius(1),
                marginBottom: theme.spacing(4),
                padding: theme.spacing(3),
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={3} sx={{ borderColor: theme.palette.custom.gray30, borderRight: '1px solid' }}>
                  <TextStyle variant="body4" color={theme.palette.custom.gray20} sx={{ display: 'block', mb: 0.5 }}>
                    Jenis Dokumen
                  </TextStyle>
                  <TextStyle variant="body2" weight={600} color={theme.palette.primary.main}>
                    {header.jenisDokumen ?? '-'}
                  </TextStyle>
                </Grid>
                <Grid item xs={3} sx={{ borderColor: theme.palette.custom.gray30, borderRight: '1px solid', pl: 2 }}>
                  <TextStyle variant="body4" color={theme.palette.custom.gray20} sx={{ display: 'block', mb: 0.5 }}>
                    Nama Dokumen
                  </TextStyle>
                  <TextStyle variant="body2" weight={600} color={theme.palette.primary.main}>
                    {header.namaDokumen ?? '-'}
                  </TextStyle>
                </Grid>
                <Grid item xs={3} sx={{ borderColor: theme.palette.custom.gray30, borderRight: '1px solid', pl: 2 }}>
                  <TextStyle variant="body4" color={theme.palette.custom.gray20} sx={{ display: 'block', mb: 0.5 }}>
                    Nomor Dokumen
                  </TextStyle>
                  <TextStyle variant="body2" weight={600} color={theme.palette.primary.main}>
                    {header.nomorDokumen ?? '-'}
                  </TextStyle>
                </Grid>
                <Grid item xs={3} sx={{ pl: 2 }}>
                  <TextStyle variant="body4" color={theme.palette.custom.gray20} sx={{ display: 'block', mb: 0.5 }}>
                    Versi
                  </TextStyle>
                  <TextStyle variant="body2" weight={600} color={theme.palette.primary.main}>
                    {header.versi ?? '-'}
                  </TextStyle>
                </Grid>
              </Grid>
            </Box>

            {/* Change Banner */}
            <RowWrapper sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <TextStyle variant="body1" weight={700} color={theme.palette.primary.main}>
                  {currentChange.changeLabel ?? '-'}
                </TextStyle>
                <TextStyle variant="body5" color={theme.palette.custom.gray20} sx={{ display: 'block', mt: 0.5 }}>
                  {currentChange.changeDate ?? '-'}
                </TextStyle>
              </Box>
              <MuiButton
                variant="outlined"
                onClick={handleViewChanges}
                startIcon={
                  <Box
                    sx={{
                      alignItems: 'center',
                      border: '1.5px solid',
                      borderColor: theme.palette.primary.main,
                      borderRadius: '50%',
                      display: 'flex',
                      height: 20,
                      justifyContent: 'center',
                      width: 20,
                    }}
                  >
                    <span style={{ fontSize: '10px', marginLeft: '2px' }}>▶</span>
                  </Box>
                }
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(0, 91, 130, 0.04)',
                    borderColor: theme.palette.primary.main,
                  },
                  borderColor: theme.palette.primary.main,
                  borderRadius: theme.radius(1),
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  px: 2,
                  textTransform: 'none',
                }}
              >
                Lihat Perubahan Ini
              </MuiButton>
            </RowWrapper>

            {/* Comparison Grid Table */}
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: theme.radius(1), mb: 4 }}>
              <MuiTable size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                    <TableCell sx={{ borderColor: theme.palette.custom.gray30, borderRight: '1px solid', fontWeight: 700, py: 1.5, width: '35%' }}>Parameter</TableCell>
                    <TableCell sx={{ borderColor: theme.palette.custom.gray30, borderRight: '1px solid', fontWeight: 700, py: 1.5, width: '32.5%' }}>Before</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 1.5, width: '32.5%' }}>After</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(currentChange.changes ?? []).map((row, idx) => (
                    <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ borderColor: theme.palette.custom.gray30, borderRight: '1px solid', fontWeight: 500, py: 1.5 }}
                      >
                        {row.parameter}
                      </TableCell>
                      <TableCell sx={{ borderColor: theme.palette.custom.gray30, borderRight: '1px solid', py: 1.5 }}>
                        {isTlConfirmationParam(row.parameter) ? (
                          renderTlConfirmation(row.before)
                        ) : (
                          <TextStyle variant="body4">{row.before}</TextStyle>
                        )}
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        {isTlConfirmationParam(row.parameter) ? (
                          renderTlConfirmation(row.after)
                        ) : (
                          <TextStyle
                            variant="body4"
                            color={row.before !== row.after ? '#10b981' : 'inherit'}
                            weight={row.before !== row.after ? 600 : 400}
                          >
                            {row.after}
                          </TextStyle>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </MuiTable>
            </TableContainer>

            {/* Change History Section */}
            <TextStyle variant="body1" weight={700} color={theme.palette.primary.main} sx={{ display: 'block', mb: 2 }}>
              Riwayat Perubahan
            </TextStyle>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: theme.radius(1) }}>
              <MuiTable size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                    <TableCell sx={{ fontWeight: 700, py: 1.5 }}>Perubahan</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 1.5 }}>Tanggal</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 1.5 }}>Oleh</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 1.5 }}>Versi</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 1.5 }}>Keterangan</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {changeHistory.map((row, idx) => (
                    <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 500, py: 1.5 }}>{row.changeLabel}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>{row.date ? formatDateTime(row.date) : '-'}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>{row.changedBy}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>{row.version}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>{row.remark}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </MuiTable>
            </TableContainer>
          </>
        )}
      </Box>

      {/* Footer */}
      <RowWrapper sx={{ borderColor: theme.palette.custom.gray30, borderTop: '1px solid', justifyContent: 'flex-end', pt: 2 }}>
        <Button
          variant="outlined"
          onClick={() => closeNiceModal(modalId)}
          sx={{ height: '3vw', width: '8vw' }}
        >
          Close
        </Button>
      </RowWrapper>
    </Dialog>
  );
});

export default AuditTrailDetailModal;
