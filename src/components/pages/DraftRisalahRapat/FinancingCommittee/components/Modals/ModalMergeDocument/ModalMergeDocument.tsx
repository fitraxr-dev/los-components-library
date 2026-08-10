import NiceModal, { useModal } from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { useModalMergeDocument } from './ModalMergeDocument.hook';


const ModalMergeDocument = NiceModal.create(() => {
  const modalId = MODAL.RISALAH_RAPAT.MERGE_DOCUMENT;
  const { visible } = useModal(modalId);

  const {
    handleMergeDocument,
    isLoading,
    page,
    pageSize,
    selectedDocument,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage,
  } = useModalMergeDocument();

  return (
    <SectionModal
      title="Merge Dokumen"
      containerSx={{ minWidth: '80vw' }}
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={
        <RowWrapper gap={2} mt={3} justifyContent="end">
          <Button
            variant="outlined"
            onClick={() => closeNiceModal(modalId)}
          >
            Cancel
          </Button>
          <Button
            color="success"
            isLoading={isLoading}
            onClick={handleMergeDocument}
            disabled={!selectedDocument.size}
          >
            Generate
          </Button>
        </RowWrapper>
      }
    >
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableHeader={tableHeader}
          tableData={tableData}
          currentPage={page}
          handlePageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalPage={totalPage}
          isLoading={isLoading}
        />
      </BaseContainer>
    </SectionModal>
  );
});

export default ModalMergeDocument;
