import * as React from 'react';

import { Grid } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import useCustomRouter from '@/hooks/useCustomRouter';

import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Title from '@/components/shared/Title';

import useTabProcess from './TabProcess.hook';


const TabProcess = ({ kind }: { kind: 'COT' | 'EOD' }) => {
  const router = useCustomRouter();
  const { isViewOnly, isMaker, isSubmission } = useMasterParameter();
  const form = useForm<any>({
    defaultValues: kind === 'COT'
      ? { cutOfTime: '', isActive: true, process: '' }
      : { endOfDay: '', eodDate: '', isActive: true, process: '' },
    shouldUnregister: true,
  });

  const { control, reset, handleSubmit, formState: { isSubmitting } } = form;

  const {
    data,
    handleSave,
    isAutoSaveFetching,
    isLoading,
  } = useTabProcess(kind, form);

  const isFormDisabled = isViewOnly || !isMaker || (data && !data.isEditable);

  React.useEffect(() => {
    if (!data) return;

    if (kind === 'COT') {
      reset({
        cutOfTime: data?.cutOfTime ?? '',
        isActive: data?.isActive ?? true,
        process: data?.process ?? '',
      });
    } else {
      reset({
        endOfDay: data?.endOfDay ?? '',
        eodDate: data?.eodDate ?? '',
        isActive: data?.isActive ?? true,
        process: data?.process ?? '',
      });
    }
  }, [data, kind, reset]);

  const sectionTitle = kind === 'COT' ? 'Cut of Time (COT)' : 'End of Day (EOD)';

  const showSave = !isViewOnly && isMaker && (!isSubmission || data?.isEditable);

  return (
    <ColumnWrapper gap={3}>
      <Title title="Process" />

      <SectionTitle title={sectionTitle} isOpen>
        <Grid
          container
          spacing={2}
          sx={{ boxShadow: 7, mt: 2, pb: 4, px: 2 }}
        >
          <Grid item xs={6}>
            <Controller
              control={control}
              name="process"
              render={({ field }) => (
                <Input
                  label="Process"
                  type="text"
                  {...field}
                  disabled
                  isMandatory
                />
              )}
            />
          </Grid>
          {kind === 'COT' ? (
            <>
              <Grid item xs={6}>
                <Controller
                  control={control}
                  name="cutOfTime"
                  render={({ field }) => (
                    <Input
                      label="Cut of Time"
                      type="time"
                      {...field}
                      isMandatory
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
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
                    />
                  )}
                />
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={6}>
                <Controller
                  control={control}
                  name="endOfDay"
                  render={({ field }) => (
                    <Input
                      label="End of Day"
                      type="time"
                      {...field}
                      isMandatory
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  control={control}
                  name="eodDate"
                  render={({ field }) => (
                    <Input
                      label="Tanggal EOD"
                      placeholder="DD/MM/YYYY"
                      type="date"
                      {...field}
                      onChange={(date) => {
                        const v = date ? date.startOf('day').format('YYYY-MM-DD') : null;
                        field.onChange(v);
                      }}
                      minDate={new Date().toString()}
                      isMandatory
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
                    />
                  )}
                />
              </Grid>
            </>
          )}
        </Grid>
      </SectionTitle>

      <RowWrapper gap={2} alignItems="center" justifyContent="end">
        <Button
          variant="outlined"
          onClick={() => router.push(MASTER_PARAMETER.PARAMETER_COT_EOD_LIST_PAGE)}
        >
          Close
        </Button>
        {showSave && (
          <Button
            onClick={handleSubmit(handleSave)}
            isLoading={isSubmitting || isAutoSaveFetching}
            disabled={isFormDisabled || isAutoSaveFetching}
          >
            {isAutoSaveFetching ? 'Auto Saving...' : 'Save'}
          </Button>
        )}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default TabProcess;
