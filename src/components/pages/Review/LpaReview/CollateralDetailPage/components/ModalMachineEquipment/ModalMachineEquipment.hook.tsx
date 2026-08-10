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
import useGetMachineEquipmentDetailCollateral from '../../hooks/useGetMachineEquipmentDetailCollateral';
import useSaveCollateralMachineEquipment from '../../hooks/useSaveMachineEquipmentDetailCollateral';
import { DOCUMENT_SCHEMA } from '../FormUploadDocument/FormUploadDocument.constants';

import { machineEquipmentValidation } from './ModalMachineEquipment.constants';


const useModalMachineEquipment = (({
  processId,
  parentId,
  id = null,
  viewOnly = false }: { processId: string; parentId: string; id: string; viewOnly: boolean }) => {
  const theme = useTheme();
  const modalId = modal.MACHINES_EQUIPMENT;
  const { visible } = useModal(modalId);
  const { debiturName } = useIdentity();
  const { recordActivity } = useRecordLog();
  const [lastSavedPayload, setLastSavedPayload] = useState<any>(null);

  const { handleSubmit, setValue, reset, control, formState, watch } = useForm({
    defaultValues: {
      amount: 0,
      condition: null,
      document: null,
      engineName: null,
      id: null,
      indicationLiquidationValue: null,
      marketValue: null,
      number: 0,
      parentId: parentId,
      remark: null,
      spesification: null,
      year: null,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(machineEquipmentValidation),
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
    const machineEquipmentValues = watch();

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

    const filledMachineEquipmentFields = [
      machineEquipmentValues.amount,
      machineEquipmentValues.condition,
      machineEquipmentValues.engineName,
      machineEquipmentValues.indicationLiquidationValue,
      machineEquipmentValues.marketValue,
      machineEquipmentValues.number,
      machineEquipmentValues.remark,
      machineEquipmentValues.spesification,
      machineEquipmentValues.year,
    ].filter(Boolean).length;

    const hasAnyMachineEquipmentField = filledMachineEquipmentFields > 0;
    const hasCompleteUploadSection = filledUploadFields === totalUploadFields;

    if (id !== null) {
      return formState.isValid && isUploadSectionValid;
    }

    const isFormValid = (hasAnyMachineEquipmentField && filledUploadFields === 0) || hasCompleteUploadSection;

    return isFormValid && isUploadSectionValid;
  }, [formState.isValid, methods.getValues(), watch(), id]);

  const { mutate, isSuccess: saveSuccess } = useSaveCollateralMachineEquipment({
    onError: () => {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess: () => {
      // Record activity for saving machine equipment collateral
      const activityType = id !== null ? ActivityType.EDIT : ActivityType.CREATE;
      recordActivity({
        activity: activityType,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({
          engineName: lastSavedPayload?.engineName,
          indicationLiquidationValue: lastSavedPayload?.indicationLiquidationValue,
          marketValue: lastSavedPayload?.marketValue,
        }),
        changeBefore: id !== null ? JSON.stringify({
          engineName: data?.engineName,
          indicationLiquidationValue: data?.indicationLiquidationValue,
          marketValue: data?.marketValue,
        }) : '',
        menuCode: 'lpa-review',
        module: TypeModule.LPA,
        process: TypeProcess.LPA_REVIEW,
        remarks: `successfully ${id !== null ? 'edited' : 'created'} machine equipment collateral`,
      });

      showNiceModalV2({ type: 'success' });
      closeNiceModal(modalId);
    },
  });

  const { data, isLoading, isSuccess } = useGetMachineEquipmentDetailCollateral({
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
        remarks: `view machine equipment collateral detail for edit (machineId: ${id})`,
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
        indicationLiquidationValue: data.indicationLiquidationValue,
        marketValue: data.marketValue,
        number: parseFloat(data.number?.replace(/,/g, '')),
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
    setValue,
    theme,
    visible,
    watch,
  };
});

export default useModalMachineEquipment;
