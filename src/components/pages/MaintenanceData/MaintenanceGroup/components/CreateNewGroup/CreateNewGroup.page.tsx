'use client';
import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import { modal as MODAL } from '../../ListPage/MaintenanceGroup.constants';

import useCreateNewGroupModal from './CreateNewGroup.hooks';


const CreateNewGroupModal = NiceModal.create(() => {
  const modalId = MODAL.CREATE_NEW_GROUP;
  const modal = useModal(modalId);

  const { tableHeader, listData } = useCreateNewGroupModal();

  const footer = (
    <RowWrapper sx={{ gap: 2, justifyContent: 'end', mt: 2 }}>
      <Button
        variant="outlined"
      >
        Create New Group
      </Button>
      <Button>
        Use Existing Group
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      // title="Rekomendasi Nama Group"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{ minWidth: '52vw' }}
      customFooter={footer}
    >
      <Title title="Rekomendasi Nama Group" />

      <Table
        isPaper
        tableHeader={tableHeader}
        tableData={listData?.data?.contents}

      />
    </SectionModal>
  );
}
);

export default CreateNewGroupModal;
