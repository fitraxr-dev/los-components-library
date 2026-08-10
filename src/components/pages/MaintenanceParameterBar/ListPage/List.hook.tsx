import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useRouter } from 'next/navigation';

import { roles } from '@/configs/constants/general';
import { MODAL } from '@/configs/constants/modalId';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useGetParameterListCustom from '@/hooks/services/useGetParameterListCustom';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import useRegisterBucket from './hooks/useRegisterBucket';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useList = () => {
  const router = useRouter();
  const [{ currentRole }] = useApp();
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
  const { data: searchByOptions } = useGetParameterList('searchByMtcParameterBusinessCall', { label: 'value1', value: 'value2' });
  const { data: orderByOptions } = useGetParameterList('sortByMtcParameterBusinessCall', { label: 'value1', value: 'value2' });


  const { data, isLoading: isApiLoading } = useGetParameterListCustom({
    filter: {
      ...filter?.filter,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ? {
      columnName: filter.sortList.columnName,
      sortType: (filter.sortList.sortType as 'asc' | 'desc') || 'asc',
    } : {
      columnName: 'modifiedDate',
      sortType: 'desc',
    },
  });

  const tablePage = data?.data?.page;
  const tableData = data?.data?.contents?.map((item: any) => ({
    ...item,
  })) || [];

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const handleDetailClick = async (data: any) => {
    try {
      // Set navigation context for bucket list detail view (consistent with APUPPT)
      if (typeof window !== 'undefined') {
        const navigationContextData = {
          isBucketListDetail: true, // Mark as bucket list detail
          isDetail: true,
          isViewOnly: true,
          module: 'parameter-mapping-bar',
          source: 'bucket-list',
        };
        sessionStorage.setItem('maintenanceParameterBarNavigation', JSON.stringify(navigationContextData));
      }

      // For detail mode, processId can be null if no bucketProcessId (consistent with APUPPT)
      const processId = data.bucketProcessId || 'null';
      const basePath = '/master-parameter/parameter-mapping-bar/';
      const detailPath = `${data.id}/${processId}/detail/${data.subModule || 'default'}/${data.code || 'default'}/${data.module || 'default'}/process`;
      router.push(basePath + detailPath);
    } catch (error) {
      console.error('Error handling detail click:', error);
    }
  };

  const handleEditWithWarning = async (data: any) => {
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya, Edit',
      cancelText: 'Batal',
      onCancel: () => {
        // Do nothing on cancel
      },
      onSubmit: async () => {
        // Call register API to get bucketProcessId (consistent with APUPPT)
        registerBucketMutation.mutate(
          { id: data.id.toString(), subModule: data.subModule },
          {
            onError: (error) => {
              NiceModal.show(MODAL.GLOBAL.ERROR, {
                message: 'Gagal mendaftarkan bucket process. Silakan coba lagi.',
                onClose: () => {
                  closeNiceModal(MODAL.GLOBAL.ERROR);
                },
              });
            },
            onSuccess: (response) => {

              // Safe access to bucketProcessId - check multiple possible response structures
              let bucketProcessId = response?.data?.data?.content?.bucketProcessId;


              // Try alternative response structures
              if (!bucketProcessId) {
                bucketProcessId = response?.data?.content?.bucketProcessId;
              }
              if (!bucketProcessId) {
                bucketProcessId = response?.data?.bucketProcessId;
              }
              if (!bucketProcessId) {
                bucketProcessId = (response as any)?.bucketProcessId;
              }
              if (!bucketProcessId) {
                bucketProcessId = response?.data?.id;
              }

              if (!bucketProcessId) {
                console.error('bucketProcessId is undefined or null. Response:', response);
                NiceModal.show(MODAL.GLOBAL.ERROR, {
                  message: 'Bucket Process ID tidak ditemukan dalam response API.',
                  onClose: () => {
                    closeNiceModal(MODAL.GLOBAL.ERROR);
                  },
                });
                return;
              }


              try {
                // Set navigation context for edit mode (not bucket list detail) - consistent with APUPPT
                if (typeof window !== 'undefined') {
                  const navigationContextData = {
                    isBucketListDetail: false, // Not bucket list detail for edit mode
                    isEdit: true,
                    isViewOnly: false,
                    module: 'parameter-mapping-bar',
                    source: 'bucket-list',
                  };
                  sessionStorage.setItem('maintenanceParameterBarNavigation', JSON.stringify(navigationContextData));
                }

                // Navigate to edit page with bucketProcessId from register response (consistent with APUPPT)
                const basePath = '/master-parameter/parameter-mapping-bar/';
                const editPath = `${data.id}/${bucketProcessId}/edit/${data.subModule || 'default'}/${data.code || 'default'}/${data.module || 'default'}/process`;
                const fullPath = basePath + editPath;
                router.push(fullPath);
              } catch (navigationError) {
                console.error('Navigation error:', navigationError);
                NiceModal.show(MODAL.GLOBAL.ERROR, {
                  message: 'Terjadi kesalahan saat navigasi. Silakan coba lagi.',
                  onClose: () => {
                    closeNiceModal(MODAL.GLOBAL.ERROR);
                  },
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
      sx: { minWidth: '1vw' },
      type: 'index',
    },
    {
      key: 'code',
      label: 'Tipe Business Call',
      sx: { minWidth: '1vw' },
    },
    {
      key: 'description',
      label: 'Kategori',
      sx: { minWidth: '1vw' },
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
        ...(isMaker && (data as any).isEditable ? [{
          iconName: 'edit',
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
      endKey: 'endModifiedDate',
      label: 'Last Modified',
      placeholder1: 'Start Date',
      placeholder2: 'End Date',
      startKey: 'startModifiedDate',
      type: 'period',
    },
  ];

  const handleOpenApprovalStatusModal = () => {
    NiceModal.show('APPROVAL_STATUS_MODAL_PARAMETER_BAR');
  };

  return {
    filter,
    filterContentList,
    filterDropdownList,
    handleDetailClick,
    handleEditWithWarning,
    handleOpenApprovalStatusModal,
    isLoading: isApiLoading || isLoading || registerBucketMutation.isPending,
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
