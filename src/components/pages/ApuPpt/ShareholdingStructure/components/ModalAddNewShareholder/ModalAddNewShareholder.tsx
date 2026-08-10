'use client';

import NiceModal from '@ebay/nice-modal-react';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import InputDebtorName from '@/components/shared/Input/components/InputDebtorName';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';

import useShareHolderModal from './ModalAddNewShareholder.hook';

import type { ModalShareholderProps } from './ModalAddNewShareholder.types';


const ModalAddNewShareholder = NiceModal.create((props: ModalShareholderProps) => {


  const isParentLevel = props.isParentLevel;
  const isEdit = props?.action === 'edit' && isParentLevel;


  const {
    handleSaveShareholder,
    institutionTypeList,
    control,
    handleSubmit,
    formState,
    modal,
    modalId,
    shareHolderList,
    isAutoSaveFetching,
    isIndividualType,
  } = useShareHolderModal(props);


  return (
    <SectionModal
      title={
        isEdit ?
          'Edit New Shareholder' :
          'Add New Shareholder'
      }
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
          name="parentId"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              isMandatory
              type="dropdown"
              label="Nama Shareholder Tingkat Sebelumnya"
              placeholder="Nama Shareholder Tingkat Sebelumnya"
              value={field.value}
              onChange={(e) => {
                field.onChange(e);
              }}
              dropdownList={shareHolderList}
              disabled={isEdit}
              error={!!formState.errors.type}
              helperText={formState.errors.type?.message || null}
            />
          )}
        />}

        <Controller
          name="type"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              type="dropdown"
              label="Tipe"
              placeholder="Tipe"
              value={field.value}
              onChange={(e) => {
                field.onChange(e);
              }}
              dropdownList={institutionTypeList}
              isMandatory
              disabled={isEdit}
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
                  label="Gelar Depan"
                  placeholder="Gelar Depan"
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values);
                  }}
                />
              )}
            />
            <InputDebtorName
              name="name"
              control={control}
              type="text"
              label="Nama Shareholder"
              placeholder="Nama Shareholder"
              isMandatory
              disabled={isEdit}
              error={!!formState.errors.name}
              helperText={formState.errors.name?.message || null}
              inputProps={{}}
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
          <InputDebtorName
            name="name"
            control={control}
            type="text"
            label="Nama Shareholder"
            placeholder="Nama Shareholder"
            isMandatory
            disabled={isEdit}
            error={!!formState.errors.name}
            helperText={formState.errors.name?.message || null}
            inputProps={{}}
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
              disabled={isEdit}
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
              disabled={isEdit}
              thousandSeparator=","
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

        <InputDebtorName
          name="beneficialOwner"
          control={control}
          type="text"
          contentTooltip={
            <ColumnWrapper sx={{ p: 1 }}>
              <TextStyle variant="body5">
                Benefical Owner level paling bawah
                <br />
                wajib perorangan/perseorangan.
              </TextStyle>
            </ColumnWrapper>
          }
          label="Beneficial Owner"
          placeholder="Beneficial Owner"
          // disabled={isEdit}
          error={!!formState.errors.beneficialOwner}
          helperText={formState.errors.beneficialOwner?.message || null}
          inputProps={{}}
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
        <Button
          disabled={!formState.isValid || isAutoSaveFetching}
          onClick={(handleSubmit(handleSaveShareholder))}
        >
          {isAutoSaveFetching ? 'Auto Saving...' : 'Save'}
        </Button>
      </RowWrapper>
    </SectionModal>

  );
},
);

export default ModalAddNewShareholder;
