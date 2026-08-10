import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MAINTENANCE_MODULE } from '@/configs/constants/maintenance';
import { MODAL } from '@/configs/constants/modalId';
import { downloadFile } from '@/helpers/utils';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Cell from '@/components/shared/Cell';
import ModalTable from '@/components/shared/SmiModal/ModalTable';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import useModalShareholderDetail from './ModalShareholderDetail.hook';

import type { ModalShareholderDetailProps } from './ModalShareholderDetail.types';


const ModalShareholderDetail = NiceModal.create(({
  id,
  module,
  isRequestMode,
  tableType,
}: ModalShareholderDetailProps) => {
  const theme = useTheme();

  const modalId = MODAL.MASTER.SHAREHOLDER_DETAIL;
  const modal = useModal(modalId);

  const {
    detailShareholderData,
    detailShareholderCreditChecking,
    documentContents,
    documentPage,
    setItemPerPage,
    setNoPage,
  } = useModalShareholderDetail(id, module, isRequestMode);


  return (
    <SectionModal
      title="Detail Shareholder"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
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
        {detailShareholderData.map((item, index) =>
          <Cell
            title={item.label}
            value={item.value}
            buttons={item.url ? [{ action: async () => downloadFile(item.url, item.value), iconName: 'download', label: '' }] : []}
            key={index}
          />,
        )}
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
              detailShareholderCreditChecking.map((item, index) =>
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
    </SectionModal >
  );
});


export default ModalShareholderDetail;
