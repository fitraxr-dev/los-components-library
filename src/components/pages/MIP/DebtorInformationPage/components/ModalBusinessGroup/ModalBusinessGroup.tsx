'use client';
import { create, useModal } from '@ebay/nice-modal-react';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import { modal } from '../../DebtorInformation.constants';

import useModalGroupBusiness from './ModalBusinessGroup.hook';


const ModalBusinessGroup = create(() => {
  const modalId = modal.GROUP_BUSINESS;
  const { visible } = useModal(modalId);

  const {
    append,
    bisnisGroupDropdownList,
    control,
    fields,
    getDropdownListFiltered,
    handleAddGroup,
    handleDeleteDebtor,
    handleOnSave,
    remove,
    saveBusinessGroupLoading,
    update,
    selectedValueByIndex,
  } = useModalGroupBusiness();


  return (
    <SectionModal
      title="Pilih Group Usaha"
      containerSx={{ minHeight: '20vh', minWidth: '45vw' }}
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
            render: (row, index) => (
              <Controller
                control={control}
                name={`business_group.${index}.groupId`}
                render={({
                  field: { ref, onChange, value, ...field },
                  fieldState: { invalid, error, isTouched },
                }) => (
                  <Autocomplete
                    {...field}
                    placeholder="Pilih Group Usaha"
                    label=""
                    value={bisnisGroupDropdownList?.find(
                      (res) => res?.id === value)}
                    dropdownList={getDropdownListFiltered(row, index) ?? []}
                    onChange={(val) => {
                      const selectedId = val?.id as string;
                      onChange(selectedId);
                      update(index, { groupId: selectedId });
                      selectedValueByIndex.current = {
                        ...selectedValueByIndex.current,
                        [index]: selectedId,
                      };
                    }}
                    onInputChange={() => null}
                    error={isTouched && invalid}
                    helperText={isTouched && error ? error.message : ''}
                  />
                )}
              />
            ),
          },
          {
            key: 'action',
            label: 'Action',
            options: () => [
              {
                iconName: 'delete',
                onClick: (_, index: number) => {
                  // TODO copy ke draftMemo
                  remove(index);
                  const biggerKeys = Object.keys(selectedValueByIndex.current)
                    .filter((num) => Number(num) > index)
                    .reduce((prev, key) => (prev[key] = selectedValueByIndex.current[key], prev), {});
                  if (Object.keys(biggerKeys).length > 0) {
                    const smallKeys = Object.keys(selectedValueByIndex.current)
                      .filter((num) => Number(num) < index)
                      .reduce((prev, key) => (prev[key] = selectedValueByIndex.current[key], prev), {});
                    const minusOneKeys = Object.keys(biggerKeys)
                      .reduce((prev, key) => (prev[Number(key) - 1] = biggerKeys[key], prev), {});
                    selectedValueByIndex.current = {
                      ...smallKeys,
                      ...minusOneKeys,
                    };
                  } else {
                    selectedValueByIndex.current = Object.keys(selectedValueByIndex.current)
                      .filter((num) => Number(num) !== index)
                      .reduce((prev, key) => (prev[key] = selectedValueByIndex.current[key], prev), {});
                  }
                },
              }
            ],
            sx: { width: '4%' },
            type: 'action',
          },
        ]}
        tableData={fields}
        footer={<TableFooter onClick={() => handleAddGroup()} />}
      />
      <RowWrapper sx={{ gap: 2, justifyContent: 'end', justifyItems: 'end', mt: 3 }}>
        <Button variant="outlined" onClick={() => closeNiceModal(modalId)}>
          Cancel
        </Button>
        <Button
          isLoading={saveBusinessGroupLoading}
          onClick={handleOnSave}
          disabled={fields.length < 1}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default ModalBusinessGroup;
