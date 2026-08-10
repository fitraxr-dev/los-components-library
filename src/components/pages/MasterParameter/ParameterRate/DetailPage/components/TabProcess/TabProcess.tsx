import { useEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import useCustomRouter from '@/hooks/useCustomRouter';

import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import Loader from '@/components/shared/Loader';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import useTabProcess from './TabProcess.hook';
import { TabProcessSchema } from './TabProcess.schema';


const TabProcess = () => {
  const router = useCustomRouter();
  const { isViewOnly, isMaker, isSubmission } = useMasterParameter();
  const { control, handleSubmit, watch, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      ariumCode: '',
      currency: '',
      exchangeRate: '',
      isActive: true,
      temenosCode: '',
    },
    mode: 'onChange',
    resolver: yupResolver(TabProcessSchema),
  });

  const formValues = watch();

  const {
    data: defaultData,
    handleSave,
    isAutoSaveFetching,
    isLoading,
  } = useTabProcess(formValues);

  useEffect(() => {
    if (defaultData) {
      reset({
        ariumCode: defaultData.ariumCode ?? '',
        currency: defaultData.currency ?? '',
        exchangeRate: defaultData.exchangeRate ?? '',
        isActive: defaultData.isActive ?? true,
        temenosCode: defaultData.temenosCode ?? '',
      });
    }
  }, [defaultData, reset]);

  const isDisabled = isViewOnly || !isMaker || (isSubmission && defaultData?.isEditable === false);
  const showSave = !isViewOnly && isMaker && (!isSubmission || defaultData?.isEditable !== false);

  return (
    <ColumnWrapper gap={3}>
      <Loader isLoading={isLoading} />
      <Title title="Process" />

      <SectionTitle title="Parameter Rate" isOpen>
        <Grid
          container
          spacing={2}
          sx={{ boxShadow: 7, mt: 2, pb: 4, px: 2 }}
        >
          <Grid item xs={6}>
            <Controller
              control={control}
              name="currency"
              render={({ field, fieldState }) => (
                <Input
                  label="Currency"
                  type="text"
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled
                  isMandatory
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Box>
              <RowWrapper mb={1}>
                <TextStyle weight={600}>
                  Exchange Rate
                  <TextStyle component="span" weight={600} color="error.main">
                    *
                  </TextStyle>
                </TextStyle>
              </RowWrapper>
              <Controller
                control={control}
                name="exchangeRate"
                render={({ field, fieldState }) => (
                  <Input
                    label=""
                    type="currency"
                    {...field}
                    value={{ currency: 'IDR', value: field.value ?? '' }}
                    onChange={(e: any) => {
                      const value = e?.value ?? e?.target?.value ?? '';
                      field.onChange(value);
                    }}
                    maxAmount="9,999,999.99"
                    disabledCurrency
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    disabled={isDisabled}
                  />
                )}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="ariumCode"
              render={({ field, fieldState }) => (
                <Input
                  label="Kode Arium"
                  placeholder="Input Kode Arium"
                  type="text"
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isDisabled}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="temenosCode"
              render={({ field, fieldState }) => (
                <Input
                  label="Kode Temenos"
                  placeholder="Input Kode Temenos"
                  type="text"
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isDisabled}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <Input
                  label="Active"
                  type="radio"
                  radioList={[
                    { label: 'Ya', value: true },
                    { label: 'Tidak', value: false }
                  ]}
                  {...field}
                  disabled={isDisabled}
                />
              )}
            />
          </Grid>
        </Grid>
      </SectionTitle>

      <RowWrapper gap={2} alignItems="center" justifyContent="end">
        <Button
          variant="outlined"
          onClick={() => router.push(MASTER_PARAMETER.PARAMETER_RATE_LIST_PAGE)}
        >
          Close
        </Button>
        {showSave && (
          <Button
            onClick={handleSubmit(handleSave)}
            isLoading={isSubmitting}
            disabled={isDisabled || isAutoSaveFetching}
          >
            {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
          </Button>
        )}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default TabProcess;
