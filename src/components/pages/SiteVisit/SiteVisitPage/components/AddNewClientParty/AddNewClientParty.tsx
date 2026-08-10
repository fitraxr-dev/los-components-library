'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modalSiteVisit } from '../../SiteVisit.constants';
import { PartyType, type PartySiteVisit } from '../AddNewSiteVisit/AddNewSIteVisit.hook';

import useAddNewClientParty from './AddNewClientParty.hook';


interface AddNewClientPartyProps {
  editData?: PartySiteVisit;
  editIndex?: number;
  storeData: (type: PartyType, data: PartySiteVisit) => void;
}

const AddNewClientParty = NiceModal.create(({ editData, editIndex, storeData }: AddNewClientPartyProps) => {
  const { control, onSave } = useAddNewClientParty(editData);
  const modalId = modalSiteVisit.ADD_NEW_PIHAK_CLIENT;
  const modal = useModal(modalId);

  const footer = (
    <RowWrapper sx={{ gap: 3, justifyContent: 'end', mt: 5 }}>
      <Button
        variant="outlined"
        onClick={() => {closeNiceModal(modalId);}}
      >
        Cancel
      </Button>
      <Button
        onClick={onSave((data) => {
          // Pertahankan ID dari editData jika sedang edit
          const finalData: PartySiteVisit = {
            ...(data || {}),
            ...(editData?.id && { id: editData.id }),
          };
          storeData(PartyType.CLIENT, finalData);
          closeNiceModal(modalId);
        })}
      >
        Save
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      title={editData ? 'Edit Pihak Client/Customer' : 'Add New Pihak Client/Customer'}
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
          name="name"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="text"
              label="Nama"
              placeholder="Input Nama"
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
              isMandatory
            />
          )}
        />

        <Controller
          control={control}
          name="position"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="text"
              label="Jabatan"
              placeholder="Input Jabatan"
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
              isMandatory
            />)}
        />
      </ColumnWrapper>
    </SectionModal>
  );
});


export default AddNewClientParty;
