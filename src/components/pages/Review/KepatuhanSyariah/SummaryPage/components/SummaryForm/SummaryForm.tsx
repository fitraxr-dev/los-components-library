'use client';

import React from 'react';

import { Controller } from 'react-hook-form';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import useSummaryForm from './SummaryForm.hooks';


const SummaryForm = () => {

  const {
    data,
    container,
    setContainer,
    handleOnSave,
    theme,
    control,
    setValue,
    handleSubmit,
    isDetail,
    handleCancel,
    viewOnly,
    isAutoSaveFetching,
    isSaveLoading,
    isLoading,
  } = useSummaryForm();

  console.log('isDetail', isDetail);

  return (
    <ColumnWrapper sx={{ gap: '16px' }}>

      <RowWrapper
        sx={{
          borderBottom: '0.1vw solid',
          borderColor: theme.palette.custom.gray30,
          justifyContent: 'center',
          marginBottom: theme.spacing(4),
          p: 1,
        }}
      >
        <TextStyle variant="body1" color={theme.palette.primary.main}>
          Catatan Kepatuhan Syariah
        </TextStyle>
      </RowWrapper>
      <ColumnWrapper>
        <Title title="Kepatuhan Syariah" />
        <Controller
          name="title"
          control={control}
          render={({ field: { ref, value, ...field }, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              placeholder="Input Kepatuhan Syariah"
              value={value}
              onChange={(value) => setValue('title', value)}
              error={invalid}
              helperText={error?.message}
              disabled
            />
          )}
        >
        </Controller>
      </ColumnWrapper>
      <ColumnWrapper>
        <WordEditor
          container={container}
          setContainer={setContainer}
          initialValue={data.description}
          onSave={(blob) => { }}
          isReadOnly={viewOnly || isDetail}
        />
      </ColumnWrapper>
      <RowWrapper sx={{ gap: 3, justifyContent: 'end' }}>
        <Button
          isLoading={isLoading}
          disabled={isSaveLoading || isLoading}
          onClick={handleCancel}
          variant="outlined"
        >
          {isDetail ? 'Close' : 'Cancel'}
        </Button>
        {!isDetail &&
          <Button
            isLoading={isLoading}
            onClick={handleSubmit(handleOnSave)}
            variant="contained"
            disabled={viewOnly || isSaveLoading || isLoading || isAutoSaveFetching}
          >
            {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
          </Button>
        }
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default SummaryForm;
