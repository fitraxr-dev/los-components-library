import { useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { ONE_MINUTE } from '@/configs/constants';
import { ActivityType } from '@/enums/Activity';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDetailDocument from '@/hooks/services/mip/mip-discussion/useGetDetailDocument';
import useSaveDocumentDiscussion from '@/hooks/services/mip/mip-discussion/useSaveDocumentDiscussion';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';


import { modal, modalUploadDocumentMipSchema } from './ModalUploadDocumentMIP.constants';


import type { ModalUploadDocumentMipProps } from './ModalUploadDocumentMIP.types';


const useModalUploadDocumentMIP = (props: ModalUploadDocumentMipProps) => {
  const { bucketMasterId, _module, process, id, uploadBy, analystId } = props;
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const [payload, setPayload] = useState(null);
  const [fileObject, setFileObject] = useState<File | null>(null);
  const [savedAnalystId, setSavedAnalystId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: detailDocumentData } = useGetDetailDocument({
    bucketProcessId: processId,
    uploadId: id,
  }, {
    enabled: !!id,
    staleTime: ONE_MINUTE,
  });

  const { mutate: saveDocument, isPending: isSaveDocumentLoading } = useSaveDocumentDiscussion({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-discussion-staff-list']});
      queryClient.invalidateQueries({ queryKey: ['document', { bucketProcessId: processId, uploadId: id }]});
      queryClient.invalidateQueries({ queryKey: ['document-discussion-analyst-list']});
      queryClient.invalidateQueries({ queryKey: ['document']});
      recordActivity({
        activity: id ? ActivityType.EDIT : ActivityType.ADD,
        bucketProcessId: processId,
        changeAfter: payload ? JSON.stringify(payload) : null,
        changeBefore: id ? JSON.stringify(detailDocumentData) : null,
        menuCode: 'mip',
        module: _module,
        process: process,
        remarks: id ? `Edit Document MIP with Id: ${id} in MIP Discussion` : 'Add new Document MIP in MIP Discussion',
      });
      closeNiceModal(modal.UPLOAD_DOCUMENT_MIP);
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const { control, setValue, watch, handleSubmit, formState: { isDirty }, reset } = useForm({
    defaultValues: {
      document: {
        extension: '',
        file: '',
        name: '',
        url: '',
      },
      documentName: '',
      uploadBy: '',
      uploadDate: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(modalUploadDocumentMipSchema),
  });

  useEffect(() => {
    if (!id) {
      setValue('uploadBy', uploadBy);
      setValue('uploadDate', new Date().toDateString());
    }
  }, []);

  const isDocumentEmpty = !watch('document.name');

  useEffect(() => {
    if (detailDocumentData) {
      // Simpan analystId dari detail document untuk edit mode
      if (detailDocumentData.analystId) {
        setSavedAnalystId(detailDocumentData.analystId);
      }

      reset({
        document: {
          extension: `.${detailDocumentData.fileType}`,
          file: detailDocumentData.fileUrl,
          name: detailDocumentData.fileName,
          url: detailDocumentData.fileUrl,
        },
        documentName: detailDocumentData.fileName,
        uploadBy: detailDocumentData?.staff,
        uploadDate: detailDocumentData.createdDate,
      });
    }
  }, [detailDocumentData]);

  const handleOnSave = (data) => {
    const extension = data.document.extension.split('.')[1];

    const fileToUpload = fileObject ? fileObject : (id ? null : data.document.file);

    const finalAnalystId = id ? (savedAnalystId || analystId) : analystId;

    const payload: any = {
      analystId: finalAnalystId ? String(finalAnalystId) : null,
      bucketMasterId,
      bucketProcessId: processId,
      file: fileToUpload,
      fileName: data.documentName ? data.documentName : data.document.name,
      fileType: extension,
      module: _module,
      process,
      uploadId: id ? id : undefined,
      uploadTimestamp: new Date().toISOString(),
    };

    setPayload(payload);

    saveDocument(payload);
  };

  const handleOnCancel = () => {
    closeNiceModal(modal.UPLOAD_DOCUMENT_MIP);
  };

  const isSaveDisabled = id
    ? !watch('documentName')
    : !watch('document.name') || !watch('documentName');

  return {
    control,
    handleOnCancel,
    handleOnSave,
    handleSubmit,
    isDirty,
    isDocumentEmpty,
    isSaveDisabled,
    isSaveDocumentLoading,
    setFileObject,
    setValue,
  };
};

export default useModalUploadDocumentMIP;
