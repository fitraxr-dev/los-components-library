'use client';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import useAddNewListOfValue from './AddNewListOfValue.hook';


const AddNewListOfValue = NiceModal.create((props?: { editData?: any; isEdit?: boolean }) => {
  const modalId = 'MODAL_ADD_LIST_OF_VALUE';
  const modal = useModal(modalId);

  const isEdit = props?.isEdit || false;
  const editData = props?.editData;

  return <AddNewListOfValueContent {...props} />;
});

const AddNewListOfValueContent = (props?: { editData?: any; isEdit?: boolean }) => {
  const { control, onSave, isFormValid, isLoading, isAutoSaveFetching } = useAddNewListOfValue(props);
  const modalId = 'MODAL_ADD_LIST_OF_VALUE';
  const modal = useModal(modalId);

  const isEdit = props?.isEdit || false;
  const editData = props?.editData;

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
          closeNiceModal(modalId);
        })}
        disabled={!isFormValid || isLoading || isAutoSaveFetching}
        isLoading={isLoading}
      >
        {isAutoSaveFetching ? 'Auto Saving...' : isEdit ? 'Update' : 'Save'}
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      title={isEdit ? 'Edit List Of Value' : 'Add New List Of Value'}
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        minWidth: '24.5vw',
      }}
      customFooter={footer}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        {/* Row 1: LOV ID (always disabled) - Value Name */}
        <RowWrapper sx={{ gap: 2 }}>
          <Controller
            control={control}
            name="code"
            render={({ field: { ref, ...field }, fieldState }) => (
              <Input
                {...field}
                type="text"
                label="LOV Code"
                placeholder="Enter LOV Code"
                disabled={true}
                error={!!fieldState?.error}
                helperText={fieldState?.error?.message}
                containerSx={{ flex: 1 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'none',
                    },
                  },
                  pointerEvents: 'none',
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="valueName"
            render={({ field: { ref, ...field }, fieldState }) => (
              <Input
                {...field}
                type="text"
                label="Value Name"
                placeholder="Enter Value Name"
                error={!!fieldState?.error}
                helperText={fieldState?.error?.message}
                containerSx={{ flex: 1 }}
                isMandatory
              />
            )}
          />
        </RowWrapper>

        {/* Row 2: Kode Arium - Kode Temenos */}
        <RowWrapper sx={{ gap: 2 }}>
          <Controller
            control={control}
            name="ariumCode"
            render={({ field: { ref, ...field }, fieldState }) => (
              <Input
                {...field}
                type="text"
                label="ARIUM CODE"
                placeholder="Enter ARIUM CODE"
                error={!!fieldState?.error}
                helperText={fieldState?.error?.message}
                containerSx={{ flex: 1 }}
              />
            )}
          />
          <Controller
            control={control}
            name="temenosCode"
            render={({ field: { ref, ...field }, fieldState }) => (
              <Input
                {...field}
                type="text"
                label="TEMENOS CODE"
                placeholder="Enter TEMENOS CODE"
                error={!!fieldState?.error}
                helperText={fieldState?.error?.message}
                containerSx={{ flex: 1 }}
              />
            )}
          />
        </RowWrapper>

        {/* Row 3: Radio Button */}
        <RowWrapper sx={{ gap: 2 }}>
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <Input
                {...field}
                label="Active"
                position="horizontal"
                radioList={[
                  { label: 'Ya', value: 'Ya' },
                  { label: 'Tidak', value: 'Tidak' },
                ]}
                type="radio"
                value={field.value ? 'Ya' : 'Tidak'}
                onChange={(e) => field.onChange(e.target.value === 'Ya')}
              />
            )}
          />
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
};

export default AddNewListOfValue;
