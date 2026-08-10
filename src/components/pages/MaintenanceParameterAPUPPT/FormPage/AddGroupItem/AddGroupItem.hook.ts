import * as React from 'react';
import { useMemo } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { Watch } from '@mui/icons-material';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { roles } from '@/configs/constants/general';
import { MODAL } from '@/configs/constants/modalId';
import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
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

import { TABLE_HEADER, NOMOR_ITEM_GROUP_OPTIONS } from './AddGroupItem.constant';
import useGetGroupDetail from './hooks/useGetGroupDetail';
import useGetParameterGroupItemList from './hooks/useGetParameterGroupItemList';
import useGetParameterGroupItemNumber from './hooks/useGetParameterGroupItemNumber';
import useGetParameterGroupLovCode from './hooks/useGetParameterGroupLovCode';
import useGetParameterListByModule from './hooks/useGetParameterListByModule';
import useParameterGroupStore from './hooks/useParameterGroupStore';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { ContentList, Dropdown } from '@/components/shared/Input/Input.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';

// Types - same as TabProcessBeneficial

const useAddGroupItem = (control: any, watch: any) => {
  const params = useParams();
  const router = useCustomRouter();
  const [{ currentRole }] = useApp();
  const { recordActivity } = useRecordLog();
  const isMaker = !!currentRole?.includes?.(roles.MAKER);

  // Get route params
  const routeId = (params as any)?.id;
  const routeProcessId = (params as any)?.processId;
  const routeMode = (params as any)?.mode;
  const routeModeGroup = (params as any)?.modeGroup; // New parameter for modeGroup
  const routeModeSubItem = (params as any)?.modeSubItem; // This is actually the groupId in this context
  const routeGroupId = (params as any)?.groupId; // New parameter for saved group ID

  // Use modeSubItem as groupId when groupId is not available
  const effectiveGroupId = routeGroupId || routeModeSubItem;

  // Store original mode for proper navigation back
  const [originalMode, setOriginalMode] = React.useState(routeMode);


  // Update original mode when routeMode changes and it's not 'detail'
  React.useEffect(() => {
    if (routeMode && routeMode !== 'detail') {
      setOriginalMode(routeMode);
    }
  }, [routeMode]);

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [isLoading, setIsLoading] = React.useState(false);
  const [filter, setFilter] = React.useState<SearchValue>(null);

  // Get detail data for form
  const { data: detailData, isLoading: detailLoading, error: detailError } = useGetDetail(
    routeId ? { bucketProcessId: routeProcessId || null, id: routeId.toString() } : null
  );
  // Get group detail data if effectiveGroupId exists (data already saved)
  const { data: groupDetailData, isLoading: groupDetailLoading, error: groupDetailError } = useGetGroupDetail(
    effectiveGroupId ? {
      bucketProcessId: routeProcessId || null,
      id: parseInt(effectiveGroupId.toString()),
    } : null
  );

  const { data: applicationCategoryData, isLoading: isApplicationCategoryLoading } = useGetParameterListByModule('apApplicationCategory');

  const { data: referensiGroupData, isLoading: isReferensiGroupLoading } = useGetParameterGroupLovCode('APU_PPT');

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

  // Watch for jenisPermohonan field changes
  const watchedJenisPermohonan = watch('jenisPermohonan');
  const selectedJenisPermohonan = watchedJenisPermohonan || groupDetailData?.data?.content?.applicationTypeKey;
  const shouldShowReferensiGroup = selectedJenisPermohonan === 'DATA_UPDATES';

  const {
    data: itemListData,
    isFetching: isLoadingItemList,
    error: itemListError,
  } = useGetParameterGroupItemList(routeProcessId, effectiveGroupId, page, pageSize, selectedJenisPermohonan, filter);

  // Debug: Log when selectedJenisPermohonan changes
  React.useEffect(() => {
  }, [selectedJenisPermohonan]);

  const jenisPermohonanOptions = useMemo(() => {
    if (!applicationCategoryData?.listParameter) return [];

    return applicationCategoryData.listParameter.map((item) => ({
      label: item.value1,
      value: item.key,
    }));
  }, [applicationCategoryData?.listParameter]);

  const referensiGroupOptions = useMemo(() => {
    if (!referensiGroupData?.contents) return [];

    return referensiGroupData.contents.map((item) => ({
      label: item.label,
      value: item.key,
    }));
  }, [referensiGroupData?.contents]);

  // Use hardcoded options for nomor item group
  const nomorItemGroupOptions = NOMOR_ITEM_GROUP_OPTIONS;

  const {
    mutate: storeParameterGroup,
    isPending: isStorePending,
  } = useParameterGroupStore({
    onError: (error) => {
      showNiceModalV2({
        title: `Data gagal disimpan${error?.message ? ': ' + error.message : ''}`,
        type: 'error',
      });
    },
    onSuccess: (data) => {
      const newId = data?.data?.content?.id;
      const bucketProcessId = data?.data?.content?.bucketProcessId || routeProcessId;
      // onSuccess: () => {
      showNiceModalV2({
        onClose: () => {
          if (newId && bucketProcessId) {
            const basePath = '/master-parameter/parameter-mapping-apu_ppt/';
            // const newRoute = `${routeId}/${bucketProcessId}/edit/process/${routeModeGroup}/add-group/${newId}`;
            const newRoute = `${routeId}/${bucketProcessId}/edit/process/`;
            router.push(basePath + newRoute);
          } else {
            console.error('ID or bucketProcessId not found in response');
            router.back();
          }
          // router.push('/master-parameter/parameter-mapping-apu_ppt');
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const saveApplicationTypeToSession = () => {
    try {
      if (detailData?.data?.content?.applicationType) {
        sessionStorage.setItem('beneficial-owner', detailData.data.content.applicationType);
      }
    } catch (error) {
      console.error('Error saving to session storage:', error);
    }
  };

  // Table header - different from TabProcessBeneficial
  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: (data) => [
        {
          iconName: 'detail',
          onClick: (data) => {
            saveApplicationTypeToSession();

            // Navigate to detail item page for MaintenanceParameterAPUPPT using new modeSubItem structure
            const basePath = '/master-parameter/parameter-mapping-apu_ppt/';
            const detailPath = `${routeId}/${routeProcessId || 'null'}/${routeMode}/process/${routeModeGroup}/add-group/detail/${effectiveGroupId}/add-sub-item/${data.id}`;
            router.push(basePath + detailPath);
          },
        },
        ...(isMaker && routeModeGroup !== 'detail' ? [{
          iconName: 'edit',
          onClick: (data) => {
            showNiceModalV2({
              cancelText: 'Tidak',
              onSubmit: () => {
                saveApplicationTypeToSession();

                // Navigate to edit item page for MaintenanceParameterAPUPPT using new modeSubItem structure
                const basePath = '/master-parameter/parameter-mapping-apu_ppt/';
                const editPath = `${routeId}/${routeProcessId || 'null'}/${routeMode}/process/${routeModeGroup}/add-group/edit/${effectiveGroupId}/add-sub-item/${data.id}`;
                router.push(basePath + editPath);
              },
              submitText: 'Ya',
              title: 'Apakah anda yakin ingin mengedit data ini?',
              type: 'warning',
            });
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

  const handleSave = (formData: {
    jenisPermohonan: string;
    nomorItemGroup: string;
    active: boolean;
    referensiGroup: string;
    itemGroup: string;
    needConfirmation: boolean;
    additionalAction: boolean;
  }) => {
    if (!formData.nomorItemGroup?.trim()) {
      showNiceModalV2({
        title: 'Validation Error: Nomor Item Group is required',
        type: 'warning',
      });
      return;
    }

    if (!formData.itemGroup?.trim()) {
      showNiceModalV2({
        title: 'Validation Error: Item Group is required',
        type: 'warning',
      });
      return;
    }

    // Record save activity
    recordActivity({
      activity: ActivityType.CREATE,
      bucketProcessId: routeProcessId || '',
      changeAfter: JSON.stringify(formData),
      changeBefore: '',
      menuCode: 'parameter-mapping-apu-ppt',
      module: 'parameter-mapping-apu-ppt',
      process: routeId?.toString() || '',
      remarks: 'Save Add Group Item',
    });

    const storeData = {
      additionalAction: formData.additionalAction,
      applicationType: formData.jenisPermohonan || '',
      bucketProcessId: routeProcessId,
      code: groupDetailData?.data?.content?.code || '',
      id: effectiveGroupId || '',
      isActive: formData.active,
      itemGroup: formData.itemGroup,
      itemList: [],
      module: detailData?.data?.content?.groupCode || '',
      needConfirmation: formData.needConfirmation,
      noItemGroup: formData.nomorItemGroup,
      referenceGroup: formData.referensiGroup || null,
    };

    storeParameterGroup(storeData);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Here you would typically fetch new data with the new page
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    // Here you would typically fetch new data with the new page size
  };

  const handleAddItemRoute = () => {
    // Navigate to Add Group Sub Item page - without subItemId (create mode)
    // Path: process/[modeGroup]/add-group/[modeSubItem]/add-sub-item
    const groupId = effectiveGroupId || 'null';
    const basePath = '/master-parameter/parameter-mapping-apu_ppt/';
    const addSubItemPath = `${routeId}/${routeProcessId || 'null'}/${routeMode}/process/${routeModeGroup}/add-group/${groupId}/add-sub-item`;
    router.push(basePath + addSubItemPath);
  };

  const handleBack = () => {
    if (effectiveGroupId) {
      // If has groupId, go back to the process page using original mode
      const basePath = '/master-parameter/parameter-mapping-apu_ppt/';
      const processPath = `${routeId}/${routeProcessId || 'null'}/${originalMode}/process`;
      router.push(basePath + processPath);
    } else {
      // If no groupId, use default router.back()
      router.back();
    }
  };

  const handlePreview = () => {
    // Record preview navigation activity
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: routeProcessId || null,
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-mapping-apu-ppt',
      module: 'parameter-mapping-apu-ppt',
      process: routeId?.toString() || '',
      remarks: 'Navigate to Preview from Add Group Item',
    });

    // Navigate to preview page with correct route structure
    const basePath = '/master-parameter/parameter-mapping-apu_ppt/';

    if (routeId && routeProcessId && routeMode && routeModeGroup && effectiveGroupId) {
      const previewPath = `${routeId}/${routeProcessId}/${routeMode}/process/${routeModeGroup}/add-group/` +
        `${routeModeSubItem}/${effectiveGroupId}/preview`;
      router.push(basePath + previewPath);
    } else {
      // Fallback with groupId but without modeGroup
      const fallbackPath = `${routeId}/${routeProcessId}/${routeMode}/process/add-group/${effectiveGroupId}`;
      router.push(basePath + fallbackPath);
    }
  };

  // Check if data is already saved (has effectiveGroupId)
  const isDataSaved = !!effectiveGroupId;

  // Get saved form data for population
  const savedFormData = React.useMemo(() => {
    if (!groupDetailData?.data?.content) return null;

    const content = groupDetailData.data.content;


    // Find matching option for jenisPermohonan dropdown
    let mappedJenisPermohonan = '';
    if (content.applicationType && jenisPermohonanOptions.length > 0) {
      // Try to find exact match first
      const exactMatch = jenisPermohonanOptions.find((option) =>
        option.label === content.applicationType || option.value === content.applicationType
      );

      if (exactMatch) {
        mappedJenisPermohonan = exactMatch.value;
      } else {
        // Try to find partial match (case insensitive)
        const partialMatch = jenisPermohonanOptions.find((option) =>
          option.label.toLowerCase().includes(content.applicationType.toLowerCase()) ||
          content.applicationType.toLowerCase().includes(option.label.toLowerCase())
        );

        if (partialMatch) {
          mappedJenisPermohonan = partialMatch.value;
        } else {
          mappedJenisPermohonan = content.applicationType;
        }
      }
    }

    const formData = {
      active: content.isActive ?? true,
      additionalAction: content.additionalAction ?? false,
      id: routeId || '',
      itemGroup: content.itemGroup || '',
      jenisPermohonan: mappedJenisPermohonan,
      needConfirmation: content.needConfirmation ?? false,
      nomorItemGroup: content.itemNo?.toString() || '',
      // ✅ Updated to use itemNo from response
      referensiGroup: content.referenceGroup || '',
    };

    return formData;
  }, [groupDetailData, jenisPermohonanOptions]);

  const watchFields = watch();

  // Auto-save payload
  const autoSavePayload = React.useMemo(() => () => {
    const payload = {
      additionalAction: watchFields.additionalAction,
      applicationType: watchFields.jenisPermohonan || '',
      // applicationTypeKey: watchFields.jenisPermohonan || groupDetailData?.data?.content?.applicationTypeKey,
      bucketProcessId: routeProcessId,

      // code: groupDetailData?.data?.content?.code || '',
      code: '',


      // createdBy: groupDetailData?.data?.content?.createdBy,

      // Metadata dari existing data
      // createdDate: groupDetailData?.data?.content?.createdDate,

      id: effectiveGroupId || null,

      isActive: watchFields.active,

      itemGroup: watchFields.itemGroup,

      itemList: [],

      // itemNo: groupDetailData?.data?.content?.itemNo,

      // modifiedBy: groupDetailData?.data?.content?.modifiedBy,
      // modifiedDate: groupDetailData?.data?.content?.modifiedDate,
      module: detailData?.data?.content?.groupCode || '',
      needConfirmation: watchFields.needConfirmation,
      noItemGroup: watchFields.nomorItemGroup,
      referenceGroup: watchFields.referensiGroup || null,
      // status: groupDetailData?.data?.content?.status,
      // statusLabel: groupDetailData?.data?.content?.statusLabel,
    };
    return Promise.resolve(payload);
  }, [
    watchFields,
    routeProcessId,
    effectiveGroupId,
    detailData?.data?.content?.groupCode,
    groupDetailData?.data?.content,
  ]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !!effectiveGroupId && routeModeGroup !== 'detail' && isMaker,
    payload: autoSavePayload,
    url: 'parameter.parameterApuPpt.store',
  });

  return {
    detailData,
    filter,
    filterContentList,
    filterDropdownList,
    groupDetailLoading,
    handleAddItemRoute,
    handleBack,
    handleCancel,
    handlePageChange,
    handlePageSizeChange,
    handlePreview,
    handleSave,
    isAutoSaveFetching,
    isDataSaved,
    isLoading:
      isLoadingItemList ||
      isLoading ||
      isStorePending ||
      isApplicationCategoryLoading ||
      isReferensiGroupLoading ||
      groupDetailLoading,
    jenisPermohonanOptions,
    originalMode,
    page,
    pageSize,
    referensiGroupOptions,
    routeGroupId: effectiveGroupId,
    routeId,
    routeMode,
    routeModeGroup,
    routeProcessId,
    savedFormData,
    selectedJenisPermohonan,
    setFilter,
    setPage,
    setPageSize,
    shouldShowReferensiGroup,
    tableData: itemListData?.contents || [],
    tableHeader,
    totalPage: itemListData?.page?.totalPage || 1,
  };
};

export default useAddGroupItem;
