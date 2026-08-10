import NiceModal from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import useModalFormMember from './ModalFormMember.hook';


const ModalFormMember = NiceModal.create(({
}) => {
  const {
    visible,
    modalId,
    setFilter,
    theme,
    isLoading,
    handleAddMember,
    tableHeader,
    debtorAutoCompleteList,
    selectedMember,
    setSelectedMember,
  } = useModalFormMember();

  return (
    <SectionModal
      title=" Add Group Member"
      isOpen={visible}
      customFooter={() => null}
      containerSx={{ maxHeight: '75vh', minWidth: '32vw' }}
      onClose={() => closeNiceModal(modalId)}
    >
      <Autocomplete
        label=""
        placeholder="Pencarian"
        dropdownList={debtorAutoCompleteList}
        onInputChange={(e) => {
          setFilter(e.toString());
        }}
        onChange={(e) => {
          if (e.id) {

            setSelectedMember([...selectedMember,
              {
                debtorId: e.id,
                debtorName: e.label,
              }]);
          }
        }}
      />
      {/* <RowWrapper
        sx={{
          border: '1px solid',
          borderColor: theme.palette.primary.main,
          borderRadius: theme.radius(1),
        }}
      >
        <RowWrapper sx={{ alignItems: 'center', flex: 1, px: 2, py: 1.5 }}>
          <Icon iconName="search" textVariant="body3" sx={{ mr: 2 }} />
          <InputBase
            sx={{
              '.MuiInputBase-input': {
                height: theme.typography.body4.fontSize,
                padding: '0px',
                ...theme.typography.body4,
                fontWeight: 500,
              },
              flex: 1,
            }}
            type="text"
            placeholder="Pencarian"
            onChange={(e) => {
              setFilter((prev) => ({
                ...prev,
                value: e.target.value,
              }));
            }}
          />
        </RowWrapper>
      </RowWrapper> */}
      <Table
        tableHeader={tableHeader}
        tableData={
          selectedMember
        }
        isLoading={isLoading}
      />
      <RowWrapper justifyContent="end" mt={theme.spacing(2)}>
        <Button
          onClick={handleAddMember}
        >
          Add Member to Group
        </Button>
      </RowWrapper>
    </SectionModal>
  );
},
);

export default ModalFormMember;
