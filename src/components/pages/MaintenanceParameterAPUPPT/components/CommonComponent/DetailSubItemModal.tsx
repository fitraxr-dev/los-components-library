import React, { useEffect, useState } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@emotion/react';
import { Controller, useForm } from 'react-hook-form';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import IconButton from '@/components/shared/IconButton';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import useGetGroupDetail from '../../FormPage/AddGroupItem/hooks/useGetGroupDetail';

import useGetParameterGroupSubItemDetail from './hooks/useGetParameterGroupSubItemDetail';


interface AddSubItemFormData {
  nomorSubItem: string;
  active: boolean;
  canEdit: boolean;
  toMaintenanceCustomer: boolean;
  referensiSubItem: string;
  subItem: string;
}

interface DetailSubItemModalProps {
  initialData?: {
    id?: number;
    bucketProcessId?: string;
    groupItemId?: number;
    nomorSubItem?: string;
    active?: boolean;
    canEdit?: boolean;
    toMaintenanceCustomer?: boolean;
    referensiSubItem?: string;
    subItem?: string;
  };
}

const DetailSubItemModal: React.FC<DetailSubItemModalProps> = NiceModal.create(({ initialData }) => {
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

  const {
    data: subItemDetail,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useGetParameterGroupSubItemDetail({
    bucketProcessId: initialData?.bucketProcessId && initialData.bucketProcessId !== 'null' ? initialData.bucketProcessId : null,
    id: initialData?.id || null,
  });

  const { control, reset } = useForm<AddSubItemFormData>({
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

  const handleClose = () => {
    modal.hide();
  };

  const handleReferensiSearch = () => {
  };

  // Show error state
  if (detailError) {
    return (
      <SectionModal
        title="Detail Sub Item"
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
      title="Detail Sub Item"
      isOpen={modal.visible}
      onClose={handleClose}
      containerSx={{ minWidth: '75vw' }}
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
                placeholder="Nomor Sub Item"
                type="text"
                containerSx={{ flex: 1 }}
                isMandatory
                error={!!error}
                helperText={error?.message}
                disabled
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
                disabled
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
                disabled
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
                disabled
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
                  disabled
                />
              )}
            />
            <div style={{ flex: 1 }} />
          </RowWrapper>
        )}

        <Controller
          name="subItem"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              label="Description"
              labelProps={{
                children: (
                  <>
                    Sub Item
                    <span style={{ color: 'red' }}>*</span>
                  </>
                ),
              }}
              placeholder="Sub Item"
              type="richtext"
              containerSx={{ width: '100%' }}
              rows={4}
              isMandatory
              error={!!error}
              helperText={error?.message}
              disabled
            />
          )}
        />
      </ColumnWrapper>
    </SectionModal>
  );
});

export default DetailSubItemModal;
