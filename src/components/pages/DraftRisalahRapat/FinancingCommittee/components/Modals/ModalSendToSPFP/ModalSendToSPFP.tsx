import NiceModal, { useModal } from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import useModalSendToSPFP from './ModalSendToSPFP.hook';


const ModalSendToSPFP = NiceModal.create(() => {
  const modalId = MODAL.RISALAH_RAPAT.SEND_TO_SPFP;
  const { visible } = useModal(modalId);

  const {
    handleSendToSPFP,
    isLoading,
    page,
    pageSize,
    selectedDocument,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage,
  } = useModalSendToSPFP();

  return (
    <SectionModal
      title="Pilih Dokumen untuk Dikirim ke SPFP"
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
            variant="contained"
            isLoading={isLoading}
            onClick={handleSendToSPFP}
            disabled={tableData?.length <= 0 || !selectedDocument.size}
          >
            Send to SPFP
          </Button>
        </RowWrapper>
      }
    >
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
    </SectionModal>
  );
});

export default ModalSendToSPFP;
