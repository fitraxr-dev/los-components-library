import NiceModal, { useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/TableV2';

import { modal } from '../../SyariahFacility.constants';

import useModalInquiryAccountList from './ModalInquiryAccountList.hook';


const ModalInquiryAccountList = NiceModal.create(({ cif }: { cif: string }) => {
  const {
    itemPerPage,
    noPage,
    setItemPerPage,
    setNoPage,
    tableHeader,
    inquiryAccountListContents,
    inquiryAccountListPage,
    isLoadingInquiryAccountList,
  } = useModalInquiryAccountList({ cif });

  const modalId = modal.INQUIRY_ACCOUNT_LIST;
  const { visible } = useModal(modalId);

  const footer = (
    <RowWrapper sx={{ justifyContent: 'end', mt: 2 }}>
      <Button
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
        maxHeight: '75vh',
        maxWidth: '75vw',
        minWidth: '75vw',
      }}
      customFooter={footer}
    >
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableData={inquiryAccountListContents}
          tableHeader={tableHeader}
          pageSize={itemPerPage}
          currentPage={noPage}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
          totalPage={inquiryAccountListPage?.totalPage}
          isLoading={isLoadingInquiryAccountList}
        />
      </BaseContainer>
    </SectionModal>
  );
});
export default ModalInquiryAccountList;
