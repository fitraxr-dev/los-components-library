import { useEffect } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import { capitalize } from '@/helpers/string';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { ITEM_MODAL_IDS } from '../../Item.constant';

import useSubItemModal from './SubItemModal.hook';
import { SubItemModalSchema } from './subItemModal.schema';


interface SubItemModalProps {
  subItemId?: number | string;
  groupApplicationTypeKey?: string;
  mode: 'add' | 'edit' | 'detail';
}

const SubItemModal = NiceModal.create(({ subItemId, groupApplicationTypeKey, mode }: SubItemModalProps) => {
  const modalId = ITEM_MODAL_IDS.SUBITEM_MODAL;
  const modal = useModal(modalId);

  const isFormDisabled = mode === 'detail';

  const form = useForm({
    defaultValues: {
      additionalAction: true,
      isActive: true,
      needConfirmation: true,
      noSubItem: '',
      referenceSubItem: null,
      subItem: '',
    },
    disabled: isFormDisabled,
    mode: 'onChange',
    resolver: yupResolver(SubItemModalSchema),
  });

  const { control, handleSubmit, formState: { isSubmitting, isValid } } = form;

  const {
    handleSave,
    parameterGroupSubItemData,
    referenceSubItemOptions,
    subItemNumberOptions,
    isAutoSaveFetching,
  } = useSubItemModal({
    form,
    groupApplicationTypeKey,
    mode,
    subItemId,
  });

  const formValues = {
    ...parameterGroupSubItemData,
    noSubItem: parameterGroupSubItemData?.subItemNo,
  };


  useEffect(() => {
    if (!parameterGroupSubItemData) return;

    form.reset({
      ...parameterGroupSubItemData,
      noSubItem: parameterGroupSubItemData.subItemNo,
    });
  }, [parameterGroupSubItemData, form]);

  const title = `${capitalize(mode)} Sub Item`;

  return (
    <SectionModal
      title={title}
      isOpen={modal.visible}
      customFooter={
        <RowWrapper py={3} gap={2} alignItems="center" justifyContent="end">
          <Button
            variant="outlined"
            onClick={() => closeNiceModal(modalId)}
          >
            Close
          </Button>
          {!isFormDisabled && (
            <Button
              onClick={handleSubmit(handleSave)}
              isLoading={isSubmitting}
              disabled={!isValid || isAutoSaveFetching}
            >
              {isAutoSaveFetching ? 'Auto Saving...' : 'Save'}
            </Button>
          )}
        </RowWrapper>
      }
    >
      <Grid container spacing={2}>
        {groupApplicationTypeKey === 'DATA_UPDATES' && (
          <Grid item xs={6}>
            <Controller
              name="referenceSubItem"
              control={control}
              render={({ field }) =>
                <Input
                  label="Referensi Sub Item"
                  placeholder="Pilih Referensi Sub Item"
                  type="dropdown"
                  dropdownList={referenceSubItemOptions}
                  {...field}
                />
              }
            />
          </Grid>
        )}
        <Grid item xs={6}>
          <Controller
            control={control}
            name="noSubItem"
            render={({ field, fieldState }) => (
              <Input
                label="Nomor Sub Item"
                placeholder="Nomor Sub Item"
                type="dropdown"
                dropdownList={subItemNumberOptions}
                {...field}
                isMandatory
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <Input
                label="Active"
                type="radio"
                radioList={[
                  { label: 'Ya', value: true },
                  { label: 'Tidak', value: false }
                ]}
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="needConfirmation"
            control={control}
            render={({ field }) =>
              <Input
                label="Show Button Edit"
                type="radio"
                radioList={[
                  { label: 'Ya', value: true },
                  { label: 'Tidak', value: false }
                ]}
                {...field}
              />
            }
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="additionalAction"
            control={control}
            render={({ field }) =>
              <Input
                label="To Maintenance Customer"
                type="radio"
                radioList={[
                  { label: 'Ya', value: true },
                  { label: 'Tidak', value: false }
                ]}
                {...field}
              />
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="subItem"
            control={control}
            render={({ field, fieldState }) =>
              <Input
                label="Description"
                placeholder="Masukkan deskripsi Item Group"
                type="richtext"
                {...field}
                isMandatory
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            }
          />
        </Grid>
      </Grid>
    </SectionModal>
  );
});

export default SubItemModal;
