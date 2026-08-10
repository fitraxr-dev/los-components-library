import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalTable from '@/components/shared/SmiModal/ModalTable';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { useModalDebtorDetail } from './ModalDebtorDetail.hook';


const ModalDebtorDetail = NiceModal.create(({ id, tableType }: { id: number; tableType: string }) => {
  const theme = useTheme();

  const modalId = 'DEBTOR_DETAIL';
  const modal = useModal(modalId);

  const {
    cellDataWithDetail,
    cellDataCreditChecking,
    documentContents,
    documentPage,
    setItemPerPage,
    setNoPage,
    handleOpenWatermarkModal,
    showDetailCondition,
  } = useModalDebtorDetail(id);


  return (
    <SectionModal
      title="Detail Customer"
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
        {cellDataWithDetail.map((item, index) => (
          <Cell
            title={item.label}
            value={item.value}
            buttons={item.url ? [
              {
                action: () => handleOpenWatermarkModal(item, 'preview'),
                iconName: 'preview-document',
                label: 'Preview',
              },
              {
                action: () => handleOpenWatermarkModal(item, 'download'),
                iconName: 'download',
                label: 'Download',
              },
            ] : []}
            options={item.sx}
            key={index}
          />
        ))}
      </Box>

      {(showDetailCondition || tableType === 'SUMMARY' || tableType === 'UPLOAD_RESULT') && (
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
          {tableType === 'SUMMARY' || showDetailCondition && (
            <Box
              sx={{
                display: 'grid',
                gridGap: theme.spacing(2),
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >
              {cellDataCreditChecking.map((item, index) => (
                <Cell
                  title={item.label}
                  value={item.value}
                  options={item.sx}
                  key={index}
                />
              ))}
            </Box>
          )}
        </Box>
      )
      }
    </SectionModal >
  );
});


export default ModalDebtorDetail;
