import { useEffect, useMemo, useState } from 'react';


import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import useGetDetailOfferingLetter from '../../UploadOfferingLetterPage/hooks/useGetDetailOfferingLetter';
import { modal } from '../../UploadOfferingLetterPage/UploadOfferingLetter.constants';

import useSaveDraftOfferingLetter from './hooks/useSaveDraftOfferingLetter';
import { formData, validation } from './ModalAddDraftOL.form';

import type { ModalAddDraftProps } from './ModalAddDraftOL.types';


export const useAddDraftOLModal = (props: ModalAddDraftProps) => {
  const { processId } = useIdentity();

  // State for Detail Final OL only
  const [documentGroup, setDocumentGroup] = useState<any>(null);
  const [documentType, setDocumentType] = useState<any>(null);
  const [signedDate, setSignedDate] = useState<string>('');

  const {
    process,
    module,
    title,
    nomorDraft,
    draftParent,
    editData,
    bucketProcessId,
  } = props;

  // Helper function to create document object
  const createDocumentObject = (fileUrl: string, fileName: string, fileExt?: string) => {
    if (!fileUrl) return null;

    const splitFileName = fileName.split('.');
    const extension = splitFileName.length > 1 ? `.${splitFileName.pop()}` : '';
    const name = splitFileName.join('.');

    return {
      document: fileUrl,
      documentExtension: fileExt || extension.replace('.', '') || 'pdf',
      extension,
      file: fileUrl,
      fileName: fileName,
      name,
      url: fileUrl,
    };
  };

  const {
    masintonForm,
    masintonMultiChange,
    masintonChange,
    masintonValidation,
    masintonSubmit,
    masintonMagic,
  } = useMasintonForm(
    editData ? {
      document: {
        error: false,
        errorMessage: '',
        value: createDocumentObject(editData.file, editData.fileName, editData.fileExt),
      },
      documentName: {
        error: false,
        errorMessage: '',
        value: editData.fileName || '',
      },
      noDraft: {
        error: false,
        errorMessage: '',
        value: editData.noDraft || '',
      },
    } : formData,
    validation
  );

  const {
    noDraft: { value: noDraft },
    documentName: { value: documentName },
    document: { value: document },
  } = masintonForm;

  const { data: offeringLetterData, isLoading: offeringLetterLoading } = useGetDetailOfferingLetter(
    {
      bucketProcessId,
      module: module,
      noDraft: props.nomorDraft,
      process: process,
    },
  );

  useEffect(() => {
    const content = offeringLetterData;
    if (!content) return;

    const baseFileName = content.fileName || '';
    const fileExt = content.fileExt || '';


    const hasExtensionInName = baseFileName.includes('.') && baseFileName.split('.').pop()?.toLowerCase() === fileExt.toLowerCase();
    const fullFileName = hasExtensionInName ? baseFileName : (fileExt ? `${baseFileName}.${fileExt}` : baseFileName);

    const splitFileName = fullFileName.split('.');
    const extension = splitFileName.length > 1 ? `.${splitFileName.pop()}` : '';
    const name = splitFileName.join('.');

    const contentAny = content as any;

    const fileUrl = content.file ? decodeURI(content.file) : null;

    const mappedData: Record<string, any> = {
      document: fileUrl
        ? {
          document: fileUrl,
          documentExtension: fileExt || extension.replace('.', '') || 'pdf',
          extension,
          file: fileUrl,
          // Extra fields required for watermark modal interaction
          fileName: fullFileName,
          name,
          url: fileUrl,
        }
        : null,
      documentName: fullFileName,
      noDraft: content.noDraft,
    };

    masintonMultiChange(mappedData);

    // Map documentGroup if available (for Detail Final OL)
    if (contentAny.documentGroup) {
      setDocumentGroup({
        id: contentAny.documentGroup,
        label: contentAny.documentGroup,
      });
    }

    // Map documentType if available (for Detail Final OL)
    if (contentAny.documentType) {
      setDocumentType({
        id: contentAny.documentType,
        label: contentAny.documentType,
      });
    }

    // Map signedDate if available (for Detail Final OL)
    if (contentAny.signedDate) {
      setSignedDate(contentAny.signedDate);
    }
  }, [offeringLetterData]);

  const { mutate: saveDraftOfferingLetter, isPending: isSaveLoading } = useSaveDraftOfferingLetter({
    onSuccess: () => {
      closeNiceModal(modal.MODAL_ADD_DRAFT_OL);
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleOnSave = (data: any) => {
    if (!masintonValidation()) return;

    const payload = Object.assign(masintonSubmit(), {
      bucketProcessId: String(processId),
      draftParent: draftParent || editData?.draftParent || nomorDraft,
      file: document.file,
      isFinal: false,
      module,
      process,
    });
    console.log('payload', payload);
    saveDraftOfferingLetter(payload);
  };

  const generateTitle = (id: number) => {
    if (id) {
      return title ? 'Add Draft OL' : 'Detail Draft OL';
    }
  };

  return {
    documentGroup,
    documentType,
    generateTitle,
    handleOnSave,
    isSaveLoading,
    masintonChange,
    masintonForm,
    masintonMultiChange,
    signedDate,
  };
};
