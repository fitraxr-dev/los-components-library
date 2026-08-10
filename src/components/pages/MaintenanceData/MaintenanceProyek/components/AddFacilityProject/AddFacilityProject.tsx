'use client';
import NiceModal from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import useAddFacilityProject from './AddFacilityProject.hooks';


interface AddFacilityProjectProps {
  id: string;
  listPayload: any;
  selectedMember?: any;
  detailProyek?: any;
}

const AddFacilityProject = NiceModal.create((props: AddFacilityProjectProps) => {
  const {
    modal,
    modalId,
    handleAddFacilities,
    isLoadingProjectFacility,
    isSaveLoading,
    projectFacilityFilter,
    setProjectFacilityFilter,
    setProjectFacilityPage,
    setProjectFacilityPageSize,
    facilityDataMapped,
    projectFacilityFilterContentList,
    projectFacilityPage,
    projectFacilityPageSize,
    projectFacilitySearchByOptions,
    tableHeaderAddFacility,
    selectedFacilities,
    selectedMember,
    totalPages,
  } = useAddFacilityProject(props);

  return (
    <SectionModal
      title="Add Facility Project"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '70vw' }}
    >
      {/* Show selected member info if available */}
      {/* {selectedMember && (
        <TextStyle variant="body3" sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          Selected Member: {selectedMember.customerName} ({selectedMember.customerId})
        </TextStyle>
      )} */}

      <Input
        type="search"
        value={projectFacilityFilter}
        onChange={setProjectFacilityFilter}
        placeholder="Pencarian"
        dropdownList={projectFacilitySearchByOptions}
        contentList={projectFacilityFilterContentList}
      />

      <Table
        tableHeader={tableHeaderAddFacility}
        isLoading={isLoadingProjectFacility}
        tableData={facilityDataMapped}
        totalPage={totalPages}
        currentPage={projectFacilityPage}
        pageSize={projectFacilityPageSize}
        handlePageChange={setProjectFacilityPage}
        onPageSizeChange={setProjectFacilityPageSize}
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
          onClick={handleAddFacilities}
          disabled={selectedFacilities.length === 0}
        >
          Add Facility Project
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default AddFacilityProject;
