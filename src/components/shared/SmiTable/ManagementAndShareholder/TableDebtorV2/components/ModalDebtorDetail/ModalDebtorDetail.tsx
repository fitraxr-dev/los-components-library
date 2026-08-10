import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { downloadFile } from '@/helpers/utils';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalTable from '@/components/shared/SmiModal/ModalTable';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { useModalDebtorDetail } from './ModalDebtorDetail.hook';


const ModalDebtorDetail = NiceModal.create(({
  id,
  module,
  isRequestMode,
  tableType,
}: ModalDebtorDetailProps) => {
  const modalId = 'DEBTOR_DETAIL';
  const theme = useTheme();
  const { visible } = useModal(modalId);

  const {
    cellDataWithDetail,
    cellDataCreditChecking,
    documentContents,
    documentPage,
    setItemPerPage,
    setNoPage,
    handleOpenWatermarkModal,
  } = useModalDebtorDetail(id, module, isRequestMode);

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
            options={item.sx}
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
          {documentContents?.length > 0 && <ModalTable
            data={documentContents}
            page={documentPage}
            setItemPerPage={setItemPerPage}
            setNoPage={setNoPage}
          />}

          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(2),
              gridTemplateColumns: 'repeat(2, 1fr)',
              mt: 5,
            }}
          >
            {
              cellDataCreditChecking.map((item, index) =>
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
    </SectionModal>
  );
});


export default ModalDebtorDetail;
