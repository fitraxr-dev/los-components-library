import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import dayjs from 'dayjs';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterDocumentGroup from '@/hooks/services/useGetParameterDocumentGroup';
import useGetParameterDocumentType from '@/hooks/services/useGetParameterDocumentType';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import {
  documentCategoryDropdownList,
} from '@/components/shared/SmiModal/ModalUploadDocument/ModalUploadDocument.constants';

import { modal } from '../../UploadOfferingLetterPage/UploadOfferingLetter.constants';

import useSaveFinalDraftOL from './hooks/useSaveFinalDraftOL';
import { formData, validation } from './ModalFinalDraftOL.form';

import type { ModalFinalDraftOLProps } from './ModalFinalDraftOL.types';


export const useModalFinalDraftOL = (props: ModalFinalDraftOLProps) => {
  const { processId } = useIdentity();
  const [keywordDocumentGroup, setKeyworDocumentGroup] = useState('');
  const [keywordDocumentType, setKeyworDocumentType] = useState('');

  const {
    process,
    module,
    nomorDraft,
    draftParent,
    editData,
  } = props;

  const createDocumentObject = (fileUrl: string, fileName: string, fileExt?: string) => {
    if (!fileUrl) return null;


    const encodedFileUrl = encodeURI(fileUrl);
    const hasExtensionInName = fileName.includes('.') && fileName.split('.').pop()?.toLowerCase() === fileExt?.toLowerCase();
    const fullFileName = hasExtensionInName ? fileName : (fileExt ? `${fileName}.${fileExt}` : fileName);

    const splitFileName = fullFileName.split('.');
    const extension = splitFileName.length > 1 ? `.${splitFileName.pop()}` : '';
    const name = splitFileName.join('.');

    return {
      document: encodedFileUrl,
      documentExtension: fileExt || extension.replace('.', '') || 'pdf',
      extension,
      file: encodedFileUrl,
      fileName: fullFileName,
      name,
      url: encodedFileUrl,
    };
  };

  const buildFullFileName = (fileName: string, fileExt?: string) => {
    if (!fileName) return '';
    const hasExtensionInName = fileName.includes('.') && fileName.split('.').pop()?.toLowerCase() === fileExt?.toLowerCase();
    return hasExtensionInName ? fileName : (fileExt ? `${fileName}.${fileExt}` : fileName);
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
        value: editData.file ? createDocumentObject(editData.file, editData.fileName || '', editData.fileExt) : '',
      },
      documentCategory: {
        error: false,
        errorMessage: '',
        value: editData.documentCategory ? {
          id: editData.documentCategory,
          label: editData.documentCategoryLabel || '',
        } : '',
      },
      documentGroup: {
        error: false,
        errorMessage: '',
        value: editData.documentGroup ? {
          id: editData.documentGroup,
          label: editData.documentGroupLabel || '',
        } : '',
      },
      documentName: {
        error: false,
        errorMessage: '',
        value: buildFullFileName(editData.fileName || '', editData.fileExt) || editData.documentName || '',
      },
      documentType: {
        error: false,
        errorMessage: '',
        value: editData.documentType ? {
          id: editData.documentType,
          label: editData.documentTypeLabel || '',
        } : '',
      },
      noDraft: {
        error: false,
        errorMessage: '',
        value: editData.noDraft || nomorDraft || '',
      },
      signedDate: {
        error: false,
        errorMessage: '',
        value: editData.signedDate ? dayjs(editData.signedDate).format('YYYY-MM-DD') : '',
      },
    } : formData,
    validation
  );

  const {
    noDraft: { value: noDraft },
    documentName: { value: documentName },
    document: { value: document },
    documentCategory: { value: documentCategory },
    documentGroup: { value: documentGroup },
    documentType: { value: documentType },
    signedDate: { value: signedDate },
  } = masintonForm;

  // Initialize document category
  useEffect(() => {
    if (!editData) {
      // Set default to FINANCING_DOCUMENT for final draft OL
      const defaultCategory = documentCategoryDropdownList.find((dt) => dt.id === 'FINANCING_DOCUMENT');
      if (defaultCategory) {
        masintonChange('documentCategory', defaultCategory);
      }
    }
  }, []);


  const { data: documentGroupData, isFetching: isFetchDocumentGroupLoading } = useGetParameterDocumentGroup(
    {
      filter: {
        documentCategory: typeof documentCategory === 'object' ? documentCategory?.id : documentCategory,
      },
      page: {
        itemPerPage: 100,
        noPage: 1,
      },
      searchDetail: {
        key: 'documentTypeName',
        value: keywordDocumentGroup,
      },
    },
    { enabled: !!documentCategory && (typeof documentCategory === 'object' ? !!documentCategory?.id : !!documentCategory) }
  );

  const { data: documentTypeData, isFetching: isFetchDocumentTypeLoading } = useGetParameterDocumentType(
    {
      filter: {
        documentGroupCode: typeof documentGroup === 'object' ? documentGroup?.id : documentGroup,
      },
      page: {
        itemPerPage: 100,
        noPage: 1,
      },
      searchDetail: {
        key: 'documentGroupName',
        value: keywordDocumentType,
      },
    },
    { enabled: !!documentGroup && (typeof documentGroup === 'object' ? !!documentGroup?.id : !!documentGroup) }
  );

  // Initialize default document group when data is loaded
  useEffect(() => {
    if (!editData && documentGroupData?.length > 0 && !documentGroup) {
      const defaultGroup = documentGroupData.find(
        (dt) => dt.id === 'FINANCING_DOCUMENTS_CORPORATE_CUSTOMER_COMPANY'
      );
      if (defaultGroup) {
        masintonChange('documentGroup', defaultGroup);
      }
    }
  }, [documentGroupData, editData, documentGroup]);

  // Initialize default document type when data is loaded
  useEffect(() => {
    if (!editData && documentTypeData?.length > 0 && !documentType) {
      const defaultType = documentTypeData.find(
        (dt) => dt.id === 'FINANCING_DOCUMENTS_LEGAL_FACILITY_CONFIRMATION_LETTER'
      );
      if (defaultType) {
        masintonChange('documentType', defaultType);
      }
    }
  }, [documentTypeData, editData, documentType]);

  const { mutate: saveFinalDraftOL, isPending: isSaveLoading } = useSaveFinalDraftOL({
    onSuccess: () => {
      closeNiceModal(modal.MODAL_FINAL_DRAFT_OL);
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  // Generate document name based on document type, document number, and date
  const docoumentName = useMemo(() => {
    const docTypeLabel = typeof documentType === 'object' ? documentType?.label : '[Jenis Dokumen]';
    const docNumber = noDraft || '[No Draft]';
    const docDate = signedDate ? dayjs(signedDate).format('DDMMYYYY') : '[Tanggal Tanda Tangan]';
    return `${docTypeLabel}_${docNumber}_${docDate}`;
  }, [documentType, noDraft, signedDate]);

  const handleOnSave = (data: any) => {
    if (!masintonValidation()) return;

    const payload = Object.assign(masintonSubmit(), {
      bucketProcessId: data?.bucketProcessId || String(processId),
      documentCategory: typeof documentCategory === 'object' ? documentCategory?.id : documentCategory,
      documentGroup: typeof documentGroup === 'object' ? documentGroup?.id : documentGroup,
      documentName: docoumentName,
      documentType: typeof documentType === 'object' ? documentType?.id : documentType,
      draftParent: draftParent || editData?.draftParent || nomorDraft,
      file: document?.file || document,
      isFinal: true,
      module,
      process,
      signedDate: signedDate ? `${signedDate}T00:00:00.000Z` : '',
      ...(editData && { noDraft }),
    });

    saveFinalDraftOL(payload);
  };

  const generateTitle = (id: number) => {
    if (id) {
      return props.isDetail ? 'Detail Draft OL' : 'Edit Draft OL';
    }
    return 'Add Draft OL';
  };

  const isKtpOrNpwp = useMemo(() => {
    if (!documentType) return false;
    const docTypeValue = documentType?.value || documentType;
    const docTypeLabel = typeof docTypeValue === 'object' ? docTypeValue?.label : docTypeValue;
    const docTypeId = typeof docTypeValue === 'object' ? docTypeValue?.value : docTypeValue;
    return docTypeLabel === 'KTP' || docTypeLabel === 'NPWP' || docTypeId === 'KTP' || docTypeId === 'NPWP';
  }, [documentType]);

  return {
    docoumentName,
    documentCategory,
    documentGroup,
    documentGroupData: documentGroupData || [],
    documentType,
    documentTypeData: documentTypeData || [],
    generateTitle,
    handleOnSave,
    isFetchDocumentGroupLoading,
    isFetchDocumentTypeLoading,
    isKtpOrNpwp,
    isSaveLoading,
    masintonChange,
    masintonForm,
    masintonMultiChange,
    setKeyworDocumentGroup,
    setKeyworDocumentType,
  };
};
