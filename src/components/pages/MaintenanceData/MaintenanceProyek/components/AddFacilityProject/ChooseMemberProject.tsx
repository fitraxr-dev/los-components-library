'use client';
import NiceModal from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import useChooseMemberProject from './ChooseMemberProject.hooks';


interface ChooseMemberProjectProps {
  id: string;
  listPayload: any;
  detailProyek?: any;
}

const ChooseMemberProject = NiceModal.create((props: ChooseMemberProjectProps) => {
  const {
    modal,
    modalId,
    handleAdd,
    isLoadingProjectMember,
    isSaveLoading,
    projectMemberFilter,
    setProjectMemberFilter,
    setProjectMemberPage,
    setProjectMemberPageSize,
    projectMemberData,
    projectMemberDataMapped,
    projectMemberFilterContentList,
    projectMemberPage,
    projectMemberPageSize,
    projectMemberSearchByOptions,
    tableHeaderAddProjectMember,
    selectedRequest,
  } = useChooseMemberProject(props);

  return (
    <SectionModal
      title="Choose Member Project"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '70vw' }}
    >
      <Input
        type="search"
        value={projectMemberFilter}
        onChange={setProjectMemberFilter}
        placeholder="Pencarian"
        dropdownList={projectMemberSearchByOptions}
        contentList={projectMemberFilterContentList}
      />

      <Table
        tableHeader={tableHeaderAddProjectMember}
        isLoading={isLoadingProjectMember}
        tableData={projectMemberDataMapped}
        totalPage={projectMemberData?.data?.page?.totalPage}
        currentPage={projectMemberPage}
        pageSize={projectMemberPageSize}
        handlePageChange={setProjectMemberPage}
        onPageSizeChange={setProjectMemberPageSize}
      />

      <RowWrapper marginTop={5} justifyContent="end" gap={2}>
        <Button
          variant="outlined"
          onClick={() => closeNiceModal(modalId)}
        >
          Close
        </Button>
        <Button
          isLoading={isSaveLoading}
          onClick={handleAdd}
          disabled={!selectedRequest}
        >
          Choose Member
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default ChooseMemberProject;
