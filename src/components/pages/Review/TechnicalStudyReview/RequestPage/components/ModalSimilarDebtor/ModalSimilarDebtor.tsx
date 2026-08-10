'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { modal } from '../../Request.constants';


interface ModalSimilarDebtorProps {
  dataTable: any[];
}

const ModalSimilarDebtor = NiceModal.create<ModalSimilarDebtorProps>(({ dataTable }) => {
  const modalId = modal.SIMILAR_DEBTOR;
  const { visible } = useModal(modalId);

  const tableHeader = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '4vw' },
      type: 'index',
    },
    {
      key: 'debtorName',
      label: 'Nama Depan',
      sx: { minWidth: '8vw' },
    },
    {
      key: 'debtorId',
      label: 'Kode',
      sx: { minWidth: '6vw' },
    },
    {
      key: 'profile',
      label: 'Profil',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'birthPlace',
      label: 'Tempat Lahir',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'birthDate',
      label: 'Tanggal Lahir',
      sx: { minWidth: '13vw' },
      type: 'date',
    },
    {
      key: 'nationality',
      label: 'Warga Negara',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'category',
      label: 'Watchlist',
      sx: { minWidth: '10vw' },
    },
  ];

  return (
    <SectionModal
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        maxHeight: '90vh',
        maxWidth: '80vw',
        minWidth: '80vw',
      }}
      title="Similar Debtor List"
    >
      <Table
        isPaper
        tableHeader={tableHeader}
        tableData={dataTable || []}
        hidePagination
      />
    </SectionModal>
  );
});

export default ModalSimilarDebtor;
