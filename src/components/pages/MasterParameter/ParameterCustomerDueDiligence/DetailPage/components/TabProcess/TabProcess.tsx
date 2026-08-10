import * as React from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';

import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import Title from '@/components/shared/Title';

import useGetParameterGroupItemNumber from '../../hooks/useGetParameterGroupItemNumber';

import useTabProcess from './TabProcess.hook';
import { TabProcessSchema } from './TabProcess.schema';


const TabProcess = () => {
  const router = useCustomRouter();
  const {
    isViewOnly,
    isBucketProcessId,
    processId,
    isMaker,
    mode,
  } = useMasterParameter();

  const { control, watch, handleSubmit, reset, formState: { isSubmitting, isValid } } = useForm({
    defaultValues: {
      additionalAction: true,
      applicationType: '',
      isActive: true,
      itemGroup: '',
      needConfirmation: true,
      noItemGroup: '',
      referenceGroup: null,
    },
    mode: 'onChange',
    resolver: yupResolver(TabProcessSchema),
  });

  const watchFields = watch();

  const {
    applicationTypeOptions,
    handleAddItem,
    handleSave,
    isAutoSaveFetching,
    isLoading,
    page,
    pageSize,
    parameterGroupDetailData,
    referenceGroupOptions,
    setPage,
    setPageSize,
    tableDataItem,
    tableHeaderItem,
    totalPage,
  } = useTabProcess(watchFields);

  React.useEffect(() => {
    if (parameterGroupDetailData) {
      reset({
        additionalAction: parameterGroupDetailData.additionalAction ?? true,
        applicationType: parameterGroupDetailData.applicationTypeKey || '',
        isActive: parameterGroupDetailData.isActive ?? true,
        itemGroup: parameterGroupDetailData.itemGroup || '',
        needConfirmation: parameterGroupDetailData.needConfirmation ?? true,
        noItemGroup: parameterGroupDetailData.itemNo || '',
        referenceGroup: parameterGroupDetailData.referenceGroup || null,
      });
    }
  }, [parameterGroupDetailData, reset]);

  const disableForm = isViewOnly || !isMaker || parameterGroupDetailData?.isEditable === false;

  const selectedApplicationType = watch('applicationType');
  const { data: itemGroupNumberOptions } = useGetParameterGroupItemNumber({
    applicationType: selectedApplicationType,
    currentItemNo: parameterGroupDetailData?.itemNo,
  });

  const handlePreview = React.useCallback(() => {
    const nextPath = replacePath(MASTER_PARAMETER.PARAMETER_CUSTOMER_DUE_DILIGENCE_PREVIEW_PAGE, {
      mode,
      processId: isBucketProcessId ? processId : selectedApplicationType,
    });
    router.push(nextPath);
  }, [router, mode, processId, isBucketProcessId, selectedApplicationType]);

  return (
    <ColumnWrapper gap={3}>
      <Title
        title="Process"
        buttons={[
          {
            iconName: 'monitor',
            label: 'Preview APU PPT',
            onClick: handlePreview,
          }
        ]}
      />

      <SectionTitle title="Item Group" isOpen>
        <Grid
          container
          spacing={2}
          sx={{ boxShadow: 7, mt: 2, pb: 4, px: 2 }}
        >
          <Grid item xs={4}>
            <Controller
              control={control}
              name="noItemGroup"
              render={({ field, fieldState }) => (
                <Input
                  label="Nomor Item Group"
                  placeholder="Nomor Item Group"
                  type="dropdown"
                  dropdownList={itemGroupNumberOptions}
                  {...field}
                  isMandatory
                  disabled={disableForm}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              control={control}
              name="applicationType"
              render={({ field, fieldState }) => (
                <Input
                  label="Jenis Permohonan"
                  placeholder="Jenis Permohonan"
                  type="dropdown"
                  dropdownList={applicationTypeOptions}
                  {...field}
                  isMandatory
                  disabled={disableForm}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
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
                  disabled={disableForm}

                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name="needConfirmation"
              control={control}
              render={({ field }) =>
                <Input
                  label="Show Button Edit"
                  type="radio"
                  radioList={[
                    { label: 'Ya', value: true },
                    { label: 'Tidak', value: false }
                  ]}
                  {...field}
                  disabled={disableForm}

                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name="additionalAction"
              control={control}
              render={({ field }) =>
                <Input
                  label="To Maintenance Customer"
                  type="radio"
                  radioList={[
                    { label: 'Ya', value: true },
                    { label: 'Tidak', value: false }
                  ]}
                  {...field}
                  disabled={disableForm}

                />
              }
            />
          </Grid>
          {watch('applicationType') === 'DATA_UPDATES' && (
            <Grid item xs={4}>
              <Controller
                name="referenceGroup"
                control={control}
                render={({ field }) =>
                  <Input
                    label="Referensi Group"
                    placeholder="Pilih Referensi Group"
                    type="dropdown"
                    dropdownList={referenceGroupOptions}
                    {...field}
                    disabled={disableForm}

                  />
                }
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <Controller
              name="itemGroup"
              control={control}
              render={({ field, fieldState }) =>
                <Input
                  label="Description"
                  placeholder="Masukkan deskripsi Item Group"
                  type="richtext"
                  {...field}
                  isMandatory
                  disabled={disableForm}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              }
            />
          </Grid>
        </Grid>
      </SectionTitle>

      <SectionTitle title="Item" isOpen>
        <BaseContainer sx={{ boxShadow: 7, mt: 2 }}>
          <Table
            tableHeader={tableHeaderItem}
            tableData={tableDataItem}
            totalPage={totalPage}
            currentPage={page}
            handlePageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            isLoading={isLoading}
            footer={!disableForm && (
              <TableFooter disabled={!processId} onClick={handleAddItem} />
            )}
          />
        </BaseContainer>
      </SectionTitle>

      <RowWrapper gap={2} alignItems="center" justifyContent="end">
        <Button
          variant="outlined"
          onClick={() => router.push(MASTER_PARAMETER.PARAMETER_CUSTOMER_DUE_DILIGENCE_LIST_PAGE)}
        >
          Close
        </Button>
        {!disableForm && (
          <Button
            onClick={handleSubmit(handleSave)}
            isLoading={isSubmitting}
            disabled={!isValid || isAutoSaveFetching}
          >
            {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
          </Button>
        )}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default TabProcess;
