'use client';
import * as React from 'react';
import { useEffect } from 'react';

import { Grid } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import Title from '@/components/shared/Title';

import useAddGroupItem from './AddGroupItem.hook';
import useGetParameterGroupItemNumber from './hooks/useGetParameterGroupItemNumber';


const AddGroupItemPage = () => {
  const router = useCustomRouter();
  const { push, reset: resetBreadcrumbs } = useBreadcrumbs();
  const { recordActivity } = useRecordLog();

  const { control, handleSubmit, watch, reset, formState: { isValid } } = useForm({
    defaultValues: {
      active: true,
      additionalAction: true,
      itemGroup: '',
      jenisPermohonan: '',
      needConfirmation: true,
      nomorItemGroup: '',
      referensiGroup: '',
    },
    mode: 'onChange',
  });

  const selectedJenisPermohonan = watch('jenisPermohonan');

  const {
    groupDetailLoading,
    handleAddItemRoute,
    handleBack,
    handlePreview,
    handleSave,
    isAutoSaveFetching,
    isDataSaved,
    isLoading,
    jenisPermohonanOptions,
    originalMode,
    page,
    pageSize,
    referensiGroupOptions,
    routeGroupId,
    routeId,
    routeMode,
    routeModeGroup,
    routeProcessId,
    savedFormData,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage,
    detailData,
    handleCancel,
    filter,
    setFilter,
    filterDropdownList,
    filterContentList,
  } = useAddGroupItem(control, watch);

  // Hit API untuk item group number di component
  // Untuk edit/detail, kirim id dari item yang dipilih
  const isAddMode = !routeGroupId;
  const { data: itemGroupNumberData, refetch: refetchItemGroupNumber } = useGetParameterGroupItemNumber(
    selectedJenisPermohonan,
    detailData?.data?.content?.groupCode || '',
    routeProcessId || '',
    '',
    isAddMode ? '' : (routeGroupId?.toString() || ''),
  );

  // Refetch ketika selectedJenisPermohonan berubah
  React.useEffect(() => {
    if (selectedJenisPermohonan && selectedJenisPermohonan !== '') {
      refetchItemGroupNumber();
    }
  }, [selectedJenisPermohonan, refetchItemGroupNumber]);

  // Process item group number options
  const itemGroupNumberOptions = React.useMemo(() => {
    if (!itemGroupNumberData?.contents) return [];

    return itemGroupNumberData.contents.map((item) => ({
      label: item.label,
      value: item.key,
    }));
  }, [itemGroupNumberData?.contents]);


  const shouldShowReferensiGroup = selectedJenisPermohonan === 'DATA_UPDATES';

  // Set breadcrumbs
  React.useEffect(() => {
    resetBreadcrumbs();
    push({ href: '/master-parameter/parameter-mapping-apu_ppt', label: 'Parameter Mapping APU PPT' });
    push({ label: 'Add Group Item' });

    // Record activity for page access
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: '',
      changeAfter: '',
      changeBefore: '',
      menuCode: '/master-parameter/parameter-mapping-apu_ppt/add-group-item',
      module: 'PARAMETER_APU_PPT',
      process: 'PARAMETER_APU_PPT',
      remarks: 'Accessed Parameter Mapping APU PPT Add Group Item page',
    });
  }, [push, resetBreadcrumbs, recordActivity]);

  // Populate form with saved data when available
  useEffect(() => {
    if (savedFormData && !groupDetailLoading) {
      reset(savedFormData);
    }
  }, [savedFormData, groupDetailLoading, reset]);
  return (
    <ColumnWrapper gap={3}>
      <Title
        title="Add Group Dokumen Diverifikasi"
        buttons={[
          {
            disabled: routeGroupId === undefined,
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
              name="jenisPermohonan"
              control={control}
              rules={{ required: 'Jenis Permohonan is required' }}
              render={({ field, fieldState: { error } }) =>
                <Input
                  {...field}
                  label="Jenis Permohonan"
                  placeholder="Jenis Permohonan"
                  type="dropdown"
                  dropdownList={jenisPermohonanOptions}
                  isMandatory
                  error={!!error}
                  helperText={error?.message}
                  disabled={routeModeGroup === 'detail'}
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name="nomorItemGroup"
              control={control}
              rules={{ required: 'Nomor Item Group is required' }}
              render={({ field, fieldState: { error } }) =>
                <Input
                  {...field}
                  label="Nomor Item Group"
                  placeholder="Pilih Nomor Item Group"
                  type="dropdown"
                  dropdownList={itemGroupNumberOptions}
                  isMandatory
                  disabled={routeModeGroup === 'detail'}
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name="active"
              control={control}
              render={({ field }) =>
                <Input
                  type="radio"
                  label="Active"
                  value={field.value}
                  onChange={field.onChange}
                  radioList={[
                    { label: 'Ya', value: true },
                    { label: 'Tidak', value: false }
                  ]}
                  disabled={routeModeGroup === 'detail'}
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name="needConfirmation"
              control={control}
              render={({ field }) =>
                <Input
                  type="radio"
                  label="Show Button Edit"
                  value={field.value}
                  onChange={field.onChange}
                  radioList={[
                    { label: 'Ya', value: true },
                    { label: 'Tidak', value: false }
                  ]}
                  disabled={routeModeGroup === 'detail'}
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
                  type="radio"
                  label="To Maintenance Customer"
                  value={field.value}
                  onChange={field.onChange}
                  radioList={[
                    { label: 'Ya', value: true },
                    { label: 'Tidak', value: false }
                  ]}
                  disabled={routeModeGroup === 'detail'}
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            {shouldShowReferensiGroup ? (
              <Controller
                name="referensiGroup"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="Referensi Group"
                    placeholder="Pilih Referensi Group"
                    type="dropdown"
                    dropdownList={referensiGroupOptions}
                    disabled={routeModeGroup === 'detail'}
                  />
                }
              />
            ) : null}
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="itemGroup"
              control={control}
              rules={{ required: 'Item Group is required' }}
              render={({ field, fieldState: { error } }) =>
                <Input
                  {...field}
                  label="Description"
                  placeholder="Masukkan deskripsi Item Group"
                  type="richtext"
                  containerSx={{ width: '100%' }}
                  rows={4}
                  error={!!error}
                  helperText={error?.message}
                  isMandatory
                  disabled={routeModeGroup === 'detail'}
                />
              }
            />
          </Grid>
        </Grid>
      </SectionTitle>

      <SectionTitle title="Item" isOpen>
        <ColumnWrapper gap={1}>
          <Input
            type="search"
            value={filter}
            onChange={setFilter}
            placeholder="Pencarian..."
            dropdownList={filterDropdownList}
            contentList={filterContentList}
            containerSx={{ width: '45vw' }}
          />
          <BaseContainer sx={{ boxShadow: 7, mt: 2 }}>
            <Table
              tableHeader={tableHeader}
              tableData={tableData}
              totalPage={totalPage ?? 1}
              currentPage={page}
              handlePageChange={setPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              isLoading={isLoading}
              footer={routeModeGroup !== 'detail' ? <TableFooter
                onClick={() => {
                  handleAddItemRoute();
                }}
                disabled={!isDataSaved}
              /> : null}
            />
          </BaseContainer>
        </ColumnWrapper>
      </SectionTitle>

      <RowWrapper gap={2} alignItems="center" justifyContent="end">
        {routeModeGroup === 'detail' ? (
          <Button
            variant="outlined"
            onClick={handleBack}
          >
            Close
          </Button>
        ) : (
          <>
            <Button
              variant="outlined"
              onClick={handleBack}
            >
              Close
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancel}
              color="error"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(handleSave)}
              disabled={!isValid || isLoading || isAutoSaveFetching}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : isLoading ? 'Saving...' : 'Save'}
            </Button>
          </>
        )}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default AddGroupItemPage;
