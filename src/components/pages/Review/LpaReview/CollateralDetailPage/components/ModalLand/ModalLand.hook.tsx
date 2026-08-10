import { useEffect, useMemo, useState } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import { DOCUMENT_SCHEMA } from '@/components/shared/SmiComponent/FormUploadDocument/FormUploadDocument.constants';

import { modal } from '../../CollateralDetail.constants';
import useGetLandDetailCollateral from '../../hooks/useGetLandDetailCollateral';
import useSaveCollateralLand from '../../hooks/useSaveLandDetailCollateral';

import { landValidation } from './ModalLand.constants';


const useModalLand = (({
  processId,
  parentId,
  id = null,
  viewOnly = false }: { processId: string; parentId: string; id: string; viewOnly: boolean }) => {
  const theme = useTheme();
  const modalId = modal.LAND;
  const { visible } = useModal(modalId);

  const { debiturName } = useIdentity();
  const { recordActivity } = useRecordLog();
  const [lastSavedPayload, setLastSavedPayload] = useState<any>(null);

  const { data: documentType, isLoading: documentTypeIsLoading } = useGetParameterList('typeDocumentCollateralLandLPA');

  const { handleSubmit, reset, control, formState, watch } = useForm({
    defaultValues: {
      document: null,
      documentNo: null,
      documentType: null,
      endDate: null,
      id: null,
      indicationLiquidationValue: null,
      marketValue: null,
      measuringLetterDate: null,
      measuringLetterNo: null,
      parentId: parentId,
      publicationDate: null,
      remark: null,
      rightsHolders: null,
      wide: null,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(landValidation),
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
    const landValues = watch();

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

    const filledLandFields = [
      landValues.documentNo,
      landValues.documentType,
      landValues.endDate,
      landValues.indicationLiquidationValue,
      landValues.marketValue,
      landValues.measuringLetterDate,
      landValues.measuringLetterNo,
      landValues.publicationDate,
      landValues.remark,
      landValues.rightsHolders,
      landValues.wide,
    ].filter(Boolean).length;

    const hasAnyLandField = filledLandFields > 0;
    const hasCompleteUploadSection = filledUploadFields === totalUploadFields;

    if (id !== null) {
      // When editing, check if upload section is either empty or complete
      return formState.isValid && isUploadSectionValid;
    }

    const isFormValid = (hasAnyLandField && filledUploadFields === 0) || hasCompleteUploadSection;

    return isFormValid && isUploadSectionValid;
  }, [formState.isValid, methods, watch(), id]);

  const { mutate, isSuccess: saveSuccess } = useSaveCollateralLand({
    onSuccess: () => {
      // Record activity for saving land collateral
      const activityType = id !== null ? ActivityType.EDIT : ActivityType.CREATE;
      recordActivity({
        activity: activityType,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({
          documentNo: lastSavedPayload?.documentNo,
          indicationLiquidationValue: lastSavedPayload?.indicationLiquidationValue,
          marketValue: lastSavedPayload?.marketValue,
          wide: lastSavedPayload?.wide,
        }),
        changeBefore: id !== null ? JSON.stringify({
          documentNo: data?.documentNo,
          indicationLiquidationValue: data?.indicationLiquidationValue,
          marketValue: data?.marketValue,
          wide: data?.wide,
        }) : '',
        menuCode: 'lpa-review',
        module: TypeModule.LPA,
        process: TypeProcess.LPA_REVIEW,
        remarks: `successfully ${id !== null ? 'edited' : 'created'} land collateral`,
      });

      showNiceModalV2({ type: 'success' });
      closeNiceModal(modalId);
    },
  });

  const { data, isLoading, isSuccess } = useGetLandDetailCollateral({
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
        remarks: `view land collateral detail for edit (landId: ${id})`,
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
        indicationLiquidationValue: (data.indicationLiquidationValue?.replace(/,/g, '')),
        marketValue: (data.marketValue?.replace(/,/g, '')),
        wide: (data.wide?.replace(/,/g, '')),
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
      endDate: data.endDate ? dayjs(data.endDate).format('YYYY-MM-DD') : null,
      indicationLiquidationValue: data.indicationLiquidationValue?.replace(/,/g, ''),
      marketValue: data.marketValue?.replace(/,/g, ''),
      measuringLetterDate: data.measuringLetterDate ? dayjs(data.measuringLetterDate).format('YYYY-MM-DD') : null,
      module: TypeModule.LPA,
      parentId,
      process: TypeProcess.LPA_REVIEW,
      publicationDate: data.publicationDate ? dayjs(data.publicationDate).format('YYYY-MM-DD') : null,
    };
    setLastSavedPayload(payload);
    mutate(payload);
  };

  return {
    control,
    documentType,
    formState,
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

export default useModalLand;
