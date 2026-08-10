import { useEffect, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { ActivityType } from '@/enums/Activity';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import { DOCUMENT_SCHEMA } from '@/components/shared/SmiComponent/FormUploadDocument/FormUploadDocument.constants';

import useGetCurrentModule from '../../../hooks/useGetCurrentModule';
import useGetDetailLpaInformation from '../../hooks/useGetDetailLpaInformation';
import useSaveLpaInformation from '../../hooks/useSaveLpaInformation';
import { MODAL_ID } from '../../Review.constants';

import { validationSchema } from './ModalAddInformationLpa.constant';


const useModalAddInformationLpa = ({ id = null }: { id: string }) => {
  const { processId, debiturName, debtorId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const { module, process } = useGetCurrentModule();
  const [lastSavedPayload, setLastSavedPayload] = useState<any>(null);

  const { data, isLoading } = useGetDetailLpaInformation({
    bucketProcessId: processId,
    id,
    module,
    process,
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
        module: module,
        process: process,
        remarks: `view lpa information detail for edit (lpaId: ${id})`,
      });
    }
  }, [data, id, processId, module, process, recordActivity]);

  const { getValues, reset, formState, control } = useForm({
    defaultValues: {
      assessmentDate: '',
      kjpp: '',
      remark: '',
      reportDate: '',
      reportNo: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(validationSchema),
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
    } as any,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(DOCUMENT_SCHEMA) as any, // if there is schema for validation
    values: useMemo(() => data, [data]), // if there is initial data
  });

  useEffect(() => {
    if (id !== null) {
      reset(data);
      methods.reset({
        document: {
          extension: `.${data?.document?.documentExtension}`,
          file: null,
          name: data?.document?.documentName,
          url: data?.document?.document,
        },
        documentCategory: data?.document?.documentCategory,
        documentDate: data?.document?.documentDate,
        documentGroup: {
          id: data?.document?.documentGroup,
          label: data?.document?.documentGroupLabel,
        },
        documentName: data?.document?.documentName,
        documentNumber: data?.document?.documentNumber,
        documentType: {
          id: data?.document?.documentType,
          label: data?.document?.documentTypeLabel,
        },
      } as any);
    };
  }, [data, isLoading]);

  const { mutate: saveInformationLpa } = useSaveLpaInformation(
    {
      onError: () => {
        showNiceModalV2({ onClose: () => closeNiceModal(MODAL_ID.ADD_LPA), type: 'error' });
      },
      onSuccess: () => {
        // Record activity for saving LPA information
        const activityType = id !== null ? ActivityType.EDIT : ActivityType.CREATE;
        recordActivity({
          activity: activityType,
          bucketProcessId: processId || '',
          changeAfter: JSON.stringify({
            assessmentDate: lastSavedPayload?.assessmentDate,
            kjpp: lastSavedPayload?.kjpp,
            reportNo: lastSavedPayload?.reportNo,
          }),
          changeBefore: id !== null ? JSON.stringify({
            assessmentDate: data?.assessmentDate,
            kjpp: data?.kjpp,
            reportNo: data?.reportNo,
          }) : '',
          menuCode: 'lpa-review',
          module: module,
          process: process,
          remarks: `successfully ${id !== null ? 'edited' : 'created'} lpa information`,
        });

        closeNiceModal(MODAL_ID.ADD_LPA).then(() => {
          showNiceModalV2({ type: 'success' });
        });
      },
    },
  );

  const documentLabelName = useMemo(() => {
    const documentTypeLabel = (methods.getValues('documentType.label' as any) as string) || '';
    const documentNumber = (methods.getValues('documentNumber' as any) as string) || '';
    const documentDate = (methods.getValues('documentDate' as any) as string) || '';

    return `${documentTypeLabel}_${debiturName}_${documentNumber}_${dayjs(documentDate).format('DDMMYYYY')}`;
  }, [methods.getValues(), debiturName]);

  const handleSaveInformationLpa = () => {
    const values = getValues();
    const file = methods.getValues('document.file' as any) as File;
    const documentUrl = methods.getValues('document.url' as any) as string;

    const documentPayload: any = {
      bucketProcessId: processId,
      debtorId,
      documentCategory: methods.getValues('documentCategory' as any) as any,
      documentDate: methods.getValues('documentDate' as any) as string,
      documentExtension: (methods.getValues('document.extension' as any) as string)?.replace('.', ''),
      documentGroup: (methods.getValues('documentGroup.id' as any) as string),
      documentName: documentLabelName,
      documentNumber: methods.getValues('documentNumber' as any) as string,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL,
      documentType: (methods.getValues('documentType.id' as any) as string),
      fileName: documentLabelName,
      module,
      process,
    };

    // Include document id when editing (needed for backend to identify which document to update)
    if (id !== null && data?.document?.id) {
      documentPayload.id = data.document.id;
    }

    // If no new file is uploaded but we're editing, include the existing document URL
    if (!file && documentUrl) {
      documentPayload.document = documentUrl;
    }

    const payload = {
      assessmentDate: values.assessmentDate,
      bucketProcessId: processId,
      document: documentPayload,
      id,
      kjpp: values.kjpp,
      module,
      process,
      remark: values.remark,
      reportDate: values.reportDate,
      reportNo: values.reportNo,
    };

    setLastSavedPayload(payload);

    const formData = new FormData();
    // Only append file if it exists (new file uploaded)
    if (file) {
      formData.append('file', file); // field khusus file
    }
    formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));

    saveInformationLpa(formData);
  };

  const getDisableDocumentField = useMemo(() => {
    const {
      document: documentData,
      documentCategory,
      documentDate,
      documentGroup,
      documentName,
      documentNumber,
      documentType,
    } = methods.watch();

    if (documentData
      && documentCategory
      && documentDate
      && documentGroup?.id
      && documentName
      && documentNumber
      && documentType?.id) {
      return false;
    }

    return true;
  }, [methods.watch()]);


  return {
    control,
    formState,
    getDisableDocumentField,
    handleSaveInformationLpa,
    methods,
  };
};

export default useModalAddInformationLpa;
