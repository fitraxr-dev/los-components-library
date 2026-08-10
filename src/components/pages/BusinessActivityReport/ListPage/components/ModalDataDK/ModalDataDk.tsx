'use client';

import NiceModal, { useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import { modal } from '../../List.constants';

import { useModalDataDk } from './ModalDataDk.hook';


interface ModalDataDkProps {
  data: Array<any>;
}

const ModalDataDk = NiceModal.create((props: ModalDataDkProps) => {
  const { data } = props;
  const modalId = modal.CUSTOMER_DK_VALIDATION;
  const { visible } = useModal(modalId);
  const {
    tableHeader,
  } = useModalDataDk();

  const footer = (
    <RowWrapper sx={{ justifyContent: 'end', mt: 2 }}>
      <Button
        variant="outlined"
        onClick={() => {
          closeNiceModal(modalId);
        }}
      >
        Close
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        gap: '12px',
        maxHeight: '75vh',
        maxWidth: '75vw',
        minWidth: '75vw',
      }}
      customFooter={footer}
    >
      <Title title="Data List from Database DK" sx={{ justifyContent: 'center' }} />
      <Table
        isPaper
        maxHeight="23.5vw"
        tableHeader={tableHeader}
        tableData={data}
      />
    </SectionModal>
  );
});


export default ModalDataDk;
