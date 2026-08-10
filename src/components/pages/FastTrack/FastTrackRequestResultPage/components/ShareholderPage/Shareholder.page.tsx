'use client';

import * as React from 'react';
import { useMemo } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, useTheme } from '@mui/material';
import { useParams, usePathname } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import { useFastTrackContext } from '@/components/layouts/FastTrackLayout/FastTrack.context';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Title from '@/components/shared/Title';

import ResultDocumentTable from '../ResultDocumentTable';

import useShareholderPage from './Shareholder.hooks';


const validationSchema = yup.object({
  collectability: yup.string().required('Required'),
  googleResult: yup.string().required('Required'),
  note: yup.string().required('Required'),
  ref: yup.string().required('Required'),
  resultReporting: yup.string().required('Required'),
});

const ShareholderPage = () => {
  const theme = useTheme();
  const router = useCustomRouter();
  const { tableType } = useFastTrackContext();

  const { processId } = useIdentity();
  const { id } = useParams();
  const summaryDetailId = sessionStorage.getItem('summaryDetailId');
  const summaryId = (id && id !== 'null' ? Number(id) : null) ?? (summaryDetailId ? Number(summaryDetailId) : null);
  const path = usePathname();
  const pathSegments = path.split('/').filter((segment) => segment);
  const moduleIndex = pathSegments[5];
  const isEditMode = moduleIndex === 'edit';

  const {
    collectibilityOptions,
    institutiontypeData,
    isSaveShareholderLoading,
    saveShareholder,
    selectedStakeholderCode,
    setSelectedStakeholderCode,
    shareholderDetailData,
    stakeholderOptions,
  } = useShareholderPage(isEditMode);

  const { handleSubmit, formState, control, watch } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(validationSchema),
    values: shareholderDetailData || {
      collectability: '',
      googleResult: '',
      identityFile: null,
      identityNo: '',
      identityType: '',
      name: '',
      note: '',
      npwp: '',
      npwpFile: null,
      percentage: 0,
      ref: '',
      resultReporting: '',
      shares: '',
      type: '',
      value: '',
      valuePerShare: '',
    },
  });

  const watchedValues = watch();

  const shareholderCode = sessionStorage.getItem('shareholderCode');

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    const payload = {
      bucketProcessId: processId,
      collectability: watchedValues.collectability || '',
      googleResult: watchedValues.googleResult || '',
      id: summaryId,
      identityNo: watchedValues.identityNo || '',
      identityType: watchedValues.identityType || '',
      name: watchedValues.name || '',
      note: watchedValues.note || '',
      npwp: watchedValues.npwp || '',
      percentage: watchedValues.percentage || 0,
      ref: watchedValues.ref || '',
      referenceCode: selectedStakeholderCode || shareholderCode,
      resultReporting: watchedValues.resultReporting || '',
      shares: watchedValues.shares || '',
      value: watchedValues.value || '',
      valuePerShare: watchedValues.valuePerShare || '',
    };

    return Promise.resolve(payload);
  }, [
    processId,
    summaryId,
    shareholderCode,
    selectedStakeholderCode,
    watchedValues.collectability,
    watchedValues.googleResult,
    watchedValues.identityNo,
    watchedValues.identityType,
    watchedValues.name,
    watchedValues.note,
    watchedValues.npwp,
    watchedValues.percentage,
    watchedValues.ref,
    watchedValues.resultReporting,
    watchedValues.shares,
    watchedValues.value,
    watchedValues.valuePerShare,
  ]);

  // Auto-save
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: isEditMode && !!shareholderDetailData,
    payload: autoSavePayload,
    url: 'fastTrack.result.saveShareholder',
  });

  const handleSave = React.useCallback((data) => {
    saveShareholder({
      bucketProcessId: processId,
      collectability: data.collectability,
      googleResult: data.googleResult,
      id: summaryId,
      identityNo: data.identityNo,
      identityType: data.identityType,
      name: data.name,
      note: data.note,
      npwp: data.npwp,
      percentage: data.percentage,
      ref: data.ref,
      referenceCode: selectedStakeholderCode || shareholderCode,
      resultReporting: data.resultReporting,
      shares: data.shares,
      value: data.value,
      valuePerShare: data.valuePerShare,
    });
  }, [summaryId, processId, shareholderCode, selectedStakeholderCode, saveShareholder]);

  const isTypeIndividual = shareholderDetailData?.type === 'INDIVIDUAL';

  return (
    <ColumnWrapper gap={3}>
      <Title title={`${isEditMode ? 'Edit' : 'Add New'} Shareholder`} />
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        <Controller
          name="type"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              type="dropdown"
              label="Tipe"
              error={!!error}
              helperText={invalid && error?.message}
              placeholder="Input Tipe"
              containerSx={{ flex: 1 }}
              dropdownList={institutiontypeData}
              isMandatory
              disabled
            />
          )}
        />
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              type="dropdown-search"
              label="Nama"
              placeholder="Pilih Nama"
              error={!!error}
              helperText={invalid && error?.message}
              dropdownList={stakeholderOptions}
              containerSx={{ flex: 1 }}
              isMandatory
              onChange={(val) => {
                const selected = stakeholderOptions?.find((item) => item.value === val);
                if (selected) {
                  setSelectedStakeholderCode(selected.key);
                }
                field.onChange(val);
              }}
            />
          )}
        />

        {isTypeIndividual && (
          <Controller
            name="identityType"
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                type="text"
                label="ID Type"
                error={!!error}
                helperText={invalid && error?.message}
                placeholder="Pilih ID Type"
                containerSx={{ flex: 1 }}
                disabled
              />
            )}
          />
        )}
        {isTypeIndividual && (
          <Controller
            name="identityNo"
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                type="text"
                label="ID No"
                error={!!error}
                helperText={invalid && error?.message}
                placeholder="Input ID No"
                containerSx={{ flex: 1 }}
                disabled
              />
            )}
          />
        )}

        {isTypeIndividual && (
          <Controller
            name="identityFile"
            control={control}
            render={({ field, fieldState: { error, invalid } }) => (
              <Input
                {...field}
                type="file"
                label="ID Document"
                placeholder="Upload ID Document"
                error={!!error}
                helperText={invalid && error?.message}
                containerSx={{ flex: 1 }}
                disabled
              />
            )}
          />
        )}

        <Controller
          name="npwp"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              type="npwp"
              label="NPWP"
              placeholder="Input NPWP"
              error={!!error}
              maxLength={16}
              helperText={invalid && error?.message}
              containerSx={{ flex: 1 }}
              disabled
            />
          )}
        />
        <Controller
          name="npwpFile"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              type="file"
              label="Upload NPWP"
              placeholder="Upload NPWP"
              error={!!error}
              helperText={invalid && error?.message}
              containerSx={{ flex: 1 }}
              disabled
            />
          )}
        />

        <Controller
          name="shares"
          control={control}
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              type="number"
              label="Lembar Saham"
              error={!!error}
              helperText={invalid && error?.message}
              placeholder="Input Lembar Saham"
              containerSx={{ flex: 1 }}
              disabled
            />
          )}
        />
        <Controller
          name="valuePerShare"
          control={control}
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              type="number"
              label="Nilai per lembar"
              error={!!error}
              helperText={invalid && error?.message}
              placeholder="Input Nilai per lembar"
              containerSx={{ flex: 1 }}
              disabled
            />
          )}
        />
        <Controller
          name="percentage"
          control={control}
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              type="number"
              label="Persentase"
              error={!!error}
              helperText={invalid && error?.message}
              placeholder="Input Persentase"
              containerSx={{ flex: 1 }}
              disabled
            />
          )}
        />
        <Controller
          name="value"
          control={control}
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              type="number"
              label="Nominal"
              error={!!error}
              helperText={invalid && error?.message}
              placeholder="Input Nominal"
              containerSx={{ flex: 1 }}
              disabled
            />
          )}
        />
      </Box>

      {tableType === 'SUMMARY' && (
        <>
          <ResultDocumentTable
            documentParent={DocumentTypeRequestDtoDocumentParentEnum.SHAREHOLDERDOCRESULT}
            ownerId={shareholderCode}
          />

          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            <Controller
              name="collectability"
              control={control}
              render={({ field, fieldState: { error, invalid } }) => (
                <Input
                  {...field}
                  type="dropdown"
                  dropdownList={collectibilityOptions}
                  label="Koletibilitas"
                  placeholder="Input koletibilitas"
                  error={!!error}
                  helperText={invalid && error?.message}
                  isMandatory
                  containerSx={{ flex: 1, gridColumn: '1 / span 2' }}
                />
              )}
            />
            <Controller
              name="ref"
              control={control}
              render={({ field, fieldState: { error, invalid } }) => (
                <Input
                  {...field}
                  type="text"
                  label="Ref."
                  placeholder="Ref."
                  error={!!error}
                  helperText={invalid && error?.message}
                  isMandatory
                  containerSx={{ flex: 1, gridColumn: '1 / span 2' }}
                />
              )}
            />
            <Controller
              name="resultReporting"
              control={control}
              render={({ field, fieldState: { error, invalid } }) => (
                <Input
                  {...field}
                  type="area"
                  label="Hasil Laporan"
                  placeholder="Input hasil laporan"
                  error={!!error}
                  helperText={invalid && error?.message}
                  containerSx={{ flex: 1, gridColumn: '1 / span 2' }}
                  rows={2}
                  isMandatory
                />
              )}
            />
            <Controller
              name="note"
              control={control}
              render={({ field, fieldState: { error, invalid } }) => (
                <Input
                  {...field}
                  type="area"
                  label="Catatan"
                  placeholder="Input Catatan"
                  error={!!error}
                  helperText={invalid && error?.message}
                  containerSx={{ flex: 1, gridColumn: '1 / span 2' }}
                  rows={2}
                  isMandatory
                />
              )}
            />
            <Controller
              name="googleResult"
              control={control}
              render={({ field, fieldState: { error, invalid } }) => (
                <Input
                  {...field}
                  type="area"
                  label="Google Search"
                  placeholder="Input Catatan"
                  error={!!error}
                  helperText={invalid && error?.message}
                  containerSx={{ flex: 1, gridColumn: '1 / span 2' }}
                  rows={2}
                  isMandatory
                />
              )}
            />
          </Box>
        </>
      )}

      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button
          variant="outlined"
          sx={{ mr: 3 }}
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleSave)}
          isLoading={isSaveShareholderLoading}
          disabled={isSaveShareholderLoading || !formState.isValid || isAutoSaveFetching}
        >
          {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default ShareholderPage;
