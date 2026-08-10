import { useEffect, useMemo, useState } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';


import { modal } from '../../CollateralDetail.constants';
import useGetBuildingDetailCollateral from '../../hooks/useGetBuildingDetailCollateral';
import useSaveCollateralBuilding from '../../hooks/useSaveBuildingDetailCollateral';
import { DOCUMENT_SCHEMA } from '../FormUploadDocument/FormUploadDocument.constants';

import { buildingValidation } from './ModalBuilding.constants';


const useModalBuilding = ((
  {
    processId,
    parentId,
    id = null,
    viewOnly = false }: { processId: string; parentId: string; id: string; viewOnly: boolean }
) => {
  const theme = useTheme();
  const modalId = modal.BUILDING;
  const { visible } = useModal(modalId);
  const { debiturName } = useIdentity();
  const { recordActivity } = useRecordLog();
  const [lastSavedPayload, setLastSavedPayload] = useState<any>(null);

  const { control, handleSubmit, setValue, reset, formState, watch } = useForm({
    defaultValues: {
      allotment: null,
      builtYear: null,
      condition: null,
      document: null,
      id: null,
      imbDate: null,
      imbNumber: null,
      indicationLiquidationValue: null,
      marketValue: null,
      name: null,
      parentId: parentId,
      publishedPlace: null,
      remark: null,
      wide: null,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(buildingValidation),
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
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(DOCUMENT_SCHEMA), // if there is schema for validation
    // values: useMemo(() => initialData, [initialData]), // if there is initial data
  });

  const isValidForm = useMemo(() => {
    const uploadDocumentValues = methods.getValues();
    const buildingValues = watch();

    const hasDocument = uploadDocumentValues.document?.file || uploadDocumentValues.document?.url;

    const filledUploadFields = [
      uploadDocumentValues.documentCategory,
      uploadDocumentValues.documentGroup?.id,
      uploadDocumentValues.documentType?.id,
      uploadDocumentValues.documentNumber,
      uploadDocumentValues.documentDate,
      hasDocument,
    ].filter(Boolean).length;

    const totalUploadFields = 6;
    const isUploadSectionValid = filledUploadFields === 0 || filledUploadFields === totalUploadFields;

    const filledBuildingFields = [
      buildingValues.allotment,
      buildingValues.builtYear,
      buildingValues.condition,
      buildingValues.imbDate,
      buildingValues.imbNumber,
      buildingValues.indicationLiquidationValue,
      buildingValues.marketValue,
      buildingValues.name,
      buildingValues.publishedPlace,
      buildingValues.remark,
      buildingValues.wide,
    ].filter(Boolean).length;

    const hasAnyBuildingField = filledBuildingFields > 0;
    const hasCompleteUploadSection = filledUploadFields === totalUploadFields;

    if (id !== null) {
      return formState.isValid && isUploadSectionValid;
    }

    const isFormValid = (hasAnyBuildingField && filledUploadFields === 0) || hasCompleteUploadSection;

    return isFormValid && isUploadSectionValid;
  }, [formState.isValid, methods.getValues(), watch(), id]);

  const { mutate, isSuccess: saveSuccess } = useSaveCollateralBuilding({
    onSuccess: () => {
      // Record activity for saving building collateral
      const activityType = id !== null ? ActivityType.EDIT : ActivityType.CREATE;
      recordActivity({
        activity: activityType,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({
          indicationLiquidationValue: lastSavedPayload?.indicationLiquidationValue,
          marketValue: lastSavedPayload?.marketValue,
          name: lastSavedPayload?.name,
        }),
        changeBefore: id !== null ? JSON.stringify({
          indicationLiquidationValue: data?.indicationLiquidationValue,
          marketValue: data?.marketValue,
          name: data?.name,
        }) : '',
        menuCode: 'lpa-review',
        module: TypeModule.LPA,
        process: TypeProcess.LPA_REVIEW,
        remarks: `successfully ${id !== null ? 'edited' : 'created'} building collateral`,
      });

      showNiceModalV2({ type: 'success' });
      closeNiceModal(modalId);
    },
  });

  const { data, isLoading, isSuccess } = useGetBuildingDetailCollateral({
    bucketProcessId: processId,
    id,
    module: TypeModule.LPA,
    process: TypeProcess.LPA_REVIEW,
  }, { enabled: id !== null });

  // Record activity when detail is loaded (for edit mode)
  useEffect(() => {
    if (data && id !== null) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'lpa-review',
        module: TypeModule.LPA,
        process: TypeProcess.LPA_REVIEW,
        remarks: `view building collateral detail for edit (buildingId: ${id})`,
      });
    }
  }, [data, id, processId, recordActivity]);

  useEffect(() => {
    const {
      documentExtension,
      document,
      fileName,
      documentGroupLabel,
      documentGroup,
      documentType,
      documentTypeLabel,
    } = data?.document || {};

    if (data && isSuccess) {
      const newData = structuredClone(data.document || {});
      const fileNameWithoutExtension = fileName ? fileName.substring(0, fileName.lastIndexOf('.')) : '';
      const res = Object.assign(newData, {
        document: document ? {
          extension: `.${documentExtension}`,
          name: fileNameWithoutExtension,
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
      });

      methods.reset(res);
      reset({
        ...data,
        builtYear: data.builtYear ? Number(data.builtYear) : null,
        imbDate: data.imbDate ? new Date(data.imbDate) : null,
        indicationLiquidationValue: data.indicationLiquidationValue?.replace(/,/g, ''),
        marketValue: data.marketValue?.replace(/,/g, ''),
        wide: data.wide?.replace(/,/g, ''),
      });
    }
  }, [data, isLoading]);

  const documentLabelName = useMemo(() => {
    return `${methods.getValues('documentType.label')}_${debiturName}_${methods.getValues('documentNumber')}_${dayjs(methods.getValues('documentDate')).format('DDMMYYYY')}`;
  }, [methods.getValues(), debiturName]);


  const handleSubmitData = (data) => {
    // Check if document fields are filled
    const documentFile = methods.getValues('document.file');
    const documentUrl = methods.getValues('document.url');
    const hasDocumentFile = documentFile || documentUrl;

    const hasDocument = hasDocumentFile &&
                       methods.getValues('documentCategory') &&
                       methods.getValues('documentDate') &&
                       methods.getValues('documentGroup.id') &&
                       methods.getValues('documentType.id');

    let documentData = null;
    if (hasDocument) {
      const documentDate = methods.getValues('documentDate');
      documentData = {
        bucketProcessId: processId,
        debtorId: null,
        description: null,
        document: documentFile || documentUrl,
        documentCategory: methods.getValues('documentCategory'),
        documentDate: documentDate ? dayjs(documentDate).format('YYYY-MM-DD') : null,
        documentExtension: methods.getValues('document.extension')?.replace('.', '') || '',
        documentGroup: methods.getValues('documentGroup.id'),
        documentName: methods.getValues('documentName') || '',
        documentNumber: methods.getValues('documentNumber') || '',
        documentParent: DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL,
        documentType: methods.getValues('documentType.id'),
        fileName: documentLabelName,
        module: TypeModule.LPA,
        ownerId: null,
        ownership: null,
        process: TypeProcess.LPA_REVIEW,
      };
    }

    const payload = {
      ...data,
      bucketProcessId: processId,
      document: documentData,
      imbDate: data.imbDate ? dayjs(data.imbDate).format('YYYY-MM-DD') : null,
      indicationLiquidationValue: data.indicationLiquidationValue?.replace(/,/g, ''),
      marketValue: data.marketValue?.replace(/,/g, ''),
      module: TypeModule.LPA,
      parentId,
      process: TypeProcess.LPA_REVIEW,
      wide: data.wide?.replace(/,/g, ''),
    };
    setLastSavedPayload(payload);
    mutate(payload);
  };
  return {
    control,
    handleSubmit,
    handleSubmitData,
    isValidForm,
    methods,
    modalId,
    theme,
    visible,
    watch,
  };
});

export default useModalBuilding;
