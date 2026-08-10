'use client';
import { create, useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import IconButton from '@/components/shared/IconButton';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { modal } from '../../DebtorInformation.constants';

import useModalGroupBusiness from './ModalGroupBusiness.hook';


const ModalGroupBusiness = create(() => {
  const theme = useTheme();
  const modalId = modal.GROUP_BUSINESS;
  const { visible } = useModal(modalId);

  const {
    handleOnSave,
    handleEditGroup,
    handleAddGroup,
    handleDeleteDebtor,
    listGroupDebtor,
    groupBusinessDropdownList,
    saveBusinessGroupLoading,
  } = useModalGroupBusiness();


  return (
    <SectionModal
      title="Pilih Group Usaha"
      containerSx={{ minWidth: '65vw' }}
      isOpen={visible}
      customFooter={() => null}
    >
      <Table
        tableHeader={[
          {
            key: 'index',
            label: 'No',
            sx: { width: '4%' },
            type: 'index',
          },
          {
            key: 'groupName',
            label: 'Nama Group Usaha',
            render: (_, index) => (
              <Input
                type="dropdown"
                placeholder="Select Tipe"
                containerSx={{ flex: 1 }}
                dropdownList={groupBusinessDropdownList}
                onChange={(e) => handleEditGroup(e, index)}
                value={listGroupDebtor[index].groupId}
              />
            ),
          },
          {
            key: 'action',
            label: 'Action',
            options: [
              { iconName: 'delete', onClick: (_: unknown, index: number) => handleDeleteDebtor(index) },
            ],
            sx: { width: '4%' },
            type: 'action',
          },
        ]}
        tableData={listGroupDebtor}
        footer={
          <RowWrapper
            sx={{ justifyContent: 'end', mb: 2 }}
          >
            <Button
              variant="outlined"
              startIcon="add-2"
              startIconSx={{ fontSize: theme.spacing(3) }}
              sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
              onClick={() => handleAddGroup()}
            >
              Add New
            </Button>
          </RowWrapper>
        }
      />
      <RowWrapper sx={{ gap: 2, justifyContent: 'end', mt: 3 }}>
        <Button variant="outlined" onClick={() => closeNiceModal(modalId)}>
          Cancel
        </Button>
        <Button
          isLoading={saveBusinessGroupLoading}
          onClick={handleOnSave}
          disabled={listGroupDebtor.length < 1}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default ModalGroupBusiness;
