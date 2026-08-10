import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { downloadFile } from '@/helpers/utils';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modalData } from '../../../ManagementShareholder.constants';

import useGetModalManagementDetailNew from './ModalManagementDetailNew.hook';


const ModalManagementDetailNew = NiceModal.create(({ id }: { id: number }) => {
  const modalId = modalData.MODAL_MANAGEMENT_DETAIL_NEW;
  const theme = useTheme();
  const modal = useModal(modalId);

  const {
    cellDataWithDetail,
  } = useGetModalManagementDetailNew(id);

  return (
    <SectionModal
      title="Detail management"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '60vw',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(2),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        <>
          {cellDataWithDetail.map((item, index) =>
            <Cell
              title={item.label}
              value={item.value}
              buttons={item.url ? [{ action: async () => downloadFile(item.url, item.value), iconName: 'download', label: '' }] : []}
              key={index}
            />,
          )}
        </>
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


export default ModalManagementDetailNew;
