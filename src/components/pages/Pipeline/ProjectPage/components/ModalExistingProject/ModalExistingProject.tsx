import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { modal } from '../../Project.constants';

import useModalProjectExisting from './ModalExistingProject.hook';


const ModalExistingProject = NiceModal.create(() => {
  const modalId = modal.PROJECT_EXISTING_PAGE;
  const { visible } = useModal(modalId);
  const {
    handleAddProject,
    handleCreateNewProject,
    isSaveLoading,
    selected,
    tableHeader,
    isProjectListLoading,
    projectList,
    projectPage,
    setNoPage,
    setItemPerPage,
    noPage,
    filter,
    filterContentList,
    filterDropdownList,
    setFilter,
  } = useModalProjectExisting();


  return (
    <SectionModal
      title="Add Proyek"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '82vw',
      }}
    >
      <ColumnWrapper gap={2}>
        <Box width="100%">
          <Input
            type="search"
            value={filter}
            onChange={setFilter}
            placeholder="Pencarian..."
            dropdownList={filterDropdownList}
            contentList={filterContentList}
          />
        </Box>
        <Table
          tableHeader={tableHeader}
          tableData={projectList}
          isLoading={isProjectListLoading}
          totalPage={projectPage?.totalPage ?? 1}
          currentPage={noPage}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
        />
        <RowWrapper justifyContent="end" gap={2}>
          <Button
            disabled={selected?.length >= 1 || isProjectListLoading}
            onClick={handleCreateNewProject}
          >
            Create New Proyek
          </Button>
          <Button
            onClick={handleAddProject}
            disabled={!selected?.length}
            isLoading={isSaveLoading}
          >
            Add to Proyek
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
},
);

export default ModalExistingProject;
