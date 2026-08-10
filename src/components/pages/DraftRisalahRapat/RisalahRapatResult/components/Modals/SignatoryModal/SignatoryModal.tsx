import React from 'react';

import { create } from '@ebay/nice-modal-react';
import CircularProgress from '@mui/material/CircularProgress';
import { Controller, set } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RadioButton from '@/components/shared/Input/components/RadioButton';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { MODAL } from '../../../RisalahRapatResult.contants';

import useSignatoryModal from './SignatoryModal.hook';

import type { SignatoryModalProps } from './SignatoryModal.types';
import type { AutocompleteOption } from '@/components/shared/Autocomplete/types';


const SignatoryModal = create((props: SignatoryModalProps) => {
  const { mode = 'Add' } = props;
  const {
    skuDataName,
    handleSubmit,
    control,
    directorDataName,
    divisionDropdownList,
    skuDivisionDropdownList,
    handleSubmitCollaborator,
    hasSKU,
    modal,
    modalId,
    rolesData,
    handleChangeSKU,
    directorateDropdownList,
    setDirectorat,
    watch,
    detailDataIsLoading,
    setValue,
    watchValue,
    errors,
  } = useSignatoryModal(props);

  const isMandatory = !watch('directorForm.data.userId') || hasSKU ? (!watch('skuForm.data.userId') || !watch('skuForm.number') || !watch('skuForm.date')) : false;
  return (
    <>
      <SectionModal
        title={`${mode} Penandatanganan`}
        isOpen={modal.visible}
        onClose={() => closeNiceModal(modalId)}
        customFooter={() => null}
        containerSx={{
          '-ms-overflow-style': 'none',
          gap: 2,
          minWidth: '25vw',
          'scrollbar-width': 'none',
        }}
      >
        {detailDataIsLoading ?
          <RowWrapper sx={{ justifyContent: 'center' }}>
            <CircularProgress />
          </RowWrapper> :
          <>
            <Controller
              control={control}
              name="directorForm.role"
              render={({
                field: { ref, ...field },
                fieldState: { invalid, error },
              }) => (
                <Autocomplete
                  {...field}
                  id="input-role"
                  testId="input-role"
                  isMandatory
                  label="Role"
                  placeholder="Choose Role"
                  dropdownList={rolesData}
                  value={watch('directorForm.role')}
                  error={invalid}
                  helperText={error ? error.message : ''}
                />
              )}
            />
            <Controller
              control={control}
              name="directorForm.directorate"
              render={({
                field: { ref, ...field },
                fieldState: { invalid, error },
              }) => (
                <Autocomplete
                  {...field}
                  id="input-directorate"
                  testId="input-directorate"
                  isMandatory={mode !== 'Add'}
                  label="Direktorat"
                  placeholder="Input Direktorat"
                  value={watch('directorForm.directorate.label')}
                  disabled={!!!watch('directorForm.role') || mode !== 'Add'}
                  onChange={(val) => {
                    setDirectorat(val.label);
                    setValue('directorForm.division', {});
                    setValue('directorForm.fullName', '');
                    setValue('directorForm.directorate', val);
                  }}
                  dropdownList={directorateDropdownList}
                  error={invalid}
                  helperText={error ? error.message : ''}
                />
              )}
            />
            <Controller
              control={control}
              name="directorForm.division"
              render={({
                field: { ref, ...field },
                fieldState: { invalid, error },
              }) => (
                <Autocomplete
                  {...field}
                  id="input-division"
                  testId="input-division"
                  isMandatory={mode !== 'Add'}
                  label="Divisi"
                  placeholder="Choose Divisi"
                  value={watch('directorForm.division.label')}
                  disabled={!!!watch('directorForm.directorate.id') || mode !== 'Add'}
                  onChange={(val) => {
                    setValue('directorForm.fullName', '');
                    setValue('directorForm.division', val);
                  }}
                  dropdownList={divisionDropdownList}
                  error={invalid}
                  helperText={error ? error.message : ''}
                />
              )}
            />
            <Controller
              control={control}
              name="directorForm.data.fullName"
              render={({
                field: { ref, ...field },
                fieldState: { invalid, error },
              }) => (
                <Autocomplete
                  {...field}
                  isMandatory
                  disabled={!!!watch('directorForm.division') || mode !== 'Add'}
                  label="Nama"
                  placeholder="Choose Nama"
                  dropdownList={directorDataName}
                  onInputChange={(val) => setValue('directorForm.data.fullName', val)}
                  onChange={(val) => {
                    setValue('directorForm.fullName', val.fullName);
                    setValue('directorForm.data', val);
                  }}
                  error={invalid}
                  helperText={error ? error.message : ''}
                />
              )}
            />
            <Input
              label="Jabatan"
              placeholder="Input Jabatan"
              disabled
              value={watchValue.directorForm?.data?.roleRefactor?.name}
            />
            <RadioButton
              label="Apakah Terdapat SKU?"
              sx={{ flex: 1 }}
              defaultChecked={false}
              radioList={[
                {
                  label: 'Tidak',
                  value: false,
                },
                {
                  label: 'Ya',
                  value: true,
                }
              ]}
              onChange={() => handleChangeSKU()}
              value={hasSKU}
            />
            {hasSKU ?
              <>
                <Controller
                  control={control}
                  name="skuForm.directorate"
                  render={({
                    field: { ref, ...field },
                    fieldState: { invalid, error },
                  }) => (
                    <Autocomplete
                      {...field}
                      id="input-directorate"
                      testId="input-directorate"
                      isMandatory={mode !== 'Add'}
                      label="Direktorat"
                      placeholder="Input Direktorat"
                      value={watch('skuForm.directorate.label')}
                      onChange={(val) => {
                        setDirectorat(val.label);
                        setValue('skuForm.division', {});
                        setValue('skuForm.fullName', '');
                        setValue('skuForm.directorate', val);
                      }}
                      dropdownList={directorateDropdownList}
                      error={invalid}
                      helperText={error ? error.message : ''}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="skuForm.division"
                  render={({
                    field: { ref, ...field },
                    fieldState: { invalid, error },
                  }) => (
                    <Autocomplete
                      {...field}
                      id="input-division"
                      testId="input-division"
                      isMandatory
                      label="Divisi"
                      placeholder="Choose Divisi"
                      value={watch('skuForm.division.label')}
                      onChange={(val) => {
                        setValue('skuForm.division', val);
                      }}
                      dropdownList={skuDivisionDropdownList}
                      error={invalid}
                      helperText={error ? error.message : ''}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="skuForm.fullName"
                  render={({
                    field: { ref, ...field },
                    fieldState: { invalid, error },
                  }) => (
                    <Autocomplete
                      {...field}
                      disabled={!!!watch('skuForm.division')}
                      isMandatory
                      label="Nama"
                      placeholder="Choose Staff"
                      value={watch('skuForm.data.fullName')}
                      onInputChange={(val) => { setValue('skuForm.fullName', val); }}
                      onChange={(val) => {
                        setValue('skuForm.data', val);
                      }}
                      dropdownList={skuDataName}
                      error={invalid}
                      helperText={error ? error.message : ''}
                    />
                  )}
                />

                <Input
                  label="Jabatan"
                  placeholder="Input Jabatan"
                  value={watchValue.skuForm?.data?.roleRefactor?.name}
                  disabled
                />
                <Controller
                  control={control}
                  name="skuForm.number"
                  render={({
                    field: { ref, ...field },
                  }) => (
                    <Input
                      {...field}
                      label="Nomor SKU"
                      placeholder="Input Nomor SKU"
                      value={field.value}
                      isMandatory
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="skuForm.date"
                  render={({
                    field: { ref, ...field },
                  }) => (
                    <Input
                      {...field}
                      label="Tanggal SKU"
                      type="date"
                      placeholder="Input Tanggal SKU"
                      isMandatory
                    />
                  )}
                />
              </> : null}

            <RowWrapper sx={{ gap: 4, justifyContent: 'end', mt: 4 }}>
              <Button variant="outlined" onClick={() => closeNiceModal(MODAL.SIGNATORY)}>Cancel</Button>
              <Button color="primary" disabled={isMandatory} onClick={handleSubmit((data) => handleSubmitCollaborator(data))}>Save</Button>
            </RowWrapper>
          </>}
      </SectionModal>

    </>

  );
});


export default SignatoryModal;
