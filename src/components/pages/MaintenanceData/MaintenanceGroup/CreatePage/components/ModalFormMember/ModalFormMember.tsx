import NiceModal from '@ebay/nice-modal-react';
import { Box, InputBase } from '@mui/material';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import useModalFormMember from './ModalFormMember.hook';

import type { ModalFormMemberProps } from './ModalFormMember.types';


const ModalFormMember = NiceModal.create(({
}) => {
  const {
    visible,
    modalId,
    setFilter,
    theme,
    isLoading,
    handleAddMember,
    handleAddMemberToTable,
    tableHeader,
    debtorAutoCompleteList,
    selectedMember,
    setSelectedMember,
    isButtonDisabled,
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
            handleAddMemberToTable(e);
          }
        }}
      />
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
          disabled={isButtonDisabled}
        >
          Add Member to Group
        </Button>
      </RowWrapper>
    </SectionModal>
  );
},
);

export default ModalFormMember;
