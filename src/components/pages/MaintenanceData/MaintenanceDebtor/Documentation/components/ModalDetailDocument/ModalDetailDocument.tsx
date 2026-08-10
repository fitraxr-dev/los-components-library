import React from 'react';

import { create, useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from '../../Documentation.constants';

import { useModalDetailDocument } from './ModalDetailDocument.hooks';

import type { ModalDetailDocumentProps } from './ModalDetailDocument.types';


const ModalDetailDocument = create((props: ModalDetailDocumentProps) => {
  const { data } = props;
  const theme = useTheme();
  const modalId = modal.DETAIL_DOCUMENT;
  const { visible } = useModal(modalId);
  const { handleOpenWatermarkModal } = useModalDetailDocument();

  return (
    <SectionModal
      title="Detail Documentation"
      isOpen={visible}
      customFooter={() => {}}
      containerSx={{ minWidth: '60vw' }}
      onClose={() => closeNiceModal(modalId)}
    >
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(2),
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <Cell title="Master ID" value={data?.bucketMasterId} />
        <Cell title="ID Process" value={data?.bucketProcessId} />
        <Cell title="Group Dokumen" value={data?.documentGroupLabel} />
        <Cell title="Jenis Dokumen" value={data?.documentTypeLabel} />
        <Cell title="Nama Dokumen" value={data?.fileName} />
        <Cell title="Nomor Dokumen" value={data?.documentNumber} />
        <Cell title="Tanggal Dokumen" value={data?.documentDate} />
        <Cell title={null} value={null} />
        <Cell title="Upload By" value={data?.uploadedBy} />
        <Cell title="Upload Date" value={data?.uploadedDate} />
        <Cell
          title="Upload Dokumen"
          value={data?.document}
          buttons={ data?.document ? [
            {
              action: () => { handleOpenWatermarkModal(data, 'preview'); },
              iconName: 'preview-document',
              label: 'Preview',
            },
            {
              action: () => { handleOpenWatermarkModal(data, 'download'); },
              iconName: 'download',
              label: 'Download',
            },
          ] : []}
        />
        <Cell title="Creator Name" value={data?.creatorName} />
        <Cell title="Division Creator" value={data?.divisionLabel} />
      </Box>
      <RowWrapper sx={{ justifyContent: 'end', mt: theme.spacing(3) }}>
        <Button
          variant="outlined"
          onClick={() => closeNiceModal(modalId)}
        >
          Close
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default ModalDetailDocument;
