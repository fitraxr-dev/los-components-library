import NiceModal, { useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { MODAL_ID } from '../../Rating.constants';

import { TABLE_DATA } from './__mock__';
import { HISTORY_TABLE_HEADER } from './HistoryTable.constants';


const HistoryTable = NiceModal.create(() => {
  const modalId = MODAL_ID.HISTORY_MODAL;
  const modal = useModal(modalId);


  return (
    <SectionModal
      title="History Rating"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '90vw' }}
    >
      <Table
        maxHeight="50vh"
        tableHeader={HISTORY_TABLE_HEADER}
        tableData={TABLE_DATA}
      />


      <RowWrapper sx={{ justifyContent: 'end', mt: 3, py: 3 }}>
        <Button
          variant="outlined"
          sx={{ mr: 3 }}
          onClick={() => closeNiceModal(modalId)}
        >
          Cancel
        </Button>
      </RowWrapper>
    </SectionModal>
  );
},
);

export default HistoryTable;
