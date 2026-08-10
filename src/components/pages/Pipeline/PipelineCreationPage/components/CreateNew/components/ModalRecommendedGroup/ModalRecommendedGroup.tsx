'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import { useModalRecommendedGroup } from './ModalRecommendedGroup.hook';

import type { ModalRecommendedGroupProps } from './ModalRecommendedGroup.types';


const ModalRecommendedGroup = NiceModal.create(({
  groupName,
  onSelectGroup,
  onCreateNew,
}: ModalRecommendedGroupProps) => {
  const {
    filter,
    filterContentList,
    filterDropdownList,
    handleAddGroupMember,
    handleCreateNewGroup,
    isLoading,
    isSaveLoading,
    listMasterGroup,
    page,
    pageSize,
    selected,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
    totalPage,
    visible,
    modalId,
  } = useModalRecommendedGroup({ groupName, onCreateNew, onSelectGroup });

  const footer = (
    <RowWrapper sx={{ justifyContent: 'end', mt: 2 }}>
      <Button
        variant="outlined"
        sx={{ mr: 1 }}
        onClick={() => closeNiceModal(modalId)}
      >
        Cancel
      </Button>
      <Button
        disabled={isLoading || isSaveLoading}
        sx={{ mr: 1 }}
        onClick={handleCreateNewGroup}
      >
        Create New Group
      </Button>
      <Button
        disabled={isLoading || isSaveLoading || selected.length < 1}
        onClick={handleAddGroupMember}
      >
        Add Group Member
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      title="Recommended Groups"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        maxHeight: '75vh',
        maxWidth: '75vw',
        minWidth: '75vw',
      }}
      customFooter={footer}
    >
      <Box sx={{ mb: 2 }}>
        <TextStyle variant="body2" color="text.secondary">
          Terdapat Nama Group yang sama pada database
        </TextStyle>
      </Box>

      <Input
        type="search"
        value={filter}
        onChange={setFilter}
        placeholder="Search groups..."
        dropdownList={filterDropdownList}
        contentList={filterContentList}
      />

      <Table
        isPaper
        isLoading={isLoading}
        maxHeight="23.5vw"
        tableHeader={tableHeader}
        tableData={listMasterGroup}
        totalPage={totalPage}
        currentPage={page}
        handlePageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </SectionModal>
  );
});

export default ModalRecommendedGroup;
