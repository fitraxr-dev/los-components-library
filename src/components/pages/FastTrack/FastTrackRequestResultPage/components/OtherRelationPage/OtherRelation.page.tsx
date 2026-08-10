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

import useOtherRelationPage from './OtherRelation.hooks';


const validationSchema = yup.object({
  collectability: yup.string().required('Required'),
  googleResult: yup.string().required('Required'),
  note: yup.string().required('Required'),
  ref: yup.string().required('Required'),
  resultReporting: yup.string().required('Required'),
});

const OtherRelationPage = () => {
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
    institutionTypeOptions,
    jobPositionOptions,
    isSaveOtherRelationLoading,
    saveOtherRelation,
    otherRelationDetailData,
    selectedStakeholderCode,
    setSelectedStakeholderCode,
    stakeholderOptions,
  } = useOtherRelationPage(isEditMode);

  const { handleSubmit, formState, control, watch } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(validationSchema),
    values: otherRelationDetailData || {
      collectability: '',
      googleResult: '',
      identityFile: null,
      identityNo: '',
      identityType: '',
      jobPosition: '',
      name: '',
      note: '',
      npwp: '',
      npwpFile: null,
      ref: '',
      resultReporting: '',
      type: '',
      typeDescription: '',
    },
  });

  const watchedValues = watch();

  const otherRelatedCode = sessionStorage.getItem('otherRelatedCode');

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    const payload = {
      bucketProcessId: processId,
      collectability: watchedValues.collectability || '',
      googleResult: watchedValues.googleResult || '',
      id: summaryId,
      identityNo: watchedValues.identityNo || '',
      identityType: watchedValues.identityType || '',
      jobPosition: watchedValues.jobPosition || '',
      name: watchedValues.name || '',
      note: watchedValues.note || '',
      npwp: watchedValues.npwp || '',
      ref: watchedValues.ref || '',
      referenceCode: selectedStakeholderCode || otherRelatedCode,
      resultReporting: watchedValues.resultReporting || '',
      typeDescription: watchedValues.typeDescription || '',
    };

    return Promise.resolve(payload);
  }, [
    processId,
    summaryId,
    otherRelatedCode,
    selectedStakeholderCode,
    watchedValues.collectability,
    watchedValues.googleResult,
    watchedValues.identityNo,
    watchedValues.identityType,
    watchedValues.jobPosition,
    watchedValues.name,
    watchedValues.note,
    watchedValues.npwp,
    watchedValues.ref,
    watchedValues.resultReporting,
    watchedValues.typeDescription,
  ]);

  // Auto-save
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: isEditMode && !!otherRelationDetailData,
    payload: autoSavePayload,
    url: 'fastTrack.result.saveOtherRelated',
  });

  const handleSave = React.useCallback((data) => {
    saveOtherRelation({
      bucketProcessId: processId,
      collectability: data.collectability,
      googleResult: data.googleResult,
      id: summaryId,
      identityNo: data.identityNo,
      identityType: data.identityType,
      jobPosition: data.jobPosition,
      name: data.name,
      note: data.note,
      npwp: data.npwp,
      ref: data.ref,
      referenceCode: selectedStakeholderCode || otherRelatedCode,
      resultReporting: data.resultReporting,
      typeDescription: data.typeDescription,
    });
  }, [summaryId, processId, otherRelatedCode, selectedStakeholderCode, saveOtherRelation]);

  const isTypeOthers = otherRelationDetailData?.type === 'OTHERS';
  const isTypeIndividual = otherRelationDetailData?.type === 'INDIVIDUAL';

  return (
    <ColumnWrapper gap={3}>
      <Title title={`${isEditMode ? 'Edit' : 'Add New'} Pihak Terkait Lainnya`} />
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
              dropdownList={institutionTypeOptions}
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

        {isTypeIndividual && (
          <Controller
            name="jobPosition"
            control={control}
            render={({ field: { ref, ...field }, fieldState: { error } }) => (
              <Input
                {...field}
                ref={ref}
                label="Jabatan"
                type="dropdown"
                placeholder="Input Jabatan"
                dropdownList={jobPositionOptions}
                error={!!error}
                helperText={error?.message}
                disabled
              />
            )}
          />
        )}
        {isTypeOthers && (
          <Controller
            name="typeDescription"
            control={control}
            render={({ field: { ref, ...field }, fieldState: { error } }) => (
              <Input
                {...field}
                ref={ref}
                isMandatory
                label="Keterangan Tipe"
                placeholder="Keterangan"
                containerSx={{ gridColumn: '1 / 3' }}
                error={!!error}
                helperText={error?.message}
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

      </Box>

      {tableType === 'SUMMARY' && (
        <>
          <ResultDocumentTable
            documentParent={DocumentTypeRequestDtoDocumentParentEnum.OTHERRELATEDDOCRESULT}
            ownerId={otherRelatedCode}
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
          isLoading={isSaveOtherRelationLoading}
          disabled={isSaveOtherRelationLoading || !formState.isValid || isAutoSaveFetching}
        >
          {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default OtherRelationPage;
