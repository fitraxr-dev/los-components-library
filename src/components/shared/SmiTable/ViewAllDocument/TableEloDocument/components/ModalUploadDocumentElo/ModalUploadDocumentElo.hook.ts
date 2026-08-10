import { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { usePathname } from 'next/navigation';

import { TypeProcess } from '@/enums/Module';
import { dayJsJakartaKeep } from '@/helpers/date';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useAddDocument from '@/hooks/services/useAddDocument';
import useAddDocumentEloExisting from '@/hooks/services/useAddDocumentEloExisting';
import useGetDocumentById from '@/hooks/services/useGetDocumentById';
import useGetParameterDocumentGroup from '@/hooks/services/useGetParameterDocumentGroup';
import useGetParameterDocumentType from '@/hooks/services/useGetParameterDocumentType';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';
import {
  DocumentTypeRequestDtoDocumentParentEnum,
  DocumentTypeRequestDtoOwnershipEnum,
} from '@/services/openapi/bucket-document-service';

import {
  documentCategoryDropdownList,
} from '@/components/shared/SmiModal/ModalUploadDocument/ModalUploadDocument.constants';
import { formData, validation } from '@/components/shared/SmiModal/ModalUploadDocument/ModalUploadDocument.form';
import {
  pathDocumentParentListApuppt,
} from '@/components/shared/SmiModal/ModalUploadDocumentExisting/ModalUploadDocumentExisting.constants';

import { MODAL_UPLOAD_DOCUMENT_ELO } from '../../TableEloDocument.constants';

import type { ModalUploadDocumentEloProps } from './ModalUploadDocumentElo.types';
import type {
  ModalUploadDocumentProps,
} from '@/components/shared/SmiModal/ModalUploadDocument/ModalUploadDocument.types';


const useModalUploadDocumentELO = (props: ModalUploadDocumentEloProps) => {
  const {
    process,
    module,
    id,
    type,
    isExistingMode,
  } = props;

  const { processId, debiturName, debtorId } = useIdentity();
  const [keywordDocumentGroup, setKeyworDocumentGroup] = useState('');
  const [keywordDocumentType, setKeyworDocumentType] = useState('');
  const [selected, setSelected] = useState([]);

  // Reset selected data when isExisting changes to false
  useEffect(() => {
    if (!isExistingMode) {
      setSelected([]);
    }
  }, [isExistingMode]);
  const path = usePathname();
  const isViewAllDocument = getLastPath(path) === 'view-all-document';
  let ownership;

  const {
    masintonForm,
    masintonMultiChange,
    masintonChange,
    masintonValidation,
    masintonSubmit,
    masintonMagic,
  } = useMasintonForm(formData, validation);

  const {
    documentGroup: { value: documentGroup },
    documentType: { value: documentType },
    documentCategory: { value: documentCategory },
    document: { value: document },
    documentNumber: { value: documentNumber },
    documentDate: { value: documentDate },
  } = masintonForm;

  let documentParent = documentCategory;

  switch (process) {
    case TypeProcess.CREDIT_CHECKING:
      ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTCREDITCHECKING;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.REVIEWER_DK:
      ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTREVIEWERDK;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.REVIEWER_DH:
      ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTREVIEWERDH;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.REVIEWER_DEPI:
      ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTREVIEWERDEPI;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.REVIEWER_DELST:
      ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTREVIEWERDELST;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.BAR:
      ownership = DocumentTypeRequestDtoOwnershipEnum.OTHERRELATED;
      break;
    case TypeProcess.LEGAL_SIGNING:
      ownership = DocumentTypeRequestDtoOwnershipEnum.OTHERRELATED;
      break;
    case TypeProcess.TECHNICAL_REVIEW:
      ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTTECHNICALREVIEW;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.TECHNICAL_REVIEW_DELST:
      ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTTECHNICALREVIEW;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.LPA:
      ownership = DocumentTypeRequestDtoOwnershipEnum.LPA;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.LPA_REVIEW:
      ownership = DocumentTypeRequestDtoOwnershipEnum.LPAREVIEW;
      break;
    case TypeProcess.SPFP:
    case TypeProcess.SPDP:
    case TypeProcess.SPFP_FINAL:
      ownership = DocumentTypeRequestDtoOwnershipEnum.SPFP;
      documentParent = type;
      break;
    case TypeProcess.PROCESSING_TYPE_PK:
      ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTUPLOADPKPT;
      break;
    case TypeProcess.RISALAH_RAPAT:
      ownership = DocumentTypeRequestDtoOwnershipEnum.RISALAHRAPAT;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.APU_PPT_DPOP:
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.DOCUMENTAPUPPT;
      if (props?.ownerId) {
        documentParent = DocumentTypeRequestDtoDocumentParentEnum.DOCUMENTAPUPPT;
        ownership = pathDocumentParentListApuppt.find((item) => item?.path === path?.split('/')[5])?.documentParent;
      }
      break;
    case TypeProcess.APU_PPT:
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.DOCUMENTAPUPPT;
      ownership = pathDocumentParentListApuppt.find((item) => item?.path === path?.split('/')[5])?.documentParent;
      break;

    case TypeProcess.CREDIT_CHECKING_DPOP:
      ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTCREDITCHECKING;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.REVIEWER_DELST:
      ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTREVIEWERDELST;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.MIP:
      ownership = DocumentTypeRequestDtoOwnershipEnum.MIP;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.MIP_ANALYST:
      ownership = DocumentTypeRequestDtoOwnershipEnum.MIP;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.MIP_REVIEW:
      ownership = DocumentTypeRequestDtoOwnershipEnum.MIPREVIEW;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.HIGH_RISK_DK:
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.MUP:
      ownership = DocumentTypeRequestDtoOwnershipEnum.MUP;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.MUP_ANALYST:
      ownership = DocumentTypeRequestDtoOwnershipEnum.MUP;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    default:
      ownership = DocumentTypeRequestDtoOwnershipEnum.OTHERRELATED;
      break;
  }

  const {
    data: documentDetailData,
    isSuccess: isDocumentDetailSuccess,
  } = useGetDocumentById(
    { id: +id }, { enabled: id !== undefined && id !== null });

  useEffect(() => {
    masintonChange('documentCategory', documentCategoryDropdownList.find((dt) => dt.id === type));
  }, []);

  useEffect(() => {
    const {
      documentExtension,
      document,
      fileName,
      documentGroupLabel,
      documentGroup,
      documentType,
      documentTypeLabel,
      documentCategory,
      documentCategoryLabel,
    } = documentDetailData || {};

    if (documentDetailData && isDocumentDetailSuccess) {
      const newData = structuredClone(documentDetailData);
      const data = Object.assign(newData, {
        document: document ? {
          extension: `.${documentExtension}`,
          name: fileName.split('.')?.[0],
          url: document,
        } : null,
        documentCategory: {
          id: documentCategory,
          label: documentCategoryLabel,
        },
        documentGroup: {
          id: documentGroup,
          label: documentGroupLabel,
        },
        documentType: {
          id: documentType,
          label: documentTypeLabel,
        },
      });

      masintonMagic(data ?? {});
    }
  }, [documentDetailData, isDocumentDetailSuccess]);

  const { data: documentGroupData, isFetching: isFetchDocumentGroupLoading } = useGetParameterDocumentGroup(
    {
      filter: {
        documentCategory: documentCategory?.id,
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
    { enabled: !!documentCategory }
  );

  const { data: documentTypeData, isFetching: isFetchDocumentTypeLoading } = useGetParameterDocumentType(
    {
      filter: {
        documentGroupCode: documentGroup?.id,
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
    { enabled: !!documentGroup?.id }
  );

  const { mutate: saveDocument, isPending: isSaveLoading } = useAddDocument({
    onError: (error) => {
      showNiceModalV2({
        title: error.message,
        type: 'error',
      });
    },
    onSuccess: (response) => {
      closeNiceModal(MODAL_UPLOAD_DOCUMENT_ELO);
      showNiceModalV2({
        title: response?.data?.message || 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const { mutate: saveDocumentExisting, isPending: isSaveLoadingExisting } = useAddDocumentEloExisting({
    onError: (error) => {
      showNiceModalV2({
        title: error.message,
        type: 'error',
      });
    },
    onSuccess: (response) => {
      console.log('response', response);
      closeNiceModal(MODAL_UPLOAD_DOCUMENT_ELO);
      showNiceModalV2({
        title: response || 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const formatDocumentParent = () => {
    let formatDoc = documentParent;
    if (typeof documentParent === 'object') {
      formatDoc = documentCategory?.id;
    }
    return formatDoc;
  };

  const handleSave = () => {
    if (isExistingMode) {
      // Handle existing document selection
      if (selected.length === 0) {
        showNiceModalV2({
          title: 'Pilih dokumen yang akan digunakan',
          type: 'warning',
        });
        return;
      }

      // Send selected documents
      const payload = {
        bucketProcessId: props.childId ?? String(processId),
        documentIds: selected.map((item) => item.id),
        module,
        process,
      };

      // Here you would typically call an API to link the selected documents
      console.log('Selected documents:', payload);
      showNiceModalV2({
        title: 'Dokumen berhasil dipilih',
        type: 'success',
      });
      saveDocumentExisting(payload);
      return;
    }

    // Handle new document upload
    if (!masintonValidation()) return;
    let payload;
    payload = Object.assign(masintonSubmit(), {
      bucketProcessId: props.childId ?? String(processId),
      debtorId: debtorId ?? undefined,
      document: document.file,
      documentCategory: documentCategory.id,
      documentDate: dayJsJakartaKeep(documentDate),
      documentExtension: document.extension.replace('.', ''),
      documentGroup: documentGroup?.id,
      documentParent: isViewAllDocument ? documentCategory.id : formatDocumentParent(),
      documentType: documentType?.id,
      fileName: `${documentType?.label}_${debiturName}_${documentNumber}_${dayjs(documentDate).format('DDMMYYYY')}`,
      id: id ? +id : undefined,
      module,
      ownerId: props?.ownerId ?? props?.bucketMasterId,
      ownership: isViewAllDocument ? undefined : ownership,
      process,
    });
    saveDocument(payload);
  };

  const generateTitle = (id: number) => {
    if (id) {
      return 'Edit Dokumen';
    } else {
      return 'Add Dokumen';
    }
  };

  return {
    debiturName,
    documentDetailData,
    documentGroupData,
    documentTypeData,
    existingDocuments: props.existingDocuments || [],
    generateTitle,
    handleSave,
    isExistingMode,
    isFetchDocumentGroupLoading,
    isFetchDocumentTypeLoading,
    isSaveLoading,
    isViewAllDocument,
    masintonChange,
    masintonForm,
    masintonMultiChange,
    selected,
    setKeyworDocumentGroup,
    setKeyworDocumentType,
    setSelected,
  };
};

export default useModalUploadDocumentELO;
