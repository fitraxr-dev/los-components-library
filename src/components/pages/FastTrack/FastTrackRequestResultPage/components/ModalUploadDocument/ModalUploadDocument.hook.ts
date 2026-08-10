import { useEffect, useMemo, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { usePathname, useSearchParams } from 'next/navigation';

import { DocumentTypeRequest } from '@/enums/DocumentTypeRequest';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { dayJsJakartaKeep, formatDateTime } from '@/helpers/date';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useAddDocument from '@/hooks/services/useAddDocument';
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

import useDetailDocument from '../../hooks/useDetailDocument';
import useGetMandatoryCheckOptions from '../../hooks/useGetMandatoryCheckOptions';
import { pathDocumentParentListApuppt } from '../ModalUploadDocumentExisting/ModalUploadDocumentExisting.constants';

import { documentCategoryDropdownList, modal } from './ModalUploadDocument.constants';
import { formData, validation } from './ModalUploadDocument.form';

import type { ModalUploadDocumentProps } from './ModalUploadDocument.types';

//ToDo: Wandi Refactor this thank you
const useModalUploadDocument = (props: ModalUploadDocumentProps) => {
  let {
    process,
    module,
    id,
    type,
    disableGroupOnKtpNpwp = false,
    ownerId,
    sourceSection,
    isViewOnly,
  } = props;

  const paramOwnerId = useSearchParams().get('ownerId');
  ownerId = paramOwnerId ? paramOwnerId : ownerId;

  const { processId, debiturName, debtorId } = useIdentity();
  const [keywordDocumentGroup, setKeyworDocumentGroup] = useState('');
  const [keywordDocumentType, setKeyworDocumentType] = useState('');
  const path = usePathname();
  const isViewAllDocument = getLastPath(path) === 'view-all-document';
  const hasInitialDataLoaded = useRef(false);
  const previousDocumentType = useRef<string | null>(null);
  let ownership;
  const queryClient = useQueryClient();

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
    memoType: { value: memoType },
  } = masintonForm;

  let documentParent = documentCategory;
  const pathDocumentParent = pathDocumentParentListApuppt.find((item) => item?.path === path?.split('/')[5])?.documentParent;

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
      ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTTECHNICALREVIEWDELST;
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
      ownership = DocumentTypeRequestDtoOwnershipEnum.SPFP;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.OFFERINGLETTER;
      break;
    case TypeProcess.SPDP:
    case TypeProcess.SPFP_FINAL:
      ownership = DocumentTypeRequestDtoOwnershipEnum.SPFP;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
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
      ownership = pathDocumentParent;
      break;
    case TypeProcess.APU_PPT:
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.DOCUMENTAPUPPT;
      if (pathDocumentParent === DocumentTypeRequestDtoOwnershipEnum.CUSTOMERDUEDILIGENCE && !!ownerId) {
        ownership = DocumentTypeRequestDtoOwnershipEnum.CUSTOMERDUEDILIGENCE;
      } else if (pathDocumentParent === DocumentTypeRequestDtoOwnershipEnum.BENEFICIALOWNER) {
        ownership = DocumentTypeRequestDtoOwnershipEnum.BENEFICIALOWNER;
      } else if (pathDocumentParent === DocumentTypeRequestDtoOwnershipEnum.DOCUMENTDEBTOR) {
        ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTDEBTOR;
      } else {
        ownership = DocumentTypeRequestDtoOwnershipEnum.ADDITIONALDOCUMENT;
      }
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
      ownership = DocumentTypeRequest.HIGH_RISK_CONCLUSION;
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
    case TypeProcess.FAST_TRACK:
      ownership = 'FAST_TRACK';
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    default:
      ownership = DocumentTypeRequestDtoOwnershipEnum.OTHERRELATED;
      break;
  }


  const {
    data: defaultDocumentDetailData,
    isSuccess: isDefaultDocumentDetailSuccess,
  } = useGetDocumentById(
    { id: +id }, { enabled: id !== undefined && id !== null && module !== TypeModule.FAST_TRACK });

  const {
    data: fastTrackDocumentDetailData,
    isSuccess: isFastTrackDocumentDetailSuccess,
  } = useDetailDocument({
    bucketProcessId: props.childId ?? String(processId),
    documentId: id,
    enabled: id !== undefined && id !== null && module === TypeModule.FAST_TRACK,
    module,
    process,
  });

  const documentDetailData = module === TypeModule.FAST_TRACK ? fastTrackDocumentDetailData : defaultDocumentDetailData;
  const isDocumentDetailSuccess = module === TypeModule.FAST_TRACK ?
    isFastTrackDocumentDetailSuccess : isDefaultDocumentDetailSuccess;


  useEffect(() => {
    masintonChange('documentCategory', documentCategoryDropdownList.find((dt) => dt.id === type));
  }, []);


  useEffect(() => {
    const isFastTrackView = module === TypeModule.FAST_TRACK;
    const {
      documentExtension,
      fileExt,
      document,
      imageUrl,
      fileName,
      documentName,
      documentGroupLabel,
      documentGroup,
      documentType,
      documentTypeLabel,
      documentCategory,
      documentCategoryLabel,
      sourceSection,
      remarkDoc,
      remark,
      documentNumber,
      documentNo,
      documentDate,
    } = documentDetailData || {};

    if (documentDetailData && isDocumentDetailSuccess) {
      const newData = structuredClone(documentDetailData);

      const ext = isFastTrackView ? fileExt : documentExtension;
      const docUrl = isFastTrackView ? imageUrl : document;
      const fName = isFastTrackView ? documentName : fileName?.split('.')?.[0];

      const data = Object.assign(newData, {
        document: docUrl ? {
          extension: `.${ext}`,
          name: fName,
          url: docUrl,
        } : null,
        documentCategory: {
          id: documentCategory,
          label: documentCategoryLabel,
        },
        documentDate: isFastTrackView ? formatDateTime(documentDate) : documentDate,
        documentGroup: {
          id: documentGroup,
          label: documentGroupLabel,
        },
        documentNumber: isFastTrackView ? (documentNo || documentNumber) : documentNumber,
        documentType: {
          id: documentType,
          label: documentTypeLabel,
        },
        memoType: {
          label: documentDetailData?.jenisMemoName || '',
          value: documentDetailData?.jenisMemo || '',
        },
        remark: isFastTrackView ? remarkDoc : remark,
      });

      masintonMagic(data ?? {});
      hasInitialDataLoaded.current = true;
      // Store initial documentType to prevent reset on initial load
      previousDocumentType.current = documentType;
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

  const { data: memoOptionsData, isFetching: isFetchMemoOptionsLoading } = useGetMandatoryCheckOptions();
  console.log('memoOptionsData', memoOptionsData);

  const { mutate: saveDocument, isPending: isSaveLoading } = useAddDocument({
    onError: (error) => {
      const errorData = error?.message;
      showNiceModalV2({
        title: errorData,
        type: 'error',
      });
    },
    onSuccess: () => {
      closeNiceModal(modal.MODAL_UPLOAD_DOCUMENT);
      closeNiceModal('MODAL_UPLOAD_DOCUMENT_ELO');
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['fast-track-list']});
      queryClient.invalidateQueries({ queryKey: ['detail-fast-track']});
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
    if (!masintonValidation()) return;
    let payload: any;
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
      id: documentDetailData?.documentId || (id ? +id : undefined),
      jenisMemo: memoType?.value,
      module,
      ownerId: props?.ownerId ? props?.bucketMasterId : ownerId,
      ownership: isViewAllDocument ? undefined : ownership,
      process,
      remarkDoc: masintonForm.remark?.value,
      sourceSection: sourceSection,
    });
    delete payload.remark;
    delete payload.memoType;
    saveDocument(payload);
  };

  const generateTitle = (id: number) => {
    if (id) {
      return 'Edit Dokumen';
    } else {
      return 'Add Dokumen';
    }
  };

  // Check if documentType is KTP or NPWP
  const isKtpOrNpwp = useMemo(() => {
    if (!disableGroupOnKtpNpwp) return false;
    if (!documentType) return false;
    const docTypeValue = documentType?.value || documentType;
    const docTypeLabel = typeof docTypeValue === 'object' ? docTypeValue?.label : docTypeValue;
    const docTypeId = typeof docTypeValue === 'object' ? docTypeValue?.value : docTypeValue;
    return docTypeLabel === 'KTP' || docTypeLabel === 'NPWP' || docTypeId === 'KTP' || docTypeId === 'NPWP';
  }, [documentType, disableGroupOnKtpNpwp]);


  const isRatingUploadFile = useMemo(() => {
    if (!documentType) return false;
    const docTypeValue = documentType?.value || documentType;

    const docTypeId = typeof docTypeValue === 'object' ? docTypeValue?.id : docTypeValue;
    return docTypeId === 'RATING_UPLOAD_FILE_RATING_&_HISTORY';

  }, [documentType]);

  useEffect(() => {
    if (!disableGroupOnKtpNpwp || !isKtpOrNpwp || !documentGroup?.id) {
      // Update previous documentType even if not KTP/NPWP or conditions not met
      if (documentType) {
        const currentDocTypeId = typeof documentType === 'object' ? documentType?.id : documentType;
        previousDocumentType.current = currentDocTypeId;
      }
      return;
    }

    const currentDocTypeId = typeof documentType === 'object' ? documentType?.id : documentType;
    const prevDocTypeId = previousDocumentType.current;

    if (!hasInitialDataLoaded.current || (prevDocTypeId !== null && prevDocTypeId !== currentDocTypeId)) {
      masintonMultiChange({
        documentGroup: '',
      });
    }

    previousDocumentType.current = currentDocTypeId;
  }, [isKtpOrNpwp, disableGroupOnKtpNpwp, documentType, documentGroup, masintonMultiChange]);

  return {
    debiturName,
    documentDetailData,
    documentGroupData,
    documentTypeData,
    generateTitle,
    handleSave,
    isFetchDocumentGroupLoading,
    isFetchDocumentTypeLoading,
    isFetchMemoOptionsLoading,
    isKtpOrNpwp,
    isRatingUploadFile,
    isSaveLoading,
    isViewAllDocument,
    isViewOnly,
    masintonChange,
    masintonForm,
    masintonMultiChange,
    memoOptionsData,
    setKeyworDocumentGroup,
    setKeyworDocumentType,
  };
};

export default useModalUploadDocument;
