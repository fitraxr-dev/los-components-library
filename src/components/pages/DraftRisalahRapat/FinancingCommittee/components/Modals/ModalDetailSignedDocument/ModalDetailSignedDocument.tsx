import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { toDateString, toHourMinuteSecond } from '@/helpers/date';
import useGetDocumentById from '@/hooks/services/useGetDocumentById';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import type { DocumentVerificationResultResponseDto } from '@/services/openapi/agreement-service';


const ModalDetailSignedDocument = NiceModal.create(({ id }: DocumentVerificationResultResponseDto) => {
  const theme = useTheme();

  const modalId = MODAL.RISALAH_RAPAT.DETAIL_SIGNED_DOCUMENT;
  const { visible } = useModal(modalId);

  const { data: documentDetailData } = useGetDocumentById({ id });

  return (
    <SectionModal
      title="Detail Dokumen Risalah Rapat Yang Sudah Ditandatangani"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        minWidth: '52vw',
      }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Cell
            title="Nama Dokumen"
            value={documentDetailData?.documentName ?? '-'}
          />
          <Cell
            title="Nomor Dokumen"
            value={documentDetailData?.documentNumber ?? '-'}
          />
          <Cell
            title="Tanggal Dokumen"
            value={documentDetailData?.documentDate ? toDateString(documentDetailData?.documentDate) : '-'}
          />
          <Cell
            title="Waktu Dokumen"
            value={documentDetailData?.documentDate ? toHourMinuteSecond(documentDetailData?.documentDate) : '-'}
          />
        </Box>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ModalDetailSignedDocument;
