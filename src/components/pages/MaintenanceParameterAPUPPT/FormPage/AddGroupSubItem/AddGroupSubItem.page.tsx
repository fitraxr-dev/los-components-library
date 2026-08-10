'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';

import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { Grid } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';
import AddSubItemModal from '@/components/pages/MaintenanceParameterAPUPPT/components/CommonComponent/AddSubItemModal';
import DetailSubItemModal from '@/components/pages/MaintenanceParameterAPUPPT/components/CommonComponent/DetailSubItemModal';
import EditSubItemModal from '@/components/pages/MaintenanceParameterAPUPPT/components/CommonComponent/EditSubItemModal';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import Title from '@/components/shared/Title';


import useAddGroupSubItem from './AddGroupSubItem.hook';
// @ts-ignore
import useGetParameterGroupItemNumber from './hooks/useGetParameterGroupItemNumber';

// Modal constants
const MODAL_IDS = {
  ADD_SUB_ITEM_MODAL: 'ADD_SUB_ITEM_MODAL',
  DETAIL_SUB_ITEM_MODAL: 'DETAIL_SUB_ITEM_MODAL',
  EDIT_SUB_ITEM_MODAL: 'EDIT_SUB_ITEM_MODAL',
};

const AddGroupSubItemPage = () => {
  const router = useCustomRouter();
  const { isViewOnly } = useMasterParameter();
  const { push, reset: resetBreadcrumbs } = useBreadcrumbs();
  const { recordActivity } = useRecordLog();

  const [shouldHideReferensiItem, setShouldHideReferensiItem] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { isValid }, reset } = useForm({
    defaultValues: {
      active: true,
      additionalAction: true,
      item: '',
      kode: '',
      needConfirmation: true,
      nomorItem: '',
      referensiItem: '',
    },
    mode: 'onChange',
  });

  const watchFields = watch();

  const {
    applicationType,
    applicationTypeKey,
    groupDetailData,
    groupDetailLoading,
    handleBack,
    handleSaveItem,
    isAutoSaveFetching,
    isDataSaved,
    isLoading,
    isSaving,
    itemDetailLoading,
    page,
    pageSize,
    referensiItemOptions,
    routeGroupId,
    routeId,
    routeItemId,
    routeMode,
    routeModeGroup,
    routeModeSubItem,
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
  } = useAddGroupSubItem(watchFields);

  const payloadNomorItem = {
    applicationType,
    bucketProcessId: routeProcessId || '',
    from: 'item',
    module: detailData?.data?.content?.groupCode || '',
  };
  // Hit API untuk nomor item di component
  const { data: nomorItemData } = useGetParameterGroupItemNumber(payloadNomorItem);

  // API akan otomatis ter-hit ketika payloadNomorItem sudah lengkap

  // Process nomor item options
  const nomorItemOptions = React.useMemo(() => {
    let options = [];

    if (nomorItemData?.contents) {
      options = nomorItemData.contents.map((item) => ({
        label: item.label,
        value: item.key,
      }));
    } else {
      options = []; // Fallback to empty array
    }

    // Add current itemNo from savedFormData if it exists and not already in options
    if (savedFormData?.nomorItem) {
      const currentItemNo = savedFormData.nomorItem;
      const existsInOptions = options.some((option) => option.value === currentItemNo);

      if (!existsInOptions) {
        options.unshift({
          label: currentItemNo,
          value: currentItemNo,
        });
      }
    }

    return options;
  }, [nomorItemData?.contents, savedFormData?.nomorItem]);

  const shouldShowReferensiGroup = applicationTypeKey === 'DATA_UPDATES';

  // Set breadcrumbs
  React.useEffect(() => {
    resetBreadcrumbs();
    push({ href: '/master-parameter/parameter-mapping-apu_ppt', label: 'Parameter Mapping APU PPT' });
    push({ label: 'Add Group Sub Item' });

    // Record activity for page access
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: '',
      changeAfter: '',
      changeBefore: '',
      menuCode: '/master-parameter/parameter-mapping-apu_ppt/add-group-sub-item',
      module: 'PARAMETER_APU_PPT',
      process: 'PARAMETER_APU_PPT',
      remarks: 'Accessed Parameter Mapping APU PPT Add Group Sub Item page',
    });
  }, [push, resetBreadcrumbs, recordActivity]);

  useEffect(() => {
    try {
      const beneficialOwnerValue = sessionStorage.getItem('beneficial-owner');
      setShouldHideReferensiItem(beneficialOwnerValue === 'APU PPT');
    } catch (error) {
      console.error('Error reading session storage:', error);
      setShouldHideReferensiItem(false);
    }
  }, []);

  useEffect(() => {
    if (shouldHideReferensiItem) {
      setValue('referensiItem', '');
    }
  }, [shouldHideReferensiItem, setValue]);

  // Populate form with saved data when available (edit mode)
  useEffect(() => {
    if (savedFormData && !itemDetailLoading) {
      reset(savedFormData);
    }
  }, [savedFormData, itemDetailLoading, reset]);

  const handleSave = async (data) => {
    try {
      const result = await handleSaveItem(data);

      // Optional: Reset form after successful save
      // reset();

      // Optional: Navigate back or to a different page
      // router.back();

    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  const handleOpenAddSubItemModal = async () => {
    try {
      const result = await NiceModal.show(MODAL_IDS.ADD_SUB_ITEM_MODAL, {
        applicationType,
        bucketProcessId: routeProcessId || '',
        groupDataId: routeGroupId || routeModeSubItem || '',
        groupItemId: parseInt(routeGroupId || '0'),
        moduleCode: detailData?.data?.content?.groupCode || '',
      });
    } catch (error) {
    }
  };

  return (
    <>
      <ColumnWrapper gap={3}>
        <Title title="Add Item" />
        <SectionTitle title="Item" isOpen>
          <Grid
            container
            spacing={2}
            sx={{ boxShadow: 7, mt: 2, pb: 4, px: 2 }}
          >
            <Grid item xs={4}>
              <Controller
                name="nomorItem"
                control={control}
                rules={{ required: 'Nomor Item is required' }}
                render={({ field, fieldState: { error } }) =>
                  <Input
                    {...field}
                    label="Nomor Item"
                    labelProps={{
                      children: (
                        <>
                          Nomor Item
                          <span style={{ color: 'red' }}>*</span>
                        </>
                      ),
                    }}
                    placeholder="Pilih Nomor Item"
                    type="dropdown"
                    dropdownList={nomorItemOptions}
                    disabled={isViewOnly || isSaving || routeModeSubItem === 'detail'}
                    isMandatory
                    error={!!error}
                    helperText={error?.message}
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
                    disabled={isViewOnly || isSaving || routeModeSubItem === 'detail'}
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
                    disabled={isViewOnly || isSaving || routeModeSubItem === 'detail'}
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
                    disabled={isViewOnly || isSaving || routeModeSubItem === 'detail'}
                  />
                }
              />
            </Grid>
            <Grid item xs={4}>
              {shouldShowReferensiGroup ? (
                <Controller
                  name="referensiItem"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      label="Referensi Item"
                      placeholder="Pilih Referensi Item"
                      type="dropdown"
                      disabled={isViewOnly || isSaving || routeModeSubItem === 'detail'}
                      dropdownList={referensiItemOptions}
                    />
                  }
                />
              ) : null}
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="item"
                control={control}
                rules={{ required: 'Item is required' }}
                render={({ field, fieldState: { error } }) =>
                  <Input
                    {...field}
                    label="Description"
                    labelProps={{
                      children: (
                        <>
                          Item
                          <span style={{ color: 'red' }}>*</span>
                        </>
                      ),
                    }}
                    placeholder="Masukkan deskripsi Sub Item"
                    type="richtext"
                    disabled={isViewOnly || isSaving || routeModeSubItem === 'detail'}
                    containerSx={{ width: '100%' }}
                    rows={4}
                    isMandatory
                    error={!!error}
                    helperText={error?.message}
                  />
                }
              />
            </Grid>
          </Grid>
        </SectionTitle>

        <SectionTitle title="Sub Item" isOpen>
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
                footer={routeModeSubItem !== 'detail' ? <TableFooter
                  onClick={handleOpenAddSubItemModal}
                  disabled={!isDataSaved}
                /> : null}
              />
            </BaseContainer>
          </ColumnWrapper>
        </SectionTitle>

        <RowWrapper gap={2} alignItems="center" justifyContent="end">
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={isSaving}
          >
            Close
          </Button>
          <Button
            variant="outlined"
            onClick={handleCancel}
            color="error"
            disabled={isSaving}
          >
            Cancel
          </Button>
          {routeModeSubItem !== 'detail' && (
            <Button
              onClick={handleSubmit(handleSave)}
              disabled={!isValid || isSaving || isAutoSaveFetching}
              isLoading={isSaving}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
          )}
        </RowWrapper>
      </ColumnWrapper>

      <ModalDef
        id={MODAL_IDS.ADD_SUB_ITEM_MODAL}
        component={AddSubItemModal}
      />
      <ModalDef
        id={MODAL_IDS.DETAIL_SUB_ITEM_MODAL}
        component={DetailSubItemModal}
      />
      <ModalDef
        id={MODAL_IDS.EDIT_SUB_ITEM_MODAL}
        component={EditSubItemModal}
      />
    </>
  );
};

export default AddGroupSubItemPage;
