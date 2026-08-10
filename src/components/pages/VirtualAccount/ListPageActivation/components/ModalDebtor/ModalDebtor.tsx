'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import Search from '@/components/shared/Input/components/Search';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { LIST_DEBTOR_DATA } from '../../../__mocks__/mockData';
import { modal } from '../../List.constants';

import { useModalDebtor } from './ModalDebtor.hook';


const ModalDebtor = NiceModal.create(() => {
  const modalId = modal.DEBTOR;
  const { visible } = useModal(modalId);

  const {
    filter,
    filterContentList,
    filterDropdownList,
    hasSearched,
    isLoading,
    noPage,
    selected,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeader,
    tablePage,
    handleCreate,
  } = useModalDebtor(modalId);

  const footer = (
    <RowWrapper sx={{ gap: 2, justifyContent: 'end', mt: 2 }}>
      <Button
        variant="outlined"
        sx={{ }}
        onClick={() => closeNiceModal(modalId)}
      >
        Close
      </Button>
      <Button
        disabled={selected.length !== 1 }
        onClick={() => handleCreate()}
      >
        Create New VA
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
    >
      <Box width="70%">
        <Input
          type="search"
          value={filter}
          onChange={setFilter}
          placeholder="Pencarian..."
          contentList={filterContentList}
          dropdownList={filterDropdownList}
        />
      </Box>
      <Table
        isPaper
        maxHeight="50vh"
        isLoading={isLoading}
        tableHeader={tableHeader}
        tableData={tableData}
        currentPage={noPage}
        totalPage={tablePage?.totalPage ?? 1}
        handlePageChange={setNoPage}
        onPageSizeChange={setItemPerPage}
      />
    </SectionModal>
  );
});


export default ModalDebtor;
