import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import SearchV2 from '@/components/shared/Input/components/Search/SearchV2';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/TableV2';

import { modal } from '../../SyariahFacility.constants';

import useModalInquiryLimitList from './ModalInquiryLimitList.hook';


const ModalInquiryLimitList = NiceModal.create(({ cif }: { cif: string }) => {
  const {
    filter,
    filterList,
    itemPerPage,
    noPage,
    searchByList,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableHeader,
    inquiryLimitListContents,
    inquiryLimitListPage,
    isLoadingInquiryLimitList,
  } = useModalInquiryLimitList({ cif });

  const modalId = modal.INQUIRY_LIMIT_LIST;
  const { visible } = useModal(modalId);

  const footer = (
    <RowWrapper sx={{ justifyContent: 'end', mt: 2 }}>
      <Button
        onClick={() => closeNiceModal(modalId)}
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
      <Box sx={{ width: '45vw' }}>
        <SearchV2 value={filter} contentList={searchByList} dropdownList={filterList} placeholder="Pencarian" onChange={setFilter} />
      </Box>

      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableData={inquiryLimitListContents}
          tableHeader={tableHeader}
          pageSize={itemPerPage}
          currentPage={noPage}
          isLoading={isLoadingInquiryLimitList}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
          totalPage={inquiryLimitListPage?.totalPage}
        />
      </BaseContainer>
    </SectionModal>
  );
});
export default ModalInquiryLimitList;
