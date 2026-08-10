import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';

import useRegisterWorkflow from '../hooks/useRegisterWorkflow';

import { useGetParameterLOVList, useGetParameterLOVHistoryList } from './hooks';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { ContentList, Dropdown } from '@/components/shared/Input/Input.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useList = () => {
  const { isMaker } = useMasterParameter();
  const router = useCustomRouter();
  const { recordActivity } = useRecordLog();

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [filter, setFilter] = React.useState<SearchValue>(null);
  const [activeTab, setActiveTab] = React.useState<'data' | 'history'>('data');

  const { data: searchByOptions } = useGetParameterList('searchByMtcParameter', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByMtcParameter', { label: 'value1', value: 'value2' });

  const registerWorkflowMutation = useRegisterWorkflow();

  const filterDropdownList: Dropdown[] = searchByOptions || [];
  const filterContentList: ContentList[] = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions || [],
      type: 'sort',
    },
    {
      endKey: 'endModifiedDate',
      label: 'Periode Modified Date',
      placeholder1: 'Start Date',
      placeholder2: 'End Date',
      startKey: 'startModifiedDate',
      type: 'period',
    },
  ];

  // Data List Query
  const { data: dataList, isFetching: isDataLoading } = useGetParameterLOVList({
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

  // History List Query
  const { data: historyList, isFetching: isHistoryLoading } = useGetParameterLOVHistoryList({
    filter: {
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: { key: '', value: '' },
    sortList: {
      columnName: 'modifiedDate',
      sortType: 'desc',
    },
  });

  const tableHeaderData: TableHeader[] = [
    { key: 'index', label: 'No', sx: { minWidth: '4vw' }, type: 'index' },
    { key: 'description', label: 'Category', sx: { minWidth: '10vw' } },
    { key: 'module', label: 'Key', sx: { minWidth: '10vw' } },
    { key: 'modifiedBy', label: 'Modified By', sx: { minWidth: '10vw' } },
    { key: 'modifiedDate', label: 'Last Modified', sx: { minWidth: '3vw' }, type: 'date' },
    {
      key: 'action',
      label: 'Action',
      options: (data) => [
        {
          iconName: 'detail',
          onClick: (data) => {
            // Record activity for view detail
            recordActivity({
              activity: ActivityType.VIEW,
              remarks: `view detail parameter lov: ${data.description} (${data.module})`,
            });

            // Set navigation context for bucket list detail view (consistent with BAR pattern)
            if (typeof window !== 'undefined') {
              const navigationContextData = {
                isBucketListDetail: true, // Mark as bucket list detail
                isDetail: true,
                isViewOnly: true,
                module: 'parameter-lov',
                source: 'bucket-list',
              };
              sessionStorage.setItem('maintenanceParameterNavigation', JSON.stringify(navigationContextData));
            }

            // For detail mode, processId can be null if no bucketProcessId
            const processId = 'null';
            const basePath = '/master-parameter/parameter-lov/';
            const description = encodeURIComponent(data.description);
            const detailPath = `${data.id}/${processId}/${description}/${data.module}/detail/process`;
            router.push(basePath + detailPath);
          },
        },
        ...(isMaker && data.isEditable ? [{
          iconName: 'edit',
          onClick: (data) => {
            // Record activity for edit attempt
            recordActivity({
              activity: ActivityType.EDIT,
              remarks: `attempt to edit parameter lov: ${data.description} (${data.module})`,
            });

            NiceModal.show(MODAL.GLOBAL.CONFIRM, {
              agreeText: 'Ya',
              cancelText: 'Batal',
              onCancel: () => {
                // Record activity for cancel edit
                recordActivity({
                  activity: ActivityType.CANCEL,
                  remarks: `cancel edit parameter lov: ${data.description} (${data.module})`,
                });
              },
              onSubmit: async () => {
                // Record activity for confirm edit
                recordActivity({
                  activity: ActivityType.EDIT,
                  remarks: `confirm edit parameter lov: ${data.description} (${data.module})`,
                });
                try {
                  // Register workflow first
                  const registerResponse = await registerWorkflowMutation.mutateAsync({
                    module: data.module || '', // Use module from data, fallback to empty string
                  });

                  // Handle different response structures
                  let bucketProcessId: string | undefined;
                  let registerId: string | undefined;
                  let isSuccess = false;

                  // Check for success in different response formats
                  if (registerResponse.errorCode === '0000' && registerResponse.data) {
                    bucketProcessId = registerResponse.data.bucketProcessId;
                    registerId = registerResponse.data.id;
                    isSuccess = true;
                  } else if (registerResponse.success && registerResponse.bucketProcessId) {
                    bucketProcessId = registerResponse.bucketProcessId;
                    registerId = registerResponse.id;
                    isSuccess = true;
                  } else if (registerResponse.bucketProcessId) {
                    // Direct response with bucketProcessId
                    bucketProcessId = registerResponse.bucketProcessId;
                    registerId = registerResponse.id;
                    isSuccess = true;
                  }

                  if (isSuccess && bucketProcessId) {
                    // Set navigation context for edit mode (not bucket list detail) - consistent with BAR pattern
                    if (typeof window !== 'undefined') {
                      const navigationContextData = {
                        isBucketListDetail: false, // Not bucket list detail for edit mode
                        isEdit: true,
                        isViewOnly: false,
                        module: 'parameter-lov',
                        source: 'bucket-list',
                      };
                      sessionStorage.setItem('maintenanceParameterNavigation', JSON.stringify(navigationContextData));
                    }

                    // Navigate to edit page with new routing structure
                    const basePath = '/master-parameter/parameter-lov/';
                    const description = encodeURIComponent(data.description);
                    const editPath = `${data.id}/${bucketProcessId}/${description}/${data.module}/edit/process`;
                    router.push(basePath + editPath);
                  } else {
                    // Handle error - show error modal or message
                    alert('Register workflow failed: ' + (registerResponse.errorDesc || registerResponse.message || 'Unknown error'));
                  }
                } catch (error) {
                  // Handle error - show error modal or message
                  alert('Error registering workflow: ' + (error instanceof Error ? error.message : 'Unknown error'));
                }
              },
              title: 'Apakah Anda yakin ingin mengedit data ini?',
            });
          },
        }] : []),
      ],
      sx: {
        minWidth: '10vw',
        width: '10vw',
      },
      type: 'action',
    }
  ];

  const tableHeaderHistory: TableHeader[] = [
    { key: 'index', label: 'No', sx: { minWidth: '4vw' }, type: 'index' },
    { key: 'documentName', label: 'Nama Dokumen', sx: { minWidth: '10vw' } },
    { key: 'uploadedBy', label: 'Uploaded By', sx: { minWidth: '10vw' } },
    { key: 'uploadedAt', label: 'Uploaded Date', sx: { minWidth: '10vw' }, type: 'date' },
    { key: 'status', label: 'Status', sx: { minWidth: '3vw' } },
    {
      key: 'action',
      label: 'Action',
      options: (data) => [
        {
          iconName: data.status === 'Success' ? 'Preview' : 'Failed',
          isUseOnclick: true,
          onClick: (data) => {
            // Record activity for preview document
            recordActivity({
              activity: ActivityType.PREVIEW,
              remarks: `preview upload result document: ${data.documentName} (${data.status})`,
            });
            handleOpenTemplateDetailModal(data);
          },
        },
      ],
      sx: {
        minWidth: '6vw',
        width: '6vw',
      },
      type: 'action',
    },
  ];

  const handleOpenApprovalStatusModal = () => {
    // Record activity for opening approval status modal
    recordActivity({
      activity: ActivityType.VIEW,
      remarks: `open approval status modal for parameter lov from ${activeTab} tab`,
    });
    NiceModal.show('APPROVAL_STATUS_MODAL_PARAMETER');
  };

  const handleChangeTab = (tab: 'data' | 'history') => {
    setActiveTab(tab);
    setPage(1); // Reset page when changing tabs
  };


  const handleOpenTemplateDetailModal = async (data: any) => {
    try {
      // Record activity for opening template detail modal
      recordActivity({
        activity: ActivityType.VIEW,
        remarks: `open template detail modal for document: ${data.documentName} (${data.status})`,
      });

      // Parse message if it's a JSON string
      let parsedMessage = data.message;
      if (typeof data.message === 'string' && data.message.startsWith('{')) {
        try {
          parsedMessage = JSON.parse(data.message);
        } catch (e) {
          console.error('Error parsing message:', e);
        }
      }

      // Always show UploadResultModal for history detail (both success and failed)
      const result = await NiceModal.show(MODAL.UPLOAD_RESULT_LOV, {
        initialData: {
          ...data,
          message: parsedMessage,
        },
      });
    } catch (error) {
      console.error('Error opening template detail modal:', error);
    }
  };


  return {
    activeTab,
    filter,
    filterContentList,
    filterDropdownList,
    handleChangeTab,
    handleOpenApprovalStatusModal,
    isLoading: activeTab === 'data' ? isDataLoading : isHistoryLoading,
    isMaker,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableData: activeTab === 'data' ? dataList?.contents : historyList?.contents,
    tableHeaderData,
    tableHeaderHistory,
    totalPage: activeTab === 'data' ? dataList?.page?.totalPage : historyList?.page?.totalPage,
  };
};

export default useList;
