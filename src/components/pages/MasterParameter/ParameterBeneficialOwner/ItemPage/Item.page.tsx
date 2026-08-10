'use client';

import * as React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { capitalize, Grid } from '@mui/material';
import { useParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import useCustomRouter from '@/hooks/useCustomRouter';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
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

import SubItemModal from './components/SubItemModal';
import { ITEM_MODAL_IDS } from './Item.constant';
import useItemPage from './Item.hook';
import { ItemPageSchema } from './item.schema';


const ItemPage = () => {
  const router = useCustomRouter();
  const { id } = useParams();

  const {
    processId,
    mode,
    isViewOnly,
    isMaker,
  } = useMasterParameter();
  const { push, reset } = useBreadcrumbs();

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-beneficial-owner', label: 'Parameter Beneficial Owner' });
    push({ href: `/${processId}/${mode}`, label: capitalize(mode) });
    push({ href: null, label: 'Item' });
  }, [push, reset]);

  const { control, handleSubmit, watch, reset: resetForm, formState: { isSubmitting, isValid } } = useForm({
    defaultValues: {
      additionalAction: true,
      isActive: true,
      item: '',
      itemNo: '',
      needConfirmation: true,
      referenceItem: null,
    },
    mode: 'onChange',
    resolver: yupResolver(ItemPageSchema),
  });

  const watchFields = watch();

  const {
    handleOpenSubItemModal,
    handleSave,
    isAutoSaveFetching,
    isLoading,
    page,
    pageSize,
    parameterGroupDetailData,
    parameterGroupItemData,
    referenceItemOptions,
    setPage,
    setPageSize,
    itemNumberOptions,
    tableDataSubItem,
    tableHeaderSubItem,
    totalPage,
  } = useItemPage(watchFields);

  React.useEffect(() => {
    if (parameterGroupItemData) {
      resetForm({
        additionalAction: parameterGroupItemData.additionalAction ?? true,
        isActive: parameterGroupItemData.isActive ?? true,
        item: parameterGroupItemData.item || '',
        itemNo: parameterGroupItemData.itemNo || '',
        needConfirmation: parameterGroupItemData.needConfirmation ?? true,
        referenceItem: parameterGroupItemData.referenceItem || null,
      });
    }
  }, [parameterGroupItemData, resetForm]);

  const title = `${id ? capitalize(mode) : 'Add'} Item`;

  const isFormDisabled = isViewOnly || !isMaker || (parameterGroupDetailData?.isEditable === false);


  return (
    <>
      <ColumnWrapper gap={3}>
        <Title title={title} />

        <SectionTitle title="Item" isOpen>
          <Grid
            container
            spacing={2}
            sx={{ boxShadow: 7, mt: 2, pb: 4, px: 2 }}
          >
            <Grid item xs={4}>
              <Controller
                control={control}
                name="itemNo"
                render={({ field, fieldState }) => (
                  <Input
                    label="Nomor Item"
                    placeholder="Nomor Item"
                    type="dropdown"
                    dropdownList={itemNumberOptions}
                    {...field}
                    isMandatory
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            {parameterGroupDetailData?.applicationTypeKey === 'DATA_UPDATES' && (
              <Grid item xs={4}>
                <Controller
                  name="referenceItem"
                  control={control}
                  render={({ field }) =>
                    <Input
                      label="Referensi Item"
                      placeholder="Pilih Referensi Item"
                      type="dropdown"
                      dropdownList={referenceItemOptions}
                      {...field}
                    />
                  }
                />
              </Grid>
            )}
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
                  />
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="item"
                control={control}
                render={({ field, fieldState }) =>
                  <Input
                    label="Description"
                    placeholder="Masukkan deskripsi Item Group"
                    type="richtext"
                    {...field}
                    isMandatory
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                }
              />
            </Grid>
          </Grid>
        </SectionTitle>

        <SectionTitle title="Sub Item" isOpen>
          <BaseContainer sx={{ boxShadow: 7, mt: 2 }}>
            <Table
              tableHeader={tableHeaderSubItem}
              tableData={tableDataSubItem}
              totalPage={totalPage}
              currentPage={page}
              handlePageChange={setPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              isLoading={isLoading}
              footer={!isFormDisabled && (
                <TableFooter
                  disabled={!id}
                  onClick={() => handleOpenSubItemModal({ mode: 'add' })}
                />
              )}
            />
          </BaseContainer>
        </SectionTitle>

        <RowWrapper gap={2} alignItems="center" justifyContent="end">
          <Button
            variant="outlined"
            onClick={() => router.back()}
          >
            Close
          </Button>
          {!isFormDisabled && (
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

      <ModalDef
        id={ITEM_MODAL_IDS.SUBITEM_MODAL}
        component={SubItemModal}
      />
    </>
  );
};

export default ItemPage;
