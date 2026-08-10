import { useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { TypeProcess } from '@/enums/Module';
import { dayJsJakartaKeep } from '@/helpers/date';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useAddDocument from '@/hooks/services/useAddDocument';
import useGetDocumentById from '@/hooks/services/useGetDocumentById';
import useGetParameterDocumentGroup from '@/hooks/services/useGetParameterDocumentGroup';
import useGetParameterDocumentType from '@/hooks/services/useGetParameterDocumentType';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import {
  DocumentGroupParamRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentParentEnum,
  DocumentTypeRequestDtoOwnershipEnum,
} from '@/services/openapi/bucket-document-service';

import { pathDocumentParentListApuppt } from '../ModalUploadDocumentExisting/ModalUploadDocumentExisting.constants';

import { documentCategoryDropdownList, modal, schema } from './ModalUploadDocument.constantsV2';

import type { ModalUploadDocumentProps } from './ModalUploadDocument.typesV2';

//ToDo: Wandi Refactor this thank you
const useModalUploadDocument = (props: ModalUploadDocumentProps) => {
  const {
    process,
    module,
    id,
    type,
  } = props;

  const { processId, debiturName, debtorId } = useIdentity();
  const [keywordDocumentGroup, setKeyworDocumentGroup] = useState('');
  const [keywordDocumentType, setKeyworDocumentType] = useState('');
  const path = usePathname();
  const isViewAllDocument = getLastPath(path) === 'view-all-document';
  let ownership;

  const { control, watch, setValue, reset, formState: { isValid } } = useForm({
    defaultValues: {
      document: {
        extension: '',
        file: [],
        name: '',
        url: '',
      },
      documentCategory: {
        id: '',
        label: '',
      },
      documentDate: null,
      documentGroup: {
        id: '',
        label: '',
      },
      documentNumber: '',
      documentType: {
        id: '',
        label: '',
      },
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  const {
    documentGroup,
    documentType,
    documentCategory,
    document,
    documentNumber,
    documentDate,
  } = watch();

  let documentParent = documentCategory?.id;

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
      ownership = DocumentTypeRequestDtoOwnershipEnum.BAR;
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
    setValue('documentCategory', documentCategoryDropdownList.find((dt) => dt.id === type));
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

      reset(data ?? {});
    }
  }, [documentDetailData, isDocumentDetailSuccess]);

  const isValidEnumValue = (val: any): val is DocumentGroupParamRequestDtoDocumentCategoryEnum =>
    Object.values(DocumentGroupParamRequestDtoDocumentCategoryEnum).includes(val);

  const categoryId = documentCategory?.id;

  const { data: documentGroupData, isFetching: isFetchDocumentGroupLoading } = useGetParameterDocumentGroup(
    {
      filter: {
        documentCategory: isValidEnumValue(categoryId) ? categoryId : undefined,
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
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      closeNiceModal(modal.MODAL_UPLOAD_DOCUMENT);
      showNiceModalV2({
        onClose() {},
        title: 'Data berhasil disimpan',
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
    if (!isValid) return;
    let payload;
    payload = {
      bucketProcessId: props.childId ?? String(processId),
      debtorId: debtorId ?? undefined,
      document: document.file,
      documentCategory: documentCategory.id,
      documentDate: dayJsJakartaKeep(documentDate),
      documentExtension: document.extension.replace('.', ''),
      documentGroup: documentGroup?.id,
      documentNumber: documentNumber,
      documentParent: isViewAllDocument ? documentCategory.id : formatDocumentParent(),
      documentType: documentType?.id,
      fileName: `${documentType?.label}_${debiturName}_${documentNumber}_${dayjs(documentDate).format('DDMMYYYY')}`,
      id: id ? +id : undefined,
      module,
      ownerId: props?.ownerId ?? props?.bucketMasterId,
      ownership: isViewAllDocument ? undefined : ownership,
      process,
    };

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
    control,
    debiturName,
    document,
    documentCategory,
    documentDate,
    documentDetailData,
    documentGroup,
    documentGroupData,
    documentNumber,
    documentType,
    documentTypeData,
    generateTitle,
    handleSave,
    isFetchDocumentGroupLoading,
    isFetchDocumentTypeLoading,
    isSaveLoading,
    isValid,
    isViewAllDocument,
    setKeyworDocumentGroup,
    setKeyworDocumentType,
    setValue,
  };
};

export default useModalUploadDocument;
