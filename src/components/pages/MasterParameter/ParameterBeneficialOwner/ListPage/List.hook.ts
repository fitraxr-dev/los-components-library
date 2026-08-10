import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { accessid, MASTER_PARAMETER } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';

import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';

import useGetParameterGroupDetail from '../ItemPage/hooks/useGetParameterGroupDetail';

import useGetParameterGroupList from './hooks/useGetParameterGroupList';
import useParameterGroupStandaloneSave from './hooks/useParameterGroupStandaloneSave';
import { MODAL, TABLE_HEADER } from './List.constant';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { ContentList, Dropdown } from '@/components/shared/Input/Input.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useList = () => {
  const router = useCustomRouter();
  const { isMaker } = useMasterParameter();

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [filter, setFilter] = React.useState<SearchValue>(null);
  const [pendingDetailId, setPendingDetailId] = React.useState<number | null>(null);

  const { data: searchByOptions } = useGetParameterList('searchByParameterGroup');
  const { data: sortByOptions } = useGetParameterList('sortByParameterGroup');
  const { data: applicationCategoryOptions } = useGetParameterList('apApplicationCategory');

  const filterDropdownList: Dropdown[] = searchByOptions;
  const filterContentList: ContentList[] = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'endLastModifiedDate',
      label: 'Last Modified',
      startKey: 'startLastModifiedDate',
      type: 'period',
    },
    {
      key: 'isActive',
      label: 'Active',
      options: [
        { label: 'Ya', value: true },
        { label: 'Tidak', value: false }
      ],
      type: 'single-select',
    },
  ];

  const { data: parameterBOData, isFetching: isLoading } = useGetParameterGroupList({
    filter: {
      ...filter?.filter,
      module: 'BENEFICIAL_OWNER',
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const { data: pendingDetailData } = useGetParameterGroupDetail({
    id: pendingDetailId,
  });

  React.useEffect(() => {
    if (!pendingDetailId || !pendingDetailData?.content?.bucketProcessId) return;

    const nextPath = replacePath(MASTER_PARAMETER.PARAMETER_BENEFICIAL_OWNER_DETAIL_PAGE, {
      mode: 'detail',
      processId: pendingDetailData.content.bucketProcessId,
    });
    router.push(nextPath);
    setPendingDetailId(null);
  }, [pendingDetailData, pendingDetailId, router]);

  const { mutateAsync: saveParameterGroup } = useParameterGroupStandaloneSave();

  const canView = useCheckAccess(accessid.PARAMETER_BENEFICIAL_OWNER_VIEW);
  const canEdit = useCheckAccess(accessid.PARAMETER_BENEFICIAL_OWNER_UPDATE);

  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: (data) => [
        ...(canView ? [{
          iconName: 'detail',
          onClick: (data) => {
            // setPendingDetailId(data.id);
            const nextPath = replacePath(MASTER_PARAMETER.PARAMETER_BENEFICIAL_OWNER_DETAIL_PAGE, {
              mode: 'detail',
              processId: data.id,
            });
            router.push(nextPath);
          },
        }] : []),
        ...(canEdit && data?.isEditable ? [{
          iconName: 'edit',
          onClick: (data) => {
            showNiceModalV2({
              cancelText: 'Tidak',
              onSubmit: async () => {
                try {
                  const response = await saveParameterGroup(data.id);

                  if (response?.content?.bucketProcessId) {
                    const nextPath = replacePath(MASTER_PARAMETER.PARAMETER_BENEFICIAL_OWNER_DETAIL_PAGE, {
                      mode: 'edit',
                      processId: response.content.bucketProcessId,
                    });
                    router.push(nextPath);
                  }
                } catch (error) {
                  console.error('Error during standalone save:', error);
                }
              },
              submitText: 'Ya',
              title: 'Apakah anda yakin ingin mengedit data ini?',
              type: 'warning',
            });
          },
        }] : []),
      ],
      sx: { maxWidth: '10vw' },
      type: 'action',
    }
  ];

  const handleOpenApprovalStatusModal = () => {
    NiceModal.show(MODAL.APPROVAL_STATUS_MODAL);
  };

  return {
    filter,
    filterContentList,
    filterDropdownList,
    handleOpenApprovalStatusModal,
    isLoading,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableData: parameterBOData?.contents,
    tableHeader,
    totalPage: parameterBOData?.page?.totalPage,
  };
};

export default useList;
