'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { modal } from '../../List.constants';

import { useModalDetail } from './ModalDetail.hook';


const ModalDetail = NiceModal.create(({ detailData }: { detailData: any }) => {
  const modalId = modal.DETAIL;
  const { visible } = useModal(modalId);

  const {
    page,
    setPage,
    setPageSize,
    isLoading,
    tableHeader,
    tableData,
    totalPage,
  } = useModalDetail({ detailData });

  return (
    <SectionModal
      title="Detail Message"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        maxHeight: '75vh',
        maxWidth: '75vw',
        minWidth: '75vw',
      }}
    >
      <Table
        isPaper
        isLoading={isLoading}
        maxHeight="50vh"
        tableHeader={tableHeader}
        tableData={tableData}
        totalPage={totalPage}
        currentPage={page}
        handlePageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </SectionModal>
  );
});

export default ModalDetail;
