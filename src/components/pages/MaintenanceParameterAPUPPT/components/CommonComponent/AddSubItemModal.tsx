import React, { useEffect, useMemo } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { API } from '@/helpers/api';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';

import SectionModal from '../../../../shared/SmiModal/SectionModal/SectionModal';
import useGetGroupDetail from '../../FormPage/AddGroupItem/hooks/useGetGroupDetail';
import useGetParameterGroupItemNumber from '../../FormPage/AddGroupSubItem/hooks/useGetParameterGroupItemNumber';
import useGetParameterGroupLovCode from '../../hooks/useGetParameterGroupLovCode';


interface AddSubItemFormData {
  nomorItem: string;
  active: boolean;
  canEdit: boolean;
  toMaintenanceCustomer: boolean;
  referensiSubItem: string;
  subItem: string;
}

interface AddSubItemModalProps {
  groupItemId: number;
  bucketProcessId: string;
  applicationType?: string;
  moduleCode?: string;
  groupDataId?: string;
}

const AddSubItemModal: React.FC<AddSubItemModalProps> = NiceModal.create(
  ({ groupItemId, bucketProcessId, applicationType, moduleCode, groupDataId }) => {
    const modal = useModal();
    const theme = useTheme();
    const queryClient = useQueryClient();
    const params = useParams();


    // Get itemId from route params (the last parameter in the URL)
    const routeItemId = (params as any)?.itemId;
    const routeBucketProcessId = (params as any)?.processId;

    // Get group detail data
    const { data: groupDetailData, isLoading: groupDetailLoading, error: groupDetailError } = useGetGroupDetail(
      groupItemId ? {
        bucketProcessId: bucketProcessId || routeBucketProcessId || null,
        id: groupItemId,
      } : null
    );

    const shouldHideReferensiField = useMemo(() => {
      // Check from group detail data first
      if (groupDetailData?.data?.content?.applicationTypeKey === 'DATA_UPDATES') {
        return true;
      }

      // Fallback to session storage check
      try {
        const beneficialOwner = sessionStorage.getItem('beneficial-owner');
        return beneficialOwner === 'APU PPT';
      } catch (error) {
        console.warn('Session storage not available:', error);
        return false;
      }
    }, [groupDetailData?.data?.content?.applicationTypeKey]);

    // Get referensi sub item options
    const { data: referensiSubItemData, isLoading: isReferensiSubItemLoading } = useGetParameterGroupLovCode('APU_PPT');
    const referensiSubItemOptions = useMemo(() => {
      if (!referensiSubItemData?.contents) return [];


      return referensiSubItemData.contents.map((item) => ({
        label: item.label,
        value: item.key,
      }));
    }, [referensiSubItemData?.contents]);

    const { control, handleSubmit, reset, formState: { isValid } } = useForm<AddSubItemFormData>({
      defaultValues: {
        active: true,
        canEdit: false,
        nomorItem: '',
        referensiSubItem: '',
        subItem: '',
        toMaintenanceCustomer: false,
      },
      mode: 'onChange',
    });

    const payloadNomorItem = {
      applicationType,
      bucketProcessId: routeBucketProcessId || '',
      from: 'subitem',
      module: moduleCode || '',
    };
    // Dynamic nomor sub item options
    const { data: nomorItemData, refetch: refetchNomorItem } = useGetParameterGroupItemNumber(
      payloadNomorItem,
    );

    React.useEffect(() => {
      if (applicationType && moduleCode) {
        refetchNomorItem();
      }
    }, [applicationType, moduleCode, refetchNomorItem]);

    const nomorItemOptions = React.useMemo(() => {
      if (!nomorItemData?.contents) return [];
      return nomorItemData.contents.map((item) => ({ label: item.label, value: item.key }));
    }, [nomorItemData?.contents]);

    const storeSubItemMutation = useMutation({
      mutationFn: async (data: any) => {
        const response = await API('parameter.parameterApuPpt.itemSubStore', {
          data,
        });
        return response.data;
      },
      onError: (error) => {
        console.error('Error storing sub item:', error);
      },
      onSuccess: (data) => {
        // Reset form to clear previous data
        reset();

        queryClient.invalidateQueries({ queryKey: ['parameter-group-sub-items', bucketProcessId]});
        modal.resolve(data);
        modal.hide();
      },
    });

    const handleSave = (formData: AddSubItemFormData) => {
      const requestData = {
        additionalAction: formData.toMaintenanceCustomer,
        bucketProcessId: routeBucketProcessId,
        groupDataId: groupDataId || '',
        groupItemId: routeItemId ? parseInt(routeItemId) : parseInt(groupItemId.toString()),
        isActive: formData.active,
        needConfirmation: formData.canEdit,
        noSubItem: formData.nomorItem,
        referenceSubItem: formData.referensiSubItem || null,
        subItem: formData.subItem,
      };

      storeSubItemMutation.mutate(requestData);
    };

    // Reset form when modal opens
    useEffect(() => {
      if (modal.visible) {
        reset();
      }
    }, [modal.visible, reset]);

    const handleClose = () => {
      if (!storeSubItemMutation.isPending) {
        modal.hide();
      }
    };

    return (
      <SectionModal
        isOpen={modal.visible}
        onClose={handleClose}
        title="Add Sub Item"
        customFooter={
          <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
            <Button variant="outlined" sx={{ mr: 3 }} onClick={handleClose}>
              Close
            </Button>
            <Button
              onClick={handleSubmit(handleSave)}
              disabled={!isValid || storeSubItemMutation.isPending}
            >
              {storeSubItemMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </RowWrapper>
        }
        containerSx={{ maxWidth: 'lg', width: '100%' }}
      >
        <ColumnWrapper gap={3}>
          <RowWrapper gap={2}>
            <Controller
              name="nomorItem"
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
                  disabled={storeSubItemMutation.isPending}
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
                  disabled={storeSubItemMutation.isPending}
                />
              )}
            />
          </RowWrapper>

          <RowWrapper gap={2}>
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
                  disabled={storeSubItemMutation.isPending}
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
                  disabled={storeSubItemMutation.isPending}
                />
              )}
            />
          </RowWrapper>

          {shouldHideReferensiField && (
            <RowWrapper gap={2}>
              <Controller
                name="referensiSubItem"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Referensi Sub Item"
                    placeholder="Pilih Referensi Sub Item"
                    type="dropdown"
                    containerSx={{ flex: 1 }}
                    disabled={storeSubItemMutation.isPending}
                    dropdownList={referensiSubItemOptions}
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
                placeholder="Sub Item"
                type="richtext"
                containerSx={{ width: '100%' }}
                rows={4}
                isMandatory
                error={!!error}
                helperText={error?.message}
                disabled={storeSubItemMutation.isPending}
              />
            )}
          />

        </ColumnWrapper>
      </SectionModal>
    );
  }
);

export default AddSubItemModal;
