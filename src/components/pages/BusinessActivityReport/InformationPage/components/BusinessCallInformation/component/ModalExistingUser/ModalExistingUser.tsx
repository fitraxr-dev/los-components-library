'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';


import { modal } from '../../../../Information.constant';

import { useModalExistingUser } from './ModalExistingUser.hook';

import type { ModalExistingUserProps } from './ModalExistingUser.constant';


const ModalExistingUser = NiceModal.create((props: ModalExistingUserProps) => {
  const modalId = modal.EXISTING_USER;
  const { visible } = useModal(modalId);
  const { similarDebtorList } = props;

  const {
    handleCreateNewDebiturAndBar,
    selected,
    tableHeader,
    handleCreateBarWithExisting,
  } = useModalExistingUser(props);

  const footer = (
    <RowWrapper sx={{ gap: '24px', justifyContent: 'end', mt: 2 }}>
      <Button
        disabled={!!selected}
        onClick={handleCreateNewDebiturAndBar}
      >
        Create New Customer & BAR
      </Button>
      <Button
        disabled={!selected}
        onClick={handleCreateBarWithExisting}
      >
        Create BAR
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        maxHeight: '90vh',
        maxWidth: '75vw',
        minWidth: '75vw',
      }}
      customFooter={footer}
      title="Rekomendasi Nama Customer"
    >
      <Table
        isPaper
        tableHeader={tableHeader}
        tableData={similarDebtorList}
      />
    </SectionModal>
  );
});


export default ModalExistingUser;
