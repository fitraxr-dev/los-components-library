'use client';
import NiceModal from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import useAddProjectMember from './AddProjectMember.hooks';


interface AddProjectMemberProps {
  id: string;
  listPayload: any;
}

const AddProjectMember = NiceModal.create((props: AddProjectMemberProps) => {
  const {
    modal,
    modalId,
    customerList,
    tableHeaderAddProjectMember,
    handleSelectCustomer,
    selectedCustomerList,
    handleAdd,
    setFilter,
    isSaveLoading,
  } = useAddProjectMember(props);

  return (
    <SectionModal
      title="Add Project Member"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '70vw' }}
    >
      <Autocomplete
        label=""
        placeholder="Choose Kategori Proyek"
        dropdownList={customerList}
        onInputChange={(value) => {
          setFilter((prev) => ({
            ...prev,
            searchDetail: {
              ...prev.searchDetail,
              value: value,
            },
          }));
        }}
        onChange={(value) => {
          setFilter((prev) => ({
            ...prev,
            searchDetail: {
              ...prev.searchDetail,
              value: value.label,
            },
          }));
          if (!value || value.label === '') return;
          handleSelectCustomer(value.label);
        }}
        // value={filter.searchDetail.value}
      />

      <Table
        tableHeader={tableHeaderAddProjectMember}
        isLoading={false}
        tableData={selectedCustomerList}

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
          disabled={selectedCustomerList.length <= 0}
        >
          Save
        </Button>
      </RowWrapper>


    </SectionModal>
  );
});

export default AddProjectMember;
