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
import useGetComplementaryFacilitiesDetailCollateral from '../../hooks/useGetComplementaryFacilitiesDetailCollateral';
import useSaveCollateralComplementaryFacilities from '../../hooks/useSaveComplementaryFacilitiesDetailCollateral';
import { DOCUMENT_SCHEMA } from '../FormUploadDocument/FormUploadDocument.constants';

import { complimentaryValidation } from './ModalComplementaryFacilities.constants';


const useModalComplementaryFacilities = ((
  {
    processId,
    parentId,
    id = null,
    viewOnly = false }: { processId: string; parentId: string; id: string; viewOnly: boolean }) => {
  const theme = useTheme();
  const modalId = modal.COMPLEMENTARY_FACILITIES;
  const { visible } = useModal(modalId);
  const { debiturName } = useIdentity();
  const { recordActivity } = useRecordLog();
  const [lastSavedPayload, setLastSavedPayload] = useState<any>(null);

  const { handleSubmit, reset, control, formState, watch } = useForm({
    defaultValues: {
      amount: 0,
      capacity: 0,
      condition: null,
      document: null,
      id: null,
      indicationLiquidationValue: null,
      magnitude: 0,
      marketValue: null,
      name: null,
      parentId: parentId,
      remark: null,
      year: null,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(complimentaryValidation),
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
    resolver: yupResolver(DOCUMENT_SCHEMA),
  });

  const isValidForm = useMemo(() => {
    const uploadDocumentValues = methods.getValues();
    const complementaryFacilitiesValues = watch();

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

    const filledComplementaryFacilitiesFields = [
      complementaryFacilitiesValues.amount,
      complementaryFacilitiesValues.capacity,
      complementaryFacilitiesValues.condition,
      complementaryFacilitiesValues.indicationLiquidationValue,
      complementaryFacilitiesValues.magnitude,
      complementaryFacilitiesValues.marketValue,
      complementaryFacilitiesValues.name,
      complementaryFacilitiesValues.remark,
      complementaryFacilitiesValues.year,
    ].filter(Boolean).length;

    const hasAnyComplementaryFacilitiesField = filledComplementaryFacilitiesFields > 0;
    const hasCompleteUploadSection = filledUploadFields === totalUploadFields;

    const isFormValid = (hasAnyComplementaryFacilitiesField && filledUploadFields === 0) || hasCompleteUploadSection;

    if (id !== null) {
      return formState.isValid && isUploadSectionValid;
    }

    return isFormValid && isUploadSectionValid;
  }, [formState.isValid, methods.getValues(), watch(), id]);

  const { mutate, isSuccess: saveSuccess } = useSaveCollateralComplementaryFacilities({
    onSuccess: () => {
      // Record activity for saving complementary facilities collateral
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
        remarks: `successfully ${id !== null ? 'edited' : 'created'} complementary facilities collateral`,
      });

      showNiceModalV2({ type: 'success' });
      closeNiceModal(modalId);
    },
  });

  const { data, isLoading, isSuccess } = useGetComplementaryFacilitiesDetailCollateral({
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
        remarks: `view complementary facilities collateral detail for edit (facilitiesId: ${id})`,
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
        amount: parseFloat(data.amount?.replace(/,/g, '')),
        capacity: parseFloat(data.capacity?.replace(/,/g, '')),
        indicationLiquidationValue: data.indicationLiquidationValue?.replace(/,/g, ''),
        magnitude: parseFloat(data.magnitude?.replace(/,/g, '')),
        marketValue: data.marketValue?.replace(/,/g, ''),
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
      documentData = {
        bucketProcessId: processId,
        debtorId: null,
        description: null,
        document: documentFile || documentUrl,
        documentCategory: methods.getValues('documentCategory'),
        documentDate: methods.getValues('documentDate'),
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
      indicationLiquidationValue: parseFloat(data.indicationLiquidationValue?.replace(/,/g, '') || '0'),
      marketValue: parseFloat(data.marketValue?.replace(/,/g, '') || '0'),
      module: TypeModule.LPA,
      parentId,
      process: TypeProcess.LPA_REVIEW,
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


export default useModalComplementaryFacilities;
