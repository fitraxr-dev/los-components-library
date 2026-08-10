import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Cell from '@/components/shared/Cell';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal as MODAL } from '../../Create.constants';

import useViewDetailGroupModal from './ViewDetailGroupModal.hook';


const ViewDetailGroupModal = NiceModal.create(() => {
  const modalId = MODAL.VIEW_DETAIL_GROUP_MODAL;
  const modal = useModal(MODAL.VIEW_DETAIL_GROUP_MODAL);
  const theme = useTheme();
  const { cellDataModalDetail } = useViewDetailGroupModal();

  return (
    <SectionModal
      title="Detail Group Member"
      isOpen={modal.visible}
      customFooter={() => null}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        minWidth: '52vw',
      }}
    >
      <Box sx={{ display: 'grid', gridGap: theme.spacing(2), gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {cellDataModalDetail.data.map((item, index) => (
          <Cell
            title={item.label}
            value={item.value}
            key={index}
          />
        ))}

      </Box>
    </SectionModal>
  );
});

export default ViewDetailGroupModal;
