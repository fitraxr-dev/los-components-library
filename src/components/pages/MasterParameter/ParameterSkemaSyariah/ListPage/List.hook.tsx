import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { roles } from '@/configs/constants';
import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { API } from '@/helpers/api';
import { formatDateTime } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';

import useGetParameterSyariahDetail from '../CreatePage/hooks/useGetParameterSyariahDetail';
import useParameterSyariahSave from '../CreatePage/hooks/useParameterSyariahSave';

import useGetSyariahList from './hooks/useGetSyariahList';
import { MODAL, TABLE_HEADER } from './List.constant';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { ContentList, Dropdown } from '@/components/shared/Input/Input.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useList = () => {
  const [{ currentRole }] = useApp();
  const isMaker = !!currentRole?.includes?.(roles.MAKER);
  const router = useCustomRouter();
  const { recordActivity } = useRecordLog();

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [filter, setFilter] = React.useState<SearchValue>(null);


  // State for edit mode
  const [editingId, setEditingId] = React.useState<number | null>(null);

  const { data: searchByOptions } = useGetParameterList('searchByParameterSyariah', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByParameterSyariah', { label: 'value1', value: 'value2' });
  const { data: productSyariahOptions } = useGetParameterList('productSyariah');

  // Fetch detail when editingId is set
  const { data: editingDetail, isLoading: isEditingDetailLoading } = useGetParameterSyariahDetail(
    { id: editingId || 0 },
    { enabled: !!editingId }
  );

  const { mutate: saveParameterSyariah } = useParameterSyariahSave({
    onError: (error) => {
      showNiceModalV2({
        title: `Data gagal disimpan${error?.message ? ': ' + error.message : ''}`,
        type: 'error',
      });
      setEditingId(null);
    },
    onSuccess: (response) => {
      const bucketProcessId = response?.data?.bucketProcessId;

      recordActivity({
        activity: ActivityType.EDIT,
        bucketProcessId: bucketProcessId || '',
        changeAfter: JSON.stringify(response?.data),
        changeBefore: editingDetail ? JSON.stringify(editingDetail) : '',
        menuCode: 'parameter-skema-syariah',
        module: TypeModule.PARAMETER_SYARIAH,
        process: TypeProcess.PARAMETER_SYARIAH,
        remarks: 'successfully edited parameter syariah from list page',
      });

      setEditingId(null);

      if (bucketProcessId) {
        const nextPath = replacePath(MASTER_PARAMETER.PARAMETER_SKEMA_SYARIAH_EDIT_PAGE, {
          processId: bucketProcessId,
        });
        router.push(`${nextPath}?tab=PROCESS`);
      } else {
        showNiceModalV2({
          title: 'Gagal mendapatkan bucket process ID',
          type: 'error',
        });
      }
    },
  });

  // Trigger save when detail data is loaded
  React.useEffect(() => {
    if (editingDetail && editingId) {
      // Prepare payload for save API
      const saveData = {
        action: 'UPDATE' as const,
        attributes: editingDetail.attributes?.map((attr) => ({
          attributeKey: attr.attributeKey,
          attributeLabel: attr.attributeLabel,
          attributeType: attr.attributeType,
        })) || [],
        id: editingDetail.id,
        isActive: editingDetail.isActive,
        productCode: editingDetail.productCode || null,
        productName: editingDetail.product || '',
        productReferenceCode: editingDetail.productCodeReference || '',
        productReferenceName: editingDetail.product || '',
      };

      // Call save API
      saveParameterSyariah(saveData);
    }
  }, [editingDetail, editingId, saveParameterSyariah]);

  const activeList = [
    { label: 'Ya', value: 'yes' },
    { label: 'Tidak', value: 'no' },
  ];

  const filterDropdownList: Dropdown[] = searchByOptions;

  const filterContentList: ContentList[] = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      key: 'products',
      label: 'Product',
      options: productSyariahOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'isActive',
      label: 'Active',
      options: activeList,
      type: 'dropdown',
    },
  ];

  const isActiveFilterValue = filter?.filter?.isActive === 'yes' ? true : filter?.filter?.isActive === 'no' ? false : undefined;

  const { data: parameterSyariahData, isFetching: isLoading } = useGetSyariahList({
    filter: {
      products: [],
      ...filter?.filter,
      ...(isActiveFilterValue !== undefined ? { isActive: isActiveFilterValue } : {}),
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  // Record activity when list data is loaded
  React.useEffect(() => {
    if (parameterSyariahData) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'parameter-skema-syariah',
        module: TypeModule.PARAMETER_SYARIAH,
        process: TypeProcess.PARAMETER_SYARIAH,
        remarks: 'view parameter skema syariah list',
      });
    }
  }, [parameterSyariahData, page, pageSize, recordActivity]);

  const tableData = parameterSyariahData?.contents.map((data) => ({
    ...data,
    isActive: data.isActive ? 'Ya' : 'Tidak',
  }));

  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER,
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
          onClick: (data) => {
            showNiceModalV2({
              cancelText: 'Tidak',
              onSubmit: () => {
                // Set editing ID to trigger detail fetch
                setEditingId(data.id);
              },
              submitText: 'Ya',
              title: 'Apakah anda yakin ingin mengedit data ini?',
              type: 'warning',
            });
          },
        }] : []),
      ],
      sx: {
        minWidth: '10vw',
      },
      type: 'action',
    }
  ];

  const handleOpenApprovalStatusModal = () => {
    NiceModal.show(MODAL.APPROVAL_STATUS_MODAL);
  };

  const handleDetailClick = (data: any) => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: data.bucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-skema-syariah',
      module: TypeModule.PARAMETER_SYARIAH,
      process: TypeProcess.PARAMETER_SYARIAH,
      remarks: 'view parameter skema syariah detail from list',
    });

    const nextPath = replacePath(MASTER_PARAMETER.PARAMETER_SKEMA_SYARIAH_DETAIL_PAGE, {
      processId: data.id,
    });
    router.push(nextPath);
  };

  return {

    filter,
    filterContentList,
    filterDropdownList,
    handleDetailClick,
    handleOpenApprovalStatusModal,
    isLoading: isLoading || isEditingDetailLoading,
    page,
    pageSize,

    setFilter,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage: parameterSyariahData?.page?.totalPage,
  };
};

export default useList;
