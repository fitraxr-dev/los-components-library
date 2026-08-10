'use client';
import React, { useContext, useEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, useTheme } from '@mui/material';
import { useParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { DirtyContext } from '@/contexts/DirtyContext';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import WordEditor from '@/components/shared/WordEditor';

import useFormFinancingStructureProposal from './FormFinancingStructureProposal.hook';


const INITIAL_VALUES = {
  description: '',
  title: '',
};

const validationSchema = yup.object({
  description: yup.string().nullable(),
  title: yup.string().required().nonNullable(),
});

const FormFinancingStructureProposal = () => {
  const { dirtyMsg } = useContext(DirtyContext);
  const { id } = useParams();
  const theme = useTheme();

  const {
    container,
    setContainer,
    handleCancel,
    handleOnSave,
    isSaveLoading,
    detailProposal,
  } = useFormFinancingStructureProposal();

  const { watch, control, handleSubmit, reset } = useForm({
    defaultValues: {
      description: detailProposal?.description ?? INITIAL_VALUES.description,
      title: detailProposal?.title ?? INITIAL_VALUES.title,
    },
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (detailProposal) {
      reset({
        description: detailProposal?.description,
        title: detailProposal?.title,
      });
    }
  }, [detailProposal]);

  const isRequiredEmpty = !watch('title');

  return (
    <ColumnWrapper gap={theme.spacing(3)} paddingBottom={theme.spacing(2)}>
      <RowWrapper
        sx={{
          borderBottom: '0.1vw solid',
          borderColor: theme.palette.custom.gray30,
          justifyContent: 'center',
          p: 1,
        }}
      >
        <TextStyle
          variant="body1"
          color={theme.palette.primary.main}
          weight={600}
        >
          {`${id ? 'Edit' : 'Add New'} Usulan Struktur Pembiayaan`}
        </TextStyle>
      </RowWrapper>
      <Box>
        <Controller
          control={control}
          name="title"
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              inputRef={ref}
              label="Title"
              placeholder="Input Title"
            />
          )}
        />
      </Box>

      <RowWrapper>
        <WordEditor
          container={container}
          setContainer={setContainer}
          initialValue={detailProposal?.description}
          isLoading={isSaveLoading}
        />
      </RowWrapper>

      <RowWrapper justifyContent="end" gap={theme.spacing(3)}>
        <Button variant="outlined" onClick={handleCancel} >Cancel</Button>
        <Button
          onClick={handleSubmit(handleOnSave)}
          disabled={isRequiredEmpty || !dirtyMsg}
        >
          Save
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default FormFinancingStructureProposal;
