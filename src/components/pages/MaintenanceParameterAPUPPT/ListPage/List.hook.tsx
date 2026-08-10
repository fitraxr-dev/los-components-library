import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

// import { useNavigationContext } from '../context/NavigationContext';
import useGetParameterGroupList from './hooks/useGetParameterGroupList';
import useRegisterBucket from './hooks/useRegisterBucket';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { ContentList, Dropdown } from '@/components/shared/Input/Input.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useList = () => {
  const router = useCustomRouter();
  const [user] = useApp();
  const { recordActivity } = useRecordLog();
  const registerBucketMutation = useRegisterBucket();
  const isMaker = user.currentRole.includes(roles.MAKER);

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [filter, setFilter] = React.useState<SearchValue>(null);

  const { data: searchByOptions } = useGetParameterList('searchByListApuBudd', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByListApuBudd', { label: 'value1', value: 'value2' });

  const filterDropdownList: Dropdown[] = searchByOptions || [];
  const filterContentList: ContentList[] = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions || [],
      type: 'sort',
    },
    {
      endKey: 'endLastModifiedDate',
      label: 'Last Modified',
      placeholder1: 'Start Date',
      placeholder2: 'End Date',
      startKey: 'startLastModifiedDate',
      type: 'period',
    },
  ];

  // Data List Query
  const { data: dataList, isFetching: isLoading } = useGetParameterGroupList({
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

  // Record initial page view activity and clear navigation context
  React.useEffect(() => {
    // Clear any existing navigation context when returning to list page
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('maintenanceParameterAPUPPTNavigation');
    }

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-mapping-apu-ppt',
      module: 'parameter-mapping-apu-ppt',
      process: '',
      remarks: 'View Parameter Mapping APU PPT List Page',
    });
  }, [recordActivity]);

  const tableHeader: TableHeader[] = [
    { key: 'index', label: 'No', sx: { width: '4vw' }, type: 'index' },
    { key: 'groupName', label: 'Group Name', sx: { width: '10vw' } },
    { key: 'modifiedBy', label: 'Modified By', sx: { width: '10vw' } },
    { key: 'modifiedDate', label: 'Last Modified', sx: { width: '10vw' }, type: 'date' },
    {
      key: 'action',
      label: 'Action',
      options: (data) => [
        {
          iconName: 'detail',
          onClick: (data) => {
            // Record detail view activity
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: data.bucketProcessId || '',
              changeAfter: '',
              changeBefore: '',
              menuCode: 'parameter-mapping-apu-ppt',
              module: 'parameter-mapping-apu-ppt',
              process: data.id?.toString() || '',
              remarks: `View detail for Parameter Group: ${data.groupName}`,
            });

            // Set navigation context for bucket list detail view
            if (typeof window !== 'undefined') {
              const navigationContextData = {
                isBucketListDetail: true, // Mark as bucket list detail
                isDetail: true,
                isViewOnly: true,
                module: 'parameter-mapping-apu-ppt',
                source: 'bucket-list',
              };
              sessionStorage.setItem('maintenanceParameterAPUPPTNavigation', JSON.stringify(navigationContextData));
            }

            // For detail mode, processId can be null if no bucketProcessId
            const processId = data.bucketProcessId || 'null';
            const basePath = '/master-parameter/parameter-mapping-apu_ppt/';
            const detailPath = `${data.id}/${processId}/detail/process`;
            router.push(basePath + detailPath);
          },
        },
        ...(isMaker && data?.isEditable ? [{
          iconName: 'edit',
          onClick: (data) => {
            NiceModal.show(MODAL.GLOBAL.CONFIRM, {
              agreeText: 'Ya, Edit',
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
                  changeBefore: JSON.stringify(data),
                  menuCode: 'parameter-mapping-apu-ppt',
                  module: 'parameter-mapping-apu-ppt',
                  process: data.id?.toString() || '',
                  remarks: `Edit Parameter Group: ${data.groupName}`,
                });

                // Call register API to get bucketProcessId


                registerBucketMutation.mutate(
                  { id: data.id.toString() },
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

                      // Safe access to bucketProcessId
                      const bucketProcessId = response?.data?.content?.bucketProcessId;
                      if (!bucketProcessId) {
                        console.error('bucketProcessId is undefined or null');
                        NiceModal.show(MODAL.GLOBAL.ERROR, {
                          message: 'Bucket Process ID tidak ditemukan dalam response API.',
                          onClose: () => {
                            closeNiceModal(MODAL.GLOBAL.ERROR);
                          },
                        });
                        return;
                      }

                      // Set navigation context for edit mode (not bucket list detail)
                      if (typeof window !== 'undefined') {
                        const navigationContextData = {
                          isBucketListDetail: false, // Not bucket list detail for edit mode
                          isEdit: true,
                          isViewOnly: false,
                          module: 'parameter-mapping-apu-ppt',
                          source: 'bucket-list',
                        };
                        sessionStorage.setItem('maintenanceParameterAPUPPTNavigation', JSON.stringify(navigationContextData));
                      }

                      // Navigate to edit page with bucketProcessId from register response
                      const basePath = '/master-parameter/parameter-mapping-apu_ppt/';
                      const editPath = `${data.id}/${bucketProcessId}/edit/process`;
                      router.push(basePath + editPath);
                    },
                  }
                );
              },
              title: 'Apakah Anda yakin ingin mengedit data ini?',
            });
          },
        }] : []),
      ],
      sx: { width: '10vw' },
      type: 'action',
    }
  ];

  const handleOpenApprovalStatusModal = () => {
    // Record approval status modal activity
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-mapping-apu-ppt',
      module: 'parameter-mapping-apu-ppt',
      process: '',
      remarks: 'Open Approval Status Modal for Parameter Mapping APU PPT',
    });

    NiceModal.show('APPROVAL_STATUS_MODAL_PARAMETER_APU_PPT');
  };

  return {
    filter,
    filterContentList,
    filterDropdownList,
    handleOpenApprovalStatusModal,
    isLoading: isLoading || registerBucketMutation.isPending,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableData: dataList?.data?.contents,
    tableHeader,
    totalPage: dataList?.data?.page?.totalPage,
  };
};

export default useList;
