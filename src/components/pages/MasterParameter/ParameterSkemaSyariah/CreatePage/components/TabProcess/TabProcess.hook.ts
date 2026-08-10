import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import useGetParameterSyariahDetail from '@/components/pages/MasterParameter/ParameterSkemaSyariah/CreatePage/hooks/useGetParameterSyariahDetail';

import useParameterSyariahMode from '../../../hooks/useParameterSyariahMode';
import useGetParameterSyariahProductReference from '../../hooks/useGetParameterSyariahProductReference';
// import useGetParameterSyariahProducts from '../../hooks/useGetParameterSyariahProducts';
import useParameterSyariahSave from '../../hooks/useParameterSyariahSave';

import { TABLE_HEADER } from './TabProcess.constant';

import type {
  ParameterSyariahAttribute,
} from '@/components/pages/MasterParameter/ParameterSkemaSyariah/CreatePage/hooks/useGetParameterSyariahDetail';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTabProcessSyariah = (
  onSaveSuccess?: () => void,
  formFieldConfigs?: Array<{ id: number; label: string; type: string }>,
  formData?: { productName: string; reference: string; active: boolean }
) => {
  const { isViewOnly, processId, isMaker } = useParameterSyariahMode();
  const router = useCustomRouter();
  const pathname = usePathname();
  const { recordActivity } = useRecordLog();

  // Detect CREATE mode by checking if pathname includes '/create'
  const isCreateMode = pathname?.includes('/create');

  // State for selected reference ID
  const [selectedReferenceId, setSelectedReferenceId] = React.useState<number | null>(null);

  // Determine which ID to use for fetching detail
  // Priority: selectedReferenceId (when user changes reference) > processId (initial load in edit mode)
  const detailIdToFetch = selectedReferenceId || processId || 0;

  // Fetch parameter syariah detail if processId is available (for edit mode) or reference is selected (for create mode)
  const { data: parameterSyariahDetail, isLoading: isDetailLoading, error: detailError } = useGetParameterSyariahDetail(
    { id: detailIdToFetch },
    { enabled: !!detailIdToFetch }
  );

  // Show error modal when detail fetch fails
  React.useEffect(() => {
    if (detailError) {
      NiceModal.show(MODAL.GLOBAL.WARNING, {
        closeText: 'Close',
        title: 'Belum dilakukan mapping pada produk ini',
      });
    }
  }, [detailError, processId]);

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [isLoading, setIsLoading] = React.useState(false);

  const emptyTableData = {
    contents: [],
    page: {
      currentPage: 1,
      totalItems: 0,
      totalPage: 1,
    },
  };

  const { data: referensiData, isLoading: isReferensiLoading } = useGetParameterSyariahProductReference();
  const { data: parameterSyariahOptions } = useGetParameterList('productSyariah', { id: 'id', label: 'value1', value: 'key' });
  // const { data: productsData } = useGetParameterSyariahProducts();

  const referensiOptions = React.useMemo(() => {
    if (!referensiData?.listParameter) return [];

    const options = referensiData.listParameter.map((item, index) => ({
      id: item.id || (index + 1),
      key: item.key,
      label: item.value1,
      value: item.key,
    }));

    return options;
  }, [referensiData?.listParameter]);
  // const productOptions = React.useMemo(() => {
  //   if (!productsData?.listParameter) return [];

  //   return productsData.listParameter.map((item, index) => ({
  //     id: index + 1, // Use index as ID since the new API doesn't have id field
  //     label: item.value1,
  //     value: item.key,
  //   }));
  // }, [productsData?.listParameter]);

  // Map API response attributes to form field configurations
  const formFieldConfigsFromApi = React.useMemo(() => {
    if (!parameterSyariahDetail?.attributes) return [];

    return parameterSyariahDetail.attributes.map((attribute: ParameterSyariahAttribute, index: number) => {
      // Map attributeType from API to the expected format
      const typeMapping: Record<string, string> = {
        'Currency Input': 'Currency Input',
        'Dropdown': 'Dropdown',
        'Percentage Input': 'Percentage Input',
        'Text Input': 'Text Input',
      };

      const mappedType = typeMapping[attribute.attributeType] || 'Text Input';

      return {
        id: index + 1,
        label: attribute.attributeLabel,
        type: mappedType,
      };
    });
  }, [parameterSyariahDetail?.attributes]);

  // Auto-save payload
  const autoSavePayload = React.useMemo(() => () => {
    if (!formData || !formFieldConfigs || formFieldConfigs.length === 0) {
      return Promise.resolve(null);
    }

    // Get the selected reference to extract ID
    const selectedReferenceOption = referensiOptions.find((opt) => opt.value === formData.reference);
    if (!selectedReferenceOption?.id) {
      return Promise.resolve(null);
    }

    // Get the selected product to extract name
    const selectedProductOption = parameterSyariahOptions?.find((opt: any) => opt.value === formData.productName);
    if (!selectedProductOption) {
      return Promise.resolve(null);
    }

    // Build attributes array from formFieldConfigs and API detail
    const attributes = formFieldConfigs.map((config, index) => {
      const apiAttribute = parameterSyariahDetail?.attributes?.[index];

      return {
        attributeKey: apiAttribute?.attributeKey || '',
        attributeLabel: config.label,
        attributeType: config.type,
      };
    });

    // Construct the payload
    const saveData = {
      action: 'UPDATE' as 'UPDATE',
      attributes,
      bucketProcessId: processId,
      id: selectedProductOption.id,
      isActive: formData.active,
      productCode: formData.productName,
      productName: selectedProductOption.label,
      productReferenceCode: formData.reference,
      productReferenceName: selectedReferenceOption.label,
    };

    return Promise.resolve(saveData);
  }, [
    formData,
    formFieldConfigs,
    referensiOptions,
    parameterSyariahOptions,
    parameterSyariahDetail?.attributes,
    processId,
  ]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !isCreateMode && !!processId && !!parameterSyariahDetail && !isViewOnly,
    payload: autoSavePayload,
    url: 'parameter.parameterSkemaSyariah.save',
  });

  const {
    mutate: saveParameterSyariah,
    isPending: isStorePending,
  } = useParameterSyariahSave({
    onError: (error) => {
      showNiceModalV2({
        title: `Data gagal disimpan${error?.message ? ': ' + error.message : ''}`,
        type: 'error',
      });
    },
    onSuccess: (data) => {
      const bucketProcessId = data?.data?.bucketProcessId;

      recordActivity({
        activity: isCreateMode ? ActivityType.CREATE : ActivityType.SAVE,
        bucketProcessId: bucketProcessId || '',
        changeAfter: JSON.stringify(data?.data),
        changeBefore: parameterSyariahDetail ? JSON.stringify(parameterSyariahDetail) : '',
        menuCode: 'parameter-skema-syariah',
        module: TypeModule.PARAMETER_SYARIAH,
        process: TypeProcess.PARAMETER_SYARIAH,
        remarks: `successfully ${isCreateMode ? 'created' : 'saved'} parameter syariah`,
      });

      showNiceModalV2({
        onClose: () => {
          // In CREATE mode, redirect to edit page with bucketProcessId and action=ADD
          if (isCreateMode && bucketProcessId) {
            const nextPath = replacePath(MASTER_PARAMETER.PARAMETER_SKEMA_SYARIAH_EDIT_PAGE, {
              processId: bucketProcessId,
            });
            const fullPath = `${nextPath}?tab=SUMMARY&action=ADD`;
            router.push(fullPath);
          }
          // In EDIT mode, just switch to Summary tab
          else if (!isCreateMode && onSaveSuccess) {
            onSaveSuccess();
          }
          // Fallback if something goes wrong
          else {
            if (!bucketProcessId) {
            }
            router.back();
          }
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: (data) => [
        {
          iconName: 'detail',
          onClick: (data) => {
            const nextPath = replacePath('', {
              mode: 'detail',
              processId: data?.module,
            });
            router.push(nextPath);
          },
        },
        ...(isMaker && data.isEditable ? [{
          iconName: 'edit',
          onClick: (data) => {
            showNiceModalV2({
              cancelText: 'Tidak',
              onSubmit: () => {
                const nextPath = replacePath('', {
                  mode: 'edit',
                  processId: data?.module,
                });
                router.push(nextPath);
              },
              submitText: 'Ya',
              title: 'Apakah anda yakin ingin mengedit data ini?',
              type: 'warning',
            });
          },
        }] : []),
        ...(isMaker ? [{
          iconName: 'delete',
          onClick: (data) => {
            showNiceModalV2({
              cancelText: 'Tidak',
              onSubmit: () => {
              },
              submitText: 'Ya',
              title: 'Apakah anda yakin ingin menghapus data ini?',
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

  const handleSave = (formData: {
    productName: string;
    reference: string;
    active: boolean;
    formFieldConfigs: Array<{
      id: number;
      label: string;
      type: string;
    }>;
  }) => {
    // Validation
    if (!formData.productName?.trim()) {
      showNiceModalV2({
        title: 'Validation Error: Nama Produk is required',
        type: 'warning',
      });
      return;
    }

    if (!formData.reference?.trim()) {
      showNiceModalV2({
        title: 'Validation Error: Referensi is required',
        type: 'warning',
      });
      return;
    }

    // Get the selected reference to extract ID
    const selectedReferenceOption = referensiOptions.find((opt) => opt.value === formData.reference);
    if (!selectedReferenceOption?.id) {
      showNiceModalV2({
        title: 'Reference not selected',
        type: 'warning',
      });
      return;
    }
    // Get the selected product to extract name
    const selectedProductOption = parameterSyariahOptions?.find((opt: any) => opt.value === formData.productName);
    if (!selectedProductOption) {
      showNiceModalV2({
        title: 'Product not selected',
        type: 'warning',
      });
      return;
    }

    // Build attributes array from formFieldConfigs and API detail
    const attributes = formData.formFieldConfigs.map((config, index) => {
      // Find corresponding attribute from API to get the key
      const apiAttribute = parameterSyariahDetail?.attributes?.[index];

      return {
        attributeKey: apiAttribute?.attributeKey || '',
        attributeLabel: config.label,
        attributeType: config.type,
      };
    });
    // Construct the payload
    const saveData = {
      action: (processId ? 'UPDATE' : 'ADD') as 'ADD' | 'UPDATE',
      attributes,
      ...(processId && { bucketProcessId: processId }),
      id: selectedProductOption.id,
      isActive: formData.active,
      productCode: formData.productName,
      productName: selectedProductOption.label,
      productReferenceCode: formData.reference,
      productReferenceName: selectedReferenceOption.label,
    };

    saveParameterSyariah(saveData);
  };

  // Handler untuk ketika referensi dipilih
  const handleReferenceChange = (referenceKey: string) => {
    // Cari ID dari reference key
    const selectedOption = referensiOptions.find((option) => option.value === referenceKey);
    if (selectedOption) {
      // Gunakan ID jika tersedia, jika tidak gunakan key sebagai fallback
      // Note: Jika menggunakan key (string), API akan error kecuali backend support fetch by key
      const idToUse = selectedOption.id;
      if (idToUse) {
        setSelectedReferenceId(idToUse);
      } else {
        console.error('ID tidak tersedia untuk reference:', referenceKey);
        setSelectedReferenceId(null);
      }
    } else {
      setSelectedReferenceId(null);
    }
  };

  return {
    formFieldConfigsFromApi,
    handleReferenceChange,
    handleSave,
    isAutoSaveFetching,
    isLoading: isLoading || isReferensiLoading || isDetailLoading,
    isStorePending,
    isViewOnly,
    page,
    pageSize,
    parameterSyariahDetail,
    parameterSyariahOptions,
    referensiOptions,
    selectedReferenceId,
    setPage,
    setPageSize,
    tableData: emptyTableData?.contents || [],
    tableHeader,
    totalPage: emptyTableData?.page?.totalPage || 1,
  };
};

export default useTabProcessSyariah;
