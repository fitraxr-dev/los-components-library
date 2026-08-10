import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { downloadFile } from '@/helpers/utils';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Cell from '@/components/shared/Cell';
import SectionModal from '@/components/shared/SmiModal/SectionModal';


import useModalShareholderDetail from './ModalShareholderDetail.hook';

import type { ModalShareholderDetailProps } from './ModalShareholderDetail.types';


const ModalShareholderDetail = NiceModal.create(({ id }: ModalShareholderDetailProps) => {
  const theme = useTheme();

  const modalId = MODAL.MASTER.SHAREHOLDER_DETAIL;
  const modal = useModal(modalId);

  const { detailShareholderData } = useModalShareholderDetail(id);

  return (
    <SectionModal
      title="Detail Shareholder"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        minWidth: '57vw',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(2),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        {detailShareholderData.map((item, index) =>
          <Cell
            title={item.label}
            value={item.value}
            buttons={item.url ? [{ action: async () => downloadFile(item.url, item.value), iconName: 'download', label: '' }] : []}
            options={index === 0 ? { gridColumn: '1 / span 2' } : index === 1 ? { gridColumn: '1 / span 1' } : { gridColumn: '2 / span 2' }}
            key={index}
          />,
        )}
      </Box>

    </SectionModal >
  );
});


export default ModalShareholderDetail;
