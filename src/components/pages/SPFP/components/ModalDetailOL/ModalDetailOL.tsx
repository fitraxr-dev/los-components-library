import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { downloadFile } from '@/helpers/utils';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from '../../UploadOfferingLetterPage/UploadOfferingLetter.constants';

import { useModalDetailOfferingLetter } from './ModalDetail.hook';

// import type { ModalDetailOfferingLetterProps } from './ModalDetailOfferingLetter.types';


const ModalDetailOfferingLetter = NiceModal.create((props: any) => {
  const modalId = modal.OFFERING_LETTER_DETAIL;
  const theme = useTheme();
  const { visible } = useModal(modalId);

  return (
    <SectionModal
      title="Detail OL"
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
            gridGap: theme.spacing(2),
            gridTemplateColumns: 'repeat(1, 1fr)',
          }}
        >
          <Cell
            title="No Draft"
            value={props?.data?.noDraft}
          />
          <Cell
            title="Nama Dokumen"
            value={props?.data?.fileName}
          />
          <Cell
            title="Tanggal"
            value={props?.data?.createdDate}
          />
          <Cell
            title="Dokumen"
            value={ props?.data?.fileName}
            buttons={[
              {
                action: () => downloadFile(props?.data?.file, props?.data?.fileName),
                iconName: 'download',
                label: 'Download',
              },
            ]}
          />
          <Cell
            title="Status"
            value={props?.data?.status}
          />
        </Box>
        <RowWrapper sx={{ justifyContent: 'end' }}>
          <Button
            variant="outlined"
            sx={{ mr: 3 }}
            onClick={() => closeNiceModal(modalId)}
          >
            Close
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal >
  );
});

export default ModalDetailOfferingLetter;
