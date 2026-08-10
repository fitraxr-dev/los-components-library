import NiceModal, { useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { MODAL_ID } from '../../Rating.constants';

import useDrdInterface from './DRDInterface.hooks';

import type { DrdInterfaceProps } from './DRDInterface.types';


const DRDInterfaceModal = NiceModal.create((props: DrdInterfaceProps) => {
  const modalId = MODAL_ID.DRD_INTERFACE_MODAL;
  const modal = useModal(modalId);

  const {
    TABLE_HEADER,
    tableData,
    isLoading,
    page,
    setPage,
    setItemPerPage,
    totalPage,
    itemPerPage } = useDrdInterface(props);

  return (
    <SectionModal
      title="DRD Interface"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '70vw' }}
    >
      <Table
        maxHeight="50vh"
        isLoading={isLoading}
        tableHeader={TABLE_HEADER}
        tableData={tableData}
        totalPage={totalPage ?? 1}
        currentPage={page}
        handlePageChange={setPage}
        onPageSizeChange={setItemPerPage}
        pageSize={itemPerPage}
      />

      <RowWrapper sx={{ justifyContent: 'end', mt: 3, py: 3 }}>
        <Button
          sx={{ mr: 3 }}
          onClick={() => closeNiceModal(modalId)}
        >
          Close
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default DRDInterfaceModal;
