import { useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { ONE_MINUTE } from '@/configs/constants';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import useGetDetailDocumentMup from '../../hooks/useGetDetailDocumentMup';
import useSaveDocumentMupDiscussion from '../../hooks/useSaveDocumentMupDiscussion';

import { modal, modalUploadDocumentMupSchema } from './ModalUploadDocumentMUP.constants';

import type { ModalUploadDocumentMupProps } from './ModalUploadDocumentMUP.types';


const useModalUploadDocumentMUP = (props: ModalUploadDocumentMupProps) => {
  const { bucketMasterId, _module, process, id, uploadBy, analystId } = props;
  const { processId } = useIdentity();
  const [fileObject, setFileObject] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { data: detailDocumentData } = useGetDetailDocumentMup({
    bucketProcessId: processId,
    uploadId: id,
  }, {
    enabled: !!id,
    staleTime: ONE_MINUTE,
  });

  const { mutate: saveDocument, isPending: isSaveDocumentLoading } = useSaveDocumentMupDiscussion({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-mup-discussion-staff-list']});
      queryClient.invalidateQueries({ queryKey: ['document-mup-discussion']});
      closeNiceModal(modal.UPLOAD_DOCUMENT_MUP);
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
    resolver: yupResolver(modalUploadDocumentMupSchema),
  });

  useEffect(() => {
    setValue('uploadBy', uploadBy);
    setValue('uploadDate', formatDate(new Date()));
  }, []);

  const isDocumentEmpty = !watch('document.name');

  useEffect(() => {
    if (detailDocumentData) {
      reset({
        document: {
          extension: `.${detailDocumentData.fileType}`,
          file: detailDocumentData.fileUrl,
          name: detailDocumentData.fileName,
          url: detailDocumentData.fileUrl,
        },
        documentName: detailDocumentData.fileName,
        uploadBy: detailDocumentData?.staff,
        uploadDate: detailDocumentData.createdDate ? formatDate(new Date(detailDocumentData.createdDate)) : '',
      });
    }
  }, [detailDocumentData]);

  const handleOnSave = (data) => {
    const extension = data.document.extension.split('.')[1];

    const fileToUpload = fileObject ?? (id ? null : data.document.file);

    saveDocument({
      analystId,
      bucketMasterId,
      bucketProcessId: processId,
      file: fileToUpload,
      fileName: data.documentName ? data.documentName : data.document.name,
      fileType: extension,
      module: _module,
      process,
      uploadId: id,
      uploadTimestamp: new Date().toISOString(),
    });
  };

  const handleOnCancel = () => {
    closeNiceModal(modal.UPLOAD_DOCUMENT_MUP);
  };

  return {
    control,
    handleOnCancel,
    handleOnSave,
    handleSubmit,
    isDirty,
    isDocumentEmpty,
    isSaveDocumentLoading,
    setFileObject,
    setValue,
  };
};

export default useModalUploadDocumentMUP;
