'use client';

import React from 'react';

import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import Autocomplete from '@/components/shared/Autocomplete';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Title from '@/components/shared/Title';

import { useCreateProcess } from './CreateProcess.hook';


const CreateProcessPage = () => {
  const { push, reset } = useBreadcrumbs();

  const {
    canCancel,
    canSave,
    form,
    isMaker,
    isLoading,
    dropdownOptions,
    handleClose,
    handleNext,
    handleSave,
  } = useCreateProcess();

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-va', label: 'Parameter VA' });
    push({ href: null, label: 'Create Process' });
  }, [push, reset]);

  const { control } = form;

  return (
    <ColumnWrapper>
      <Title title="Create Parameter VA - Process" sx={{ mb: 2 }} />
      <SectionTitle title="Virtual Account" sx={{ mb: 2 }} />

      <BaseContainer sx={{ boxShadow: 7, mb: 3 }}>
        <ColumnWrapper>
          <RowWrapper sx={{ gap: 2, my: 2 }}>
            <Box width="50%">
              <Controller
                control={control}
                name="bank"
                render={({ field, fieldState }) => (
                  <Autocomplete
                    label="Bank"
                    placeholder="Pilih Bank"
                    dropdownList={dropdownOptions.bankOptions || []}
                    value={
                      field.value ? dropdownOptions.bankOptions?.find((opt) => opt.id === field.value) || null : null
                    }
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    disabled={!isMaker}
                    isMandatory
                    onChange={(option) => {
                      field.onChange(option?.id || '');
                    }}
                  />
                )}
              />
            </Box>
            <Box width="50%">
              <Controller
                control={control}
                name="currency"
                render={({ field, fieldState }) => (
                  <Autocomplete
                    label="Currency"
                    placeholder="Pilih Currency"
                    dropdownList={dropdownOptions.currencyOptions || []}
                    value={
                      field.value
                        ? dropdownOptions.currencyOptions?.find((opt) => opt.id === field.value) || null
                        : null
                    }
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    disabled={!isMaker}
                    isMandatory
                    onChange={(option) => {
                      field.onChange(option?.id || '');
                    }}
                  />
                )}
              />
            </Box>
          </RowWrapper>

          <RowWrapper sx={{ gap: 2, my: 2 }}>
            <Box width="50%">
              <Controller
                control={control}
                name="vaType"
                render={({ field: { ref, ...field }, fieldState }) => (
                  <Autocomplete
                    {...field}
                    label="VA Type"
                    placeholder="Pilih VA Type"
                    dropdownList={dropdownOptions.vaTypeOptions || []}
                    value={
                      field.value ? dropdownOptions.vaTypeOptions?.find((opt) => opt.id === field.value) || null : null
                    }
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    disabled={!isMaker}
                    isMandatory
                    onChange={(option) => {
                      field.onChange(option?.id || '');
                    }}
                  />
                )}
              />
            </Box>
            <Box width="50%">
              <Controller
                control={control}
                name="digitVaType"
                render={({ field: { ref, ...field }, fieldState }) => (
                  <Input
                    {...field}
                    value={field.value || ''}
                    type="text"
                    label="Digit VA Type"
                    placeholder="Digit VA Type"
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    disabled={!isMaker}
                    isMandatory
                  />
                )}
              />
            </Box>
          </RowWrapper>

          <RowWrapper sx={{ gap: 2, my: 2 }}>
            <Box width="50%">
              <Controller
                control={control}
                name="customerType"
                render={({ field: { ref, ...field }, fieldState }) => (
                  <Autocomplete
                    {...field}
                    label="Customer Type"
                    placeholder="Pilih Customer Type"
                    dropdownList={dropdownOptions.customerTypeOptions || []}
                    value={
                      field.value
                        ? dropdownOptions.customerTypeOptions?.find((opt) => opt.id === field.value) || null
                        : null
                    }
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    disabled={!isMaker}
                    isMandatory
                    onChange={(option) => {
                      field.onChange(option?.id || '');
                    }}
                  />
                )}
              />
            </Box>
            <Box width="50%">
              <Controller
                control={control}
                name="prefixBank"
                render={({ field: { ref, ...field }, fieldState }) => (
                  <Input
                    {...field}
                    type="text"
                    label="Prefix Bank"
                    placeholder="Prefix Bank"
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    disabled={!isMaker}
                    isMandatory
                  />
                )}
              />
            </Box>
          </RowWrapper>

          <RowWrapper sx={{ gap: 2, my: 2 }}>
            <Box width="50%">
              <Controller
                control={control}
                name="totalDigit"
                render={({ field: { ref, ...field }, fieldState }) => (
                  <Input
                    {...field}
                    value={field.value || ''}
                    type="number"
                    label="Total Digit"
                    placeholder="Total Digit"
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    disabled={!isMaker}
                    isMandatory
                  />
                )}
              />
            </Box>
            <Box width="50%">
              <Controller
                control={control}
                name="active"
                render={({ field: { ref, ...field }, fieldState }) => (
                  <Input
                    {...field}
                    type="radio"
                    label="Active"
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    disabled={!isMaker}
                    radioList={[
                      { label: 'Ya', value: true },
                      { label: 'Tidak', value: false }
                    ]}
                  />
                )}
              />
            </Box>
          </RowWrapper>

          <RowWrapper sx={{ gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            {isMaker && (
              <>
                <Button variant="outlined" onClick={handleClose} disabled={!canCancel}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSave} isLoading={isLoading} disabled={!canSave}>
                  Save
                </Button>
              </>
            )}
          </RowWrapper>
        </ColumnWrapper>
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default CreateProcessPage;
