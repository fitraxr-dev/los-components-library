import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { documentCategory } from '@/configs/constants/documentCategory';
import { toDateString } from '@/helpers/date';
import { downloadFileV2 } from '@/helpers/utils';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from '../../TableUploadDocumentRipple.constants';

import { useModalDetailUploadDocument } from './ModalDetailUploadDocument.hook';

import type { ModalDetailUploadDocumentProps } from './ModalDetailUploadDocument.types';


const ModalDetailUploadDocument = NiceModal.create((props: ModalDetailUploadDocumentProps) => {
  const { id, title } = props;
  const modalId = modal.MODAL_DETAIL_DOCUMENT_RIPPLE;
  const theme = useTheme();
  const { visible } = useModal(modalId);

  const { detail } = useModalDetailUploadDocument({ id });

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
            value={detail?.createdBy ?? '-'}
          />
          <Cell
            title="Upload Date"
            value={detail?.createdDate ? toDateString(detail?.createdDate) : '-'}
          />
        </Box>
        <Cell
          title="Kategori Dokumen"
          value={documentCategory?.[detail?.documentCategory]}
        />
        <Cell
          title="Group Dokumen"
          value={detail?.documentGroupLabel ?? '-'}
        />
        <Cell
          title="Jenis Dokumen"
          value={detail?.documentTypeLabel ?? '-'}
        />
        <Cell
          title="Upload Document"
          value={detail?.fileName ?? '-'}
          buttons={[
            {
              action: () => {downloadFileV2(detail?.document, detail?.fileName);},
              iconName: 'download',
              label: 'Download',
            },
          ]}
        />
        <Cell
          title="Nama Dokumen"
          value={detail?.documentName ?? '-'}
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
            value={detail?.documentNumber}
          />
          <Cell
            title="Tanggal Dokumen"
            value={detail?.documentDate ? toDateString(detail?.documentDate) : '-'}
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
