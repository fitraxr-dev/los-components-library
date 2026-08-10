'use client';
import { useEffect } from 'react';

import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import WordEditor from '@/components/shared/WordEditor';

import useFullfillmentForm from './Fullfillment.hook';


const AddFullfillment = () => {
  const theme = useTheme();
  const
    {
      container,
      setContainer,
      router,
      listTermType,
      listCategory,
      listFullfillment,
      watch,
      control,
      handleSave,
      setValue,
      fulfillmentData,
    } = useFullfillmentForm();

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
          Add Pemenuhan Persyaratan Pinjaman
        </TextStyle>
      </RowWrapper>
      <Box>
        <Controller
          control={control}
          name="requirementType"
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              inputRef={ref}
              label="Jenis Persyaratan"
              placeholder="Choose Jenis Persyaratan"
              type="dropdown"
              dropdownList={listTermType}
              isMandatory
            />
          )}
        />
      </Box>
      <Box>
        <Controller
          control={control}
          name="requirements"
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              inputRef={ref}
              label=" Persyaratan"
              placeholder="Input  Persyaratan"
              isMandatory
              type="area"
            />
          )}
        />
      </Box>
      <Box>
        <Controller
          control={control}
          name="category"
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              inputRef={ref}
              label="Kategori"
              isMandatory
              type="checkbox"
              checkboxList={listCategory}
            />
          )}
        />
      </Box>
      <Box>
        <Controller
          control={control}
          name="fullfillment"
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              inputRef={ref}
              label="Pemenuhan (YA/TBO)"
              isMandatory
              type="radio"
              radioList={listFullfillment}
            />
          )}
        />
      </Box>

      <ColumnWrapper mt={3}>
        <RowWrapper mb={2}>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.custom.text}
          >
            Keterangan Persyaratan
          </TextStyle>
        </RowWrapper>
        <WordEditor
          isReadOnly={false}
          container={container}
          setContainer={setContainer}
          initialValue={fulfillmentData?.termCondition}
          onSave={(blob) => {
          }}
        />
      </ColumnWrapper>
      <RowWrapper gap={3} sx={{ justifyContent: 'end', py: 3 }}>
        <Button
          variant="outlined"
          onClick={() => {
            router.back();
          }}
        >
          cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={
            (watch().category?.length > 0 &&
            watch().fullfillment &&
            watch().requirementType &&
            watch().requirements) ? false : true
          }
        >
          Save
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default AddFullfillment;
