import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { downloadFile } from '@/helpers/utils';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';


import { usePopupManagementDetail } from './PopupDebtorDetail.hook';

import type { PopupManagementDetailProps } from '../PopupManagementDetail/PopupManagementDetail.types';


const PopupManagementDetail = NiceModal.create(({
  id,
}: PopupManagementDetailProps) => {
  const modalId = MODAL.MASTER.MANAGEMENT_DEBTOR_DETAIL;
  const theme = useTheme();
  const modal = useModal(modalId);

  const { cellDataWithDetail } = usePopupManagementDetail(id.toString());
  return (
    <SectionModal
      title="Detail management"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '52vw',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(2),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        {cellDataWithDetail.map((item, index) =>
          <Cell
            title={item.label}
            value={item.value}
            buttons={item.url ? [{ action: async () => downloadFile(item.url, item.value), iconName: 'download', label: '' }] : []}
            options={index === 0 ? { gridColumn: '1 / span 2' } : index === 1 ? { gridColumn: '1 / span 1' } : { gridColumn: '2 / span 2' }}
            key={index}
          />,
        )}
      </Box>
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


export default PopupManagementDetail;
