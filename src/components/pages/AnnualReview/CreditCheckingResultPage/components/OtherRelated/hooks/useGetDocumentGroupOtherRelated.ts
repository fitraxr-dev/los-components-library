import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';
import { DocumentControllerApi } from '@/services/openapi/bucket-document-service';


interface PageRequestDto {
  noPage?: number;
  itemPerPage?: number;
}

interface SortRequestDto {
  columnName?: string;
  sortType?: string;
}

interface SearchDetailRequestDto {
  key?: string;
  value?: string;
}

enum DocumentTypeRequestDtoOwnershipEnum {
  DEBTOR = 'DEBTOR',
  DOCUMENTCREDITCHECKING = 'DOCUMENT_CREDIT_CHECKING',
  DOCUMENTREVIEWERDELST = 'DOCUMENT_REVIEWER_DELST',
  DOCUMENTREVIEWERDEPI = 'DOCUMENT_REVIEWER_DEPI',
  DOCUMENTREVIEWERDH = 'DOCUMENT_REVIEWER_DH',
  DOCUMENTREVIEWERDK = 'DOCUMENT_REVIEWER_DK',
  DOCUMENTSITEVISIT = 'DOCUMENT_SITE_VISIT',
  DOCUMENTTECHNICALREVIEW = 'DOCUMENT_TECHNICAL_REVIEW',
  DOCUMENTTECHNICALREVIEWDELST = 'DOCUMENT_TECHNICAL_REVIEW_DELST',
  DOCUMENTUPLOADPKPT = 'DOCUMENT_UPLOAD_PKPT',
  LPA = 'LPA',
  LPAREVIEW = 'LPA_REVIEW',
  MANAGEMENT = 'MANAGEMENT',
  MEMOSUPPLEMENT = 'MEMO_SUPPLEMENT',
  OTHERRELATED = 'OTHER_RELATED',
  PKPTEFFECTIVETERMS = 'PKPT_EFFECTIVE_TERMS',
  PKPTSIGNINGTERMS = 'PKPT_SIGNING_TERMS',
  RISALAHRAPAT = 'RISALAH_RAPAT',
  RISALAHRAPATMERGED = 'RISALAH_RAPAT_MERGED',
  SHAREHOLDER = 'SHAREHOLDER',
  SPFP = 'SPFP',
  MIP = 'MIP',
  MIPANALYST = 'MIP_ANALYST',
  MUP = 'MUP',
  MUPANALYST = 'MUP_ANALYST',
  MIPREVIEW = 'MIP_REVIEW',
  DOCUMENTDEBTOR = 'DOCUMENT_DEBTOR',
  BENEFICIALOWNER = 'BENEFICIAL_OWNER',
  CUSTOMERDUEDILIGENCE = 'CUSTOMER_DUE_DILIGENCE'
}

enum DocumentTypeRequestDtoDocumentCategoryEnum {
  DIGITALMEMO = 'DIGITAL_MEMO',
  FINANCINGDOCUMENT = 'FINANCING_DOCUMENT',
  SUPPORTINGDOCUMENT = 'SUPPORTING_DOCUMENT',
  GALLERYSITEVISIT = 'GALLERY_SITE_VISIT',
  PKPTSIGNINGCONDITIONS = 'PKPT_SIGNING_CONDITIONS',
  PKPTEFFECTIVECONDITIONS = 'PKPT_EFFECTIVE_CONDITIONS',
  RISALAHRAPAT = 'RISALAH_RAPAT',
  ELO = 'ELO',
  REFINA = 'REFINA'
}

enum DocumentTypeRequestDtoDocumentParentEnum {
  DIGITALMEMO = 'DIGITAL_MEMO',
  FINANCINGDOCUMENT = 'FINANCING_DOCUMENT',
  SUPPORTINGDOCUMENT = 'SUPPORTING_DOCUMENT',
  WAITINGAPPROVAL = 'WAITING_APPROVAL',
  DEBTORDOCRESULT = 'DEBTOR_DOC_RESULT',
  SHAREHOLDERDOCRESULT = 'SHAREHOLDER_DOC_RESULT',
  MANAGEMENTDOCRESULT = 'MANAGEMENT_DOC_RESULT',
  OTHERRELATEDDOCRESULT = 'OTHER_RELATED_DOC_RESULT',
  CREDITCHECKING = 'CREDIT_CHECKING',
  GALLERYSITEVISIT = 'GALLERY_SITE_VISIT',
  TECHNICALREVIEW = 'TECHNICAL_REVIEW',
  PKPTSIGNINGCONDITIONS = 'PKPT_SIGNING_CONDITIONS',
  PKPTEFFECTIVECONDITIONS = 'PKPT_EFFECTIVE_CONDITIONS',
  RISALAHRAPAT = 'RISALAH_RAPAT',
  COMPLIANCECHECK = 'COMPLIANCE_CHECK',
  OFFERINGLETTER = 'OFFERING_LETTER',
  DOCUMENTAPUPPT = 'DOCUMENT_APU_PPT',
  NPWP = 'NPWP',
  NPWPSHAREHOLDER = 'NPWP_SHAREHOLDER',
  NPWPMANAGEMENT = 'NPWP_MANAGEMENT',
  NIKMANAGEMENT = 'NIK_MANAGEMENT',
  ELO = 'ELO'
}

interface DocumentTypeRequestDto {
  documentParent?: DocumentTypeRequestDtoDocumentParentEnum;
  documentCategory?: DocumentTypeRequestDtoDocumentCategoryEnum;
  bucketProcessId?: string;
  process?: string;
  module?: string;
  ownership?: DocumentTypeRequestDtoOwnershipEnum;
  ownerId?: string;
  multiDocsParents?: string;
  multiDocsCategories?: string;
  startDate?: string;
  endDate?: string;
  uploadedStartDate?: string;
  uploadedEndDate?: string;
  division?: Array<string>;
  documentGroup?: Array<string>;
  documentType?: Array<string>;
  document?: Array<string>;
  previousBucketProcessId?: Array<string>;
  documentParentApprovedMandatory?: Array<string>;
  approvedExcludeDocumentCategory?: Array<string>;
  approvedMandatoryDocumentCategory?: Array<string>;
  debtorId?: string;
  approvedOnly?: boolean;
  codeBlacklist?: Array<string>;
}

interface GenericBucketRequestDtoDocumentTypeRequestDto {
  page?: PageRequestDto;
  sortList?: SortRequestDto;
  searchDetail?: SearchDetailRequestDto;
  filter?: DocumentTypeRequestDto;
}

const api = new DocumentControllerApi();

const useGetDocumentGroupOtherRelated = (payload: GenericBucketRequestDtoDocumentTypeRequestDto) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('bucketDocument.document.getOtherDocumentGroup', {
        data: payload,
      });

      return res.data.data;
    },
    queryKey: ['mns-document-group-other-related'],
  });

  return query;
};

export default useGetDocumentGroupOtherRelated;
