import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MAINTENANCE_MODULE } from '@/configs/constants/maintenance';
import { MODAL } from '@/configs/constants/modalId';
import { downloadFile } from '@/helpers/utils';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';


import ModalTable from '../../../../../SmiModal/ModalTable';

import { usePopupManagementDetail } from './ModalManagementDetail.hook';

import type { PopupManagementDetailProps } from './ModalManagementDetail.types';


const PopupManagementDetail = NiceModal.create(({
  id,
  module,
  tableType,
}: PopupManagementDetailProps) => {
  const modalId = MODAL.MASTER.MANAGEMENT_DETAIL;
  const theme = useTheme();
  const modal = useModal(modalId);

  const {
    cellDataWithDetail,
    detailManagementCreditChecking,
    documentContents,
    documentPage,
    setItemPerPage,
    setNoPage,
    handleOpenWatermarkModal,
  } = usePopupManagementDetail(id, module);

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
              buttons={item.url ? [
                {
                  action: () => { handleOpenWatermarkModal(item, 'preview'); },
                  iconName: 'preview-document',
                  label: 'Preview',
                },
                {
                  action: () => { handleOpenWatermarkModal(item, 'download'); },
                  iconName: 'download',
                  label: 'Download',
                },
              ] : []}
              key={index}
            />,
          )}
        </>
      </Box>

      {tableType === 'SUMMARY' || tableType === 'UPLOAD_RESULT' ?
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(2),
          }}
        >
          <ModalTable
            data={documentContents}
            page={documentPage}
            setItemPerPage={setItemPerPage}
            setNoPage={setNoPage}
          />
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(2),
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >

            {
              detailManagementCreditChecking.map((item, index) =>
                <Cell
                  title={item.label}
                  value={item.value}
                  options={item.sx}
                  key={index}
                />,
              )
            }
          </Box>
        </Box> : null}
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
