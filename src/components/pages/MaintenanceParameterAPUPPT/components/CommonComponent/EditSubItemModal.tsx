import React, { useEffect, useMemo, useState } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import IconButton from '@/components/shared/IconButton';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import useGetGroupDetail from '../../FormPage/AddGroupItem/hooks/useGetGroupDetail';
import useGetParameterGroupItemNumber from '../../FormPage/AddGroupSubItem/hooks/useGetParameterGroupItemNumber';

import useGetParameterGroupSubItemDetail from './hooks/useGetParameterGroupSubItemDetail';
import useUpdateParameterGroupSubItem from './hooks/useUpdateParameterGroupSubItem';


interface EditSubItemFormData {
  nomorSubItem: string;
  active: boolean;
  canEdit: boolean;
  toMaintenanceCustomer: boolean;
  referensiSubItem: string;
  subItem: string;
}

interface EditSubItemModalProps {
  initialData?: {
    id?: number;
    bucketProcessId?: string;
    groupItemId?: number;
    applicationType?: string;
    moduleCode?: string;
    nomorSubItem?: string;
    active?: boolean;
    canEdit?: boolean;
    toMaintenanceCustomer?: boolean;
    referensiSubItem?: string;
    subItem?: string;
  };
}

const EditSubItemModal: React.FC<EditSubItemModalProps> = NiceModal.create(({ initialData }) => {
  // Dynamic nomor sub item options
  const payloadNomorItem = {
    applicationType: initialData?.applicationType,
    bucketProcessId: initialData?.bucketProcessId || '',
    from: 'subitem',
    module: initialData?.moduleCode || '',
  };
  const { data: nomorItemData, refetch: refetchNomorItem } = useGetParameterGroupItemNumber(
    payloadNomorItem,
  );

  React.useEffect(() => {
    if (initialData?.applicationType && initialData?.moduleCode) {
      refetchNomorItem();
    }
  }, [initialData?.applicationType, initialData?.moduleCode, refetchNomorItem]);

  const nomorItemOptions = React.useMemo(() => {
    if (!nomorItemData?.contents) return [];
    return nomorItemData.contents.map((item) => ({ label: item.label, value: item.key }));
  }, [nomorItemData?.contents]);
  const params = useParams();
  const routeItemId = (params as any)?.itemId;
  const modal = useModal();
  const theme = useTheme();
  const [shouldHideReferensiItem, setShouldHideReferensiItem] = useState(false);

  // Get group detail data
  const { data: groupDetailData, isLoading: groupDetailLoading, error: groupDetailError } = useGetGroupDetail(
    initialData?.groupItemId ? {
      bucketProcessId: initialData?.bucketProcessId || null,
      id: initialData.groupItemId,
    } : null
  );

  const updateSubItem = useUpdateParameterGroupSubItem();

  const {
    data: subItemDetail,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useGetParameterGroupSubItemDetail({
    bucketProcessId: initialData?.bucketProcessId && initialData.bucketProcessId !== 'null' ? initialData.bucketProcessId : null,
    id: initialData?.id || null,
  });

  const { control, handleSubmit, formState: { isValid }, reset, watch } = useForm<EditSubItemFormData>({
    defaultValues: {
      active: true,
      canEdit: false,
      nomorSubItem: '',
      referensiSubItem: '',
      subItem: '',
      toMaintenanceCustomer: false,
    },
    mode: 'onChange',
  });

  const watchFields = watch();

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    const payload = {
      additionalAction: watchFields.toMaintenanceCustomer,
      bucketProcessId: initialData?.bucketProcessId,

      // code: subItemDetail?.code,


      // createdBy: subItemDetail?.createdBy,

      // Metadata dari existing data
      // createdDate: subItemDetail?.createdDate,

      groupItemId: routeItemId,

      id: initialData?.id,

      isActive: watchFields.active,

      // modifiedBy: subItemDetail?.modifiedBy,

      // modifiedDate: subItemDetail?.modifiedDate,
      needConfirmation: watchFields.canEdit,
      noSubItem: watchFields.nomorSubItem,
      // reference: subItemDetail?.reference,
      referenceSubItem: watchFields.referensiSubItem || null,
      // status: subItemDetail?.status,
      subItem: watchFields.subItem,
    };
    return Promise.resolve(payload);
  }, [
    watchFields,
    initialData?.bucketProcessId,
    initialData?.id,
    routeItemId,
    subItemDetail,
  ]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !!initialData?.id && !!subItemDetail && modal.visible,
    payload: autoSavePayload,
    url: 'parameter.parameterApuPpt.itemSubStore',
  });

  // Check session storage for beneficial owner and group detail
  useEffect(() => {
    // Check from group detail data first
    if (groupDetailData?.data?.content?.applicationTypeKey === 'DATA_UPDATES') {
      setShouldHideReferensiItem(true);
      return;
    }

    // Fallback to session storage check
    try {
      const beneficialOwnerValue = sessionStorage.getItem('beneficial-owner');
      setShouldHideReferensiItem(beneficialOwnerValue === 'APU PPT');
    } catch (error) {
      console.error('Error reading session storage:', error);
      setShouldHideReferensiItem(false);
    }
  }, [groupDetailData?.data?.content?.applicationTypeKey]);

  useEffect(() => {
    if (subItemDetail) {
      reset({
        active: subItemDetail.isActive ?? true,
        canEdit: subItemDetail.needConfirmation ?? false,
        nomorSubItem: subItemDetail.subItemNo?.toString() || '',
        referensiSubItem: subItemDetail.reference || '',
        subItem: subItemDetail.subItem || '',
        toMaintenanceCustomer: subItemDetail.additionalAction ?? false,
      });
    }
  }, [subItemDetail, reset]);

  const handleSave = async (data: EditSubItemFormData) => {
    try {
      const saveData = {
        additionalAction: data.toMaintenanceCustomer,
        bucketProcessId: initialData?.bucketProcessId,
        groupItemId: routeItemId,
        id: initialData?.id,
        isActive: data.active,
        needConfirmation: data.canEdit,
        noSubItem: data.nomorSubItem,
        referenceSubItem: data.referensiSubItem || null,
        subItem: data.subItem,
      };


      await updateSubItem.mutateAsync(saveData);

      modal.resolve(saveData);
      modal.hide();
    } catch (error) {
      console.error('Error saving sub item:', error);
    }
  };

  const handleClose = () => {
    modal.hide();
  };

  const handleReferensiSearch = () => {
  };

  // Show error state
  if (detailError) {
    return (
      <SectionModal
        title="Edit Sub Item"
        isOpen={modal.visible}
        onClose={handleClose}
        containerSx={{ minWidth: '75vw' }}
      >
        <div style={{ padding: '20px', textAlign: 'center' }}>
          Error loading sub item detail: {detailError.message}
        </div>
      </SectionModal>
    );
  }

  return (
    <SectionModal
      title="Edit Sub Item"
      isOpen={modal.visible}
      onClose={handleClose}
      containerSx={{ minWidth: '75vw' }}
      customFooter={
        <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
          <Button variant="outlined" sx={{ mr: 3 }} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(handleSave)}
            disabled={!isValid || isLoadingDetail || updateSubItem.isPending || isAutoSaveFetching}
          >
            {isAutoSaveFetching ? 'Auto Save ...' : updateSubItem.isPending ? 'Saving...' : 'Save'}
          </Button>
        </RowWrapper>
      }
    >
      <ColumnWrapper gap={3}>
        {/* Group Detail Information */}
        {groupDetailData?.data?.content && (
          <RowWrapper gap={2} sx={{ backgroundColor: '#f5f5f5', borderRadius: 1, p: 2 }}>
            <div style={{ flex: 1 }}>
              <strong>Group Information:</strong>
              <div>Code: {groupDetailData.data.content.code || 'N/A'}</div>
              <div>Item No: {groupDetailData.data.content.itemNo || 'N/A'}</div>
              <div>Application Type: {groupDetailData.data.content.applicationType || 'N/A'}</div>
              <div>Status: {groupDetailData.data.content.statusLabel || 'N/A'}</div>
            </div>
          </RowWrapper>
        )}

        <RowWrapper gap={2} sx={{ pt: 3 }}>
          <Controller
            name="nomorSubItem"
            control={control}
            rules={{ required: 'Nomor Sub Item is required' }}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                label="Nomor Sub Item"
                labelProps={{
                  children: (
                    <>
                      Nomor Sub Item
                      <span style={{ color: 'red' }}>*</span>
                    </>
                  ),
                }}
                placeholder="Pilih Nomor Sub Item"
                type="dropdown"
                dropdownList={nomorItemOptions}
                containerSx={{ flex: 1 }}
                isMandatory
                error={!!error}
                helperText={error?.message}
                disabled={updateSubItem.isPending}
              />
            )}
          />

          <Controller
            name="active"
            control={control}
            render={({ field }) => (
              <Input
                type="radio"
                label="Active"
                value={field.value}
                onChange={field.onChange}
                radioList={[
                  { label: 'Ya', value: true },
                  { label: 'Tidak', value: false }
                ]}
                containerSx={{ flex: 1 }}
                disabled={updateSubItem.isPending}
              />
            )}
          />
        </RowWrapper>

        <RowWrapper gap={2} sx={{ pt: 3 }}>
          <Controller
            name="canEdit"
            control={control}
            render={({ field }) => (
              <Input
                type="radio"
                label="Can Edit"
                value={field.value}
                onChange={field.onChange}
                radioList={[
                  { label: 'Ya', value: true },
                  { label: 'Tidak', value: false }
                ]}
                containerSx={{ flex: 1 }}
                disabled={updateSubItem.isPending}
              />
            )}
          />

          <Controller
            name="toMaintenanceCustomer"
            control={control}
            render={({ field }) => (
              <Input
                type="radio"
                label="To Maintenance Customer"
                value={field.value}
                onChange={field.onChange}
                radioList={[
                  { label: 'Ya', value: true },
                  { label: 'Tidak', value: false }
                ]}
                containerSx={{ flex: 1 }}
                disabled={updateSubItem.isPending}
              />
            )}
          />
        </RowWrapper>

        {shouldHideReferensiItem && (
          <RowWrapper gap={2}>
            <Controller
              name="referensiSubItem"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Referensi Sub Item"
                  placeholder="[referensi]"
                  type="text"
                  containerSx={{ flex: 1 }}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        iconName="search"
                        onClick={handleReferensiSearch}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'transparent',
                          },
                          padding: 1,
                        }}
                      />
                    ),
                  }}
                  disabled={updateSubItem.isPending}
                />
              )}
            />
            <div style={{ flex: 1 }} />
          </RowWrapper>
        )}

        <Controller
          name="subItem"
          control={control}
          rules={{ required: 'Sub Item is required' }}
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              label="Description"
              placeholder="Description"
              type="richtext"
              containerSx={{ width: '100%' }}
              rows={4}
              isMandatory
              error={!!error}
              helperText={error?.message}
              disabled={updateSubItem.isPending}
            />
          )}
        />
      </ColumnWrapper>
    </SectionModal>
  );
});

export default EditSubItemModal;
