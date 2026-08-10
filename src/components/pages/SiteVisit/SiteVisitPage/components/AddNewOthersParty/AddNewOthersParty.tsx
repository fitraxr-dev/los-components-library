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

import useAddNewOthersParty from './AddNewOthersParty.hook';


interface AddNewOthersPartyProps {
  editData?: PartySiteVisit;
  editIndex?: number;
  storeData: (type: PartyType, data: PartySiteVisit) => void;
}

const AddNewOthersParty = NiceModal.create(({ editData, editIndex, storeData }: AddNewOthersPartyProps) => {
  const { control, onSave } = useAddNewOthersParty(editData);
  const modalId = modalSiteVisit.ADD_NEW_PIHAK_LAIN;
  const modal = useModal(modalId);


  const footer = (
    <RowWrapper sx={{ gap: 3, justifyContent: 'end', mt: 5 }}>
      <Button
        variant="outlined"
        onClick={() => closeNiceModal(modalId)}
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
          storeData(PartyType.OTHER, finalData);
          closeNiceModal(modalId);
        })}
      >
        Save
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      title={editData ? 'Edit Pihak Lainnya' : 'Add New Pihak Lainnya'}
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
            />)}
        />

        <Controller
          control={control}
          name="instance"
          render={({ field: { ref, ...field }, fieldState }) => (
            <Input
              {...field}
              type="text"
              label="Instansi"
              placeholder="Input Instansi"
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
            />)}
        />
      </ColumnWrapper>
    </SectionModal>
  );
});


export default AddNewOthersParty;
