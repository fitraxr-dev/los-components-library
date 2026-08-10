import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { accessid, MASTER_PARAMETER } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';

import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';

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
      key: 'noItem',
      label: 'Nomor Item Group',
      type: 'number',
    },
    {
      key: 'feature',
      label: 'Jenis Permohonan',
      options: applicationCategoryOptions,
      type: 'dropdown',
    },
    {
      key: 'isActive',
      label: 'Active',
      options: [
        {
          label: 'Ya',
          value: true,
        },
        {
          label: 'Tidak',
          value: false,
        }
      ],
      type: 'single-select',
    },
  ];

  const { data: parameterCDDData, isFetching: isLoading } = useGetParameterGroupList({
    filter: {
      ...filter?.filter,
      module: 'CUSTOMER_DUE_DILIGENCE',
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const { mutateAsync: saveParameterGroup } = useParameterGroupStandaloneSave();

  const canEdit = useCheckAccess(accessid.PARAMETER_CUSTOMER_DUE_DILIGENCE_UPDATE);
  const canView = useCheckAccess(accessid.PARAMETER_CUSTOMER_DUE_DILIGENCE_UPDATE);

  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: (data) => [
        ...(canView ? [{
          iconName: 'detail',
          onClick: (data) => {
            const nextPath = replacePath(MASTER_PARAMETER.PARAMETER_CUSTOMER_DUE_DILIGENCE_DETAIL_PAGE, {
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
                    const nextPath = replacePath(MASTER_PARAMETER.PARAMETER_CUSTOMER_DUE_DILIGENCE_DETAIL_PAGE, {
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
    tableData: parameterCDDData?.contents,
    tableHeader,
    totalPage: parameterCDDData?.page?.totalPage,
  };
};

export default useList;
