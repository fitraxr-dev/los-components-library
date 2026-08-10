import * as React from 'react';
import { useMemo } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams } from 'next/navigation';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import useGetDetail from '../../hooks/useGetDetail';

import { TABLE_HEADER } from './AddGroupSubItem.constant';
// @ts-ignore
import useGetGroupDetail from './hooks/useGetGroupDetail';
import useGetItemDetail from './hooks/useGetItemDetail';
import useGetParameterGroupLovCode from './hooks/useGetParameterGroupLovCode';
import useGetParameterGroupSubItems from './hooks/useGetParameterGroupSubItems';
import useParameterGroupItemStore from './hooks/useParameterGroupItemStore';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { ContentList, Dropdown } from '@/components/shared/Input/Input.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useAddGroupSubItem = (watchFields: any) => {
  const params = useParams();
  const router = useCustomRouter();
  const [{ currentRole }] = useApp();
  const { recordActivity } = useRecordLog();
  const isMaker = currentRole?.includes(roles.MAKER);

  // Get route params
  const routeId = (params as any)?.id;
  const routeProcessId = (params as any)?.processId;
  const routeMode = (params as any)?.mode;
  const routeModeGroup = (params as any)?.modeGroup; // New parameter for modeGroup
  const routeModeSubItem = (params as any)?.modeSubItem; // New parameter for modeSubItem
  const routeGroupId = (params as any)?.groupId;
  const routeItemId = (params as any)?.itemId; // For edit mode

  // Fix: If routeGroupId is undefined but routeModeSubItem exists, use routeModeSubItem as groupId

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [isLoading, setIsLoading] = React.useState(false);
  const [filter, setFilter] = React.useState<SearchValue>(null);

  const MODAL_IDS = {
    DETAIL_SUB_ITEM_MODAL: 'DETAIL_SUB_ITEM_MODAL',
    EDIT_SUB_ITEM_MODAL: 'EDIT_SUB_ITEM_MODAL',
  };

  const { data: detailData, isLoading: detailLoading, error: detailError } = useGetDetail(
    routeId ? { bucketProcessId: routeProcessId || null, id: routeId.toString() } : null
  );

  // Get item detail data if routeItemId exists (edit mode)
  const { data: itemDetailData, isLoading: itemDetailLoading, error: itemDetailError } = useGetItemDetail(
    routeGroupId || routeItemId ? {
      bucketProcessId: routeProcessId || null,
      id: parseInt(routeItemId.toString()),
    } : null
  );

  // Get group detail data to get application type for nomor item API
  const { data: groupDetailData, isLoading: groupDetailLoading, error: groupDetailError } = useGetGroupDetail(
    routeId ? {
      bucketProcessId: routeProcessId || null,
      id: parseInt(routeGroupId?.toString() || routeModeSubItem?.toString() || '0'),
    } : null
  );


  const { data: referensiItemData, isLoading: isReferensiItemLoading } = useGetParameterGroupLovCode('APU_PPT');

  // Filter options
  const { data: searchByOptions } = useGetParameterList('searchByParamApuGroupData', { label: 'value1', value: 'value2' });
  const { data: orderByOptions } = useGetParameterList('sortByParamApuGroupData', { label: 'value1', value: 'value2' });
  const { data: noItemByOptions } = useGetParameterList('listNoItemParamApu');

  const filterDropdownList: Dropdown[] = searchByOptions || [];
  const filterContentList: ContentList[] = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: orderByOptions || [],
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
    {
      key: 'isActive',
      label: 'Active',
      options: [
        { label: 'Ya', value: true },
        { label: 'Tidak', value: false }
      ],
      type: 'single-select',
    },
    {
      key: 'noItem',
      label: 'Nomor Item Group',
      options: noItemByOptions,
      type: 'multiple-autocomplete',
    },
  ];

  const referensiItemOptions = useMemo(() => {
    if (!referensiItemData?.contents) return [];

    return referensiItemData.contents.map((item) => ({
      label: item.label,
      value: item.key,
    }));
  }, [referensiItemData?.contents]);

  // Extract application type from group detail data or detailData as fallback
  const applicationType = groupDetailData?.data?.content?.applicationTypeKey ||
    groupDetailData?.data?.content?.applicationType ||
    detailData?.data?.content?.applicationTypeKey ||
    detailData?.data?.content?.applicationType ||
    '';
  const applicationTypeKey = groupDetailData?.data?.content?.applicationTypeKey ||
    detailData?.data?.content?.applicationTypeKey ||
    '';
  const {
    data: subItemsData,
    isFetching: isLoadingSubItems,
    error: subItemsError,
  } = useGetParameterGroupSubItems({
    bucketProcessId: routeProcessId || null,
    filter,
    id: routeItemId || null,
    page,
    pageSize,
  });

  const transformedSubItemsData = React.useMemo(() => {
    if (!subItemsData?.contents) return [];

    return subItemsData.contents.map((item) => ({
      ...item,
      isEditable: item.status === 'DRAFT',
      nomorSubItem: item.noSubItem?.toString() || '',
    }));
  }, [subItemsData]);

  // Get saved form data for population (edit mode)
  const savedFormData = React.useMemo(() => {
    if (!itemDetailData?.data?.content) return null;

    const content = itemDetailData.data.content;
    const formData = {
      active: content.isActive ?? true,
      additionalAction: content.additionalAction ?? false,
      item: content.item || '',
      needConfirmation: content.needConfirmation ?? false,
      nomorItem: content.itemNo?.toString() || '',
      referensiItem: content.referenceItem || '',
    };
    return formData;
  }, [itemDetailData]);

  const {
    mutate: storeParameterGroupItem,
    isPending: isStorePending,
  } = useParameterGroupItemStore({
    onError: (error) => {
      showNiceModalV2({
        title: `Data gagal disimpan${error?.message ? ': ' + error.message : ''}`,
        type: 'error',
      });
    },
    onSuccess: (data) => {
      const newId = data?.data?.content?.id;
      showNiceModalV2({
        onClose: () => {
          // Navigate to sub-item page with subItemId (edit mode)
          const basePath = `/master-parameter/parameter-mapping-apu_ppt/${routeId}/${routeProcessId}/${routeMode}`;
          const subItemPath = `/process/${routeModeGroup}/add-group/${routeGroupId || routeModeSubItem}` +
            `/add-sub-item/${newId}`;
          router.push(basePath + subItemPath);
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleOpenEditSubItemModal = async (data) => {
    try {
      const result = await NiceModal.show(MODAL_IDS.EDIT_SUB_ITEM_MODAL, {
        initialData: {
          applicationType,
          bucketProcessId: data.bucketProcessId,
          groupItemId: itemDetailData?.id,
          id: data.id,
          moduleCode: detailData?.data?.content?.groupCode || '',
        },
      });
    } catch (error) {
    }
  };

  const handleOpenDetailSubItemModal = async (data) => {
    try {
      const result = await NiceModal.show(MODAL_IDS.DETAIL_SUB_ITEM_MODAL, {
        initialData: data,
      });
    } catch (error) {
    }
  };

  // Table header
  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: (data) => [
        {
          iconName: 'detail',
          onClick: (data) => {
            handleOpenDetailSubItemModal(data);
          },
        },
        ...(isMaker && routeModeGroup !== 'detail' ? [{
          iconName: 'edit',
          onClick: (data) => {
            handleOpenEditSubItemModal(data);
          },
        }] : []),
      ],
      sx: { width: '10vw' },
      type: 'action',
    }
  ];
  const { mutate: submitBucket } = useSubmitBucket({
    onError: (error) => {
      showNiceModal('error', error?.message || 'Terjadi kesalahan');
    },
    onSuccess: () => {
      showNiceModal('success', 'Status berhasil diupdate');
      router.push('/master-parameter/parameter-mapping-apu_ppt');
    },
  });

  const updateStatus = async (act: 'SUBMIT' | 'RETURN_TO_MAKER' | 'REJECT' | 'CANCELED' | 'APPROVED') => {
    let action: string = act;
    if (act === 'REJECT') {
      action = 'REJECTED';
    }

    NiceModal.show(
      MODAL.GLOBAL.COMMENT,
      {
        onSave: ({ comment }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          closeNiceModal(MODAL.GLOBAL.SUCCESS);

          const payload = {
            action,
            bucketProcessId: routeProcessId,
            comment,
            isCompleteEditAskForInfo: false,
            module: TypeModule.PARAMETER_APU_PPT,
            process: TypeProcess.PARAMETER_APU_PPT,
          };

          submitBucket({
            submitRequestDto: payload,
          });
        },
      },
    );
  };

  const handleCancel = () => {
    updateStatus('CANCELED');
  };
  const handleSaveItem = async (formData: {
    nomorItem: string;
    active: boolean;
    needConfirmation: boolean;
    additionalAction: boolean;
    referensiItem: string;
    item: string;
  }) => {
    if (!formData.nomorItem?.trim()) {
      showNiceModalV2({
        title: 'Validation Error: Nomor Item is required',
        type: 'warning',
      });
      return;
    }

    if (!formData.item?.trim()) {
      showNiceModalV2({
        title: 'Validation Error: Item is required',
        type: 'warning',
      });
      return;
    }

    // Record save activity
    recordActivity({
      activity: ActivityType.CREATE,
      bucketProcessId: routeProcessId || null,
      changeAfter: JSON.stringify(formData),
      changeBefore: '',
      menuCode: 'parameter-mapping-apu-ppt',
      module: 'parameter-mapping-apu-ppt',
      process: routeId?.toString() || '',
      remarks: 'Save Add Group Sub Item',
    });

    const storeData = {
      additionalAction: formData.additionalAction,
      bucketProcessId: routeProcessId,
      code: '',
      groupDataId: routeGroupId || routeModeSubItem || '',
      id: routeItemId || '',
      isActive: formData.active,
      item: formData.item,
      itemNo: formData.nomorItem,
      module: 'APU_PPT',
      needConfirmation: formData.needConfirmation,
      referenceItem: formData.referensiItem || null,
      subItemList: [],
    };

    storeParameterGroupItem(storeData);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handleBack = () => {
    if (routeItemId) {
      // If has itemId, go back to the add-group page with groupId
      const basePath = '/master-parameter/parameter-mapping-apu_ppt/';
      const addGroupPath = `${routeId}/${routeProcessId || 'null'}/${routeMode}/process/${routeModeGroup}/add-group/${routeGroupId || routeModeSubItem}`;
      router.push(basePath + addGroupPath);
    } else {
      // If no itemId, use default router.back()
      router.back();
    }
  };

  // Check if data is already saved (has routeItemId - means we're in edit mode with saved sub-item)
  const isDataSaved = !!routeItemId;

  // Auto-save payload
  const autoSavePayload = React.useMemo(() => () => {
    const payload = {
      additionalAction: watchFields.additionalAction,
      bucketProcessId: routeProcessId,
      code: itemDetailData?.data?.content?.code || '',

      // createdBy: itemDetailData?.data?.content?.createdBy,

      // Metadata dari existing data
      // createdDate: itemDetailData?.data?.content?.createdDate,

      groupDataId: routeGroupId || routeModeSubItem || '',

      id: routeItemId || null,

      isActive: watchFields.active,

      item: watchFields.item,

      itemNo: watchFields.nomorItem,

      // modifiedBy: itemDetailData?.data?.content?.modifiedBy,

      // modifiedDate: itemDetailData?.data?.content?.modifiedDate,

      module: 'APU_PPT',
      needConfirmation: watchFields.needConfirmation,
      // reference: itemDetailData?.data?.content?.reference,
      referenceItem: watchFields.referensiItem || null,
      // status: itemDetailData?.data?.content?.status,
      subItemList: [],
    };
    return Promise.resolve(payload);
  }, [
    watchFields,
    routeProcessId,
    routeGroupId,
    routeModeSubItem,
    routeItemId,
    itemDetailData?.data?.content,
  ]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !!routeItemId && routeModeSubItem !== 'detail' && isMaker && !!itemDetailData?.data?.content,
    payload: autoSavePayload,
    url: 'parameter.parameterApuPpt.itemStore',
  });

  return {
    applicationType,
    applicationTypeKey,
    detailData,
    filter,
    filterContentList,
    filterDropdownList,
    groupDetailData,
    groupDetailLoading,
    handleBack,
    handleCancel,
    handleSaveItem,
    isAutoSaveFetching,
    isDataSaved,
    isLoading: isLoading || isStorePending || isReferensiItemLoading || itemDetailLoading || groupDetailLoading,
    isSaving: isStorePending,
    itemDetailLoading,
    page,
    pageSize,
    referensiItemOptions,
    routeGroupId,
    routeId,
    routeItemId,
    routeMode,
    routeModeGroup,
    routeModeSubItem,
    routeProcessId,
    savedFormData,
    setFilter,
    setPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    tableData: transformedSubItemsData,
    tableHeader,
    totalPage: subItemsData?.page?.totalPage || 1,
  };
};

export default useAddGroupSubItem;
