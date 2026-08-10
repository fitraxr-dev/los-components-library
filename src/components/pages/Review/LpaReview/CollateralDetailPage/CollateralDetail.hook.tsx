import { useContext, useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { LegendToggleOutlined } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';
import { DocumentCreationResponseDtoDocumentParentEnum } from '@/services/openapi/lpa-service';

import DetailAset from '@/components/pages/MaintenanceData/MaintenanceDebtor/LpaPage/LpaPageDetail/DetailAgunan/component/DetailAset/DetailAset';
import { DOCUMENT_SCHEMA } from '@/components/shared/SmiComponent/FormUploadDocument/FormUploadDocument.constants';

import useGetCurrentModule from '../hooks/useGetCurrentModule';

import {
  type as collaterralType,
  label,
  TABLEHEADERUTILITY,
  TABLEHEADERINVENTORY,
  TABLEHEADERSHIP,
  TABLEHEADERVEHICLE,
  TABLEHEADERMACHINE,
  TABLEHEADERBUILDING,
  TABLEHEADERLAND,
  modal,
  collateralDetailValidation,
} from './CollateralDetail.constants';
import useDeleteBoatCollateral from './hooks/useDeleteBoatCollateral';
import useDeleteBuildingCollateral from './hooks/useDeleteBuildingCollateral';
import useDeleteCollateral from './hooks/useDeleteCollateral';
import useDeleteComplementaryFacilitiesCollateral from './hooks/useDeleteComplementaryFacilitiesCollateral';
import useDeleteInventoryCollateral from './hooks/useDeleteInventoryCollateral';
import useDeleteLandCollateral from './hooks/useDeleteLandCollateral';
import useDeleteMachineEquipmentCollateral from './hooks/useDeleteMachineEquipmentCollateral';
import useDeleteVehicleCollateral from './hooks/useDeleteVehicleCollateral';
import useGetCollateralsList from './hooks/useGetCollateralsList';
import useGetDetailCollateral from './hooks/useGetDetailCollateral';
import useSaveCollateral from './hooks/useSaveCollateral';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useCollateralDetail = () => {
  const { processId, parentId, id }: { processId: string; parentId: string; id: string } = useParams();
  const [appState] = useApp();
  const { recordActivity } = useRecordLog();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [additionalInfoContainer, setadditionalInfoContainer] = useState(null);
  const { module, process } = useGetCurrentModule();
  const router = useCustomRouter();
  const path = usePathname();
  const pathArray = path.split('/');
  const { debiturName } = useIdentity();
  const [lastSavedPayload, setLastSavedPayload] = useState<any>(null);
  const [lastDeletePayload, setLastDeletePayload] = useState<any>(null);

  const steps = appState.stepper.steps;
  const viewOnly = !steps.find((step) => step.urlPath === 'review-kjpp')?.enable;
  const [document, setDocuments] = useState<any>({
    document: {
      extension: '',
      file: null,
      name: '',
      url: '',
    },
    documentCategory: '',
    documentDate: '',
    documentGroup: {
      id: '',
      label: '',
    },
    documentName: '',
    documentNumber: '',
    documentType: {
      id: '',
      label: '',
    },
  });


  const methods = useForm({
    defaultValues: {
      document: {
        extension: '',
        file: null,
        name: '',
        url: '',
      },
      documentCategory: '',
      documentDate: '',
      documentGroup: {
        id: '',
        label: '',
      },
      documentName: '',
      documentNumber: '',
      documentType: {
        id: '',
        label: '',
      },
      uploadBy: '',
      uploadDate: '',
    } as any,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(DOCUMENT_SCHEMA), // if there is schema for validation
    // values: useMemo(() => initialData, [initialData]), // if there is initial data
  });

  const { register, watch, setValue, reset, handleSubmit, control, formState } = useForm({
    defaultValues: {
      assesmentObject: '',
      bucketProcessId: '',
      buildingTypeOtherRemark: '',
      buildingTypeRemark: '',
      coordinate: '',
      description: '',
      detailLocation: '',
      document: undefined,
      id: '',
      indicationLiquidationCurrencyCode: 'IDR',
      indicationLiquidationFxRateSource: '',
      indicationLiquidationFxRateToIdr: '',
      indicationLiquidationIdr: '',
      indicationLiquidationValue: '',
      marketValue: '',
      marketValueCurrencyCode: 'IDR',
      marketValueFxRateSource: '',
      marketValueFxRateToIdr: '',
      marketValueIdr: '',
      module: '',
      objectLocation: '',
      process: '',
      proofOwnership: '',
      propertyTypeRemark: '',
      readonly: viewOnly,
      type: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(collateralDetailValidation),
  });
  const watchField = watch();

  // Set dirty message when main or document forms have unsaved changes
  useEffect(() => {
    if (!viewOnly && (formState.isDirty || methods.formState.isDirty)) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [formState.isDirty, methods.formState.isDirty, viewOnly, setDirtyMsg]);

  // Clear dirty message on unmount
  useEffect(() => {
    return () => {
      setDirtyMsg(undefined);
    };
  }, [setDirtyMsg]);

  // const { data: typeBuilding } = useGetParameterList('typeBuildingCollateralBuildingLPA');
  const { data: typeProperty } = useGetParameterList('typePropertyCollateralLandBuildingLPA');
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, {
    label: 'value1',
    rate: 'value2',
    value: 'key',
  });
  const { data, isLoading, isSuccess } = useGetDetailCollateral({
    bucketProcessId: processId,
    id,
    module,
    process,
  });

  // Record activity when collateral detail is loaded
  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: `view collateral detail (collateralId: ${id})`,
      });
    }
  }, [data, id, processId, module, process, recordActivity]);

  const typeCollateral = collaterralType[data?.type];

  const {
    data: collateralList,
  } = useGetCollateralsList({
    payload: { bucketProcessId: processId, collateralId: id, module, process }, type: typeCollateral,
  }, {
    enabled: !!!data?.type,
  });

  const { mutate } = useSaveCollateral({
    onError: () => {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess: () => {
      // Record activity for saving collateral
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({
          marketValue: lastSavedPayload?.marketValue,
          objectLocation: lastSavedPayload?.objectLocation,
          type: lastSavedPayload?.type,
        }),
        changeBefore: JSON.stringify({
          marketValue: data?.marketValue,
          objectLocation: data?.objectLocation,
          type: data?.type,
        }),
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'successfully saved collateral detail',
      });

      setDirtyMsg(undefined);
      showNiceModalV2({
        onClose() {
          router.back();
        }, type: 'success',
      });
    },
  });

  const { mutate: deleteCollateral, isSuccess: deleteIsSuccess } = useDeleteCollateral({
    onError: () => {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess: () => {
      // Record activity for deleting collateral
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({ status: 'deleted' }),
        changeBefore: JSON.stringify({
          collateralId: lastDeletePayload?.id,
          type: 'general',
        }),
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'successfully deleted collateral',
      });

      setDirtyMsg(undefined);
      showNiceModalV2({ type: 'success' });
    },
  });

  const { mutate: deleteBoatCollateral, isSuccess: deleteBoatIsSuccess } = useDeleteBoatCollateral({
    onError: () => {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess: () => {
      // Record activity for deleting boat collateral
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({ status: 'deleted' }),
        changeBefore: JSON.stringify({
          collateralId: lastDeletePayload?.id,
          type: 'boat',
        }),
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'successfully deleted boat collateral',
      });

      setDirtyMsg(undefined);
      showNiceModalV2({ type: 'success' });
    },
  });

  const { mutate: deleteBuildingCollateral, isSuccess: deleteBuildingIsSuccess } = useDeleteBuildingCollateral({
    onError: () => {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess: () => {
      // Record activity for deleting building collateral
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({ status: 'deleted' }),
        changeBefore: JSON.stringify({
          collateralId: lastDeletePayload?.id,
          type: 'building',
        }),
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'successfully deleted building collateral',
      });

      setDirtyMsg(undefined);
      showNiceModalV2({ type: 'success' });
    },
  });

  const {
    mutate: deleteComplementaryFacilitiesCollateral,
    isSuccess: deleteComplementaryFacilitiesIsSuccess,
  } = useDeleteComplementaryFacilitiesCollateral({
    onError: () => {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess: () => {
      // Record activity for deleting complementary facilities collateral
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({ status: 'deleted' }),
        changeBefore: JSON.stringify({
          collateralId: lastDeletePayload?.id,
          type: 'complementary_facilities',
        }),
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'successfully deleted complementary facilities collateral',
      });

      setDirtyMsg(undefined);
      showNiceModalV2({ type: 'success' });
    },
  });

  const { mutate: deleteInventoryCollateral, isSuccess: deleteInventoryIsSuccess } = useDeleteInventoryCollateral({
    onError: () => {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess: () => {
      // Record activity for deleting inventory collateral
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({ status: 'deleted' }),
        changeBefore: JSON.stringify({
          collateralId: lastDeletePayload?.id,
          type: 'inventory',
        }),
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'successfully deleted inventory collateral',
      });

      setDirtyMsg(undefined);
      showNiceModalV2({ type: 'success' });
    },
  });

  const {
    mutate: deleteMachineEquipmentCollateral,
    isSuccess: deleteMachineEquipmentIsSuccess,
  } = useDeleteMachineEquipmentCollateral({
    onError: () => {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess: () => {
      // Record activity for deleting machine equipment collateral
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({ status: 'deleted' }),
        changeBefore: JSON.stringify({
          collateralId: lastDeletePayload?.id,
          type: 'machine_equipment',
        }),
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'successfully deleted machine equipment collateral',
      });

      setDirtyMsg(undefined);
      showNiceModalV2({ type: 'success' });
    },
  });

  const { mutate: deleteVehicleCollateral, isSuccess: deleteVehicleIsSuccess } = useDeleteVehicleCollateral({
    onError: () => {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess: () => {
      // Record activity for deleting vehicle collateral
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({ status: 'deleted' }),
        changeBefore: JSON.stringify({
          collateralId: lastDeletePayload?.id,
          type: 'vehicle',
        }),
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'successfully deleted vehicle collateral',
      });

      setDirtyMsg(undefined);
      showNiceModalV2({ type: 'success' });
    },
  });

  const { mutate: deleteLandCollateral, isSuccess: deleteLandIsSuccess } = useDeleteLandCollateral({
    onError: () => {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess: () => {
      // Record activity for deleting land collateral
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({ status: 'deleted' }),
        changeBefore: JSON.stringify({
          collateralId: lastDeletePayload?.id,
          type: 'land',
        }),
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'successfully deleted land collateral',
      });

      setDirtyMsg(undefined);
      showNiceModalV2({ type: 'success' });
    },
  });

  // Register DetailAset dengan ID yang sama seperti di maintenance customer
  useEffect(() => {
    NiceModal.register('DetailAgunanTanah', DetailAset);
  }, []);

  const handleDetailModal = (item: any, type: string, assetType?: string) => {
    // Untuk LAND_BUILDING, kita perlu menambahkan property typeAgunan ke item
    // untuk membedakan apakah itu LAND atau BUILDING
    const itemToPass = assetType ? { ...item, typeAgunan: assetType } : item;

    console.log('Opening detail modal with:', { itemToPass, type });

    // Gunakan ID yang sama dengan yang digunakan di DetailAset.tsx (MODAL.DETAIL_AGUNAN_TANAH = 'DetailAgunanTanah')
    NiceModal.show('DetailAgunanTanah', {
      item: itemToPass,
      typeAgunan: type,
    });
  };

  useEffect(() => {
    const {
      documentExtension,
      document,
      fileName,
      documentGroupLabel,
      documentGroup,
      documentType,
      documentTypeLabel,
      createdBy,
      createdDate,
    } = data?.document || {};

    if (data && isSuccess) {
      const newData = structuredClone(data.document || {});
      const res = Object.assign(newData, {
        document: document ? {
          extension: `.${documentExtension}`,
          name: fileName.split('.')?.[0],
          url: document,
        } : null,
        documentGroup: {
          id: documentGroup,
          label: documentGroupLabel,
        },
        documentType: {
          id: documentType,
          label: documentTypeLabel,
        },
        readonly: viewOnly,
        uploadBy: createdBy,
        uploadDate: createdDate,
      });
      setDocuments(res);
      methods.reset(res);

      const setDefaultCurrency = (value: string) => {
        let tempValue = value;
        if (value === '0.00') {
          tempValue = '';
        }
        return tempValue;
      };

      // Set default currency values from API response
      const formData = {
        ...data,
        document: res,
        indicationLiquidationCurrencyCode: data.indicationLiquidationCurrencyCode || 'IDR',
        indicationLiquidationFxRateSource: data.indicationLiquidationFxRateSource || '',
        indicationLiquidationFxRateToIdr: setDefaultCurrency(data.indicationLiquidationFxRateToIdr),
        indicationLiquidationIdr: '',
        marketValueCurrencyCode: data.marketValueCurrencyCode || 'IDR',
        marketValueFxRateSource: data.marketValueFxRateSource || '',
        marketValueFxRateToIdr: setDefaultCurrency(data.marketValueFxRateToIdr),
        marketValueIdr: '',
      };
      reset(formData);
    }
  }, [data, isSuccess, isLoading]);

  // Auto-calculate IDR values when form data changes
  useEffect(() => {
    // Helper: get fallback rate from currencyDropdownList when FxRate field is empty
    const getFallbackRate = (currencyCode: string): string => {
      const found = currencyDropdownList?.find((dt) => dt.value === currencyCode);
      return found?.rate ?? '';
    };

    // Calculate market value in IDR
    if (watchField.marketValue && watchField.marketValueCurrencyCode) {
      if (watchField.marketValueCurrencyCode === 'USD') {
        // If fxRate is empty, use fallback rate from currencyDropdownList
        const fxRate = watchField.marketValueFxRateToIdr || getFallbackRate('USD');
        if (fxRate) {
          // Auto-fill kurs field if it was empty
          if (!watchField.marketValueFxRateToIdr) {
            setValue('marketValueFxRateToIdr', fxRate);
          }
          const marketValue = parseFloat((watchField.marketValue || '0').replace(/,/g, ''));
          const exchangeRate = parseFloat(fxRate.toString().replace(/,/g, ''));
          const calculatedValue = marketValue * exchangeRate;
          setValue('marketValueIdr', calculatedValue.toString());
        }
      } else if (watchField.marketValueCurrencyCode === 'IDR') {
        setValue('marketValueIdr', watchField.marketValue || '0');
      }
    }

    // Calculate liquidation value in IDR
    if (watchField.indicationLiquidationValue && watchField.indicationLiquidationCurrencyCode) {
      if (watchField.indicationLiquidationCurrencyCode === 'USD') {
        // If fxRate is empty, use fallback rate from currencyDropdownList
        const fxRate = watchField.indicationLiquidationFxRateToIdr || getFallbackRate('USD');
        if (fxRate) {
          // Auto-fill kurs field if it was empty
          if (!watchField.indicationLiquidationFxRateToIdr) {
            setValue('indicationLiquidationFxRateToIdr', fxRate);
          }
          const liquidationValue = parseFloat((watchField.indicationLiquidationValue || '0').replace(/,/g, ''));
          const exchangeRate = parseFloat(fxRate.toString().replace(/,/g, ''));
          const calculatedValue = liquidationValue * exchangeRate;
          setValue('indicationLiquidationIdr', calculatedValue.toString());
        }
      } else if (watchField.indicationLiquidationCurrencyCode === 'IDR') {
        setValue('indicationLiquidationIdr', watchField.indicationLiquidationValue || '0');
      }
    }
  }, [
    watchField.marketValue,
    watchField.marketValueCurrencyCode,
    watchField.marketValueFxRateToIdr,
    watchField.indicationLiquidationValue,
    watchField.indicationLiquidationCurrencyCode,
    watchField.indicationLiquidationFxRateToIdr,
    currencyDropdownList,
    setValue
  ]);

  const handleSaveLpaDetail = async (formData: any) => {

    const {
      assesmentObject,
      buildingTypeOtherRemark,
      buildingTypeRemark,
      coordinate,
      detailLocation,
      id,
      indicationLiquidationCurrencyCode,
      indicationLiquidationFxRateToIdr,
      indicationLiquidationFxRateSource,
      indicationLiquidationIdr,
      indicationLiquidationValue,
      marketValue,
      marketValueCurrencyCode,
      marketValueFxRateToIdr,
      marketValueFxRateSource,
      marketValueIdr,
      module,
      objectLocation,
      process,
      proofOwnership,
      propertyTypeRemark,
      type,
    } = formData;

    const additionalInformation = await convertToDocx(additionalInfoContainer);
    let documentData = undefined;

    if (type === collaterralType.BUSINESS || type === collaterralType.MOVING_ASSETS) {
      const documentValue = methods.getValues('document');

      // Extract the actual file - handle both direct File object and structured object
      let documentFile;
      let documentUrl;
      let documentExtension;
      let fileName;

      if (documentValue instanceof File) {
        // Direct file object
        documentFile = documentValue;
        fileName = documentValue.name;
        documentExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
      } else if (documentValue && typeof documentValue === 'object') {
        // Structured object with file/url properties
        documentFile = documentValue.file;
        documentUrl = documentValue.url;
        documentExtension = documentValue.extension?.replace('.', '') || '';
        fileName = documentValue.name || '';
      }

      const documentType = methods.getValues('documentType');
      const documentNumber = methods.getValues('documentNumber');
      const documentDate = methods.getValues('documentDate');

      const documentTypeLabel = documentType?.label?.length === 0
        || documentType?.label === undefined
        || documentType?.label === null
        ? '[Jenis Dokumen]'
        : documentType?.label;
      const documentNumberLabel = documentNumber?.length === 0 ? '[Dokumen Number]' : documentNumber;
      const documentDateLabel = documentDate ? dayjs(documentDate).format('DDMMYYYY') : '[Tanggal Dokumen]';

      const formattedFileName = `${documentTypeLabel}_${debiturName}_${documentNumberLabel}_${documentDateLabel}`;

      documentData = {
        bucketProcessId: processId,
        debtorId: null,
        description: null,
        document: documentFile || documentUrl,
        documentCategory: methods.getValues('documentCategory'),
        documentDate: methods.getValues('documentDate'),
        documentExtension: documentExtension,
        documentGroup: methods.getValues('documentGroup.id'),
        documentName: methods.getValues('documentName'),
        documentNumber: methods.getValues('documentNumber'),
        documentParent: DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL,
        documentType: methods.getValues('documentType.id'),
        fileName: formattedFileName,
        module: TypeModule.LPA,
        ownerId: null,
        ownership: null,
        process: TypeProcess.LPA_REVIEW,
      };
    }

    function removeNullProperties(obj) {
      for (const key in obj) {
        if (obj[key] === null || obj[key] === undefined) {
          delete obj[key];
        }
      }
      return obj;
    }

    // Prepare document field - extract file and stringify metadata separately
    let documentField = undefined;
    let documentFileField = undefined;

    if (type === collaterralType.BUSINESS || type === collaterralType.MOVING_ASSETS) {
      if (documentData) {
        // Extract the file from documentData to send separately
        const { document: documentFile, ...documentMetadata } = documentData;

        // If there's a file, add it as a separate field and include reference in metadata
        if (documentFile instanceof File) {
          documentFileField = documentFile;
          // Include file reference in metadata
          documentMetadata.document = documentFile.name;
        } else if (documentFile) {
          // If it's a URL (existing document), include it in metadata
          documentMetadata.document = documentFile;
        }

        // Stringify the metadata (without the File object)
        documentField = JSON.stringify(documentMetadata);
      }
    }

    const payload = removeNullProperties({
      assesmentObject,
      bucketProcessId: processId,
      buildingTypeOtherRemark,
      buildingTypeRemark,
      coordinate,
      description: additionalInformation,
      detailLocation,
      document: documentField,
      documentFile: documentFileField, // Send file separately
      id,
      indicationLiquidationCurrencyCode,
      indicationLiquidationFxRateSource,
      indicationLiquidationFxRateToIdr: indicationLiquidationCurrencyCode === 'USD' && indicationLiquidationFxRateToIdr ? indicationLiquidationFxRateToIdr.replace(/,/g, '') : undefined,
      indicationLiquidationIdr: indicationLiquidationCurrencyCode === 'USD' && indicationLiquidationIdr ? indicationLiquidationIdr.replace(/,/g, '') : undefined,
      indicationLiquidationValue: indicationLiquidationValue ? indicationLiquidationValue.replace(/,/g, '') : undefined,
      marketValue: marketValue ? marketValue.replace(/,/g, '') : undefined,
      marketValueCurrencyCode,
      marketValueFxRateSource,
      marketValueFxRateToIdr: marketValueCurrencyCode === 'USD' && marketValueFxRateToIdr ? marketValueFxRateToIdr.replace(/,/g, '') : undefined,
      marketValueIdr: marketValueCurrencyCode === 'USD' && marketValueIdr ? marketValueIdr.replace(/,/g, '') : undefined,
      module,
      objectLocation,
      parentId,
      process,
      proofOwnership,
      propertyTypeRemark,
      type,
    });

    setLastSavedPayload(payload);
    mutate(payload);
  };

  // Untuk LAND_BUILDING, kita perlu mengecek collateralType untuk menentukan handling yang tepat
  const isLandBuilding = typeCollateral === collaterralType.LAND_BUILDING;

  const tableHeaderLand: TableHeader[] = [
    ...TABLEHEADERLAND,
    {
      key: 'action',
      label: 'Action',
      options: viewOnly ? [
        {
          iconName: 'detail',
          onClick: (row) => {
            // Record activity for viewing detail
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: processId || '',
              changeAfter: '',
              changeBefore: '',
              menuCode: 'lpa-review',
              module: module,
              process: process,
              remarks: `view land collateral detail (landId: ${row.id})`,
            });
            handleDetailModal(row, isLandBuilding ? collaterralType.LAND_BUILDING : collaterralType.LAND, isLandBuilding ? 'LAND' : undefined);
          },
        },
      ] : [
        {
          iconName: 'edit',
          onClick: (row) => {
            // Record activity for viewing edit modal
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: processId || '',
              changeAfter: '',
              changeBefore: '',
              menuCode: 'lpa-review',
              module: module,
              process: process,
              remarks: `view edit land collateral modal (landId: ${row.id})`,
            });
            handleEditModal(row, collaterralType.LAND);
          },
        },
        {
          iconName: 'delete',
          onClick: (row) => { handleDeleteModal(row.id, collaterralType.LAND); },
        },
        {
          iconName: 'detail',
          onClick: (row) => {
            // Record activity for viewing detail
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: processId || '',
              changeAfter: '',
              changeBefore: '',
              menuCode: 'lpa-review',
              module: module,
              process: process,
              remarks: `view land collateral detail (landId: ${row.id})`,
            });
            handleDetailModal(row, isLandBuilding ? collaterralType.LAND_BUILDING : collaterralType.LAND, isLandBuilding ? 'LAND' : undefined);
          },
        },
      ],
      sx: { minWidth: '10vw' },
      type: 'action',
    },
  ];

  const tableHeaderBuilding: TableHeader[] = [
    ...TABLEHEADERBUILDING,
    {
      key: 'action',
      label: 'Action',
      options: viewOnly ? [
        {
          iconName: 'detail',
          onClick: (row) => { handleDetailModal(row, collaterralType.BUILDING); },
        },
      ] : [
        {
          iconName: 'edit',
          onClick: (row) => { handleEditModal(row, collaterralType.BUILDING); },
        },
        {
          iconName: 'delete',
          onClick: (row) => { handleDeleteModal(row.id, collaterralType.BUILDING); },
        },
        {
          iconName: 'detail',
          onClick: (row) => { handleDetailModal(row, collaterralType.BUILDING); },
        },
      ],
      sx: { minWidth: '10vw' },
      type: 'action',
    },
  ];

  // TableHeader khusus untuk Building dalam konteks LAND_BUILDING
  const tableHeaderBuildingForLandBuilding: TableHeader[] = [
    ...TABLEHEADERBUILDING,
    {
      key: 'action',
      label: 'Action',
      options: viewOnly ? [
        {
          iconName: 'detail',
          onClick: (row) => { handleDetailModal(row, collaterralType.LAND_BUILDING, 'BUILDING'); },
        },
      ] : [
        {
          iconName: 'edit',
          onClick: (row) => { handleEditModal(row, collaterralType.BUILDING); },
        },
        {
          iconName: 'delete',
          onClick: (row) => { handleDeleteModal(row.id, collaterralType.BUILDING); },
        },
        {
          iconName: 'detail',
          onClick: (row) => { handleDetailModal(row, collaterralType.LAND_BUILDING, 'BUILDING'); },
        },
      ],
      sx: { minWidth: '10vw' },
      type: 'action',
    },
  ];

  const tableHeaderMachine: TableHeader[] = [
    ...TABLEHEADERMACHINE,
    {
      key: 'action',
      label: 'Action',
      options: viewOnly ? [
        {
          iconName: 'detail',
          onClick: (row) => { handleDetailModal(row, collaterralType.MACHINES_EQUIPMENT); },
        },
      ] : [
        {
          iconName: 'edit',
          onClick: (row) => { handleEditModal(row, collaterralType.MACHINES_EQUIPMENT); },
        },
        {
          iconName: 'delete',
          onClick: (row) => { handleDeleteModal(row.id, collaterralType.MACHINES_EQUIPMENT); },
        },
        {
          iconName: 'detail',
          onClick: (row) => { handleDetailModal(row, collaterralType.MACHINES_EQUIPMENT); },
        },
      ],
      sx: { minWidth: '10vw' },
      type: 'action',
    },
  ];

  const tableHeaderUtility: TableHeader[] = [
    ...TABLEHEADERUTILITY,
    {
      key: 'action',
      label: 'Action',
      options: viewOnly ? [
        {
          iconName: 'detail',
          onClick: (row) => { handleDetailModal(row, collaterralType.COMPLEMENTARY_FACILITIES); },
        },
      ] : [
        {
          iconName: 'edit',
          onClick: (row) => { handleEditModal(row, collaterralType.COMPLEMENTARY_FACILITIES); },
        },
        {
          iconName: 'delete',
          onClick: (row) => { handleDeleteModal(row.id, collaterralType.COMPLEMENTARY_FACILITIES); },
        },
        {
          iconName: 'detail',
          onClick: (row) => { handleDetailModal(row, collaterralType.COMPLEMENTARY_FACILITIES); },
        },
      ],
      sx: { minWidth: '10vw' },
      type: 'action',
    },
  ];

  const tableHeaderShip: TableHeader[] = [
    ...TABLEHEADERSHIP,
    {
      key: 'action',
      label: 'Action',
      options: viewOnly ? [
        {
          iconName: 'detail',
          onClick: (row) => { handleDetailModal(row, collaterralType.BOAT); },
        },
      ] : [
        {
          iconName: 'edit',
          onClick: (row) => { handleEditModal(row, collaterralType.BOAT); },
        },
        {
          iconName: 'delete',
          onClick: (row) => { handleDeleteModal(row.id, collaterralType.BOAT); },
        },
        {
          iconName: 'detail',
          onClick: (row) => { handleDetailModal(row, collaterralType.BOAT); },
        },
      ],
      sx: { minWidth: '10vw' },
      type: 'action',
    },
  ];

  const tableHeaderInventory: TableHeader[] = [
    ...TABLEHEADERINVENTORY,
    {
      key: 'action',
      label: 'Action',
      options: viewOnly ? [
        {
          iconName: 'detail',
          onClick: (row) => { handleDetailModal(row, collaterralType.INVENTORY); },
        },
      ] : [
        {
          iconName: 'edit',
          onClick: (row) => { handleEditModal(row, collaterralType.INVENTORY); },
        },
        {
          iconName: 'delete',
          onClick: (row) => { handleDeleteModal(row.id, collaterralType.INVENTORY); },
        },
        {
          iconName: 'detail',
          onClick: (row) => { handleDetailModal(row, collaterralType.INVENTORY); },
        },
      ],
      sx: { minWidth: '10vw' },
      type: 'action',
    },
  ];

  const tableHeaderVehicle: TableHeader[] = [
    ...TABLEHEADERVEHICLE,
    {
      key: 'action',
      label: 'Action',
      options: viewOnly ? [
        {
          iconName: 'detail',
          onClick: (row) => { handleDetailModal(row, collaterralType.VEHICLES); },
        },
      ] : [
        {
          iconName: 'edit',
          onClick: (row) => { handleEditModal(row, collaterralType.VEHICLES); },
        },
        {
          iconName: 'delete',
          onClick: (row) => { handleDeleteModal(row.id, collaterralType.VEHICLES); },
        },
        {
          iconName: 'detail',
          onClick: (row) => { handleDetailModal(row, collaterralType.VEHICLES); },
        },
      ],
      sx: { minWidth: '10vw' },
      type: 'action',
    },
  ];


  const tableHeader = {
    BOAT: tableHeaderShip,
    BUILDING: tableHeaderBuilding,
    COMPLEMENTARY_FACILITIES: tableHeaderUtility,
    INVENTORY: tableHeaderInventory,
    LAND: tableHeaderLand,
    LAND_BUILDING: tableHeaderLand,
    MACHINES_EQUIPMENT: tableHeaderMachine,
    VEHICLES: tableHeaderVehicle,
  };

  const handleEditModal = (data: any, type: string) => {
    NiceModal.show(modal[type], { id: data.id, parentId: id, processId, viewOnly });
  };

  const handleDeleteModal = (deleteId: string, type: string) => {

    showNiceModalV2({
      onSubmit() {
        const payload = { bucketProcessId: processId, id: deleteId, module, process };
        setLastDeletePayload(payload);

        switch (type) {
          case collaterralType.BOAT:
            deleteBoatCollateral(payload);
            break;
          case collaterralType.BUILDING:
            deleteBuildingCollateral(payload);
            break;
          case collaterralType.INVENTORY:
            deleteInventoryCollateral(payload);
            break;
          case collaterralType.COMPLEMENTARY_FACILITIES:
            deleteComplementaryFacilitiesCollateral(payload);
            break;
          case collaterralType.LAND:
            deleteLandCollateral(payload);
            break;
          case collaterralType.MACHINES_EQUIPMENT:
            deleteMachineEquipmentCollateral(payload);
            break;
          case collaterralType.VEHICLES:
            deleteVehicleCollateral(payload);
            break;
          default:
            deleteCollateral(payload);
            break;
        }
      }, title: 'Apakah anda yaking ingin menghapus data ini?', type: 'warning',
    });
  };

  const handleCloseButton = () => {
    router.back();
  };

  return {
    additionalInfoContainer,
    collateralList,
    collateralType: typeCollateral,
    control,
    currencyDropdownList,
    data,
    document,
    formState,
    handleCloseButton,
    handleEditModal,
    handleSaveLpaDetail,
    handleSubmit,
    id,
    isLoading,
    methods,
    parentId,
    processId,
    register,
    setDocuments,
    setValue,
    setadditionalInfoContainer,
    tableHeader,
    tableHeaderBuildingForLandBuilding,
    typeBuilding: typeProperty,
    typeProperty,
    viewOnly,
    watchField,
  };
};

export default useCollateralDetail;
