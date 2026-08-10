import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { downloadFile } from '@/helpers/utils';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modalData } from '../../../ManagementShareholder.constants';

import useModalDebtorDetailNew from './ModalDebtorDetailNew.hook';


const ModalDebtorDetailNew = NiceModal.create(({ id }: { id: string }) => {
  const modalId = modalData.MODAL_DEBTOR_DETAIL_NEW;
  const theme = useTheme();
  const { visible } = useModal(modalId);

  const {
    cellDataWithDetail,
  } = useModalDebtorDetailNew({ id });

  return (
    <SectionModal
      title="Detail Customer"
      isOpen={visible}
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
            buttons={item.url ?
              [
                {
                  action: async () => downloadFile(item.url, item.value),
                  iconName: 'download',
                  label: '',
                }
              ] : []}
            options={item.sx}
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
    </SectionModal>
  );
});


export default ModalDebtorDetailNew;
