import React, { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useRouter } from 'next/navigation';

import { roles } from '@/configs/constants/general';
import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';

import TextStyle from '@/components/shared/TextStyle';

import { useGetAllDropdownOptions } from '../hooks/useGetDropdownOptions';
import useGetParameterListCustom from '../hooks/useGetParameterListCustom';

import useRegisterBucket from './hooks/useRegisterBucket';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useList = () => {
  const router = useRouter();
  const [{ currentRole }] = useApp();
  const { recordActivity } = useRecordLog();
  const registerBucketMutation = useRegisterBucket();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const isMaker = currentRole.includes(roles.MAKER);
  const [filter, setFilter] = useState<SearchValue>({
    filter: {},
    searchDetail: { key: '', value: '' },
    sortList: undefined,
  });
  const [isLoading] = useState(false);
  const { data: searchByOptions } = useGetParameterList('searchByMtcParameterVA', { label: 'value1', value: 'value2' });
  const { data: orderByOptions } = useGetParameterList('sortByMtcParameterVA', { label: 'value1', value: 'value2' });

  // Filter options using custom hooks
  const { bankOptions, vaTypeOptions, customerTypeOptions } = useGetAllDropdownOptions();


  const { data, isLoading: isApiLoading } = useGetParameterListCustom({
    filter: {
      ...filter?.filter,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const tablePage = data?.data?.page;
  const tableData = data?.data?.contents?.map((item: any) => ({
    ...item,
  })) || [];

  useEffect(() => {
    setPage(1);
  }, [filter]);

  // Record initial page view and clear navigation context
  useEffect(() => {
    // Clear any existing navigation context when returning to list page
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('maintenanceParameterVANavigation');
    }

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-va',
      module: 'parameter-va',
      process: 'list',
      remarks: 'View Parameter VA List Page',
    });
  }, [recordActivity]);

  const handleDetailClick = async (data: any) => {
    try {
      // Record detail view activity
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: data.bucketProcessId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'parameter-va',
        module: 'parameter-va',
        process: data.id?.toString() || '',
        remarks: `View detail from Parameter VA List - ID: ${data.id}`,
      });

      // Set navigation context for bucket list detail view (consistent with Bar)
      if (typeof window !== 'undefined') {
        const navigationContextData = {
          isBucketListDetail: true, // Mark as bucket list detail
          isDetail: true,
          isViewOnly: true,
          module: 'parameter-va',
          source: 'bucket-list',
        };
        sessionStorage.setItem('maintenanceParameterVANavigation', JSON.stringify(navigationContextData));
      }

      // For detail mode, processId can be null if no bucketProcessId (consistent with Bar)
      const processId = data.bucketProcessId || 'null';
      const basePath = '/master-parameter/parameter-va/';
      const detailPath = `${data.id}/${processId}/detail/process`;
      router.push(basePath + detailPath);
    } catch (error) {
      console.error('Error handling detail click:', error);
    }
  };

  const handleEditWithWarning = async (data: any) => {
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Batal',
      onCancel: () => {
        // Do nothing on cancel
      },
      onSubmit: async () => {
        // Record edit activity
        recordActivity({
          activity: ActivityType.EDIT,
          bucketProcessId: data.bucketProcessId || '',
          changeAfter: '',
          changeBefore: '',
          menuCode: 'parameter-va',
          module: 'parameter-va',
          process: data.id?.toString() || '',
          remarks: `Start edit from Parameter VA List - ID: ${data.id}`,
        });

        // Call register API to get bucketProcessId (consistent with Bar)
        registerBucketMutation.mutate(
          { id: data.id.toString() },
          {
            onError: (error: any) => {
              console.error('Register bucket error:', error);
              const errorMessage = error?.message || 'Gagal mendaftarkan bucket process. Silakan coba lagi.';
              NiceModal.show(MODAL.GLOBAL.ERROR, {
                onClose: () => {
                  closeNiceModal(MODAL.GLOBAL.ERROR);
                },
                title: errorMessage,
              });
            },
            onSuccess: (response) => {

              // Safe access to bucketProcessId - check multiple possible response structures
              let bucketProcessId = response?.data?.data?.bucketProcessId;

              // Try alternative response structures
              if (!bucketProcessId) {
                bucketProcessId = response?.data?.bucketProcessId;
              }
              if (!bucketProcessId) {
                bucketProcessId = response?.data?.data?.content?.bucketProcessId;
              }
              if (!bucketProcessId) {
                bucketProcessId = response?.data?.content?.bucketProcessId;
              }
              if (!bucketProcessId) {
                bucketProcessId = (response as any)?.bucketProcessId;
              }
              if (!bucketProcessId) {
                bucketProcessId = response?.data?.data?.id;
              }
              if (!bucketProcessId) {
                bucketProcessId = response?.data?.id;
              }


              if (!bucketProcessId) {
                console.error('bucketProcessId is undefined or null. Full response structure:', JSON.stringify(response, null, 2));
                NiceModal.show(MODAL.GLOBAL.ERROR, {
                  onClose: () => {
                    closeNiceModal(MODAL.GLOBAL.ERROR);
                  },
                  title: 'Bucket Process ID tidak ditemukan dalam response API.',
                });
                return;
              }


              try {
                // Set navigation context for edit mode (not bucket list detail) - consistent with Bar
                if (typeof window !== 'undefined') {
                  const navigationContextData = {
                    isBucketListDetail: false, // Not bucket list detail for edit mode
                    isEdit: true,
                    isViewOnly: false,
                    module: 'parameter-va',
                    source: 'bucket-list',
                  };
                  sessionStorage.setItem('maintenanceParameterVANavigation', JSON.stringify(navigationContextData));
                }

                // Navigate to edit page with bucketProcessId from register response (consistent with Bar)
                const basePath = '/master-parameter/parameter-va/';
                const editPath = `${data.id}/${bucketProcessId}/edit/process`;
                const fullPath = basePath + editPath;
                router.push(fullPath);
              } catch (navigationError) {
                console.error('Navigation error:', navigationError);
                NiceModal.show(MODAL.GLOBAL.ERROR, {
                  onClose: () => {
                    closeNiceModal(MODAL.GLOBAL.ERROR);
                  },
                  title: 'Terjadi kesalahan saat navigasi. Silakan coba lagi.',
                });
              }
            },
          }
        );
      },
      title: 'Apakah Anda yakin ingin mengedit data ini?',
    });
  };


  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '2vw' },
      type: 'index',
    },
    {
      key: 'bankName',
      label: 'Bank Name',
      sx: { minWidth: '1vw' },
    },
    {
      key: 'vaType',
      label: 'VA Type',
      sx: { minWidth: '6vw' },
    },
    {
      key: 'customerType',
      label: 'Customer Type',
      sx: { minWidth: '1vw' },
    },
    {
      key: 'currency',
      label: 'Currency',
      sx: { minWidth: '2vw' },
    },
    {
      key: 'isActive',
      label: 'Active',
      render: (row: any) => React.createElement(TextStyle, { variant: 'body4' }, row.isActive ? 'Ya' : 'Tidak'),
      sx: { minWidth: '5vw' },
    },
    {
      key: 'modifiedBy',
      label: 'Modified By',
      sx: { minWidth: '1vw' },
    },
    {
      key: 'modifiedDate',
      label: 'Last Modified',
      sx: { minWidth: '1vw' },
      type: 'date',
    },
    {
      key: 'action',
      label: 'Action',
      options: (data) => [
        {
          iconName: 'detail',
          onClick: (data) => {
            handleDetailClick(data);
          },
        },
        ...(isMaker && data.isEditable ? [{
          iconName: 'edit',
          isDisabled: (data) => !data.isEditable,
          onClick: (data) => {
            handleEditWithWarning(data);
          },
        }] : []),
      ],
      sx: {
        minWidth: '6vw',
        width: '6vw',
      },
      type: 'action',
    },
  ];

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: orderByOptions,
      type: 'sort',
    },
    {
      key: 'bankName',
      label: 'Bank',
      options: bankOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'vaType',
      label: 'VA Type',
      options: vaTypeOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'customerType',
      label: 'Customer Type',
      options: customerTypeOptions,
      type: 'multiple-autocomplete',
    },
  ];

  const handleOpenApprovalStatusModal = () => {
    NiceModal.show('APPROVAL_STATUS_MODAL_PARAMETER_VA');
  };

  return {
    filter,
    filterContentList,
    filterDropdownList,
    handleDetailClick,
    handleEditWithWarning,
    handleOpenApprovalStatusModal,
    isLoading: isApiLoading || isLoading || registerBucketMutation.isPending,
    isMaker,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    tablePage,
    totalPage: tablePage?.totalPage,
  };
};
