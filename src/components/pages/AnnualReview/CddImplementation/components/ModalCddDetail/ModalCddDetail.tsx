import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from '../../CddImplementation.constants';

import type { ModalCddDetailProps } from './ModalCddDetail.type';


const ModalCddDetail = NiceModal.create((props: ModalCddDetailProps) => {
  const modalId = modal.MODAL_CDD_DETAIL;
  const { visible } = useModal(modalId);
  const theme = useTheme();

  return (
    <SectionModal
      title="Detail Penerapan Customer Due Diligence"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      closeBtnText="Close"
      containerSx={{
        maxWidth: '50vw',
      }}
    >
      <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
        <Input
          disabled
          type="text"
          label="Persetujuan Khusus"
          value={props?.typeSpecialApprovalLabel}
        />

        <Input
          disabled
          type="area"
          label="Deskripsi"
          minRows={4}
          value={props?.description}
        />
      </ColumnWrapper>
    </SectionModal>
  );
});
export default ModalCddDetail;
