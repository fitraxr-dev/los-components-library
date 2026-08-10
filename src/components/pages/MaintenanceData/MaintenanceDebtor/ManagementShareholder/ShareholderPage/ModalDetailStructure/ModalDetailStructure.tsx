'use client';

import NiceModal from '@ebay/nice-modal-react';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import useModalDetailStructure from './ModalDetailStructure.hook';

import type { ModalShareholderProps } from './ModalDetailStructure.types';


const ModalDetailStructure = NiceModal.create((props: ModalShareholderProps) => {


  const isParentLevel = props.isParentLevel;


  const {
    control,
    formState,
    modal,
    modalId,
    isIndividualType,
  } = useModalDetailStructure(props);


  return (
    <SectionModal
      title="Detail Shareholder"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '32vw' }}
      onConfirm={() => {
        alert('success');
        closeNiceModal(modalId);
      }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        {!isParentLevel &&
        <Controller
          name="shareholder"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              isMandatory
              label="Nama Shareholder Tingkat Sebelumnya"
              placeholder="Nama Shareholder Tingkat Sebelumnya"
              value={field.value}
              disabled
              error={!!formState.errors.type}
              helperText={formState.errors.type?.message || null}
            />
          )}
        />}

        <Controller
          name="typeLabel"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              label="Tipe"
              placeholder="Tipe"
              value={field.value}
              isMandatory
              disabled
              error={!!formState.errors.type}
              helperText={formState.errors.type?.message || null}
            />
          )}
        />

        { isIndividualType ?
          <>
            <Controller
              name="prefix"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  disabled
                  label="Gelar Depan"
                  placeholder="Gelar Depan"
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values);
                  }}
                />
              )}
            />
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  disabled
                  label="Nama Shareholder"
                  placeholder="Nama Shareholder"
                  value={field.value}

                />
              )}
            />
            <Controller
              name="suffix"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  label="Gelar Belakang"
                  placeholder="Gelar Belakang"
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values);
                  }}
                />
              )}
            />
          </> :
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                disabled
                label="Nama Shareholder"
                placeholder="Nama Shareholder"
                value={field.value}

              />
            )}
          />
        }

        <Controller
          name="informationSource"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Sumber Informasi Data"
              placeholder="Akta, Laporan Keuangan Audited, Website Perusahaan"
              value={field.value}
              onValueChange={(values) => {
                field.onChange(values);
              }}
              disabled
            />
          )}
        />

        <Controller
          name="shares"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              label="Lembar Saham"
              placeholder="Lembar Saham"
              value={field.value}
              onValueChange={(values) => {
                field.onChange(values.floatValue);
              }}
              disabled
            />
          )}
        />

        <Controller
          name="percentage"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              label="%"
              placeholder="%"
              value={field.value}
              onValueChange={(values) => {
                field.onChange(values.floatValue);
              }}
              isAllowed={(values) => {
                const { formattedValue, floatValue } = values;
                return (
                  formattedValue === '' ||
                  (!formattedValue?.includes('.') && floatValue >= 0 && floatValue <= 100) ||
                  (formattedValue?.split('.')[1]?.length >= 0 && formattedValue?.split('.')[1]?.length <= 10)
                );
              }}
              disabled
            />
          )}
        />

        <Controller
          name="beneficialOwner"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              disabled
              label="Beneficial Owner"
              placeholder="Beneficial Owner"
              value={field.value}

            />
          )}
        />
      </ColumnWrapper>
      <RowWrapper mt={3} sx={{ justifyContent: 'end' }}>
        <Button
          variant="outlined"
          sx={{ mr: 2 }}
          onClick={() => {
            closeNiceModal(modalId);
          }}
        >
          Cancel
        </Button>
      </RowWrapper>
    </SectionModal>

  );
},
);

export default ModalDetailStructure;
