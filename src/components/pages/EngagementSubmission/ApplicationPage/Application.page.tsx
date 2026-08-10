'use client';
import React from 'react';

import { useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import useApplication from './Application.hooks';


const ApplicationPage = () => {
  const theme = useTheme();

  const {
    container,
    setContainer,
    viewOnly,
    handleSave,
    handleSaveAndNext,
    handleNext,
    isLoading,
    isAutoSaveFetching,
    application,
    isLoadingDetail,
    typeSubmissionData,
    control,
    handleSubmit,
    isDirty,
    isValid,
  } = useApplication();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Permohonan" />
      <SectionTitle title="Tipe Permohonan" isOpen isMandatory>
        <ColumnWrapper sx={{ gap: 3 }}>
          <Controller
            name="typeSubmission"
            control={control}
            render={({ field: { ref, value, ...field }, fieldState: { invalid, error } }) => (
              <Input
                sx={{ mt: 2 }}
                {...field}
                disabled={viewOnly}
                type="radio"
                radioList={typeSubmissionData}
                value={value}
                sxOptions={{
                  display: 'grid',
                  gridGap: theme.spacing(2),
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  width: 1 / 2,
                }}
                error={invalid}
                helperText={error ? error.message : ''}
              />
            )}
          />

          <Controller
            name="remarks"
            control={control}
            render={({ field: { ref, value, ...field }, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                disabled={viewOnly}
                label="Keterangan"
                type="area"
                rows={4}
                value={value}
                error={invalid}
                helperText={error ? error.message : ''}
              />
            )}
          />

        </ColumnWrapper>
      </SectionTitle>

      <SectionTitle title="Permohonan" isOpen >
        <ColumnWrapper sx={{ gap: 3 }}>
          <WordEditor
            isReadOnly={viewOnly}
            container={container}
            setContainer={setContainer}
            isLoading={isLoadingDetail || isLoading}
            initialValue={application?.description}
          />
        </ColumnWrapper>
      </SectionTitle>

      <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
        {!viewOnly && (
          <Button
            isLoading={isLoading}
            onClick={handleSubmit(handleSave)}
            disabled={isAutoSaveFetching}
          >
            {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}

          </Button>
        )}
        <Button
          isLoading={isLoading}
          onClick={viewOnly ? handleNext : handleSubmit(handleSaveAndNext)}
        >
          Next
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default ApplicationPage;
