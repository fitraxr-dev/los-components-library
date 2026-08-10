import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { toDateString, toHourMinuteSecond } from '@/helpers/date';
import useGetDraftMemoById from '@/hooks/services/bucket-document/draft-memo/useGetDraftMemoById';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import type { DocumentVerificationResultResponseDto } from '@/services/openapi/agreement-service';


const ModalDetailMergeDocument = NiceModal.create(({ id }: DocumentVerificationResultResponseDto) => {
  const theme = useTheme();

  const modalId = MODAL.RISALAH_RAPAT.DETAIL_MERGE_DOCUMENT;
  const { visible } = useModal(modalId);

  const { data: documentDetailData } = useGetDraftMemoById({ id });

  return (
    <SectionModal
      title="Detail Merge Dokumen Risalah Rapat"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        minWidth: '52vw',
      }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        <Cell
          title="Nama Dokumen"
          value={documentDetailData?.documentName ?? '-'}
        />
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Cell
            title="Nomor Dokumen"
            value={documentDetailData?.documentNumber ?? '-'}
          />
          <Cell
            title="Tanggal Dokumen"
            value={documentDetailData?.createdAt ? toDateString(documentDetailData?.createdAt) : '-'}
          />
          <Cell
            title="Waktu Dokumen"
            value={documentDetailData?.createdAt ? toHourMinuteSecond(documentDetailData?.createdAt) : '-'}
          />
          <Cell
            title="Status"
            value={documentDetailData?.status ?? '-'}
          />
        </Box>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ModalDetailMergeDocument;
