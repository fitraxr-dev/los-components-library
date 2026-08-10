'use client';

import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';


import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import WordEditor from '@/components/shared/WordEditor';

import useFinancingStructureForm from './FinancingStructureForm.hook';


const FinancingStructureForm = () => {
  const theme = useTheme();
  const
    {
      container,
      setContainer,
      watch,
      control,
      handleSave,
      structureDetailData,
      id,
      isWordEditorEmpty,
      setIsWordEditorEmpty,
      handleCancel,
      handleSubmit,
      isValid,
      isDirty,
    } = useFinancingStructureForm();

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
          {id ?
            'Edit Usulan - Struktur Pembiayaan ' :
            'Add New Usulan - Struktur Pembiayaan'}
        </TextStyle>
      </RowWrapper>
      <Box>
        <Controller
          control={control}
          name="title"
          render={({ field: { ref, ...field }, fieldState: { invalid, error, isTouched } }) => (
            <Input
              {...field}
              inputRef={ref}
              label="Title"
              placeholder="Input Title"
              error={isTouched && invalid}
              helperText={isTouched && error ? error.message : ''}
              type="text"
              isMandatory
            />
          )}
        />
      </Box>
      <ColumnWrapper mt={3}>
        <WordEditor
          id="description"
          isReadOnly={false}
          container={container}
          setContainer={setContainer}
          initialValue={structureDetailData?.description}
          isWordEditorEmpty={isWordEditorEmpty}
          setIsWordEditorEmpty={setIsWordEditorEmpty}
        />
      </ColumnWrapper>
      <RowWrapper gap={3} sx={{ justifyContent: 'end', py: 3 }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
        >
          cancel
        </Button>
        <Button
          onClick={handleSubmit(handleSave)}
          disabled={!isDirty || !isValid}
        >
          Save
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default FinancingStructureForm;
