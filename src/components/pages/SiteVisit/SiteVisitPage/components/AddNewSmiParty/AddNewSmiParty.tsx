'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Controller, useWatch } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modalSiteVisit } from '../../SiteVisit.constants';
import { PartyType, type PartySiteVisit } from '../AddNewSiteVisit/AddNewSIteVisit.hook';

import useAddNewSmiParty from './AddNewSmiParty.hook';


interface AddNewSmiPartyProps {
  editData?: PartySiteVisit;
  editIndex?: number;
  storeData: (type: PartyType, data: PartySiteVisit) => void;
}

const AddNewSmiParty = NiceModal.create(({ editData, editIndex, storeData }: AddNewSmiPartyProps) => {
  const {
    control,
    division,
    divisionList,
    userList,
    isLoadingDivisions,
    isLoadingUsers,
    onSave,
    setDivisionId,
    setUserInput,
    setValue,
  } = useAddNewSmiParty(editData);
  const modalId = modalSiteVisit.ADD_NEW_PIHAK_SMI;
  const modal = useModal(modalId);
  const name = useWatch({ control, name: 'name' });
  const position = useWatch({ control, name: 'position' });
  const isValid = !!division && !!name && !!position;

  const footer = (
    <RowWrapper sx={{ gap: 3, justifyContent: 'end', mt: 5 }}>
      <Button
        variant="outlined"
        onClick={() => {closeNiceModal(modalId);}}
      >
        Cancel
      </Button>
      <Button
        disabled={!isValid}
        onClick={onSave((data) => {
          // Pertahankan ID dari editData jika sedang edit
          const finalData: PartySiteVisit = {
            ...(data || {}),
            ...(editData?.id && { id: editData.id }),
          };
          storeData(PartyType.OWNER, finalData);
          closeNiceModal(modalId);
        })}
      >
        Save
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      title={editData ? 'Edit Pihak PT.SMI yang melakukan kunjungan' : 'Add New Pihak PT.SMI yang melakukan kunjungan'}
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        minWidth: '24.5vw',
      }}
      customFooter={footer}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        <Controller
          control={control}
          name="division"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Autocomplete
              {...field}
              id="input-divisi"
              testId="input-divisi"
              label="Divisi"
              placeholder="Divisi"
              dropdownList={divisionList}
              isLoading={isLoadingDivisions}
              value={field?.value && { label: field?.value }}
              onChange={({ id, label }) => {
                setDivisionId(id); field.onChange(label);
                setValue('name', null); setValue('position', null);
              }}
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
              isMandatory
            />
          )}
        />

        <Controller
          control={control}
          name="name"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Autocomplete
              {...field}
              id="input-nama"
              testId="input-nama"
              label="Nama"
              placeholder="Nama"
              dropdownList={userList}
              isLoading={isLoadingUsers}
              value={field?.value && { label: field?.value }}
              onInputChange={setUserInput}
              onChange={(v) => field.onChange(v?.label)}
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
              isMandatory
              disabled={!division}
            />)}
        />

        <Controller
          control={control}
          name="position"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="text"
              label="Position"
              placeholder="Position"
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
              disabled
              isMandatory
            />)}
        />
      </ColumnWrapper>
    </SectionModal>
  );
});


export default AddNewSmiParty;
