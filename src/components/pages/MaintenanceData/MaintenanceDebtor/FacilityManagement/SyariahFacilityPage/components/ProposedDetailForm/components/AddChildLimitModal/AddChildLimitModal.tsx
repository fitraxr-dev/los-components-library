'use client';
import { create, useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import useAddChildLimitModal from './AddChildLimitModal.hook';


const AddChildLimitModal = create(() => {
  const theme = useTheme();
  const modalId = MODAL.MAINTENANCE_DATA.ADD_ADD_CHILD_LIMIT;
  const modal = useModal(modalId);

  const {
    filter,
    processList,
    isLoading,
    setPage,
    setPageSize,
    page,
    tableHeader,
    setFilter,
    filterDropdownList,
    filterContentList,
    processPage,
    pageSize,
    handleSave,
    selectedFacilities,
    canCreateChildLimit,
  } = useAddChildLimitModal();


  const footer = (
    <RowWrapper sx={{ gap: 2, justifyContent: 'end', mt: 2 }}>
      <Button
        variant="outlined"
        onClick={() => {
          closeNiceModal(modalId);
        }}
      >
        Cancel
      </Button>
      <Button
        isLoading={false}
        onClick={handleSave}
        disabled={selectedFacilities.length === 0 || !canCreateChildLimit}
      >
        Save
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      title="Add Child Limit"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        minWidth: '80vw',
      }}
      customFooter={footer}
    >
      <ColumnWrapper gap={theme.spacing(3)} marginBottom={theme.spacing(5)}>
        <Box sx={{ width: '45vw' }}>
          <Input
            type="search"
            value={filter}
            hasFilter
            onChange={setFilter}
            placeholder="Pencarian..."
            dropdownList={filterDropdownList}
            contentList={filterContentList}
          />
        </Box>

        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeader}
            tableData={processList}
            totalPage={processPage?.totalPage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            isLoading={isLoading}
            onPageSizeChange={setPageSize}
            pageSize={pageSize}
          />
        </BaseContainer>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default AddChildLimitModal;
