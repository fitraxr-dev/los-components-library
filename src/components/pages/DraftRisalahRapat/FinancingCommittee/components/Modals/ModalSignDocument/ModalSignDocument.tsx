import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Dialog, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalTransition from '@/components/shared/SmiModal/ModalTransition';
import TextStyle from '@/components/shared/TextStyle';

import useModalSignDocument from './ModalSignDocument.hook';

import type { TypeModule, TypeProcess } from '@/enums/Module';


interface ModalSignDocumentProps {
  bucketProcessId: string;
  documentId: number;
  documentDate?: string;
  documentName?: string;
  documentNumber?: string;
  fileName?: string;
  module: TypeModule;
  process: TypeProcess;
}

const ModalSignDocument = NiceModal.create((props: ModalSignDocumentProps) => {
  const theme = useTheme();

  const modalId = MODAL.RISALAH_RAPAT.SIGN_DOCUMENT;
  const { visible } = useModal(modalId);

  const {
    handleManualDocumentSign,
    handlePrivyDocumentSign,
  } = useModalSignDocument(props);

  return (
    <Dialog
      TransitionComponent={ModalTransition}
      open={visible}
      onClose={() => closeNiceModal(modalId)}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: '29vw',
          padding: 4,
        },
      }}
    >
      <ColumnWrapper gap={2} alignItems="center">
        <Icon
          iconName="document-signature-filled"
          sx={{ fontSize: theme.typography.h2 }}
        />
        <TextStyle
          variant="display2"
          color="primary.main"
          weight={700}
          sx={{ textAlign: 'center' }}
        >
          Penandatanganan
        </TextStyle>
        <TextStyle sx={{ textAlign: 'center' }}>
          Pilih Opsi Penandatanganan
        </TextStyle>
      </ColumnWrapper>

      <RowWrapper gap={2} mt={4}>
        <Button
          variant="outlined"
          isFull
          onClick={handleManualDocumentSign}
        >
          Manual Upload
        </Button>
        <Button
          variant="contained"
          isFull
          endIcon="privy"
          endIconSx={{ path: undefined }}
          onClick={handlePrivyDocumentSign}
        >
          Privy
        </Button>
      </RowWrapper>
    </Dialog>
  );
});

export default ModalSignDocument;
