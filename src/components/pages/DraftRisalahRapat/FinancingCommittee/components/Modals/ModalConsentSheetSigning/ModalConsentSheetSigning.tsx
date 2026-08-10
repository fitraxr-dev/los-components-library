import * as React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Controller } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';

import useModalConsentSheetSigning from './ModalConsentSheetSigning.hook';

import type { ConsentSheetUser } from '../ModalConsentSheet/ModalConsentSheet.store';


interface ModalConsentSheetSigningProps {
  sectionId: string;
  user?: ConsentSheetUser | null;
  id?: number | string;
}

const ModalConsentSheetSigning = NiceModal.create(({ sectionId, user, id }: ModalConsentSheetSigningProps) => {
  const modalId = MODAL.RISALAH_RAPAT.CONSENT_SHEET_USER;
  const { visible } = useModal(modalId);

  const {
    control,
    directorateOptions,
    divisionOptions,
    formState,
    handleSaveUser,
    handleSubmit,
    hasSku,
    isDivisionDisabled,
    isStaffDisabled,
    isSkuDivisionDisabled,
    isSkuStaffDisabled,
    isSkuLoading,
    isSkuFetching,
    resetDivisionAndStaff,
    resetForm,
    resetSkuDivisionAndStaff,
    resetSkuStaffField,
    resetStaffField,
    roleOptions,
    skuDivisionOptions,
    skuUserOptions,
    isEditing,
    syncJobPositionFromStaff,
    syncSkuJobPositionFromStaff,
    userOptions,
    setDirSearch,
    setDivSearch,
    setUserSearch,
    setSkuUserSearch,
    isKadiv,
    isBOD,
    setValue,
  } = useModalConsentSheetSigning({ editingUser: user, id, sectionId });

  const handleCloseModal = React.useCallback(() => {
    resetForm();
    closeNiceModal(modalId);
  }, [modalId, resetForm]);

  const handleSubmitForm = React.useCallback((values) => {
    handleSaveUser(values);
  }, [handleSaveUser]);

  return (
    <SectionModal
      title={`${isEditing ? 'Edit' : 'Add'} Penandatanganan`}
      isOpen={visible}
      onClose={handleCloseModal}
      containerSx={{
        gap: 3,
        minWidth: '40vw',
      }}
      customFooter={
        <RowWrapper sx={{ gap: 2, justifyContent: 'end' }}>
          <Button
            variant="outlined"
            onClick={handleCloseModal}
          >
            Close
          </Button>
          <Button
            variant="contained"
            disabled={!formState.isValid || isSkuLoading}
            onClick={handleSubmit(handleSubmitForm)}
            isLoading={isSkuLoading || isSkuFetching}
          >
            Save
          </Button>
        </RowWrapper>
      }
    >
      <Controller
        name="consentRole"
        control={control}
        rules={{ required: 'Role wajib dipilih' }}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            label="Role"
            placeholder="Choose Role"
            type="dropdown"
            dropdownList={roleOptions}
            isMandatory
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            disabled={isSkuLoading}
          />
        )}
      />
      <Controller
        name="directorate"
        control={control}
        rules={{ required: 'Direktorat wajib dipilih' }}
        render={({ field, fieldState }) => (
          <Autocomplete
            {...field}
            label="Direktorat"
            placeholder="Choose Direktorat"
            dropdownList={directorateOptions}
            isMandatory
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            value={directorateOptions.find((opt) => String(opt.id) === String(field.value)) || null}
            onInputChange={setDirSearch}
            onChange={(val) => {
              field.onChange(val?.id || '');
              resetDivisionAndStaff();
            }}
            disabled={isSkuLoading}
            isLoading={isSkuLoading}
          />
        )}
      />
      <Controller
        name="division"
        control={control}
        rules={{ required: 'Divisi wajib dipilih' }}
        render={({ field, fieldState }) => (
          <Autocomplete
            {...field}
            label="Divisi"
            placeholder="Choose Divisi"
            dropdownList={divisionOptions}
            disabled={isDivisionDisabled}
            isMandatory
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            value={divisionOptions.find((opt) => String(opt.id) === String(field.value)) || null}
            onInputChange={setDivSearch}
            onChange={(val) => {
              field.onChange(val?.id || '');
              resetStaffField();
            }}
            isLoading={isSkuLoading}
          />
        )}
      />
      <Controller
        name="staff"
        control={control}
        rules={{ required: 'Nama wajib dipilih' }}
        render={({ field, fieldState }) => {
          const options = (userOptions as any[]) || [];
          return (
            <Autocomplete
              {...field}
              label="Nama"
              placeholder="Choose Nama"
              dropdownList={options}
              disabled={isStaffDisabled}
              isMandatory
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              value={options.find((opt) => String(opt.id) === String(field.value)) || null}
              onInputChange={setUserSearch}
              onChange={(val) => {
                field.onChange(val?.id ? String(val.id) : '');
                setValue('staffName', val?.label || '');
                syncJobPositionFromStaff(val?.id ? String(val.id) : '');
              }}
              isLoading={isSkuLoading}
            />
          );
        }}
      />
      <Controller
        name="jobPositionLabel"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Jabatan"
            placeholder="Jabatan"
            type="text"
            disabled
          />
        )}
      />

      {(isKadiv || isBOD) && (
        <>
          <Controller
            name="hasSku"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Apakah Terdapat SKU?"
                type="radio"
                radioList={[
                  { label: 'Ya', value: 'true' },
                  { label: 'Tidak', value: 'false' },
                ]}
                value={field.value ? 'true' : 'false'}
                onChange={(event) => {
                  const hasSkuValue = event?.target?.value === 'true';
                  field.onChange(hasSkuValue);

                  if (!hasSkuValue) {
                    setValue('skuDirectorate', '');
                    setValue('skuDivision', '');
                    setValue('skuStaff', '');
                    setValue('skuStaffName', '');
                    setValue('skuJobPositionLabel', '');
                    setValue('skuNo', '');
                    setValue('skuDate', '');
                  }
                }}
              />
            )}
          />
        </>
      )}

      {hasSku && (isKadiv || isBOD) && (
        <>
          {isSkuLoading || isSkuFetching && (
            <TextStyle variant="body2" weight={500} color="warning.main">
              Memuat data SKU...
            </TextStyle>
          )}
          <TextStyle variant="body2" weight={500} color="primary.main">Detail SKU</TextStyle>
          <Controller
            name="skuDirectorate"
            control={control}
            rules={{ required: 'Direktorat wajib dipilih' }}
            render={({ field, fieldState }) => (
              <Autocomplete
                {...field}
                label="Direktorat"
                placeholder="Choose Direktorat"
                dropdownList={directorateOptions}
                isMandatory
                disabled={isSkuLoading}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                value={directorateOptions.find((opt) => String(opt.id) === String(field.value)) || null}
                onInputChange={setDirSearch}
                onChange={(val) => {
                  field.onChange(val?.id || '');
                  resetSkuDivisionAndStaff();
                }}
              />
            )}
          />
          <Controller
            name="skuDivision"
            control={control}
            rules={{ required: 'Divisi wajib dipilih' }}
            render={({ field, fieldState }) => (
              <Autocomplete
                {...field}
                label="Divisi"
                placeholder="Choose Divisi"
                dropdownList={skuDivisionOptions}
                disabled={isSkuDivisionDisabled || isSkuLoading}
                isMandatory
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                value={skuDivisionOptions.find((opt) => String(opt.id) === String(field.value)) || null}
                onInputChange={setDivSearch}
                onChange={(val) => {
                  field.onChange(val?.id || '');
                  resetSkuStaffField();
                }}
              />
            )}
          />
          <Controller
            name="skuStaff"
            control={control}
            rules={{ required: 'Nama wajib dipilih' }}
            render={({ field, fieldState }) => {
              const options = (skuUserOptions as any[]) || [];
              return (
                <Autocomplete
                  {...field}
                  label="Nama"
                  placeholder="Choose Nama"
                  dropdownList={options}
                  disabled={isSkuStaffDisabled || isSkuLoading}
                  isMandatory
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  value={options.find((opt) => String(opt.id) === String(field.value)) || null}
                  onInputChange={setSkuUserSearch}
                  onChange={(val) => {
                    field.onChange(val?.id ? String(val.id) : '');
                    setValue('skuStaffName', val?.label || '');
                    syncSkuJobPositionFromStaff(val?.id ? String(val.id) : '');
                  }}
                />
              );
            }}
          />
          <Controller
            name="skuJobPositionLabel"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Jabatan"
                placeholder="Jabatan"
                type="text"
                disabled
              />
            )}
          />
          <Controller
            name="skuNo"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Nomor SKU"
                placeholder="Input Nomor SKU"
                type="text"
                isMandatory
                disabled={isSkuLoading}
              />
            )}
          />
          <Controller
            name="skuDate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Tanggal SKU"
                placeholder="Pilih Tanggal SKU"
                type="date"
                isMandatory
                disabled={isSkuLoading}
              />
            )}
          />
        </>
      )}
    </SectionModal>
  );
});

export default ModalConsentSheetSigning;
