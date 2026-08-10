import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { documentCategory } from '@/configs/constants/documentCategory';
import { toDateString } from '@/helpers/date';
import { downloadFileV2 } from '@/helpers/utils';
import useGetDocumentById from '@/hooks/services/useGetDocumentById';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from '../../TableUploadDocumentRisalahRapat.constant';

import type { ModalDetailUploadDocumentProps } from './ModalDetailUploadDocument.types';


const ModalDetailUploadDocument = NiceModal.create(({ id, title }: ModalDetailUploadDocumentProps) => {
  const theme = useTheme();

  const modalId = modal.DOCUMENT_DETAIL;
  const { visible } = useModal(modalId);

  const { data: documentDetail } = useGetDocumentById({ id });

  return (
    <SectionModal
      title={`Detail ${title ? title : 'Dokumen'}`}
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
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
            title="Upload By"
            value={documentDetail?.createdBy ?? '-'}
          />
          <Cell
            title="Upload Date"
            value={documentDetail?.createdDate ? toDateString(documentDetail?.createdDate) : '-'}
          />
        </Box>
        <Cell
          title="Kategori Dokumen"
          value={documentCategory?.[documentDetail?.documentCategory]}
        />
        <Cell
          title="Group Dokumen"
          value={documentDetail?.documentGroupLabel ?? '-'}
        />
        <Cell
          title="Jenis Dokumen"
          value={documentDetail?.documentTypeLabel ?? '-'}
        />
        <Cell
          title="Upload Document"
          value={documentDetail?.fileName ?? '-'}
          buttons={[
            {
              action: () => downloadFileV2(documentDetail?.document, documentDetail?.fileName),
              iconName: 'download',
              label: 'Download',
            },
          ]}
        />
        <Cell
          title="Nama Dokumen"
          value={documentDetail?.documentName ?? '-'}
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
            value={documentDetail?.documentNumber}
          />
          <Cell
            title="Tanggal Dokumen"
            value={documentDetail?.documentDate ? toDateString(documentDetail?.documentDate) : '-'}
          />
        </Box>
      </ColumnWrapper>

      <RowWrapper sx={{ justifyContent: 'end', mt: 3, py: 3 }}>
        <Button
          variant="outlined"
          sx={{ mr: 3 }}
          onClick={() => closeNiceModal(modalId)}
        >
          Close
        </Button>
      </RowWrapper>
    </SectionModal >
  );
});

export default ModalDetailUploadDocument;
