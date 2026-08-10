/* eslint-disable max-len */
/* eslint-disable sort-keys */
/* eslint-disable sort-keys-fix/sort-keys-fix */

export const HOME_PAGE = '/';

export const NOTIFICATION_DETAIL = '/notification-detail';

export const PASSWORD_PAGE = {

  /**
   * '/password/create'
   */
  CREATE_PAGE: '/password/create',

  /**
   * '/password/create'
   */
  FORGOT_PAGE: '/password/forgot',
};

export const LOGIN_PAGE = '/login';

export const NOT_FOUND_PAGE = '/404';

export const TESTING_PAGE = '/konoha';

export const bmppSimulation = {
  /**
   * '/bmpp-simulation'
   */
  BUCKET_LIST_PAGE: '/bmpp-simulation',
  /**
   * '/bmpp-simulation/[debtorId]'
   */
  DEBTOR_DETAIL_PAGE: '/bmpp-simulation/[debtorId]',
};

export const bmppMonitoring = {
  /**
   * '/bmpp-monitoring/[id]/group/bmpp-calculation/[calculationId]'
   */
  GROUP_CALCULATION_PAGE: '/bmpp-monitoring/[id]/group/bmpp-calculation/[calculationId]',
  /**
   * '/bmpp-monitoring/[id]/group/detail'
   */
  GROUP_DETAIL_PAGE: '/bmpp-monitoring/[id]/group/detail',
  /**
   * '/bmpp-monitoring/[id]/individual/bmpp-calculation/[calculationId]'
   */
  INDIVIDUAL_CALCULATION_PAGE: '/bmpp-monitoring/[id]/individual/bmpp-calculation/[calculationId]',
  /**
   * '/bmpp-monitoring/[id]/individual/detail'
   */
  INDIVIDUAL_DETAIL_PAGE: '/bmpp-monitoring/[id]/individual/detail',
  /**
   * '/bmpp-monitoring'
   */
  MAIN_PAGE: '/bmpp-monitoring',
};

export const uploadDatabaseDk = {
  /**
   * '/upload-database-dk/detail/[id]'
   */
  DETAIL_PAGE: '/upload-database-dk/detail/[id]',
  /**
   * '/upload-database-dk'
   */
  LIST_PAGE: '/upload-database-dk',
};

export const pipeline = {

  /**
   * '/loan-processing/submission-proposal/pipeline/[processId]/detail'
   */
  DETAIL_PAGE: '/loan-processing/submission-proposal/pipeline/[processId]/detail',

  /**
   * '/loan-processing/submission-proposal/pipeline/[processId]/detail'
   */
  EDIT_PAGE: '/loan-processing/submission-proposal/pipeline/[processId]/edit',


  /**
   * '/loan-processing/submission-proposal/pipeline/group/[debtorId]/detail/[groupId]'
   */
  GROUP_DETAIL_PAGE: '/loan-processing/submission-proposal/pipeline/group/[debtorId]/[processId]/detail/[groupId]',


  /**
   * '/loan-processing/submission-proposal/pipeline/group/[debtorId]'
   */
  GROUP_PAGE: '/loan-processing/submission-proposal/pipeline/group/[debtorId]/[processId]',


  /**
   * '/loan-processing/submission-proposal/pipeline'
   */
  LIST_PAGE: '/loan-processing/submission-proposal/pipeline',

  /**
   * '/loan-processing/submission-proposal/pipeline/management-shareholder/[processId]'
   */
  MANAGEMENT_SHAREHOLDER_PAGE: '/loan-processing/submission-proposal/pipeline/management-shareholder/[processId]',
  /**
   * '/loan-processing/submission-proposal/pipeline/group/[debtorId]/create-new-group'
   */
  NEW_GROUP_PAGE: '/loan-processing/submission-proposal/pipeline/group/[debtorId]/[processId]/create-new-group',
  /**
   * '/loan-processing/submission-proposal/pipeline/create-new-debtor'
   */
  NEW_PAGE: '/loan-processing/submission-proposal/pipeline/create-new-debtor',
  /**
   * '/loan-processing/submission-proposal/pipeline/project/[debtorId]/[processId]'
   */
  PROJECT_PAGE: '/loan-processing/submission-proposal/pipeline/project/[debtorId]/[processId]',
  /**
   * '/loan-processing/submission-proposal/pipeline/[processId]/validation'
   */
  VALIDATION_PAGE: '/loan-processing/submission-proposal/pipeline/[processId]/validation',
  /**
   * '/loan-processing/submission-proposal/pipeline/[processId]/view-all-document'
   */
  VIEW_ALL_DOCUMENT_PAGE: '/loan-processing/submission-proposal/pipeline/[processId]/view-all-document',
};

export const annualReview = {
  /**
   * '/annual-review/[pageModule]'
   */
  LIST_PAGE: '/annual-review/[pageModule]',

  /**
   * '/annual-review/[pageModule]/[processId]/debtor-information'
   */
  CUSTOMER_INFORMATION_PAGE: '/annual-review/[pageModule]/[processId]/debtor-information',

  /**
   * '/annual-review/[pageModule]/[processId]/facility-overview'
   */
  FACILITY_OVERVIEW: '/annual-review/[pageModule]/[processId]/facility-overview',

  /**
   * '/annual-review/[pageModule]/[processId]/credit-checking-result'
   */
  INFO_CREDIT_CHECKING: '/annual-review/[pageModule]/[processId]/credit-checking-result',

  /**
   * '/annual-review/[pageModule]/[processId]/customer-due-diligence'
   */
  CUSTOMER_DUE_DILIGENCE: '/annual-review/[pageModule]/[processId]/customer-due-diligence',

  /**
   * '/annual-review/[pageModule]/[processId]/bmpp'
   */
  BMPP: '/annual-review/[pageModule]/[processId]/bmpp',

  /**
   * '/annual-review/[pageModule]/[processId]/additional-information'
   */
  ADDITIONAL_INFORMATION: '/annual-review/[pageModule]/[processId]/additional-information',

  /**
   * '/annual-review/[pageModule]/[processId]/draft-memo'
   */
  DRAFT_MEMO: '/annual-review/[pageModule]/[processId]/draft-memo',

  /**
   * '/annual-review/[pageModule]/[processId]/view-all-document'
   */
  VIEW_ALL_DOCUMENT: '/annual-review/[pageModule]/[processId]/view-all-document',

  /**
   * '/annual-review/[pageModule]/[processId]/validation'
   */
  VALIDATION: '/annual-review/[pageModule]/[processId]/validation',

  /**
   * '/annual-review/[pageModule]/[processId]/rating'
   */
  RATING: '/annual-review/[pageModule]/[processId]/rating',

  /**
   * '/annual-review/[pageModule]/[processId]/re-rating'
   */
  RATING_HISTORY: '/annual-review/[pageModule]/[processId]/re-rating',
};

export const mip = {

  /**
   * '/loan-processing/submission-proposal/mip/[processId]/bmpp'
   */
  BMPP_PAGE: '/loan-processing/submission-proposal/mip/[processId]/bmpp',


  /**
   * '/loan-processing/submission-proposal/mip/[processId]/customer-due-diligence'
   */
  CDD_IMPLEMENTATION: '/loan-processing/submission-proposal/mip/[processId]/customer-due-diligence',


  /**
   * '/loan-processing/submission-proposal/mip/[processId]/debtor-information'
   */
  CUSTOMER_INFORMATION_PAGE: '/loan-processing/submission-proposal/mip/[processId]/debtor-information',


  /**
   * '/loan-processing/mup/[processId]/executive-summary/add'
   */
  EXECUTIVE_OVERVIEW_ADD_FULLFILLMENT_PAGE: '/loan-processing/submission-proposal/mip/[processId]/executive-summary/add',


  /**
   * '/loan-processing/mup/[processId]/executive-summary/edit/[id]'
   */
  EXECUTIVE_OVERVIEW_EDIT_FULLFILLMENT_PAGE: '/loan-processing/submission-proposal/mip/[processId]/executive-summary/edit/[id]',


  /**
   * '/loan-processing/mup/[processId]/executive-summary'
   */
  EXECUTIVE_OVERVIEW_PAGE: '/loan-processing/submission-proposal/mip/[processId]/executive-summary',


  /**
   * '/loan-processing/submission-proposal/mip'
   */
  LIST_PAGE: '/loan-processing/submission-proposal/mip',


  /**
   * '/loan-processing/submission-proposal/mip/[processId]/memo-supplement'
   */
  MEMO_SUPPLEMENT_PAGE: '/loan-processing/submission-proposal/mip/[processId]/memo-supplement',


  /**
   * '/loan-processing/submission-proposal/mip/[processId]/'
   */
  MIP_DETAIL: '/loan-processing/submission-proposal/mip/[processId]/',


  /**
   * '/loan-processing/submission-proposal/mip/[processId]/memo-supplement'
   */
  MIP_REVIEW_REVISION_PAGE: '/loan-processing/submission-proposal/mip/[processId]/mip-discussion',


  /**
   * '/loan-processing/submission-proposal/mip/[processId]/proposal'
   */
  PROPOSAL_PAGE: '/loan-processing/submission-proposal/mip/[processId]/proposal',


  /**
   * '/loan-processing/submission-proposal/mip/[processId]/review-monitoring'
   */
  REVIEW_MONITORING: '/loan-processing/submission-proposal/mip/[processId]/review-monitoring',

  /**
   * '/loan-processing/submission-proposal/mip/[processId]/environment-and-social-safeguard-issue/edit/[id]'
   */
  ENVIRONMENTAL_AND_SOCIAL_SAFEGUARD_ISSUE_EDIT_PAGE: '/loan-processing/submission-proposal/mip/[processId]/environmental-and-social-safeguard-issue/edit/[id]',

  /**
   * '/loan-processing/submission-proposal/mip/[processId]/environmental-and-social-safeguard-issue'
   */
  ENVIRONMENTAL_AND_SOCIAL_SAFEGUARD_ISSUE_PAGE: '/loan-processing/submission-proposal/mip/[processId]/environmental-and-social-safeguard-issue',

  /**
   * '/loan-processing/submission-proposal/mip/[processId]/environmental-and-social-safeguard-issue/edit-report-routine/[id]]'
   */
  ENVIRONMENTAL_AND_SOCIAL_SAFEGUARD_REPORT_RUTIN_EDIT_PAGE: '/loan-processing/submission-proposal/mip/[processId]/environmental-and-social-safeguard-issue/edit-report-routine/[id]',


  /**
   * '/loan-processing/submission-proposal/mip/[processId]/sharia-compliance-aspect'
   */
  SHARIA_COMPLIANCE_ASPECT_PAGE: '/loan-processing/submission-proposal/mip/[processId]/sharia-compliance-aspect',

  /**
   * '/loan-processing/mup/[processId]/sharia-compliance-aspect/edit-external-concern/[id]'
   */
  SHARIA_COMPLIANCE_ASPECT_EDIT_EXTERNAL_PAGE: '/loan-processing/submission-proposal/mip/[processId]/sharia-compliance-aspect/edit-external-concern/[id]',
  /**
   * '/loan-processing/mup/[processId]/sharia-compliance-aspect/edit-internal-concern/[id]'
   */
  SHARIA_COMPLIANCE_ASPECT_EDIT_INTERNAL_PAGE: '/loan-processing/submission-proposal/mip/[processId]/sharia-compliance-aspect/edit-internal-concern/[id]',

  RATING_AND_RISK_PROFILE_PAGE: '/loan-processing/submission-proposal/mip/[processId]/rating-and-risk-profile',

  /**
   * '/loan-processing/submission-proposal/mip/[processId]/rating-history'
   */
  RATING_HISTORY: '/loan-processing/submission-proposal/mip/[processId]/rating-history',
};

export const analyst = {
  /**
   * '/loan-processing/submission-proposal/analyst/[processId]/bmpp'
   */
  BMPP_PAGE: '/loan-processing/submission-proposal/analyst/[processId]/bmpp',
  /**
   * '/mip/[processId]/customer-information'
   */
  DEBTOR_INFORMATION_PAGE: '/loan-processing/submission-proposal/analyst/[processId]/debtor-information',
  /**
   * '/loan-processing/submission-proposal/analyst'
   */
  LIST_PAGE: '/loan-processing/submission-proposal/analyst',
  /**
   * '/loan-processing/submission-proposal/analyst/[processId]/'
   */
  MIP_DETAIL: '/loan-processing/submission-proposal/analyst/[processId]/',
};

export const eligibilityReview = {
  /**
   * '/loan-processing/review/eligibility-review/[module]/[processId]/additional-information''
   */
  ADDITIONAL_INFORMATION_PAGE: '/loan-processing/review/eligibility-review/[module]/[processId]/additional-information',
  /**
   * '/loan-processing/review/eligibility-review/assignment'
   */
  ASSIGNMENT_PAGE: '/loan-processing/review/eligibility-review/assignment',
  /**
   * '/loan-processing/review/eligibility-review/[module]'
   */
  BASE_PATH: '/loan-processing/review/eligibility-review/[module]',
  /**
   * '/loan-processing/review/eligibility-review/[processId]/debtor-information'
   */
  DEBTOR_INFORMATION_PAGE: '/loan-processing/review/eligibility-review/[module]/[processId]/debtor-information',
  /**
   * 'loan-processing/review/eligibility-review/[module]/[processId]/rating'
   */
  RATING: '/loan-processing/review/eligibility-review/[module]/[processId]/rating',
  /**
   * 'loan-processing/review/eligibility-review/[module]/[processId]/rating-history'
   */
  RATING_HISTORY: '/loan-processing/review/eligibility-review/[module]/[processId]/rating-history',
  /**
   * '/loan-processing/review/history-process/[processId]'
   */
  HISTORY_PROCESS_PAGE: '/loan-processing/review/history-process/[processId]',
  /**
   * '/loan-processing/review/eligibility-review/bucket-list
   */
  LIST_PAGE: '/loan-processing/review/eligibility-review/bucket-list',
  /**
   * '/loan-processing/review/eligibility-review/monitoring'
   */
  MONITORING_LIST_PAGE: '/loan-processing/review/eligibility-review/monitoring',
  /**
   * '/loan-processing/review/eligibility-review/[processId]/proposal_summary'
   */
  PROPOSAL_SUMMARY_PAGE: '/loan-processing/review/eligibility-review/[processId]/proposal_summary',
  /**
   * '/loan-processing/review/eligibility-review/[processId]/risk-profile'
   */
  RISK_PROFILE_PAGE: '/loan-processing/review/eligibility-review/[module]/[processId]/risk-profile',
  /**
   * '/loan-processing/review/eligibility-review/[processId]/risk-profile/risk-profile-add'
   */
  RISK_PROFILE_PAGE_ADD: '/loan-processing/review/eligibility-review/[module]/[processId]/risk-profile/risk-profile-add',
  /**
   * '/loan-processing/review/eligibility-review/[processId]/risk-profile/[id]/risk-profile-edit'
   */
  RISK_PROFILE_PAGE_EDIT: '/loan-processing/review/eligibility-review/[module]/[processId]/risk-profile/[id]/risk-profile-edit',
  /**
   * '/loan-processing/review/eligibility-review/[processId]/validation'
   */
  VALIDATION_PAGE: '/loan-processing/review/eligibility-review/[processId]/validation',
  /**
   * '/loan-processing/review/eligibility-review/[processId]/view-all-document'
   */
  VIEW_ALL_DOCUMENT_PAGE: '/loan-processing/review/eligibility-review/[processId]/view-all-document',
};

export const highRisk = {
  /**
    * '/loan-processing/high-risk/assignment/[processId]/assumptions-qualification'
    */
  ASSIGNMENT_ASSUMPTIONS_AND_QUALIFICATIONS_PAGE: '/loan-processing/high-risk/assignment/[processId]/assumptions-qualifications',
  /**
    * '/loan-processing/high-risk/assignment/[processId]/compliance-analysis'
    */
  ASSIGNMENT_COMPLIANCE_ANALYSIS_PAGE: '/loan-processing/high-risk/assignment/[processId]/compliance-analysis',
  /**
    * '/loan-processing/high-risk/assignment/[processId]/conclusion/[id]'
    */
  ASSIGNMENT_CONCLUSION_EDIT_VERIFICATION_PAGE: '/loan-processing/high-risk/assignment/[processId]/conclusion/edit/[id]',
  /**
    * '/loan-processing/high-risk/assignment/[processId]/debtor-information'
    */
  ASSIGNMENT_DEBTOR_INFORMATION_PAGE: '/loan-processing/high-risk/assignment/[processId]/debtor-information',
  /**
        * '/loan-processing/high-risk/assignment/[processId]/draft-memo'
        */
  ASSIGNMENT_DRAFT_MEMO_PAGE: '/loan-processing/high-risk/assignment/[processId]/draft-memo',
  /**
    * '/loan-processing/high-risk/assignment/[processId]/legal-foundation'
    */
  ASSIGNMENT_LEGAL_FOUNDATION_PAGE: '/loan-processing/high-risk/assignment/[processId]/legal-foundation',
  /**
  * '/loan-processing/high-risk/assignment'
  */
  ASSIGNMENT_LIST_PAGE: '/loan-processing/high-risk/assignment',
  /**
    * '/loan-processing/high-risk/assignment/[processId]/objective'
    */
  ASSIGNMENT_OBJECTIVE_PAGE: '/loan-processing/high-risk/assignment/[processId]/objective',
  /**
    * '/loan-processing/high-risk/assignment/[processId]/summary'
    */
  ASSIGNMENT_SUMMARY_PAGE: '/loan-processing/high-risk/assignment/[processId]/summary',
  /**
    * '/loan-processing/high-risk/assignment/[processId]/validasi'
    */
  ASSIGNMENT_VALIDATION_PAGE: '/loan-processing/high-risk/assignment/[processId]/validation',
  /**
    * '/loan-processing/high-risk/assignment/[processId]/view-all-docs'
    */
  ASSIGNMENT_VIEW_ALL_DOCUMENT_PAGE: '/loan-processing/high-risk/assignment/[processId]/view-all-document',
  /**
   * '/loan-processing/high-risk/[module]'
   */
  BASE_PATH: '/loan-processing/high-risk/[module]',
  /**
    * '/loan-processing/high-risk/bucket/[processId]/assumptions-qualification'
    */
  BUCKET_ASSUMPTIONS_AND_QUALIFICATIONS_PAGE: '/loan-processing/high-risk/bucket/[processId]/assumptions-qualifications',
  /**
        * '/loan-processing/high-risk/bucket/[processId]/compliance-analysis'
        */
  BUCKET_COMPLIANCE_ANALYSIS_PAGE: '/loan-processing/high-risk/bucket/[processId]/compliance-analysis',
  /**
        * '/loan-processing/high-risk/bucket/[processId]/conclusion/[id]'
        */
  BUCKET_CONCLUSION_EDIT_VERIFICATION_PAGE: '/loan-processing/high-risk/bucket/[processId]/conclusion/edit/[id]',
  /**
        * '/loan-processing/high-risk/bucket/[processId]/debtor-information'
        */
  BUCKET_DEBTOR_INFORMATION_PAGE: '/loan-processing/high-risk/bucket/[processId]/debtor-information',
  /**
        * '/loan-processing/high-risk/bucket/[processId]/draft-memo'
        */
  BUCKET_DRAFT_MEMO_PAGE: '/loan-processing/high-risk/bucket/[processId]/draft-memo',
  /**
        * '/loan-processing/high-risk/bucket/[processId]/legal-foundation'
        */
  BUCKET_LEGAL_FOUNDATION_PAGE: '/loan-processing/high-risk/bucket/[processId]/legal-foundation',
  /**
    * '/loan-processing/high-risk/bucket'
    */
  BUCKET_LIST_PAGE: '/loan-processing/high-risk/bucket',
  /**
        * '/loan-processing/high-risk/bucket/[processId]/objective'
        */
  BUCKET_OBJECTIVE_PAGE: '/loan-processing/high-risk/bucket/[processId]/objective',
  /**
        * '/loan-processing/high-risk/bucket/[processId]/summary'
        */
  BUCKET_SUMMARY_PAGE: '/loan-processing/high-risk/bucket/[processId]/summary',
  /**
        * '/loan-processing/high-risk/bucket/[processId]/validasi'
        */
  BUCKET_VALIDATION_PAGE: '/loan-processing/high-risk/bucket/[processId]/validation',
  /**
        * '/loan-processing/high-risk/bucket/[processId]/view-all-docs'
        */
  BUCKET_VIEW_ALL_DOCUMENT_PAGE: '/loan-processing/high-risk/bucket/[processId]/view-all-document',
  /**
    * '/loan-processing/high-risk/monitoring/[processId]/assumptions-qualification'
    */
  MONITORING_ASSUMPTIONS_AND_QUALIFICATIONS_PAGE: '/loan-processing/high-risk/monitoring/[processId]/assumptions-qualifications',
  /**
        * '/loan-processing/high-risk/monitoring/[processId]/compliance-analysis'
        */
  MONITORING_COMPLIANCE_ANALYSIS_PAGE: '/loan-processing/high-risk/monitoring/[processId]/compliance-analysis',
  /**
        * '/loan-processing/high-risk/monitoring/[processId]/conclusion/[id]'
        */
  MONITORING_CONCLUSION_EDIT_VERIFICATION_PAGE: '/loan-processing/high-risk/monitoring/[processId]/conclusion/edit/[id]',
  /**
        * '/loan-processing/high-risk/monitoring/[processId]/debtor-information'
        */
  MONITORING_DEBTOR_INFORMATION_PAGE: '/loan-processing/high-risk/monitoring/[processId]/debtor-information',
  /**
        * '/loan-processing/high-risk/monitoring/[processId]/draft-memo'
        */
  MONITORING_DRAFT_MEMO_PAGE: '/loan-processing/high-risk/monitoring/[processId]/draft-memo',
  /**
        * '/loan-processing/high-risk/monitoring/[processId]/legal-foundation'
        */
  MONITORING_LEGAL_FOUNDATION_PAGE: '/loan-processing/high-risk/monitoring/[processId]/legal-foundation',
  /**
    * '/loan-processing/high-risk/monitoring'
    */
  MONITORING_LIST_PAGE: '/loan-processing/high-risk/monitoring',
  /**
        * '/loan-processing/high-risk/monitoring/[processId]/objective'
        */
  MONITORING_OBJECTIVE_PAGE: '/loan-processing/high-risk/monitoring/[processId]/objective',
  /**
        * '/loan-processing/high-risk/monitoring/[processId]/summary'
        */
  MONITORING_SUMMARY_PAGE: '/loan-processing/high-risk/monitoring/[processId]/summary',
  /**
        * '/loan-processing/high-risk/monitoring/[processId]/validasi'
        */
  MONITORING_VALIDATION_PAGE: '/loan-processing/high-risk/monitoring/[processId]/validation',
  /**
        * '/loan-processing/high-risk/monitoring/[processId]/view-all-docs'
        */
  MONITORING_VIEW_ALL_DOCUMENT_PAGE: '/loan-processing/high-risk/monitoring/[processId]/view-all-document',
};

export const siteVisit = {
  /**
   * '/loan-processing/site-visit/[processId]/data'
   */
  DATA_SITE_VISIT_PAGE: '/loan-processing/site-visit/[processId]/data-site-visit',
  /**
   * '/loan-processing/site-visit/[processId]/debtor-information'
   */
  DEBTOR_INFORMATION_PAGE: '/loan-processing/site-visit/[processId]/debtor-information',
  /**
   * '/loan-processing/site-visit'
   */
  LIST_PAGE: '/loan-processing/site-visit',
  /**
   * '/loan-processing/site-visit/[processId]/site-visit-request'
   */
  SITE_VISIT_PAGE: '/loan-processing/site-visit/[processId]/site-visit-request',
  /**
   * '/loan-processing/site-visit/[processId]/validation'
   */
  VALIDATION_PAGE: '/loan-processing/site-visit/[processId]/validation',
  /**
   * '/loan-processing/site-visit/[processId]/view-all-document'
   */
  VIEW_ALL_DOCUMENT_PAGE: '/loan-processing/site-visit/[processId]/view-all-document',
};

export const creditChecking = {
  /**
   * '/loan-processing/credit-checking/assignment/[processId]/debtor-information'
   */
  ASSIGNMENT_DEBTOR_INFORMATION_PAGE: '/loan-processing/credit-checking/assignment/[processId]/debtor-information',
  /**
   * '/loan-processing/credit-checking/assignment'
   */
  ASSIGNMENT_PAGE: '/loan-processing/credit-checking/assignment',
  /**
   * '/loan-processing/credit-checking/assignment/[processId]/result''
   */
  ASSIGNMENT_RESULT_PAGE: '/loan-processing/credit-checking/assignment/[processId]/result',
  /**
   * '/loan-processing/credit-checking/bucket-credit-checking/[processId]/result'
   */
  BUCKET_CREDIT_CHECKING_RESULT_PAGE: '/loan-processing/credit-checking/bucket-credit-checking/[processId]/result',
  /**
   * '/loan-processing/credit-checking/bucket-credit-checking/[processId]/request'
   */
  BUCKET_DEBTOR_INFORMATION_PAGE: '/loan-processing/credit-checking/bucket-credit-checking/[processId]/debtor-information',

  /**
   * '/loan-processing/credit-checking/bucket-credit-checking/[processId]/document-verification'
   */
  BUCKET_DOCUMENT_VERIFICATION_PAGE: '/loan-processing/credit-checking/bucket-credit-checking/[processId]/document-verification',
  /**
   * '/loan-processing/credit-checking/bucket-credit-checking'
   */
  BUCKET_LIST_PAGE: '/loan-processing/credit-checking/bucket-credit-checking',
  /**
   * '/loan-processing/credit-checking/request/[processId]/'
   */
  DETAIL_PAGE: '/loan-processing/credit-checking/request/[processId]/',
  /**
   * '/loan-processing/credit-checking/request/[processId]/request'
   */
  DETAIL_REQUEST_PAGE: '/loan-processing/credit-checking/request/[processId]/request',
  /**
   * '/loan-processing/credit-checking/[processId]/history-process'
   */
  HISTORY_PAGE: '/loan-processing/credit-checking/[processId]/history-process',
  /**
   * '/loan-processing/credit-checking/history-process/[processId]'
   */
  HISTORY_PROCESS_PAGE: '/loan-processing/credit-checking/history-process/[processId]',
  /**
   * '/loan-processing/credit-checking/monitoring/[processId]/debtor-information'
   */
  MONITORING_DEBTOR_INFORMATION_PAGE: '/loan-processing/credit-checking/monitoring/[processId]/debtor-information',
  /**
   * '/loan-processing/credit-checking/monitoring/[processId]/document-verification'
   */
  MONITORING_DOCUMENT_VERIFICATION_PAGE: '/loan-processing/credit-checking/monitoring/[processId]/document-verification',
  /**
   * '/loan-processing/credit-checking/monitoring'
   */
  MONITORING_PAGE: '/loan-processing/credit-checking/monitoring',
  /**
   * '/loan-processing/credit-checking/monitoring/[processId]/result'
   */
  MONITORING_RESULT_PAGE: '/loan-processing/credit-checking/monitoring/[processId]/result',
  /**
   * '/loan-processing/credit-checking/request/[processId]/debtor-information'
   */
  REQUEST_DEBTOR_INFORMATION_PAGE: '/loan-processing/credit-checking/request/[processId]/debtor-information',
  /**
   * '/loan-processing/credit-checking/request'
   */
  REQUEST_PAGE: '/loan-processing/credit-checking/request',
  /**
   * '/loan-processing/credit-checking/request/[processId]/result'
   */
  REQUEST_RESULT_PAGE: '/loan-processing/credit-checking/request/[processId]/result',
};

export const fastTrack = {
  /**
   * '/loan-processing/fast-track/assignment/[processId]/debtor-information'
   */
  ASSIGNMENT_DEBTOR_INFORMATION_PAGE: '/loan-processing/fast-track/assignment/[processId]/debtor-information',
  /**
   * '/loan-processing/fast-track/assignment'
   */
  ASSIGNMENT_PAGE: '/loan-processing/fast-track/assignment',
  /**
   * '/loan-processing/fast-track/assignment/[processId]/result''
   */
  ASSIGNMENT_RESULT_PAGE: '/loan-processing/fast-track/assignment/[processId]/result',
  /**
   * '/loan-processing/fast-track/bucket-fast-track/[processId]/result'
   */
  BUCKET_FAST_TRACK_RESULT_PAGE: '/loan-processing/fast-track/bucket-fast-track/[processId]/result',
  /**
   * '/loan-processing/fast-track/bucket-fast-track/[processId]/request'
   */
  BUCKET_DEBTOR_INFORMATION_PAGE: '/loan-processing/fast-track/bucket-fast-track/[processId]/debtor-information',

  /**
   * '/loan-processing/fast-track/bucket-fast-track/[processId]/document-verification'
   */
  BUCKET_DOCUMENT_VERIFICATION_PAGE: '/loan-processing/fast-track/bucket-fast-track/[processId]/document-verification',
  /**
   * '/loan-processing/fast-track/bucket-fast-track'
   */
  BUCKET_LIST_PAGE: '/loan-processing/fast-track/bucket-fast-track',
  /**
   * '/loan-processing/submission-proposal/fast-track/[processId]/'
   */
  DETAIL_PAGE: '/loan-processing/submission-proposal/fast-track/[processId]/',
  /**
   * '/loan-processing/submission-proposal/fast-track/[processId]/request'
   */
  DETAIL_REQUEST_PAGE: '/loan-processing/submission-proposal/fast-track/[processId]/request',
  /**
   * '/loan-processing/fast-track/[processId]/history-process'
   */
  HISTORY_PAGE: '/loan-processing/fast-track/[processId]/history-process',
  /**
   * '/loan-processing/fast-track/history-process/[processId]'
   */
  HISTORY_PROCESS_PAGE: '/loan-processing/fast-track/history-process/[processId]',
  /**
   * '/loan-processing/fast-track/monitoring/[processId]/debtor-information'
   */
  MONITORING_DEBTOR_INFORMATION_PAGE: '/loan-processing/fast-track/monitoring/[processId]/debtor-information',
  /**
   * '/loan-processing/fast-track/monitoring/[processId]/document-verification'
   */
  MONITORING_DOCUMENT_VERIFICATION_PAGE: '/loan-processing/fast-track/monitoring/[processId]/document-verification',
  /**
   * '/loan-processing/fast-track/monitoring'
   */
  MONITORING_PAGE: '/loan-processing/fast-track/monitoring',
  /**
   * '/loan-processing/fast-track/monitoring/[processId]/result'
   */
  MONITORING_RESULT_PAGE: '/loan-processing/fast-track/monitoring/[processId]/result',
  /**
   * '/loan-processing/submission-proposal/fast-track/[processId]/debtor-information'
   */
  REQUEST_DEBTOR_INFORMATION_PAGE: '/loan-processing/submission-proposal/fast-track/[processId]/debtor-information',
  /**
   * '/loan-processing/submission-proposal/fast-track'
   */
  REQUEST_PAGE: '/loan-processing/submission-proposal/fast-track',
  /**
   * '/loan-processing/submission-proposal/fast-track/[processId]/result'
   */
  REQUEST_RESULT_PAGE: '/loan-processing/submission-proposal/fast-track/[processId]/result',
};

export const apuPpt = {
  /**
  * '/loan-processing/apu-ppt/assignment/[processId]/beneficial-owner'
  */
  ASSIGNMENT_BENEFICIAL_OWNER: '/loan-processing/apu-ppt/assignment/[processId]/beneficial-owner',


  /**
  * '/loan-processing/apu-ppt/assignment/[processId]/beneficial-owner/edit/[id]'
  */
  ASSIGNMENT_BENEFICIAL_OWNER_EDIT: '/loan-processing/apu-ppt/assignment/[processId]/beneficial-owner/edit/[id]',


  /**
  * '/loan-processing/apu-ppt/assignment/[processId]/customer-due-diligence/edit/[id]'
  */
  ASSIGNMENT_CUSTOMER_DUE_DILIGENCE_EDIT_PAGE: '/loan-processing/apu-ppt/assignment/[processId]/customer-due-diligence/edit/[id]',


  /**
  * '/loan-processing/apu-ppt/assignment/[processId]/customer-due-diligence'
  */
  ASSIGNMENT_CUSTOMER_DUE_DILIGENCE_PAGE: '/loan-processing/apu-ppt/assignment/[processId]/customer-due-diligence',


  /**
  * '/loan-processing/apu-ppt/assignment/[processId]/debtor-document'
  */
  ASSIGNMENT_DEBTOR_DOCUMENT: '/loan-processing/apu-ppt/assignment/[processId]/debtor-document',


  /**
  * '/loan-processing/apu-ppt/assignment/[processId]/debtor-document/edit/[id]'
  */
  ASSIGNMENT_DEBTOR_DOCUMENT_EDIT: '/loan-processing/apu-ppt/assignment/[processId]/debtor-document/edit/[id]',


  /**
   * '/loan-processing/apu-ppt/assignment/[processId]/debtor-information
   */
  ASSIGNMENT_DEBTOR_INFORMATION_PAGE: '/loan-processing/apu-ppt/assignment/[processId]/debtor-information',


  /**
  * '/loan-processing/apu-ppt/assignment/[processId]/debtor-profile-information'
  */
  ASSIGNMENT_DEBTOR_INFORMATION_PROFILE_PAGE: '/loan-processing/apu-ppt/assignment/[processId]/debtor-profile-information',


  /**
  * '/loan-processing/apu-ppt/assignment/[processId]/draft-memo'
  */
  ASSIGNMENT_DRAFT_MEMO: '/loan-processing/apu-ppt/assignment/[processId]/draft-memo',


  /**
  * '/loan-processing/apu-ppt/assignment'
  */
  ASSIGNMENT_LIST_PAGE: '/loan-processing/apu-ppt/assignment',


  /**
  * '/loan-processing/apu-ppt/assignment/[processId]/note'
  */
  ASSIGNMENT_NOTE_PAGE: '/loan-processing/apu-ppt/assignment/[processId]/note',


  /**
  * '/loan-processing/apu-ppt/assignment/[processId]/share-ownership-structure'
  */
  ASSIGNMENT_SHARE_OWNERSHIP_STRUCTURE_PAGE: '/loan-processing/apu-ppt/assignment/[processId]/share-ownership-structure',


  /**
  * '/loan-processing/apu-ppt/assignment/[processId]/validation'
  */
  ASSIGNMENT_VALIDATION_PAGE: '/loan-processing/apu-ppt/assignment/[processId]/validation',


  /**
  * '/loan-processing/apu-ppt/assignment/[processId]/view-all-document'
  */
  ASSIGNMENT_VIEW_ALL_DOCUMENT_PAGE: '/loan-processing/apu-ppt/assignment/[processId]/view-all-document',


  /**
   * '/loan-processing/apu-ppt/[module]'
   */
  BASE_PATH: '/loan-processing/apu-ppt/[module]',


  /**
  * '/loan-processing/apu-ppt/[module]/[processId]/beneficial-owner/detail/[id]'
  */
  BENEFICIAL_OWNER_DETAIL: '/loan-processing/apu-ppt/[module]/[processId]/beneficial-owner/detail/[id]',


  /**
  * '/loan-processing/apu-ppt/[module]/[processId]/customer-due-diligence/detail/[id]'
  */
  CUSTOMER_DUE_DILIGENCE_DETAIL_PAGE: '/loan-processing/apu-ppt/[module]/[processId]/customer-due-diligence/detail/[id]',


  /**
  * '/loan-processing/apu-ppt/[module]/[processId]/debtor-document/detail/[id]'
  */
  DEBTOR_DOCUMENT_DETAIL: '/loan-processing/apu-ppt/[module]/[processId]/debtor-document/detail/[id]',


  /**
  * '/loan-processing/apu-ppt/monitoring/[processId]/beneficial-owner'
  */
  MONITORING_BENEFICIAL_OWNER: '/loan-processing/apu-ppt/monitoring/[processId]/beneficial-owner',


  /**
  * '/loan-processing/apu-ppt/monitoring/[processId]/beneficial-owner/edit/[id]'
  */
  MONITORING_BENEFICIAL_OWNER_EDIT: '/loan-processing/apu-ppt/monitoring/[processId]/beneficial-owner/edit/[id]',


  /**
  * '/loan-processing/apu-ppt/monitoring/[processId]/customer-due-diligence/edit/[id]'
  */
  MONITORING_CUSTOMER_DUE_DILIGENCE_EDIT_PAGE: '/loan-processing/apu-ppt/monitoring/[processId]/customer-due-diligence/edit/[id]',


  /**
  * '/loan-processing/apu-ppt/monitoring/[processId]/customer-due-diligence'
  */
  MONITORING_CUSTOMER_DUE_DILIGENCE_PAGE: '/loan-processing/apu-ppt/monitoring/[processId]/customer-due-diligence',


  /**
  * '/loan-processing/apu-ppt/monitoring/[processId]/debtor-document'
  */
  MONITORING_DEBTOR_DOCUMENT: '/loan-processing/apu-ppt/monitoring/[processId]/debtor-document',


  /**
  * '/loan-processing/apu-ppt/monitoring/[processId]/debtor-document/edit/[id]'
  */
  MONITORING_DEBTOR_DOCUMENT_EDIT: '/loan-processing/apu-ppt/monitoring/[processId]/debtor-document/edit/[id]',


  /**
   * '/loan-processing/apu-ppt/monitoring/[processId]/debtor-information
   */
  MONITORING_DEBTOR_INFORMATION_PAGE: '/loan-processing/apu-ppt/monitoring/[processId]/debtor-information',


  /**
  * '/loan-processing/apu-ppt/monitoring/[processId]/debtor-profile-information'
  */
  MONITORING_DEBTOR_INFORMATION_PROFILE_PAGE: '/loan-processing/apu-ppt/monitoring/[processId]/debtor-profile-information',


  /**
  * '/loan-processing/apu-ppt/monitoring/[processId]/draft-memo'
  */
  MONITORING_DRAFT_MEMO: '/loan-processing/apu-ppt/monitoring/[processId]/draft-memo',


  /**
  * '/loan-processing/apu-ppt/monitoring'
  */
  MONITORING_LIST_PAGE: '/loan-processing/apu-ppt/monitoring',


  /**
  * '/loan-processing/apu-ppt/monitoring/[processId]/note'
  */
  MONITORING_NOTE_PAGE: '/loan-processing/apu-ppt/monitoring/[processId]/note',


  /**
  * '/loan-processing/apu-ppt/monitoring/[processId]/share-ownership-structure'
  */
  MONITORING_SHARE_OWNERSHIP_STRUCTURE_PAGE: '/loan-processing/apu-ppt/monitoring/[processId]/share-ownership-structure',


  /**
  * '/loan-processing/apu-ppt/monitoring/[processId]/validation'
  */
  MONITORING_VALIDATION_PAGE: '/loan-processing/apu-ppt/monitoring/[processId]/validation',


  /**
  * '/loan-processing/apu-ppt/monitoring/[processId]/view-all-document'
  */
  MONITORING_VIEW_ALL_DOCUMENT_PAGE: '/loan-processing/apu-ppt/monitoring/[processId]/view-all-document',


  /**
  * '/loan-processing/apu-ppt/request/[processId]/beneficial-owner'
  */
  REQUEST_BENEFICIAL_OWNER: '/loan-processing/apu-ppt/request/[processId]/beneficial-owner',


  /**
  * '/loan-processing/apu-ppt/request/[processId]/beneficial-owner/edit/[id]'
  */
  REQUEST_BENEFICIAL_OWNER_EDIT: '/loan-processing/apu-ppt/request/[processId]/beneficial-owner/edit/[id]',


  /**
  * '/loan-processing/apu-ppt/request/[processId]/customer-due-diligence/edit/[id]'
  */
  REQUEST_CUSTOMER_DUE_DILIGENCE_EDIT_PAGE: '/loan-processing/apu-ppt/request/[processId]/customer-due-diligence/edit/[id]',


  /**
  * '/loan-processing/apu-ppt/request/[processId]/customer-due-diligence'
  */
  REQUEST_CUSTOMER_DUE_DILIGENCE_PAGE: '/loan-processing/apu-ppt/request/[processId]/customer-due-diligence',


  /**
  * '/loan-processing/apu-ppt/request/[processId]/debtor-document'
  */
  REQUEST_DEBTOR_DOCUMENT: '/loan-processing/apu-ppt/request/[processId]/debtor-document',


  /**
  * '/loan-processing/apu-ppt/request/[processId]/debtor-document/edit/[id]'
  */
  REQUEST_DEBTOR_DOCUMENT_EDIT: '/loan-processing/apu-ppt/request/[processId]/debtor-document/edit/[id]',


  /**
   * '/loan-processing/apu-ppt/request/[processId]/debtor-information
   */
  REQUEST_DEBTOR_INFORMATION_PAGE: '/loan-processing/apu-ppt/request/[processId]/debtor-information',


  /**
  * '/loan-processing/apu-ppt/request/[processId]/debtor-profile-information'
  */
  REQUEST_DEBTOR_INFORMATION_PROFILE_PAGE: '/loan-processing/apu-ppt/request/[processId]/debtor-profile-information',


  /**
  * '/loan-processing/apu-ppt/request/[processId]/draft-memo'
  */
  REQUEST_DRAFT_MEMO: '/loan-processing/apu-ppt/request/[processId]/draft-memo',


  /**
  * '/loan-processing/apu-ppt/request'
  */
  REQUEST_LIST_PAGE: '/loan-processing/apu-ppt/request',


  /**
  * '/loan-processing/apu-ppt/request/[processId]/note'
  */
  REQUEST_NOTE_PAGE: '/loan-processing/apu-ppt/request/[processId]/note',


  /**
  * '/loan-processing/apu-ppt/request/[processId]/share-ownership-structure'
  */
  REQUEST_SHARE_OWNERSHIP_STRUCTURE_PAGE: '/loan-processing/apu-ppt/request/[processId]/share-ownership-structure',


  /**
  * '/loan-processing/apu-ppt/request/[processId]/validation'
  */
  REQUEST_VALIDATION_PAGE: '/loan-processing/apu-ppt/request/[processId]/validation',


  /**
  * '/loan-processing/apu-ppt/request/[processId]/view-all-document'
  */
  REQUEST_VIEW_ALL_DOCUMENT_PAGE: '/loan-processing/apu-ppt/request/[processId]/view-all-document',


  /**
  * '/loan-processing/apu-ppt/verification/[processId]/beneficial-owner'
  */
  VERIFICATION_BENEFICIAL_OWNER: '/loan-processing/apu-ppt/verification/[processId]/beneficial-owner',


  /**
  * '/loan-processing/apu-ppt/verification/[processId]/beneficial-owner/edit/[id]'
  */
  VERIFICATION_BENEFICIAL_OWNER_EDIT: '/loan-processing/apu-ppt/verification/[processId]/beneficial-owner/edit/[id]',


  /**
  * '/loan-processing/apu-ppt/verification/[processId]/customer-due-diligence/edit/[id]'
  */
  VERIFICATION_CUSTOMER_DUE_DILIGENCE_EDIT_PAGE: '/loan-processing/apu-ppt/verification/[processId]/customer-due-diligence/edit/[id]',


  /**
  * '/loan-processing/apu-ppt/verification/[processId]/customer-due-diligence'
  */
  VERIFICATION_CUSTOMER_DUE_DILIGENCE_PAGE: '/loan-processing/apu-ppt/verification/[processId]/customer-due-diligence',


  /**
  * '/loan-processing/apu-ppt/verification/[processId]/debtor-document'
  */
  VERIFICATION_DEBTOR_DOCUMENT: '/loan-processing/apu-ppt/verification/[processId]/debtor-document',


  /**
  * '/loan-processing/apu-ppt/verification/[processId]/debtor-document/edit/[id]'
  */
  VERIFICATION_DEBTOR_DOCUMENT_EDIT: '/loan-processing/apu-ppt/verification/[processId]/debtor-document/edit/[id]',


  /**
   * '/loan-processing/apu-ppt/verification/[processId]/debtor-information
   */
  VERIFICATION_DEBTOR_INFORMATION_PAGE: '/loan-processing/apu-ppt/verification/[processId]/debtor-information',


  /**
  * '/loan-processing/apu-ppt/verification/[processId]/debtor-profile-information'
  */
  VERIFICATION_DEBTOR_INFORMATION_PROFILE_PAGE: '/loan-processing/apu-ppt/verification/[processId]/debtor-profile-information',


  /**
  * '/loan-processing/apu-ppt/verification/[processId]/draft-memo'
  */
  VERIFICATION_DRAFT_MEMO: '/loan-processing/apu-ppt/verification/[processId]/draft-memo',


  /**
  * '/loan-processing/apu-ppt/verification'
  */
  VERIFICATION_LIST_PAGE: '/loan-processing/apu-ppt/verification',


  /**
  * '/loan-processing/apu-ppt/verification/[processId]/note'
  */
  VERIFICATION_NOTE_PAGE: '/loan-processing/apu-ppt/verification/[processId]/note',


  /**
  * '/loan-processing/apu-ppt/verification/[processId]/share-ownership-structure'
  */
  VERIFICATION_SHARE_OWNERSHIP_STRUCTURE_PAGE: '/loan-processing/apu-ppt/verification/[processId]/share-ownership-structure',


  /**
  * '/loan-processing/apu-ppt/verification/[processId]/validation'
  */
  VERIFICATION_VALIDATION_PAGE: '/loan-processing/apu-ppt/verification/[processId]/validation',


  /**
  * '/loan-processing/apu-ppt/verification/[processId]/view-all-document'
  */
  VERIFICATION_VIEW_ALL_DOCUMENT_PAGE: '/loan-processing/apu-ppt/verification/[processId]/view-all-document',
};

export const maintenanceData = {
  SLA_APPROVAL_DETAIL_PAGE: 'list',
  SLA_APPROVAL_LIST_PAGE: 'list',
  SLA_CONFIRMATION_PAGE: 'list',
  SLA_DETAIL_PAGE: 'list',
  SLA_LIST_PAGE: 'list',
  SLA_VALIDATION_PAGE: 'list',
};

export const maintenanceDebtor = {
  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/rating-management'
   */
  RATING_MANAGEMENT_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/customer-information/rating-management',
  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/assessment-addendum
   */
  ASSESSEMENT_ADDENDUM_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/assessment-addendum',


  /**
   * '/maintenance-data/maintenance-debtor/master/[debtorId]/facility-management/facility-conventional'
   */
  CONVENTIONAL_FACILITY_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/facility-management/facility-conventional',

  /**
   * '/maintenance-data/maintenance-debtor/master/[debtorId]/facility-management/facility-conventional/[id]/informasi-lainnya'
   */
  CONVENTIONAL_FACILITY_OTHER_INFORMATION_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/facility-management/facility-conventional/[id]/other-information',

  /**
   * '/maintenance-data/maintenance-debtor/master/[debtorId]/facility-management/facility-conventional/[id]/informasi-lainnya'
   */
  CONVENTIONAL_FACILITY_INFORMATION_FACILITY_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/facility-management/facility-conventional/[id]/facility-information',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/customer-information/bmpk-and-other/[calculationId]'
   */
  CUSTOMER_INFORMATION_BMPP_MONITORING: '/maintenance-data/maintenance-debtor/[module]/[processId]/customer-information/bmpk-and-other/[calculationId]',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/debtor-identity?from=[from]&isPreviousPage=true'
   */
  DEBTOR_IDENTITY_FROM_OTHER_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/customer-information/debtor-identity?from=[from]&isPreviousPage=true',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/customer-information/
   *   general-information?from=[from]&isPreviousPage=true'
   */
  DEBTOR_INFORMATION_FROM_OTHER_PAGE:
    '/maintenance-data/maintenance-debtor/[module]/[processId]/customer-information/general-information?from=[from]&isPreviousPage=true',


  /**
   * '/maintenance-data/maintenance-debtor/master/[debtorId]/customer-information/general-information?isPreview=true'
   */
  CUSTOMER_INFORMATION_PREVIEW_PAGE: '/maintenance-data/maintenance-debtor/master/[debtorId]/customer-information/general-information?isPreview=true',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/debtor-information'
   */
  DEBTOR_INFORMATION_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/debtor-information',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/group-information/[groupId]/[memberId]','
   */
  DETAIL_GROUP_INFORMATION_MEMBER_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/group-information/[groupId]/[memberId]',

  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/group-information/[groupId]/bmpk/[calculationId]'
   */
  DETAIL_GROUP_INFORMATION_BMPK_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/group-information/[groupId]/bmpk/[calculationId]',

  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/group-information/[groupId]','
   */
  DETAIL_GROUP_INFORMATION_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/group-information/[groupId]',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/group-member/[id]'
   */
  DETAIL_GROUP_MEMBER_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/group/[id]',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/lpa/[lpaId]'
   */
  DETAIL_LPA_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/lpa/[lpaId]',

  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/lpa/[lpaId]/[agunanId]'
   */
  DETAIL_LPA_AGUNAN_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/lpa/[lpaId]/[agunanId]',

  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/documentation/digital-memo'
   */
  DIGITAL_MEMO_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/documentation/digital-memo',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/documentation/elo-document'
   */
  ELO_DOCUMENT_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/documentation/elo-document',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/documentation/financing-document'
   */
  FINANCING_DOCUMENT_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/documentation/financing-document',


  // /**
  //  * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/documentation/digital-memo'
  //  */
  // DIGITAL_MEMO_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/documentation/digital-memo',


  // /**
  //  * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/documentation/elo-document'
  //  */
  // ELO_DOCUMENT_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/documentation/elo-document',


  // /**
  //  * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/documentation/financing-document'
  //  */
  // FINANCING_DOCUMENT_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/documentation/financing-document',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/customer-information/general-information'
   */
  GENERAL_CUSTOMER_INFORMATION: '/maintenance-data/maintenance-debtor/[module]/[processId]/customer-information/general-information',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/group?from=[from]&id=[id]'
   * */
  GROUP_FROM_OTHER_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/group?from=[from]&id=[id]',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/group-member
   */
  GROUP_MEMBER_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/group-member',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/group'
   * */
  GROUP_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/group',


  /**
   * '/maintenance-data/maintenance-debtor'
   */
  LIST_PAGE: '/maintenance-data/maintenance-debtor',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/lpa'
   */
  LPA_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/lpa',


  /**
   * '/maintenance-data/maintenance-debtor/[debtorId]'
   */
  MAINTENANCE_DETAIL_PAGE: '/maintenance-data/maintenance-debtor/maintenance/[processId]/detail',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder?from=pipeline&id=PIPE-0001'
   * */
  MANAGEMENT_SHAREHOLDER_FROM_OTHER_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder?from=[from]&id=[id]&isPreviousPage=true',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/management/add/[id]'
   * */
  MANAGEMENT_SHAREHOLDER_MANAGEMENT_ADD: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/management/add',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/management/[id]'
   * */
  MANAGEMENT_SHAREHOLDER_MANAGEMENT_DETAIL: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/management/[id]',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/management/edit/[id]'
   * */
  MANAGEMENT_SHAREHOLDER_MANAGEMENT_EDIT: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/management/edit/[id]',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/management'
   * */
  MANAGEMENT_SHAREHOLDER_MANAGEMENT_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/management',

  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/other-related'
   * */
  MANAGEMENT_SHAREHOLDER_OTHER_RELATED_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/other-related',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/other-related/add'
   * */
  MANAGEMENT_SHAREHOLDER_OTHER_RELATED_ADD: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/other-related/add',


  /**
     * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/other-related/[id]'
     * */
  MANAGEMENT_SHAREHOLDER_OTHER_RELATED_DETAIL: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/other-related/[id]',


  /**
     * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/other-related/edit/[id]'
     * */
  MANAGEMENT_SHAREHOLDER_OTHER_RELATED_EDIT: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/other-related/edit/[id]',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder'
   * */
  MANAGEMENT_SHAREHOLDER_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder?isPreviousPage=true',

  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/shareholder'
   * */
  MANAGEMENT_SHAREHOLDER_SHAREHOLDER_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/shareholder',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/shareholder/add'
   * */
  MANAGEMENT_SHAREHOLDER_SHAREHOLDER_ADD: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/shareholder/add',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/shareholder/[id]'
   * */
  MANAGEMENT_SHAREHOLDER_SHAREHOLDER_DETAIL: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/shareholder/[id]',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/shareholder/edit/[id]'
   * */
  MANAGEMENT_SHAREHOLDER_SHAREHOLDER_EDIT: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/management-shareholder/shareholder/edit/[id]',


  /**
   * '/maintenance-data/maintenance-debtor/[debtorId]'
   */
  MASTER_DETAIL_PAGE: '/maintenance-data/maintenance-debtor/master/[debtorId]/',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/project/[id]'
   */
  PROJECT_DETAIL_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/project-information/[projectId]',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/group?from=[from]&id=[id]'
   * */
  PROJECT_FROM_OTHER_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/project-information?from=[from]&id=[id]',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/project'
   */
  PROJECT_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/project-information',


  /**
   * '/maintenance-data/maintenance-debtor/[module]/[debtorId]/documentation/supporting-document'
   */
  SUPPORTING_DOCUMENT_PAGE: '/maintenance-data/maintenance-debtor/[module]/[debtorId]/documentation/supporting-document',

  /**
   * '/maintenance-data/maintenance-debtor/master/[debtorId]/facility-management/syariah-facility'
   */
  SYARIAH_FACILITY_PAGE: '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah',
  /**
   * '/maintenance-data/maintenance-debtor/[debtorId]/validation'
   */
  VALIDATION_PAGE: '/maintenance-data/maintenance-debtor/maintenance/[processId]/validation',

  /**
   * '/maintenance-data/maintenance-debtor/master/[debtorId]/facility-management/syariah-facility/[id]/inqury-limit'
   */
  INQUIRY_LIMIT: '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah/[id]/inquiry-limit',

  /**
   * '/maintenance-data/maintenance-debtor/master/[debtorId]/facility-management/syariah-facility/[id]/inqury-limit'
   */
  INQUIRY_LIMIT_LIST: '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah/[id]/inquiry-limit-list',

  /**
   * '/maintenance-data/maintenance-debtor/master/[debtorId]/facility-management/syariah-facility/[id]/inqury-account'
   */
  INQUIRY_ACCOUNT: '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah/[id]/inquiry-account',

  /**
   * '/maintenance-data/maintenance-debtor/master/[debtorId]/facility-management/syariah-facility/[id]/inqury-account'
   */
  INQUIRY_ACCOUNT_LIST: '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah/[id]/inquiry-account-list',

  /**
   * '/maintenance-data/maintenance-debtor/master/[debtorId]/facility-management/facility-syariah/[id]/limit-induk'
   */
  LIMIT_INDUK: '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah/[id]/limit-induk',

  /**
   * '/maintenance-data/maintenance-debtor/master/[debtorId]/facility-management/facility-syariah/[id]/limit-anak-list'
   */
  LIMIT_ANAK_LIST: '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah/[id]/limit-induk/[idInduk]/limit-anak-list',

  /**
   * '/maintenance-data/maintenance-debtor/master/[debtorId]/facility-management/facility-syariah/[id]/limit-anak'
   */
  LIMIT_ANAK: '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah/[id]/limit-anak',

  /**
   * '/maintenance-data/maintenance-debtor/master/[debtorId]/facility-management/facility-syariah/[id]/edit/limit-anak'
   */
  EDIT_LIMIT_ANAK: '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah/[id]/edit/limit-anak',

  /**
   * '/maintenance-data/maintenance-debtor/master/[debtorId]/facility-management/facility-syariah/[id]/limit-anak'
   */
  DETAIL_LIMIT_ANAK: '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah/[id]/detail/limit-anak',

  /**
   * '/maintenance-data/maintenance-debtor/master/[debtorId]/facility-management/facility-syariah/[id]/limit-anak'
   */
  INFORMASI_LAINNYA: '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah/[id]/informasi-lainnya',

  /**
   * '/maintenance-data/maintenance-debtor/master/[debtorId]/facility-management/facility-syariah/[id]/limit-anak'
   */
  EDIT_INFORMASI_LAINNYA: '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah/[id]/edit/informasi-lainnya',

  /**
   * '/maintenance-data/maintenance-debtor/master/[debtorId]/facility-management/facility-syariah/[id]/limit-anak'
   */
  DETAIL_INFORMASI_LAINNYA: '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah/[id]/detail/informasi-lainnya',

  /**
   * '/maintenance-data/maintenance-debtor/master/[debtorId]/facility-management/facility-syariah/[id]/limit-anak'
   */
  DETAIL_PROJECT: '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah/[id]/project/[projectId]',

  /**
   * '/maintenance-data/maintenance-debtor/[module]/[processId]/regulator-data/slik'
   */
  REGULATOR_DATA_SLIK_PAGE: '/maintenance-data/maintenance-debtor/[module]/[processId]/regulator-data/slik',

  /**
   * '/maintenance-data/maintenance-debtor/[module]/[processId]/regulator-data/slik/fasilitas-pembiayaan/[id]'
   */
  EDIT_FASILITAS_PEMBIAYAAN: '/maintenance-data/maintenance-debtor/[module]/[processId]/regulator-data/slik/fasilitas-pembiayaan/[id]',

  /**
   * '/maintenance-data/maintenance-debtor/master/[debtorId]/perikatan-pembiayaan/[id]'
   */
  DETAIL_PERIKATAN_PEMBIYAAN: '/maintenance-data/maintenance-debtor/[module]/[processId]/perikatan-pembiayaan/[id]',
  /**
   * '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah'
   */
  FACILITY_SYARIAH_PAGE: '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah',
  /**
   * '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah/add'
   */
  ADD_FACILITY_SYARIAH: '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah/add',
  /**
   * '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah/[id]/detail/limit-induk'
   */
  DETAIL_LIMIT_INDUK: '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah/[id]/detail/limit-induk',
  /**
   * '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah/[id]/edit/limit-induk'
   */
  EDIT_LIMIT_INDUK: '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah/[id]/edit/limit-induk',
  /**
   * '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah/[id]/detail/detail-facility'
   */
  DETAIL_FACILITY: '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah/[id]/detail/detail-facility',

  /**
   * '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah/[id]/edit/detail-facility'
   */
  EDIT_FACILITY: '/maintenance-data/maintenance-debtor/[module]/[processId]/facility-management/facility-syariah/[id]/edit/detail-facility',

};

export const maintenanceSuratHutang = {
  /**
   * '/maintenance-data/surat-hutang/detail'
   */
  CREATE_NEW_PAGE: '/maintenance-data/surat-hutang/new',
  /**
   * '/maintenance-data/surat-hutang/[processId]/detail'
   */
  DETAIL_PAGE: '/maintenance-data/surat-hutang/[processId]',
  /**
   * '/maintenance-data/surat-hutang'
   * */
  LIST_PAGE: '/maintenance-data/surat-hutang',
};

export const maintenanceModal = {
  /**
   * '/maintenance-data/maintenance-modal/[processId]/maintenance-modal'
   */
  MAINTENANCE_MODAL_PAGE: '/maintenance-data/maintenance-modal/[processId]/maintenance-modal',
  /**
   * '/maintenance-data/maintenance-modal'
   */
  MAIN_PAGE: '/maintenance-data/maintenance-modal',
  /**
   * '/maintenance-data/maintenance-modal/[debtorId]/validation'
   */
  VALIDATION_PAGE: '/maintenance-data/maintenance-modal/[processId]/validation',
};

export const maintenanceGroup = {

  /**
   * '/maintenance-data/maintenance-group/[groupId]/edit/maintenance-group/member/add'
   */
  ADD_MEMBER_PAGE: '/maintenance-data/maintenance-group/[groupId]/edit/maintenance-group/member/add',


  BMPK_DETAIL_PAGE: '/maintenance-data/maintenance-group/[groupId]/member/[memberId]/bmpk/[calculationId]/detail',
  BMPP_CALCULATION_PAGE: '/maintenance-data/maintenance-group/[groupId]/bmpk/[calculationId]/detail',


  /**
   * '/maintenance-data/maintenance-group/create'
   */
  CREATE_PAGE: '/maintenance-data/maintenance-group/create/maintenance-group',


  /**
   * '/maintenance-data/maintenance-group/[groupId]/member/[memberId]/detail'
   */
  DETAIL_MEMBER_PAGE: '/maintenance-data/maintenance-group/[groupId]/member/[memberId]/detail',


  /**
   * '/maintenance-data/maintenance-group/[groupId]/detail/maintenance-group'
   */
  DETAIL_PAGE: '/maintenance-data/maintenance-group/[groupId]/detail/maintenance-group',


  /**
   * '/maintenance-data/maintenance-group/[groupId]/member/add'
   */
  EDIT_MEMBER_PAGE: '/maintenance-data/maintenance-group/[groupId]/member/[memberId]/edit',


  /**
   * '/maintenance-data/maintenance-group/create/[groupId]/edit'
   */
  EDIT_PAGE: '/maintenance-data/maintenance-group/[groupId]/edit/maintenance-group',


  /**
   * '/maintenance-data/maintenance-group/[groupId]/edit/maintenance-group?from=[from]'
   * */
  GROUP_FROM_OTHER_PAGE: '/maintenance-data/maintenance-group/[groupId]/edit/maintenance-group?from=[from]',

  /**
   * '/maintenance-data/maintenance-group'
   */
  LIST_PAGE: '/maintenance-data/maintenance-group',

  /**
   * '/maintenance-data/maintenance-group/[processId]/detail'
   */
  MAINTENANCE_DETAIL_PAGE: '/maintenance-data/maintenance-group/detail/[groupId]',

  /**
   * '/maintenance-data/maintenance-group/[processId]'
   */
  MASTER_DETAIL_PAGE: '/maintenance-data/maintenance-group/[processId]',

};

export const maintenanceReminder = {
  /**
   * '/maintenance-data/reminder'
   */
  LIST_PAGE: '/maintenance-data/maintenance-reminder',

  /**
   * '/maintenance-data/maintenance-reminder/[id]/detail/maintenance-reminder'
   */
  DETAIL_PAGE: '/maintenance-data/maintenance-reminder/[id]/detail/maintenance-reminder',

  /**
   * '/maintenance-data/maintenance-reminder/create/[id]/edit'
   */
  EDIT_PAGE: '/maintenance-data/maintenance-reminder/[id]/edit/maintenance-reminder',

  /**
   * '/maintenance-data/maintenance-reminder/[id]/detail/validation'
   */
  VALIDATION_PAGE: '/maintenance-data/maintenance-reminder/[id]/detail/validation',
};

export const maintenanceNotification = {
  /**
   * '/maintenance-data/maintenance-notification'
   */
  LIST_PAGE: '/maintenance-data/maintenance-notification',

  /**
   * '/maintenance-data/maintenance-notification/[id]/maintenance-template'
   */
  DETAIL_PAGE: '/maintenance-data/maintenance-notification/[id]/detail/maintenance-notification',

  /**
   * '/maintenance-data/maintenance-notification/[id]/validation'
   */
  VALIDATION_PAGE: '/maintenance-data/maintenance-notification/[id]/validation',
};

export const maintenanceProyek = {

  /**
   * '/maintenance-data/maintenance-proyek/[id]/edit/maintenance-proyek/member/add'
   */
  ADD_MEMBER_PAGE: '/maintenance-data/maintenance-proyek/[id]/edit/maintenance-proyek/member/add',

  /**
   * '/maintenance-data/maintenance-proyek/create'
   */
  CREATE_PAGE: '/maintenance-data/maintenance-proyek/create/project-information',


  /**
   * '/maintenance-data/maintenance-proyek/[id]/member/[memberId]/detail'
   */
  DETAIL_MEMBER_PAGE: '/maintenance-data/maintenance-proyek/[id]/member/[memberId]/detail',


  /**
   * '/maintenance-data/maintenance-proyek/[id]/detail/maintenance-proyek'
   */
  DETAIL_PAGE: '/maintenance-data/maintenance-proyek/[id]/detail/project-information',


  /**
   * '/maintenance-data/maintenance-proyek/[id]/member/add'
   */
  EDIT_MEMBER_PAGE: '/maintenance-data/maintenance-proyek/[id]/member/[memberId]/edit',


  /**
   * '/maintenance-data/maintenance-proyek/create/[id]/edit'
   */
  EDIT_PAGE: '/maintenance-data/maintenance-proyek/[id]/edit/project-information',


  /**
   * '/maintenance-data/maintenance-proyek/[id]/edit/maintenance-proyek?from=[from]'
   * */
  GROUP_FROM_OTHER_PAGE: '/maintenance-data/maintenance-proyek/[id]/edit/maintenance-proyek?from=[from]',

  /**
   * '/maintenance-data/maintenance-proyek'
   */
  LIST_PAGE: '/maintenance-data/maintenance-proyek',
  /**
   * '/maintenance-data/maintenance-proyek/[processId]/detail'
   */
  MAINTENANCE_DETAIL_PAGE: '/maintenance-data/maintenance-proyek/detail/[id]',
  /**
   * '/maintenance-data/maintenance-proyek/[processId]'
   */
  MASTER_DETAIL_PAGE: '/maintenance-data/maintenance-proyek/[processId]',

};

export const mup = {
  /**
   * '/loan-processing/mup/[processId]/additional-information'
   */
  ADDITIONAL_INFORMATION_PAGE: '/loan-processing/mup/[processId]/additional-information',

  /**
   * '/loan-processing/mup/[processId]/bmpp'
   */
  BMPP_PAGE: '/loan-processing/mup/[processId]/bmpp',


  /**
   * '/loan-processing/mup/[processId]/debtor-information/'
   */
  DEBTOR_INFORMATION_PAGE: '/loan-processing/mup/[processId]/debtor-information',


  /**
   * '/loan-processing/mup/[processId]/draft-memo'
   */
  DRAFT_MEMO_PAGE: '/loan-processing/mup/[processId]/draft-memo',


  /**
   * '/loan-processing/mup/[processId]/environment-and-social-safeguard-issue/edit/[id]'
   */
  ENVIRONMENTAL_AND_SOCIAL_SAFEGUARD_ISSUE_EDIT_PAGE: '/loan-processing/mup/[processId]/environmental-and-social-safeguard-issue/edit/[id]',


  /**
   * '/loan-processing/mup/[processId]/environment-and-social-safeguard-issue'
   */
  ENVIRONMENTAL_AND_SOCIAL_SAFEGUARD_ISSUE_PAGE: '/loan-processing/mup/[processId]/environmental-and-social-safeguard-issue',


  /**
   * '//loan-processing/mup/[processId]/environmental-and-social-safeguard-issue/edit-report-routine/[id]]'
   */
  ENVIRONMENTAL_AND_SOCIAL_SAFEGUARD_REPORT_RUTIN_EDIT_PAGE: '/loan-processing/mup/[processId]/environmental-and-social-safeguard-issue/edit-report-routine/[id]',


  /**
   * '/loan-processing/mup/[processId]/executive-summary/add'
   */
  EXECUTIVE_OVERVIEW_ADD_FULLFILLMENT_PAGE: '/loan-processing/mup/[processId]/executive-summary/add',


  /**
   * '/loan-processing/mup/[processId]/executive-summary/edit/[id]'
   */
  EXECUTIVE_OVERVIEW_EDIT_FULLFILLMENT_PAGE: '/loan-processing/mup/[processId]/executive-summary/edit/[id]',


  /**
   * '/loan-processing/mup/[processId]/executive-summary'
   */
  EXECUTIVE_OVERVIEW_PAGE: '/loan-processing/mup/[processId]/executive-summary',


  /**
   * '/loan-processing/mup/[processId]/extra-information'
   */
  EXTRA_INFORMATION_PAGE: '/loan-processing/mup/[processId]/extra-information',


  /**
   * '/loan-processing/mup/[processId]/financial-summary'
   */
  FINANCIAL_SUMMARY_PAGE: '/loan-processing/mup/[processId]/financial-summary',


  /**
   * '/loan-processing/mup/[processId]/financing-facility-summary'
   */
  FINANCING_FACILITY_SUMMARY_PAGE: '/loan-processing/mup/[processId]/financing-facility-summary',


  /**
   * '/loan-processing/mup/[processId]/financing-structure-proposal/add'
   */
  FINANCING_STRUCTURE_PROPOSAL_ADD_PAGE: '/loan-processing/mup/[processId]/financing-structure-proposal/add',


  /**
   * '/loan-processing/mup/[processId]/financing-structure-proposal/edit/[id]'
   */
  FINANCING_STRUCTURE_PROPOSAL_EDIT_PAGE: '/loan-processing/mup/[processId]/financing-structure-proposal/edit/[id]',


  /**
   * '/loan-processing/mup/[processId]/financing-structure-proposal'
   */
  FINANCING_STRUCTURE_PROPOSAL_PAGE: '/loan-processing/mup/[processId]/financing-structure-proposal',


  /**
   * '/loan-processing/mup/[processId]/legal-and-compliance-issue/edit/[id]'
   */
  LEGAL_AND_COMPLIANCE_ISSUE_EDIT_PAGE: '/loan-processing/mup/[processId]/legal-and-compliance-issue/edit/[id]',


  /**
   * '/loan-processing/mup/[processId]/legal-and-compliance-issue'
   */
  LEGAL_AND_COMPLIANCE_ISSUE_PAGE: '/loan-processing/mup/[processId]/legal-and-compliance-issue',
  /**
   * '/loan-processing/mup'
   */
  LIST_PAGE: '/loan-processing/mup',
  /**
   * '/loan-processing/mup/[processId]/proposal/add/[id]'
   */
  MUNICIPAL_FINANCING_STRUCTURE_PROPOSAL_ADD_PAGE: '/loan-processing/mup/[processId]/proposal/add',
  /**
   * '/loan-processing/mup/[processId]/proposal/add/[id]'
   */
  MUNICIPAL_FINANCING_STRUCTURE_PROPOSAL_EDIT_PAGE: '/loan-processing/mup/[processId]/proposal/edit/[id]',
  /**
   * '/loan-processing/mup/[processId]/project-strategic-value'
   */
  PROJECT_STRATEGIC_VALUE_PAGE: '/loan-processing/mup/[processId]/project-strategic-value',

  /**
   * '/loan-processing/mup/[processId]/proposal'
   */
  PROPOSAL_PAGE: '/loan-processing/mup/[processId]/proposal',
  /**
   * '/loan-processing/mup/[processId]/rating-and-risk-profile/edit/[id]'
   */
  RATING_AND_RISK_PROFILE_EDIT_PAGE: '/loan-processing/mup/[processId]/rating-and-risk-profile/edit/[id]',
  /**
   * '/loan-processing/mup/[processId]/rating-and-risk-profile'
   */
  RATING_AND_RISK_PROFILE_PAGE: '/loan-processing/mup/[processId]/rating-and-risk-profile',
  /**
   * '/loan-processing/mup/[processId]/rating-history'
   */
  RATING_HISTORY: '/loan-processing/mup/[processId]/rating-history',
  /**
   * '/loan-processing/mup/[processId]/sharia-compliance-aspect/edit-external-concern/[id]'
   */
  SHARIA_COMPLIANCE_ASPECT_EDIT_EXTERNAL_PAGE: '/loan-processing/mup/[processId]/sharia-compliance-aspect/edit-external-concern/[id]',
  /**
   * '/loan-processing/mup/[processId]/sharia-compliance-aspect/edit-internal-concern/[id]'
   */
  SHARIA_COMPLIANCE_ASPECT_EDIT_INTERNAL_PAGE: '/loan-processing/mup/[processId]/sharia-compliance-aspect/edit-internal-concern/[id]',
  /**
   * '/loan-processing/mup/[processId]/sharia-compliance-aspect'
   */
  SHARIA_COMPLIANCE_ASPECT_PAGE: '/loan-processing/mup/[processId]/sharia-compliance-aspect',
  /**
   * '/loan-processing/mup/[processId]/special-approval'
   */
  SPECIAL_APPROVAL_PAGE: '/loan-processing/mup/[processId]/special-approval',
  /**
   * '/loan-processing/mup/[processId]/validation'
   */
  VALIDATION_PAGE: '/loan-processing/mup/[processId]/validation',
  /**
   * '/loan-processing/mup/[processId]/view-all-document'
   */
  VIEW_ALL_DOCUMENT_PAGE: '/loan-processing/mup-analyst/[processId]/view-all-document',
};

export const mupAnalyst = {
  /**
   * '/loan-processing/mup/[processId]/additional-information'
   */
  ADDITIONAL_INFORMATION_PAGE: '/loan-processing/mup-analyst/[processId]/additional-information',
  /**
   * '/loan-processing/mup/[processId]/bmpp'
   */
  BMPP_PAGE: '/loan-processing/mup-analyst/[processId]/bmpp',
  /**
   * '/loan-processing/mup/[processId]/debtor-information/'
   */
  DEBTOR_INFORMATION_PAGE: '/loan-processing/mup-analyst/[processId]/debtor-information',
  /**
   * '/loan-processing/mup/[processId]/draft-memo'
   */
  DRAFT_MEMO_PAGE: '/loan-processing/mup-analyst/[processId]/draft-memo',
  /**
   * '/loan-processing/mup/[processId]/environment-and-social-safeguard-issue/edit/[id]'
   */
  ENVIRONMENTAL_AND_SOCIAL_SAFEGUARD_ISSUE_EDIT_PAGE: '/loan-processing/mup-analyst/[processId]/environmental-and-social-safeguard-issue/edit/[id]',
  /**
   * '/loan-processing/mup/[processId]/environment-and-social-safeguard-issue'
   */
  ENVIRONMENTAL_AND_SOCIAL_SAFEGUARD_ISSUE_PAGE: '/loan-processing/mup-analyst/[processId]/environmental-and-social-safeguard-issue',
  /**
   * '/loan-processing/mup/[processId]/extra-information'
   */
  EXTRA_INFORMATION_PAGE: '/loan-processing/mup-analyst/[processId]/extra-information',
  /**
   * '/loan-processing/mup/[processId]/financial-summary'
   */
  FINANCIAL_SUMMARY_PAGE: '/loan-processing/mup-analyst/[processId]/financial-summary',
  /**
   * '/loan-processing/mup/[processId]/financing-facility-summary'
   */
  FINANCING_FACILITY_SUMMARY_PAGE: '/loan-processing/mup-analyst/[processId]/financing-facility-summary',
  /**
   * '/loan-processing/mup/[processId]/financing-structure-proposal/add'
   */
  FINANCING_STRUCTURE_PROPOSAL_ADD_PAGE: '/loan-processing/mup-analyst/[processId]/financing-structure-proposal/add',
  /**
   * '/loan-processing/mup/[processId]/financing-structure-proposal/edit/[id]'
   */
  FINANCING_STRUCTURE_PROPOSAL_EDIT_PAGE: '/loan-processing/mup-analyst/[processId]/financing-structure-proposal/edit/[id]',
  /**
   * '/loan-processing/mup/[processId]/financing-structure-proposal'
   */
  FINANCING_STRUCTURE_PROPOSAL_PAGE: '/loan-processing/mup-analyst/[processId]/financing-structure-proposal',
  /**
   * '/loan-processing/mup/[processId]/legal-and-compliance-issue/edit/[id]'
   */
  LEGAL_AND_COMPLIANCE_ISSUE_EDIT_PAGE: '/loan-processing/mup-analyst/[processId]/legal-and-compliance-issue/edit/[id]',
  /**
   * '/loan-processing/mup/[processId]/legal-and-compliance-issue'
   */
  LEGAL_AND_COMPLIANCE_ISSUE_PAGE: '/loan-processing/mup-analyst/[processId]/legal-and-compliance-issue',
  /**
   * '/loan-processing/mup'
   */
  LIST_PAGE: '/loan-processing/mup-analyst',
  /**
   * '/loan-processing/mup/[processId]/project-strategic-value'
   */
  PROJECT_STRATEGIC_VALUE_PAGE: '/loan-processing/mup-analyst/[processId]/project-strategic-value',
  /**
   * '/loan-processing/mup/[processId]/rating-and-risk-profile/edit/[id]'
   */
  RATING_AND_RISK_PROFILE_EDIT_PAGE: '/loan-processing/mup-analyst/[processId]/rating-and-risk-profile/edit/[id]',
  /**
   * '/loan-processing/mup/[processId]/rating-and-risk-profile'
   */
  RATING_AND_RISK_PROFILE_PAGE: '/loan-processing/mup-analyst/[processId]/rating-and-risk-profile',
  /**
   * '/loan-processing/mup/[processId]/sharia-compliance-aspect/edit/[id]'
   */
  SHARIA_COMPLIANCE_ASPECT_EDIT_PAGE: '/loan-processing/mup-analyst/[processId]/sharia-compliance-aspect/edit/[id]',
  /**
   * '/loan-processing/mup/[processId]/sharia-compliance-aspect'
   */
  SHARIA_COMPLIANCE_ASPECT_PAGE: '/loan-processing/mup-analyst/[processId]/sharia-compliance-aspect',
  /**
   * '/loan-processing/mup/[processId]/special-approval'
   */
  SPECIAL_APPROVAL_PAGE: '/loan-processing/mup-analyst/[processId]/special-approval',
  /**
   * '/loan-processing/mup/[processId]/validation'
   */
  VALIDATION_PAGE: '/loan-processing/mup-analyst/[processId]/validation',
  /**
   * '/loan-processing/mup/[processId]/view-all-document'
   */
  VIEW_ALL_DOCUMENT_PAGE: '/loan-processing/mup-analyst/[processId]/view-all-document',
};

export const ASPECT_LEGAL_REVIEW = {
  /**
   * '/loan-processing/review/aspect-legal-review/[processId]/additional-information'
   */
  ADDITIONAL_INFORMATION_PAGE: '/loan-processing/review/aspect-legal-review/[module]/[processId]/additional-information',
  /**
  /**
    * '/loan-processing/review/aspect-legal-review/assignment'
    */
  ASSIGNMENT_PAGE: '/loan-processing/review/aspect-legal-review/assignment',
  /**
   * '/loan-processing/review/aspect-legal-review/[module]/[processId]/assumption-qualification'
   */
  ASSUMPTION_QUALIFICATION_PAGE: '/loan-processing/review/aspect-legal-review/[module]/[processId]/assumption-qualification',
  /**
   * '/loan-processing/review/aspect-legal-review/[module]'
   */
  BASE_PATH: '/loan-processing/review/aspect-legal-review/[module]',
  /**
   * '/loan-processing/review/aspect-legal-review/[module]/[processId]/debtor-information'
   */
  DEBTOR_INFORMATION_PAGE: '/loan-processing/review/aspect-legal-review/[module]/[processId]/debtor-information',
  /**
   * '/loan-processing/review/aspect-legal-review/[module]/[processId]/draft-memo'
   */
  DRAFT_MEMO_PAGE: '/loan-processing/review/aspect-legal-review/[module]/[processId]/draft-memo',
  /**
   * '/loan-processing/review/aspect-legal-review/[module]/[processId]/executive-overview'
   */
  EXCECUTIVE_SUMMARY_PAGE: '/loan-processing/review/aspect-legal-review/[module]/[processId]/executive-overview',
  /**
   * '/loan-processing/review/aspect-legal-review/[module]/[processId]/facility-summary'
   */
  FACILITY_OVERVIEW_PAGE: '/loan-processing/review/aspect-legal-review/[module]/[processId]/facility-overview',
  /**
   * '/loan-processing/review/aspect-legal-review/[module]/[processId]/draft-memo'
   */
  HISTORY_PROCESS_PAGE: '/loan-processing/review/aspect-legal-review/[processId]/history-process',
  /**
   * '/loan-processing/review/aspect-legal-review/[module]/[processId]/identify-legal-risks'
   */
  IDENTIFY_LEGAL_RISKS_PAGE: '/loan-processing/review/aspect-legal-review/[module]/[processId]/identify-legal-risks',
  /**
   * '/loan-processing/review/aspect-legal-review/[module]/[processId]/identify-legal-risks/identify-risks-create'
   */
  IDENTIFY_RISKS_CREATE_PAGE: '/loan-processing/review/aspect-legal-review/[module]/[processId]/identify-legal-risks/identify-risks-create',
  /**
   * '/loan-processing/review/aspect-legal-review/[module]/[processId]/identify-legal-risks/identify-risks-create'
   */
  IDENTIFY_RISKS_EDIT_PAGE: '/loan-processing/review/aspect-legal-review/[module]/[processId]/identify-legal-risks/[id]/identify-risks-edit',
  /**
   * '/loan-processing/review/aspect-legal-review/bucket-list'
   */
  LIST_PAGE: '/loan-processing/review/aspect-legal-review/bucket-list',
  /**
   * '/loan-processing/review/aspect-legal-review/monitoring'
   */
  MONITORING_LIST_PAGE: '/loan-processing/review/aspect-legal-review/monitoring',
  /**
   * '/loan-processing/review/aspect-legal-review/[module]/[processId]/rating'
   */
  RATING_PAGE: '/loan-processing/review/aspect-legal-review/[module]/[processId]/rating',
  /**
   * '/loan-processing/review/aspect-legal-review/[module]/[processId]/risk-profile'
   */
  RISK_PROFILE_PAGE: '/loan-processing/review/aspect-legal-review/[module]/[processId]/risk-profile',
  /**
   * '/loan-processing/review/aspect-legal-review/[module]/[processId]/validation'
   */
  VALIDATION_PAGE: '/loan-processing/review/aspect-legal-review/[module]/[processId]/validation',
  /**
   * '/loan-processing/review/aspect-legal-review/[module]/[processId]/view-all-document'
   */
  VIEW_ALL_DOCUMENT_PAGE: '/loan-processing/review/aspect-legal-review/[module]/[processId]/view-all-document',
};

export const ESDD = {
  /**
   * '/add-new-corrective-action-plan'
   */
  ADD_NEW_CORRECTIVE_ACTION_PLAN_PAGE: '/loan-processing/review/esdd/[module]/[processId]/corrective-action-plan/add',
  /**
   * '/loan-processing/review/esdd/assignment'
   */
  ASSIGNMENT_PAGE: '/loan-processing/review/esdd/assignment',
  /**
   * '/loan-processing/review/esdd/[module]'
   */
  BASE_PATH: '/loan-processing/review/esdd/[module]',
  /**
   * '/[processId]/corrective-action-plan'
   */
  CORRECTIVE_ACTION_PLAN_PAGE: '/loan-processing/review/esdd/[module]/[processId]/corrective-action-plan',
  /**
   * '/[processId]/debtor-information'
   */
  DEBTOR_INFORMATION_PAGE: '/loan-processing/review/esdd/[module]/[processId]/debtor-information',
  /**
   * '/[processId]/draft-memo'
   */
  DRAFT_MEMO_PAGE: '/loan-processing/review/esdd/[module]/[processId]/draft-memo',
  /**
   * '/edit-corrective-action-plan/[id]'
   */
  EDIT_CORRECTIVE_ACTION_PLAN_PAGE: '/loan-processing/review/esdd/[module]/[processId]/corrective-action-plan/edit/[id]',
  /**
   * '/[processId]/esdd-report'
   */
  ESDD_REPORT_PAGE: '/loan-processing/review/esdd/[module]/[processId]/esdd-report',
  /**
   * '/[processId]/executive-summary'
   */
  EXECUTIVE_SUMMARY_PAGE: '/loan-processing/review/esdd/[module]/[processId]/executive-summary',
  /**
   * '/[processId]/facility-overview'
   */
  FACILITY_OVERVIEW_PAGE: '/loan-processing/review/esdd/[module]/[processId]/facility-overview',
  /**
   * 'loan-processing/review/esdd/bucket-list'
   */
  LIST_PAGE: '/loan-processing/review/esdd/bucket-list',
  /**
   * '/loan-processing/review/esdd/monitoring'
   */
  MONITORING_PAGE: '/loan-processing/review/esdd/monitoring',
  /**
   * '/[processId]/reporting-list-routine'
   */
  REPORTING_LIST_ROUTINE_PAGE: '/loan-processing/review/esdd/[module]/[processId]/reporting-list-routine',
  /**
   * '/[processId]/summary'
   */
  SUMMARY_PAGE: '/loan-processing/review/esdd/[module]/[processId]/summary',
  /**
   * '/[processId]/validation'
   */
  VALIDATION_PAGE: '/loan-processing/review/esdd/[module]/[processId]/validation',
  /**
   * '/[processId]/view-all-document'
   */
  VIEW_ALL_DOCUMENT_PAGE: '/loan-processing/review/esdd/[module]/[processId]/view-all-document',
};

export const KEPATUHAN_SYARIAH = {
  /**
   * '/loan-processing/review/kepatuhan-syariah/[processId]/add-summary'
   */
  ADD_SUMMARY: '/loan-processing/review/kepatuhan-syariah/[module]/[processId]/summary/add-summary',
  /**
   * '/loan-processing/review/kepatuhan-syariah/assignment'
   */
  ASSIGNMENT_PAGE: '/loan-processing/review/kepatuhan-syariah/assignment',
  /**
   * '/loan-processing/review/kepatuhan-syariah/[module]'
   */
  BASE_PATH: '/loan-processing/review/kepatuhan-syariah/[module]',
  /**
   * '/loan-processing/review/kepatuhan-syariah/[processId]/debtor-information'
   */
  DEBTOR_INFORMATION_PAGE: '/loan-processing/review/kepatuhan-syariah/[module]/[processId]/debtor-information',
  /**
   * '/loan-processing/review/kepatuhan-syariah/[processId]/draft-memo'
   */
  DRAFT_MEMO_PAGE: '/loan-processing/review/kepatuhan-syariah/[module]/[processId]/draft-memo',
  /**
   * '/loan-processing/review/kepatuhan-syariah/[module]/[processId]/summary/[id]'
   */
  EDIT_SUMMARY: '/loan-processing/review/kepatuhan-syariah/[module]/[processId]/summary/[id]',
  /**
   * '/loan-processing/review/kepatuhan-syariah/[module]/[processId]/summary/detail/[id]'
   */
  DETAIL_SUMMARY: '/loan-processing/review/kepatuhan-syariah/[module]/[processId]/summary/detail/[id]',
  /**
   * '/loan-processing/review/kepatuhan-syariah/[processId]/checklist-syariah-compliance/[id]/edit'
   */
  EDIT_SYARIAH_COMPLIANCE_CHECKLIST: '/loan-processing/review/kepatuhan-syariah/[module]/[processId]/checklist-syariah-compliance/[id]/edit',
  /**
   * '/loan-processing/review/kepatuhan-syariah/[processId]/checklist-syariah-compliance/[id]/detail'
   */
  DETAIL_SYARIAH_COMPLIANCE_CHECKLIST: '/loan-processing/review/kepatuhan-syariah/[module]/[processId]/checklist-syariah-compliance/[id]/detail',
  /**
   * '/loan-processing/review/kepatuhan-syariah/[processId]/facility-overview'
   */
  FACILITY_OVERVIEW_PAGE: '/loan-processing/review/kepatuhan-syariah/[module]/[processId]/facility-overview',
  /**
   * '/loan-processing/review/kepatuhan-syariah/bucket-list'
   */
  LIST_PAGE: '/loan-processing/review/kepatuhan-syariah/bucket-list',
  /**
   * '/loan-processing/review/kepatuhan-syariah/monitoring'
   */
  MONITORING_PAGE: '/loan-processing/review/kepatuhan-syariah/monitoring',
  /**
   * '/loan-processing/review/kepatuhan-syariah/[processId]/summary'
   */
  SUMMARY_PAGE: '/loan-processing/review/kepatuhan-syariah/[module]/[processId]/summary',
  /**
   * '/loan-processing/review/kepatuhan-syariah/[processId]/summary'
   */
  SYARIAH_COMPLIANCE_CHECKLIST: '/loan-processing/review/kepatuhan-syariah/[module]/[processId]/checklist-syariah-compliance',
  /**
   * '/loan-processing/review/kepatuhan-syariah/[processId]/validation'
   */
  VALIDATION_PAGE: '/loan-processing/review/kepatuhan-syariah/[module]/[processId]/validation',
  /**
   * '/loan-processing/review/kepatuhan-syariah/[processId]/view-all-document'
   */
  VIEW_ALL_DOCUMENT_PAGE: '/loan-processing/review/kepatuhan-syariah/[module]/[processId]/view-all-document',
};

export const legalSigning = {
  /**
   * '/loan-processing/legal-signing/[processId]/additional-information'
   */
  ADDITIONAL_INFORMATION_PAGE: '/loan-processing/legal-signing/[module]/[processId]/additional-information',
  /**
    * '/loan-processing/legal-signing/assignment'
    */
  ASSIGNMENT_PAGE: '/loan-processing/legal-signing/assignment',

  /**
   * '/loan-processing/review/esdd/[module]'
   */
  BASE_PATH: '/loan-processing/legal-signing/[module]',


  /**
   * '/loan-processing/legal-signing/[module]/[processId]/debtor-information'
   */
  DEBTOR_INFORMATION_PAGE: '/loan-processing/legal-signing/[module]/[processId]/debtor-information',


  /**
   * '/loan-processing/legal-signing/[module]/[processId]/draft-memo'
   */
  DRAFT_MEMO_PAGE: '/loan-processing/legal-signing/[module]/[processId]/draft-memo',


  /**
   * '/loan-processing/legal-signing/[module]/[processId]/facility-summary'
   */
  FACILITY_OVERVIEW_PAGE: '/loan-processing/legal-signing/[module]/[processId]/facility-overview',


  /**
   * '/loan-processing/legal-signing/[module]/[processId]/draft-memo'
   */
  HISTORY_PROCESS_PAGE: '/loan-processing/legal-signing/[processId]/history-process',

  /**
   * '/loan-processing/legal-signing/bucket-list'
   */
  LIST_PAGE: '/loan-processing/legal-signing/bucket-list',
  /**
   * '/loan-processing/legal-signing/monitoring'
   */
  MONITORING_PAGE: '/loan-processing/legal-signing/monitoring',
  /**
   * '/loan-processing/legal-signing/[module]/[processId]/pk-processing-type-monitoring/[id]/edit'
   */
  PK_PROCESSING_DETAIL_PAGE: '/loan-processing/legal-signing/[module]/[processId]/pk-processing-type-monitoring/[id]/edit',
  /**
   * '/loan-processing/legal-signing/[module]/[processId]/pk-processing-type-monitoring'
   */
  PK_PROCESSING_TYPE_MONITORING: '/loan-processing/legal-signing/[module]/[processId]/pk-processing-type-monitoring',
  /**
   * '/loan-processing/legal-signing/[module]/[processId]/validation'
   */
  VALIDATION_PAGE: '/loan-processing/legal-signing/[module]/[processId]/validation',
  /**
   * '/loan-processing/legal-signing/[module]/[processId]/view-all-document'
   */
  VIEW_ALL_DOCUMENT_PAGE: '/loan-processing/legal-signing/[module]/[processId]/view-all-document',
};

export const engagementSubmission = {
  /**
   * '/loan-processing/engagement-submission/bucket-list/[processId]/application'
   */
  APPLICATION_PAGE: '/loan-processing/engagement-submission/bucket-list/[processId]/application',
  /**
   * '/loan-processing/engagement-submission/bucket-list/[processId]/debtor-information'
   */
  DEBTOR_INFORMATION_PAGE: '/loan-processing/engagement-submission/bucket-list/[processId]/debtor-information',
  /**
   * '/loan-processing/engagement-submission/bucket-list/[processId]/facility-overview/detail/[id]'
   */
  FACILITY_DETAIL: '/loan-processing/engagement-submission/bucket-list/[processId]/facility-overview/detail/[id]',
  /**
   * '/loan-processing/engagement-submission/bucket-list/[processId]/facility-overview/detail/[id]'
   */
  FACILITY_PARENT_CHILD_LIMIT: '/loan-processing/engagement-submission/bucket-list/[processId]/facility-overview/parent-child-limit',
  /**
   * '/loan-processing/engagement-submission/bucket-list'
   */
  LIST_PAGE: '/loan-processing/engagement-submission/bucket-list',
  /**
   * '/loan-processing/engagement-submission/bucket-list/[processId]/pk-processing-type-monitoring/[id]/edit'
   */
  PK_PROCESSING_DETIAL_PAGE: '/loan-processing/engagement-submission/bucket-list/[processId]/pk-processing-type-monitoring/[id]/edit',
  /**
   * '/loan-processing/engagement-submission/bucket-list/[processId]/pk-processing-type-monitoring'
   */
  PK_PROCESSING_TYPE_MONITORING: '/loan-processing/engagement-submission/bucket-list/[processId]/pk-processing-type-monitoring',
};

export const risalahRapat = {
  /**
   * '/loan-processing/risalah-rapat/draft-list'
   */
  DRAFT_LIST_PAGE: '/loan-processing/risalah-rapat/draft-list',
  /**
   * '/loan-processing/risalah-rapat/draft-list/[processId]/attachment'
   */
  ATTACHMENT_PAGE: '/loan-processing/risalah-rapat/draft-list/[processId]/attachment',
  /**
   * '/loan-processing/risalah-rapat/draft-list/[processId]/attachment/add'
   */
  ADD_NEW_CORRECTIVE_ACTION_PLAN_PAGE: '/loan-processing/risalah-rapat/draft-list/[processId]/attachment/add',
  /**
   * '/loan-processing/risalah-rapat/draft-list/[processId]/attachment/edit/[id]'
   */
  EDIT_CORRECTIVE_ACTION_PLAN_PAGE: '/loan-processing/risalah-rapat/draft-list/[processId]/attachment/edit/[id]',
  /**
   * '/loan-processing/risalah-rapat/draft-list/[processId]/committee-meeting'
   */
  COMMITTEE_MEETING_PAGE: '/loan-processing/risalah-rapat/draft-list/[processId]/committee-meeting',
  /**
   * '/loan-processing/risalah-rapat/draft-list/[processId]/debtor-information'
   */
  DEBTOR_INFORMATION_PAGE: '/loan-processing/risalah-rapat/draft-list/[processId]/debtor-information',
  /**
   * '/loan-processing/risalah-rapat/draft-list/[processId]/draft-memo'
   */
  DRAFT_MEMO_PAGE: '/loan-processing/risalah-rapat/draft-list/[processId]/draft-memo',
  /**
   * '/loan-processing/risalah-rapat/draft-list/[processId]/financing-committee'
   */
  FINANCING_COMMITTEE_PAGE: '/loan-processing/risalah-rapat/draft-list/[processId]/financing-committee',
  /**
   * '/loan-processing/risalah-rapat/draft-list/[processId]/financing-facility-overview'
   */
  FINANCING_FACILITY_OVERVIEW_PAGE: '/loan-processing/risalah-rapat/draft-list/[processId]/financing-overview',
  /**
   * '/loan-processing/risalah-rapat/draft-list/[processId]/preview-acknowledgement-sheet'
   */
  PREVIEW_ACKNOWLEDGEMENT_SHEET: '/loan-processing/risalah-rapat/draft-list/[processId]/preview-acknowledgement-sheet',
  /**
   * '/loan-processing/review/risalah-rapat/draft-list/[processId]/risalah-rapat-result'
   */
  RISALAH_RAPAT_RESULT: '/loan-processing/risalah-rapat/draft-list/[processId]/risalah-rapat-result',
  /**
   * '/loan-processing/risalah-rapat/draft-list/[processId]/validation'
   */
  VALIDATION_PAGE: '/loan-processing/risalah-rapat/draft-list/[processId]/validation',
  /**
   * '/loan-processing/risalah-rapat/draft-list/[processId]/view-all-document'
   */
  VIEW_ALL_DOCUMENT_PAGE: '/loan-processing/risalah-rapat/draft-list/[processId]/view-all-document',
};

export const lpaReview = {
  /**
   * '/loan-processing/review/lpa-review/assignment-review
   */
  ASSIGNMENT: '/loan-processing/review/lpa-review/assignment',
  /**
   * '.../lpa-review/lpa-review/[module]/[processId]/detail-lpa-information/[id]/detail-collateral/[id]'
   */
  COLLATERAL_DETAIL: '/loan-processing/review/lpa-review/[module]/[processId]/detail-lpa-information/[parentId]/detail-collateral/[id]',
  /**
   * '/loan-processing/review/lpa-review/lpa-review/[processId]/debtor-information
   */
  DEBTOR_INFORMATION: '/loan-processing/review/lpa-review/[module]/[processId]/debtor-information',
  /**
   * '/loan-processing/review/lpa-review/lpa-review/[module]/[processId]/detail-lpa-information/[parentId]'
   */
  DETAIL_LPA: '/loan-processing/review/lpa-review/[module]/[processId]/detail-lpa-information/[parentId]',
  /**
   * '/loan-processing/review/lpa-review/lpa-review/[module]/[processId]/draft-memo
   */
  DRAFT_MEMO: '/loan-processing/review/lpa-review/[module]/[processId]/draft-memo',
  /**
   * '/loan-processing/review/lpa-review/lpa-review/monitoring
   */
  MONITORING: '/loan-processing/review/lpa-review/monitoring',
  /**
   * '/loan-processing/review/lpa-review/lpa-review/[module]/[processId]/objective-background
   */
  OBJECTIVE_BACKGROUND: '/loan-processing/review/lpa-review/[module]/[processId]/objective-background',
  /**
   * '/loan-processing/review/lpa-review/lpa-review/[module]/[processId]/others
   */
  OTHERS: '/loan-processing/review/lpa-review/[module]/[processId]/others',
  /**
   * '/loan-processing/review/lpa-review/lpa-review/[module]/[processId]/recommendation
   */
  RECOMMENDATION: '/loan-processing/review/lpa-review/[module]/[processId]/recommendation',
  /**
   * '/loan-processing/review/lpa-review/lpa-review
   */
  REQUEST: '/loan-processing/review/lpa-review/bucket-list',
  /**
   * '/loan-processing/review/lpa-review/lpa-review/[module]/[processId]/review-kjpp'
   */
  REVIEW_KJPP: '/loan-processing/review/lpa-review/[module]/[processId]/review-kjpp',
  /**
   * '/loan-processing/review/lpa-review/lpa-review/[module]/[processId]/validation
   */
  VALIDATION: '/loan-processing/review/lpa-review/[module]/[processId]/validation',
  /**
   * '/loan-processing/review/lpa-review/lpa-review/[module]/[processId]/view-all-document
   */
  VIEW_ALL_DOCUMENT: '/loan-processing/review/lpa-review/[module]/[processId]/view-all-document',
};

export const lpaRequestReview = {
  /**
   * '/loan-processing/review/lpa-request-review/assignment-review
   */
  ASSIGNMENT: '/loan-processing/review/lpa-request-review/assignment',
  /**
     *
    * '/loan-processing/review/lpa-request-review/bucket-list'
    */
  BUCKET_LIST: '/loan-processing/review/lpa-request-review/bucket-list',
  /**
   * '/loan-processing/review/lpa-request-review/[processId]/debtor-information
   */
  DEBTOR_INFORMATION: '/loan-processing/review/lpa-request-review/[module]/[processId]/debtor-information',
  /**
   * '/loan-processing/review/lpa-request-review/[module]/[processId]/detail-informasi-lpa/[id]'
   */
  DETAIL_LPA: '/loan-processing/review/lpa-request-review/[module]/[processId]/detail-informasi-lpa/[id]',
  /**
   * '/loan-processing/review/lpa-request-review/[module]/[processId]/draft-memo
   */
  DRAFT_MEMO: '/loan-processing/review/lpa-request-review/[module]/[processId]/draft-memo',
  /**
   * '/loan-processing/review/lpa-request-review/[module]/[processId]/facility-overview
   */
  FACILITY_OVERVIEW: '/loan-processing/review/lpa-request-review/[module]/[processId]/facility-overview',
  /**
   * '/loan-processing/review/lpa-request-review/monitoring
   */
  MONITORING: '/loan-processing/review/lpa-request-review/monitoring',
  /**
   * '/loan-processing/review/lpa-request-review/[module]/[processId]/objective-background
   */
  OBJECTIVE_BACKGROUND: '/loan-processing/review/lpa-request-review/[module]/[processId]/objective-background',
  /**
   * '/loan-processing/review/lpa-request-review/[module]/[processId]/others
   */
  OTHERS: '/loan-processing/review/lpa-request-review/[module]/[processId]/others',
  /**
   * '/loan-processing/review/lpa-request-review/[module]/[processId]/recommendation
   */
  RECOMMENDATION: '/loan-processing/review/lpa-request-review/[module]/[processId]/recommendation',
  /**
   * '/loan-processing/review/lpa-request-review/lpa-request-review
   */
  REQUEST: '/loan-processing/review/lpa-request-review/request',
  /**
   * '/loan-processing/review/lpa-request-review/[module]/[processId]/review-kjpp'
   */
  REVIEW_KJPP: '/loan-processing/review/lpa-request-review/[module]/[processId]/review-kjpp',
  /**
   * '/loan-processing/review/lpa-request-review/[module]/[processId]/validation
   */
  VALIDATION: '/loan-processing/review/lpa-request-review/[module]/[processId]/validation',
  /**
   * '/loan-processing/review/lpa-request-review/[module]/[processId]/view-all-document
   */
  VIEW_ALL_DOCUMENT: '/loan-processing/review/lpa-request-review/[module]/[processId]/view-all-document',
};

export const userManagement = {

  ACCESS_MENU: {
    /**
  * '/user-management/access-menu/add'
  */
    ADD: '/user-management/access-menu/add',

    /**
   * '/user-management/access-menu'
   */
    BUCKET_LIST: '/user-management/access-menu',

    /**
  * '/user-management/access-menu/[id]/access-menu-detail'
  */
    DETAIL: '/user-management/access-menu/[id]/access-menu-detail',

    /**
   * '/user-management/access-menu/[id]/edit'
   */
    EDIT: '/user-management/access-menu/[id]/edit',
  },
  /**
   * '/user-management/[module]'
   */
  BASE_PATH: '/user-management/[module]',

  USER_LIST: {

    /**
   * '/user-management/user-list/[id]/add'
   */
    ADD: '/user-management/user-list/add',

    /**
     *  '/user-management/user-list'
   */
    BUCKET_LIST: '/user-management/user-list',


    /**
     * '/user-management/user-list/[id]/user-detail'
     */
    DETAIL: '/user-management/user-list/[id]/user-detail',

    /**
   * '/user-management/user-list/[id]/edit'
   */
    EDIT: '/user-management/user-list/[id]/edit',
  },

};

export const spfp = {
  /**
   * '/loan-processing/spfp/assignment'
   */
  ASSIGNMENT_PAGE: '/loan-processing/spfp/assignment',
  /**
   * '/loan-processing/spfp/[module]/[processId]/compliance-check'
   */
  COMPLIANCE_CHECK_PAGE: '/loan-processing/spfp/[module]/[processId]/compliance-check',
  /**
   * '/loan-processing/spfp/[module]/[processId]/compliance-check'
   */
  COMPLIANCE_CHECK_RESPONSE_PAGE: '/loan-processing/spfp/[module]/[processId]/compliance-check-response',
  /**
   * '/loan-processing/spfp/[module]/[processId]/debtor-information'
   */
  DEBTOR_INFORMATION_PAGE: '/loan-processing/spfp/[module]/[processId]/debtor-information',
  /**
   * '/loan-processing/spfp/[processId]/upload-offering-letter/[noDraft]/detail-draft-offering-letter'
   */
  DETAIL_DRAFT_OL_PAGE: '/loan-processing/spfp/[module]/[processId]/upload-offering-letter/[noDraft]/detail-draft-offering-letter',
  /**
   * '/loan-processing/spfp/[processId]/draft-memo'
   */
  DRAFT_MEMO_PAGE: '/loan-processing/spfp/[module]/[processId]/draft-memo',
  /**
   * '/loan-processing/spfp/[module]/[processId]/financing-overview'
   */
  FINANCING_OVERVIEW: '/loan-processing/spfp/[module]/[processId]/financing-overview',
  /**
   * '/loan-processing/spfp/history-process/[processId]'
   */
  HISTORY_PROCESS_PAGE: '/loan-processing/spfp/history-process/[processId]',
  /**
   * '/loan-processing/spfp/bucket'
   */
  LIST_PAGE: '/loan-processing/spfp/bucket',
  /**
   * '/loan-processing/spfp/[module]'
   */
  LIST_PAGE_MODULE: '/loan-processing/spfp/[module]',
  /**
   * '/loan-processing/spfp/monitoring'
   */
  MONITORING_PAGE: '/loan-processing/spfp/monitoring',
  /**
   * '/loan-processing/spfp/[module]/[processId]/compliance-check/[complianceNumber]/note-compliance-check'
   */
  NOTE_COMPLIANCE_CHECK_PAGE: '/loan-processing/spfp/[module]/[processId]/compliance-check/[complianceNumber]/note-compliance-check',
  /**
   * '/loan-processing/spfp/[module]/[processId]/compliance-check-response/[complianceNumber]/note-compliance-check'
   */
  NOTE_COMPLIANCE_CHECK_RESPONSE_PAGE: '/loan-processing/spfp/[module]/[processId]/compliance-check-response/[complianceNumber]/note-compliance-check',
  /**
   * '/loan-processing/spfp/[module]/[processId]/note-compliance-check'
   */
  NOTE_PAGE: '/loan-processing/spfp/[module]/[processId]/note-compliance-check',
  /**
   * '/loan-processing/spfp/[module]/[processId]/upload-offering-letter'
   */
  UPLOAD_OL_PAGE: '/loan-processing/spfp/[module]/[processId]/upload-offering-letter',
  /**
   * '/loan-processing/spfp/[module]/[processId]/validation'
   */
  VALIDATION_PAGE: '/loan-processing/spfp/[module]/[processId]/validation',
  /**
   * '/loan-processing/spfp/[module]/[processId]/verification-sheet'
   */
  VERIFICATION_PAGE: '/loan-processing/spfp/[module]/[processId]/verification-sheet',
  /**
   * '/loan-processing/spfp/[module]/[processId]/view-all-document'
   */
  VIEW_ALL_DOCUMENT_PAGE: '/loan-processing/spfp/[module]/[processId]/view-all-document',
};

export const technicalStudyReview = {
  /**
   * '/loan-processing/review/technical-study-review/assignment'
   */
  ASSIGNMENT_PAGE: '/loan-processing/review/technical-study-review/assignment',
  /**
   * '/loan-processing/review/technical-study-review/[module]/[processId]/debtor-information'
   */
  DEBTOR_INFORMATION_PAGE: '/loan-processing/review/technical-study-review/[module]/[processId]/debtor-information',
  /**
   * '/loan-processing/review/technical-study-review/[module]/[processId]/draft-memo'
   * */
  DRAFT_MEMO_PAGE: '/loan-processing/review/technical-study-review/[module]/[processId]/draft-memo',
  /**
   * '/loan-processing/review/technical-study-review/monitoring'
   */
  MONITORING_PAGE: '/loan-processing/review/technical-study-review/monitoring',
  /**
   * '/loan-processing/review/technical-study-review/[module]/[processId]/catatan'
   * */
  NOTE_PAGE: '/loan-processing/review/technical-study-review/[module]/[processId]/catatan',
  /**
   * '/loan-processing/review/technical-study-review'
   */
  REQUEST_PAGE: '/loan-processing/review/technical-study-review/request',
  /**
   * '/loan-processing/review/technical-study-review/review'
   */
  REVIEW_PAGE: '/loan-processing/review/technical-study-review/review',
  /**
   * '/loan-processing/review/technical-study-review/[module]/[processId]/kajian-teknis'
   * */
  TECHNICAL_STUDY_PAGE: '/loan-processing/review/technical-study-review/[module]/[processId]/kajian-teknis',
  /**
   * '/loan-processing/review/technical-study-review/[module]/[processId]/validation'
   */
  VALIDATION_PAGE: '/loan-processing/review/technical-study-review/[module]/[processId]/validation',
  /**
   * '/loan-processing/review/technical-study-review/[module]/[processId]/view-all-document'
   * */
  VIEW_ALL_DOCUMENT_PAGE: '/loan-processing/review/technical-study-review/[module]/[processId]/view-all-document',
};

export const virtualAccount = {
  /**
  * '/va/[processId]/list
  */
  VA_DETAIL: '/va/[processId]/va-list',
  /**
  * '/va/[processId]/list
  */
  VA_DETAIL_CUSTOMER: '/va/[processId]/customer-information',
  /**
  * '/va/activation/[processId]/customer-information
  */
  VA_ACTIVATION_DETAIL_CUSTOMER: '/va/activation/[processId]/customer-information',
  /**
  * '/va/[processId]/validasi
  */
  VA_VALIDASI: '/va/[processId]/validasi',
  /**
  * '/va'
  */
  VA_LIST: '/va',
  /**
  * '/va/activation'
  */
  VA_ACTIVATIN_LIST: '/va/activation',
};

export const businessActivityReport = {


  /**
  * '/business-activity-report/create-report/[processId]/existing'
  */
  EXISTING: '/business-activity-report/create-report/[processId]/existing',


  /**
   * '/business-activity-report/[processId]/group/[debtorId]/detail/[groupId]'
   */
  GROUP_DETAIL_PAGE: '/business-activity-report/[processId]/group/[debtorId]/detail/[groupId]',


  /**
   * '/business-activity-report/[processId]/group/[debtorId]'
   */
  GROUP_PAGE: '/business-activity-report/[processId]/group/[debtorId]',


  /**
  * '/business-activity-report/[processId]/information
  */
  INFORMATION: '/business-activity-report/[processId]/information',

  /**
  * '/business-activity-report/[processId]/approval
  */
  APPROVAL: '/business-activity-report/[processId]/approval',


  /**
  * '/business-activity-report'
  */
  LIST: '/business-activity-report',


  /**
  *'/business-activity-report/create-report/new',
  */
  NEW: '/business-activity-report/create-report/new',


  /**
   * '/business-activity-report/[processId]/group/[debtorId]/create-new-group'
   */
  NEW_GROUP_PAGE: '/business-activity-report/[processId]/group/[debtorId]/create-new-group',


  /**
  * '/business-activity-report/[processId]/validation
  */
  VALIDATION: '/business-activity-report/[processId]/validation',

};

export const maintenanceTAT = {

  /**
  * '/maintenance-tat'
  */
  MAINTENANCE_TAT_LIST: '/maintenance-tat',

  /**
  * '/maintenance-tat/[processId]/tat-detail
  */
  TAT_DETAIL: '/maintenance-tat/[processId]/tat-detail',
  /**
  * '/maintenance-tat/[processId]/validation
  */
  VALIDATION: '/maintenance-tat/[processId]/validation',
};

export const loanProcessingSummary = {
  /**
 *
 * '/loan-processing-summary/bast/[processId]/view-all-document'
 * */
  ADDENDUM_DATA: '/loan-processing-summary/[module]/[processId]/addendum-data',

  /**
   *
   * '/loan-processing-summary/core/[processId]/financing-facility/additional-facility/[id]'
   * */
  ADDITIONAL_FACILITY: '/loan-processing-summary/core/[processId]/financing-facility/additional-facility/[id]',


  /**
   *
   * '/loan-processing-summary/bast/[processId]/additional-information'
   * */
  ADDITIONAL_INFORMATION_PAGE: '/loan-processing-summary/bast/[processId]/additional-information',


  /**
    * '/loan-processing-summary/bast'
    */
  BUCKET_LPS_BAST_PAGE: '/loan-processing-summary/bast',


  /**
 * '/loan-processing-summary/core'
 */
  BUCKET_LPS_CORE: '/loan-processing-summary/core',


  /**
   *
   * '/loan-processing-summary/bast/[processId]/debtor-information'
   * */
  DEBTOR_INFORMATION_BAST_PAGE: '/loan-processing-summary/bast/[processId]/debtor-information',


  /**
   *
   * '/loan-processing-summary/[module]/[module]/[processId]/debtor-information'
   * */
  DEBTOR_INFORMATION_PAGE: '/loan-processing-summary/[module]/[processId]/debtor-information',


  /**
   *
   * '/loan-processing-summary/bast/[processId]/document-checklist'
   * */
  DOCUMENT_CHECKLIST_PAGE: '/loan-processing-summary/bast/[processId]/document-checklist',


  /**
   *
   * '/loan-processing-summary/core/[processId]/financing-facility'
   * */
  FINANCING_FACILITY: '/loan-processing-summary/core/[processId]/financing-facility',


  /**
   *
   * '/loan-processing-summary/bast/[processId]/validation'
   * */
  VALIDATION_PAGE: '/loan-processing-summary/bast/[processId]/validation',

  /**
   *
   * '/loan-processing-summary/bast/[processId]/view-all-document'
   * */
  VIEW_ALL_DOCUMENT_PAGE: '/loan-processing-summary/bast/[processId]/view-all-document',

  /**
   *
   * '/loan-processing-summary/bast/[processId]/data-on-core-requirements'
   * */
  DATA_ON_CORE_REQUIREMENT: '/loan-processing-summary/core/[processId]/data-on-core-requirements',

  /**
   *
   * '/loan-processing-summary/bast/[processId]/data-on-core-requirements/detail-management/[id]'
   * */
  DETAIL_MANAGEMENT: '/loan-processing-summary/core/[processId]/data-on-core-requirements/detail-management/[id]',

  /**
   *
   * '/loan-processing-summary/bast/[processId]/data-on-core-requirements/detail-shareholder/[id]'
   * */
  DETAIL_SHAREHOLDER: '/loan-processing-summary/core/[processId]/data-on-core-requirements/detail-shareholder/[id]',

  /**
   * '/loan-processing-summary/core/[processId]/financing-facility/parent-child-limit'
   */
  FACILITY_PARENT_CHILD_LIMIT: '/loan-processing-summary/core/[processId]/financing-facility/parent-child-limit',
};

export const RE_ASSIGNMENT_SKU = {
  /**
   * '/reassignment-sku'
   */
  BASH_PATH: '/reassignment-sku',
  /**
   * '/reassignment-sku/[processId]/[mode]'
   */
  DETAIL: '/reassignment-sku/[processId]/[mode]',
  /**
   * '/reassignment-sku/[processId]/[mode]/request'
   */
  REQUEST_PAGE: '/reassignment-sku/[processId]/[mode]/request',
  /**
   * '/reassignment-sku/[processId]/[mode]/validasi'
   */
  VALIDATION_PAGE: '/reassignment-sku/[processId]/[mode]/validation',
};

export const MONITORING = {
  /**
   * '/process-monitoring'
   */
  PROCESS_MONITORING: '/process-monitoring',

  /**
   * '/customer-monitoring'
   */
  CUSTOMER_MONITORING: '/customer-monitoring',

};

export const MASTER_PARAMETER = {
  /**
    * '/master-parameter/[module]'
    */
  BASE_LIST_PATH: '/master-parameter/[module]',

  /**
    * '/master-parameter/[module]/[processId]/[mode]'
    */
  BASE_MODE_PATH: '/master-parameter/[module]/[processId]/[mode]',

  /**
    * '/master-parameter/parameter-sla'
    */
  PARAMETER_SLA_LIST_PAGE: '/master-parameter/parameter-sla',

  /**
    * '/master-parameter/parameter-sla/[processId]/[mode]'
    */
  PARAMETER_SLA_DETAIL_PAGE: '/master-parameter/parameter-sla/[processId]/[mode]',

  /**
    * '/master-parameter/parameter-cot-eod'
    */
  PARAMETER_COT_EOD_LIST_PAGE: '/master-parameter/parameter-cot-eod',

  /**
    * '/master-parameter/parameter-cot-eod/[processId]/[mode]'
    */
  PARAMETER_COT_EOD_DETAIL_PAGE: '/master-parameter/parameter-cot-eod/[processId]/[mode]',

  /**
    * '/master-parameter/parameter-rate'
    */
  PARAMETER_RATE_LIST_PAGE: '/master-parameter/parameter-rate',

  /**
    * '/master-parameter/parameter-rate/[processId]/[mode]'
    */
  PARAMETER_RATE_DETAIL_PAGE: '/master-parameter/parameter-rate/[processId]/[mode]',

  /**
   * '/master-parameter/parameter-lov'
   */
  PARAMETER_LOV_LIST_PAGE: '/master-parameter/parameter-lov',

  /**
   * '/master-parameter/parameter-lov/[id]/[mode]'
   */
  PARAMETER_LOV_DETAIL_PAGE: '/master-parameter/parameter-lov/[id]/[mode]',

  /**
   * '/master-parameter/parameter-mapping-apu_ppt'
   */
  PARAMETER_MAPPING_APU_PPT_LIST_PAGE: '/master-parameter/parameter-mapping-apu_ppt',

  /**
   * '/master-parameter/parameter-mapping-apu_ppt/[id]/[mode]'
   */
  PARAMETER_MAPPING_APU_PPT_DETAIL_PAGE: '/master-parameter/parameter-mapping-apu_ppt/[id]/[mode]',

  /**
   * '/master-parameter/parameter-beneficial-owner'
   */
  PARAMETER_BENEFICIAL_OWNER_LIST_PAGE: '/master-parameter/parameter-beneficial-owner',

  /**
   * '/master-parameter/parameter-beneficial-owner/create'
   */
  PARAMETER_BENEFICIAL_OWNER_CREATE_PAGE: '/master-parameter/parameter-beneficial-owner/create',

  /**
   * '/master-parameter/parameter-beneficial-owner/[processId]/[mode]'
   */
  PARAMETER_BENEFICIAL_OWNER_DETAIL_PAGE: '/master-parameter/parameter-beneficial-owner/[processId]/[mode]',

  /**
   * '/master-parameter/parameter-beneficial-owner/[processId]/[mode]/item/create'
   */
  PARAMETER_BENEFICIAL_OWNER_CREATE_ITEM_PAGE: '/master-parameter/parameter-beneficial-owner/[processId]/[mode]/item/create',

  /**
   * '/master-parameter/parameter-beneficial-owner/[processId]/[mode]/item/[id]'
   */
  PARAMETER_BENEFICIAL_OWNER_DETAIL_ITEM_PAGE: '/master-parameter/parameter-beneficial-owner/[processId]/[mode]/item/[id]',

  /**
   * '/master-parameter/parameter-beneficial-owner/[processId]/[mode]/preview'
   */
  PARAMETER_BENEFICIAL_OWNER_PREVIEW_PAGE: '/master-parameter/parameter-beneficial-owner/[processId]/[mode]/preview',

  /**
   * '/master-parameter/parameter-cdd'
   */
  PARAMETER_CUSTOMER_DUE_DILIGENCE_LIST_PAGE: '/master-parameter/parameter-cdd',

  /**
   * '/master-parameter/parameter-cdd/create'
   */
  PARAMETER_CUSTOMER_DUE_DILIGENCE_CREATE_PAGE: '/master-parameter/parameter-cdd/create',

  /**
   * '/master-parameter/parameter-cdd/[processId]/[mode]'
   */
  PARAMETER_CUSTOMER_DUE_DILIGENCE_DETAIL_PAGE: '/master-parameter/parameter-cdd/[processId]/[mode]',

  /**
   * '/master-parameter/parameter-cdd/[processId]/[mode]/item/create'
   */
  PARAMETER_CUSTOMER_DUE_DILIGENCE_CREATE_ITEM_PAGE: '/master-parameter/parameter-cdd/[processId]/[mode]/item/create',

  /**
   * '/master-parameter/parameter-cdd/[processId]/[mode]/item/[id]'
   */
  PARAMETER_CUSTOMER_DUE_DILIGENCE_DETAIL_ITEM_PAGE: '/master-parameter/parameter-cdd/[processId]/[mode]/item/[id]',

  /**
   * '/master-parameter/parameter-cdd/[processId]/[mode]/preview'
   */
  PARAMETER_CUSTOMER_DUE_DILIGENCE_PREVIEW_PAGE: '/master-parameter/parameter-cdd/[processId]/[mode]/preview',

  /**
   * '/master-parameter/parameter-mapping-bar'
   */
  PARAMETER_MAPPING_BAR_LIST_PAGE: '/master-parameter/parameter-mapping-bar',

  /**
   * '/master-parameter/parameter-mapping-bar/[id]/[processId]/[mode]/[submodule]/[code]/[description]/[step]'
   */
  PARAMETER_MAPPING_BAR_DETAIL_PAGE: '/master-parameter/parameter-mapping-bar/[id]/[processId]/[mode]/[submodule]/[code]/[description]/[step]',

  PARAMETER_SKEMA_SYARIAH_LIST_PAGE: '/master-parameter/parameter-skema-syariah',
  PARAMETER_SKEMA_SYARIAH_CREATE_PAGE: '/master-parameter/parameter-skema-syariah/create',
  PARAMETER_SKEMA_SYARIAH_EDIT_PAGE: '/master-parameter/parameter-skema-syariah/[processId]/edit',
  PARAMETER_SKEMA_SYARIAH_DETAIL_PAGE: '/master-parameter/parameter-skema-syariah/[processId]/detail',
};

export const accessid = {
  ANALYST_CREATE: 'analyst-create',
  ANALYST_DELETE: 'analyst-delete',
  ANALYST_DOWNLOAD: 'analyst-download',
  ANALYST_MENU: 'analyst-menu',
  ANALYST_UPDATE: 'analyst-update',
  ANALYST_VIEW: 'analyst-view',
  ANNUAL_REVIEW_CREATE: 'annual-review-create',
  ANNUAL_REVIEW_DELETE: 'annual-review-delete',
  ANNUAL_REVIEW_DOWNLOAD: 'annual-review-download',
  ANNUAL_REVIEW_MENU: 'annual-review-menu',
  ANNUAL_REVIEW_UPDATE: 'annual-review-update',
  ANNUAL_REVIEW_VIEW: 'annual-review-view',
  ANNUAL_REVIEW_REQUEST_VIEW: 'request-annual-review-view',
  ANNUAL_REVIEW_REQUEST_UPDATE: 'request-annual-review-update',
  ANNUAL_REVIEW_REQUEST_CREATE: 'request-annual-review-create',
  ANNUAL_REVIEW_REQUEST_DELETE: 'request-annual-review-delete',
  ANNUAL_REVIEW_REQUEST_DOWNLOAD: 'request-annual-review-download',
  ANNUAL_REVIEW_REQUEST_MENU: 'request-annual-review-menu',
  ANNUAL_REVIEW_ANALYST_VIEW: 'annual-review-analyst-view',
  ANNUAL_REVIEW_ANALYST_UPDATE: 'annual-review-analyst-update',
  ANNUAL_REVIEW_ANALYST_CREATE: 'annual-review-analyst-create',
  ANNUAL_REVIEW_ANALYST_DELETE: 'annual-review-analyst-delete',
  ANNUAL_REVIEW_ANALYST_DOWNLOAD: 'annual-review-analyst-download',
  ANNUAL_REVIEW_ANALYST_MENU: 'annual-review-analyst-menu',
  ANNUAL_REVIEW_ASSIGNMENT_VIEW: 'assignment-annual-review-view',
  ANNUAL_REVIEW_ASSIGNMENT_UPDATE: 'assignment-annual-review-update',
  ANNUAL_REVIEW_ASSIGNMENT_CREATE: 'assignment-annual-review-create',
  ANNUAL_REVIEW_ASSIGNMENT_DELETE: 'assignment-annual-review-delete',
  ANNUAL_REVIEW_ASSIGNMENT_DOWNLOAD: 'assignment-annual-review-download',
  ANNUAL_REVIEW_ASSIGNMENT_MENU: 'assignment-annual-review-menu',
  ANNUAL_REVIEW_VERIFICATION_VIEW: 'verification-annual-review-view',
  ANNUAL_REVIEW_VERIFICATION_UPDATE: 'verification-annual-review-update',
  ANNUAL_REVIEW_VERIFICATION_CREATE: 'verification-annual-review-create',
  ANNUAL_REVIEW_VERIFICATION_DELETE: 'verification-annual-review-delete',
  ANNUAL_REVIEW_VERIFICATION_DOWNLOAD: 'verification-annual-review-download',
  ANNUAL_REVIEW_VERIFICATION_MENU: 'verification-annual-review-menu',
  ANNUAL_REVIEW_MONITORING_VIEW: 'monitoring-annual-review-view',
  ANNUAL_REVIEW_MONITORING_UPDATE: 'monitoring-annual-review-update',
  ANNUAL_REVIEW_MONITORING_CREATE: 'monitoring-annual-review-create',
  ANNUAL_REVIEW_MONITORING_DELETE: 'monitoring-annual-review-delete',
  ANNUAL_REVIEW_MONITORING_DOWNLOAD: 'monitoring-annual-review-download',
  ANNUAL_REVIEW_MONITORING_MENU: 'monitoring-annual-review-menu',
  APPROVAL_CREATE: 'approval-create',
  APPROVAL_DELETE: 'approval-delete',
  APPROVAL_DOWNLOAD: 'approval-download',
  APPROVAL_MENU: 'approval-menu',
  APPROVAL_UPDATE: 'approval-update',
  APPROVAL_VIEW: 'approval-view',
  ASSIGNMENT_APU_PPT_CREATE: 'assignment-apu-ppt-create',
  ASSIGNMENT_APU_PPT_DELETE: 'assignment-apu-ppt-delete',
  ASSIGNMENT_APU_PPT_DOWNLOAD: 'assignment-apu-ppt-download',
  ASSIGNMENT_APU_PPT_MENU: 'assignment-apu-ppt-menu',
  ASSIGNMENT_APU_PPT_UPDATE: 'assignment-apu-ppt-update',
  ASSIGNMENT_APU_PPT_VIEW: 'assignment-apu-ppt-view',
  BMPP_SIMULATION_VIEW: 'bmpp-simulation-view',
  DRAFT_LIST_CREATE: 'draft-list-create',
  DRAFT_LIST_DELETE: 'draft-list-delete',
  DRAFT_LIST_DOWNLOAD: 'draft-list-download',
  DRAFT_LIST_MENU: 'draft-list-menu',
  DRAFT_LIST_UPDATE: 'draft-list-update',
  DRAFT_LIST_VIEW: 'draft-list-view',
  HIGH_RISK_BUCKET_LIST_CREATE: 'high-risk-bucket-list-create',
  HIGH_RISK_BUCKET_LIST_VIEW: 'high-risk-bucket-list-view',
  HIGH_RISK_BUCKET_LIST_DELETE: 'high-risk-bucket-list-delete',
  HOME_VIEW: 'home-view',
  HIGH_RISK_BUCKET_LIST_DOWNLOAD: 'high-risk-bucket-list-download',
  MIP_CREATE: 'mip-create',
  HIGH_RISK_ASSIGNMENT_LIST_VIEW: 'high-risk-assignment-list-view',
  MIP_DELETE: 'mip-delete',
  HIGH_RISK_ASSIGNMENT_LIST_CREATE: 'high-risk-assignment-list-create',
  MIP_DOWNLOAD: 'mip-download',
  HIGH_RISK_ASSIGNMENT_LIST_DELETE: 'high-risk-assignment-list-delete',
  MIP_MENU: 'mip-menu',
  HIGH_RISK_ASSIGNMENT_LIST_DOWNLOAD: 'high-risk-assignment-list-download',
  MIP_VIEW: 'mip-view',
  HIGH_RISK_ASSIGNMENT_LIST_MENU: 'high-risk-assignment-list-menu',
  PIPELINE_CREATE: 'pipeline-create',
  HIGH_RISK_ASSIGNMENT_LIST_UPDATE: 'high-risk-assignment-list-update',
  PIPELINE_DELETE: 'pipeline-delete',
  HIGH_RISK_BUCKET_LIST_MENU: 'high-risk-bucket-list-menu',
  PIPELINE_DOWNLOAD: 'pipeline-download',
  HIGH_RISK_BUCKET_LIST_UPDATE: 'high-risk-bucket-list-update',
  PIPELINE_VIEW: 'pipeline-view',
  HIGH_RISK_MONITORING_LIST_CREATE: 'high-risk-monitoring-list-create',
  PIPELINE_UPDATE: 'pipeline-update',
  HIGH_RISK_MONITORING_LIST_DELETE: 'high-risk-monitoring-list-delete',
  HIGH_RISK_MONITORING_LIST_DOWNLOAD: 'high-risk-monitoring-list-download',
  PIPELINE_MENU: 'pipeline-menu',
  HIGH_RISK_MONITORING_LIST_MENU: 'high-risk-monitoring-list-menu',
  HIGH_RISK_MONITORING_LIST_UPDATE: 'high-risk-monitoring-list-update',
  MIP_UPDATE: 'mip-update',
  ASSIGNMENT_CREDIT_CHECKING_VIEW: 'assignment-credit-checking-view',
  MIR_CREATE: 'mir-create',
  ASSIGNMENT_CREDIT_CHECKING_CREATE: 'assignment-credit-checking-create',
  MIR_DELETE: 'mir-delete',
  ASSIGNMENT_CREDIT_CHECKING_DELETE: 'assignment-credit-checking-delete',
  MIR_DOWNLOAD: 'mir-download',
  ASSIGNMENT_CREDIT_CHECKING_DOWNLOAD: 'assignment-credit-checking-download',
  MIR_MENU: 'mir-menu',
  ASSIGNMENT_CREDIT_CHECKING_MENU: 'assignment-credit-checking-menu',
  MIR_VIEW: 'mir-view',
  ASSIGNMENT_CREDIT_CHECKING_UPDATE: 'assignment-credit-checking-update',
  MIR_UPDATE: 'mir-update',
  DOCUMENT_VERIFICATION_CREDIT_CHECKING_CREATE: 'document-verification-credit-checking-create',
  MONITORING_APU_PPT_CREATE: 'monitoring-apu-ppt-create',
  BUCKET_CREDIT_CHECKING_VIEW: 'bucket-credit-checking-view',
  MONITORING_APU_PPT_DELETE: 'monitoring-apu-ppt-delete',
  BUCKET_CREDIT_CHECKING_CREATE: 'bucket-credit-checking-create',
  MONITORING_APU_PPT_DOWNLOAD: 'monitoring-apu-ppt-download',
  BUCKET_CREDIT_CHECKING_DELETE: 'bucket-credit-checking-delete',
  MONITORING_APU_PPT_VIEW: 'monitoring-apu-ppt-view',
  BUCKET_CREDIT_CHECKING_DOWNLOAD: 'bucket-credit-checking-download',
  MONITORING_CREATE: 'monitoring-create',
  BUCKET_CREDIT_CHECKING_MENU: 'bucket-credit-checking-menu',
  MONITORING_DELETE: 'monitoring-delete',
  BUCKET_CREDIT_CHECKING_UPDATE: 'bucket-credit-checking-update',
  MONITORING_DOWNLOAD: 'monitoring-download',
  DOCUMENT_VERIFICATION_CREDIT_CHECKING_DELETE: 'document-verification-credit-checking-delete',
  MONITORING_VIEW: 'monitoring-view',
  DOCUMENT_VERIFICATION_CREDIT_CHECKING_DOWNLOAD: 'document-verification-credit-checking-download',
  MONITORING_UPDATE: 'monitoring-update',
  DOCUMENT_VERIFICATION_CREDIT_CHECKING_MENU: 'document-verification-credit-checking-menu',
  MONITORING_MENU: 'monitoring-menu',
  DOCUMENT_VERIFICATION_CREDIT_CHECKING_UPDATE: 'document-verification-credit-checking-update',
  REQUEST_APU_PPT_CREATE: 'request-apu-ppt-create',
  ASSIGNMENT_ELIGIBILITY_REVIEW_VIEW: 'assignment-eligibility-review-view',
  REQUEST_APU_PPT_DELETE: 'request-apu-ppt-delete',
  ASSIGNMENT_ELIGIBILITY_REVIEW_CREATE: 'assignment-eligibility-review-create',
  REQUEST_APU_PPT_DOWNLOAD: 'request-apu-ppt-download',
  ASSIGNMENT_ELIGIBILITY_REVIEW_DELETE: 'assignment-eligibility-review-delete',
  REQUEST_APU_PPT_VIEW: 'request-apu-ppt-view',
  ASSIGNMENT_ELIGIBILITY_REVIEW_DOWNLOAD: 'assignment-eligibility-review-download',
  REQUEST_APU_PPT_UPDATE: 'request-apu-ppt-update',
  ASSIGNMENT_ELIGIBILITY_REVIEW_MENU: 'assignment-eligibility-review-menu',
  REQUEST_APU_PPT_MENU: 'request-apu-ppt-menu',
  ASSIGNMENT_ELIGIBILITY_REVIEW_UPDATE: 'assignment-eligibility-review-update',
  VERIFICATION_APU_PPT_CREATE: 'verification-apu-ppt-create',
  DOCUMENT_VERIFICATION_CREDIT_CHECKING_VIEW: 'document-verification-credit-checking-view',
  VERIFICATION_APU_PPT_DELETE: 'verification-apu-ppt-delete',
  HIGH_RISK_MONITORING_LIST_VIEW: 'high-risk-monitoring-list-view',
  VERIFICATION_APU_PPT_DOWNLOAD: 'verification-apu-ppt-download',
  LIST_ELIGIBILITY_REVIEW_CREATE: 'list-eligibility-review-create',
  VERIFICATION_APU_PPT_VIEW: 'verification-apu-ppt-view',
  LIST_ELIGIBILITY_REVIEW_DELETE: 'list-eligibility-review-delete',
  VERIFICATION_APU_PPT_UPDATE: 'verification-apu-ppt-update',
  ASSIGNMENT_LEGAL_ASPECT_REVIEW_VIEW: 'assignment-legal-aspect-review-view',
  ASSIGNMENT_LEGAL_ASPECT_REVIEW_CREATE: 'assignment-legal-aspect-review-create',
  VERIFICATION_APU_PPT_MENU: 'verification-apu-ppt-menu',
  ASSIGNMENT_LEGAL_ASPECT_REVIEW_DELETE: 'assignment-legal-aspect-review-delete',
  ASSIGNMENT_LEGAL_ASPECT_REVIEW_DOWNLOAD: 'assignment-legal-aspect-review-download',
  MONITORING_APU_PPT_UPDATE: 'monitoring-apu-ppt-update',
  ASSIGNMENT_LEGAL_ASPECT_REVIEW_MENU: 'assignment-legal-aspect-review-menu',
  ASSIGNMENT_LEGAL_ASPECT_REVIEW_UPDATE: 'assignment-legal-aspect-review-update',
  MONITORING_APU_PPT_MENU: 'monitoring-apu-ppt-menu',
  LIST_ELIGIBILITY_REVIEW_DOWNLOAD: 'list-eligibility-review-download',
  LIST_ELIGIBILITY_REVIEW_MENU: 'list-eligibility-review-menu',
  LIST_ELIGIBILITY_REVIEW_UPDATE: 'list-eligibility-review-update',
  LIST_ELIGIBILITY_REVIEW_VIEW: 'list-eligibility-review-view',
  REQUEST_CREDIT_CHECKING_CREATE: 'request-credit-checking-create',
  LIST_LEGAL_ASPECT_REVIEW_CREATE: 'list-legal-aspect-review-create',
  REQUEST_CREDIT_CHECKING_DELETE: 'request-credit-checking-delete',
  ESDD_BUCKET_LIST_VIEW: 'esdd-bucket-list-view',
  REQUEST_CREDIT_CHECKING_DOWNLOAD: 'request-credit-checking-download',
  ESDD_BUCKET_LIST_CREATE: 'esdd-bucket-list-create',
  REQUEST_CREDIT_CHECKING_VIEW: 'request-credit-checking-view',
  ESDD_BUCKET_LIST_DELETE: 'esdd-bucket-list-delete',
  SITE_VISIT_CREATE: 'site-visit-create',
  ESDD_BUCKET_LIST_DOWNLOAD: 'esdd-bucket-list-download',
  SITE_VISIT_DELETE: 'site-visit-delete',
  ESDD_ASSIGNMENT_VIEW: 'esdd-assignment-view',
  SITE_VISIT_DOWNLOAD: 'site-visit-download',
  ESDD_ASSIGNMENT_CREATE: 'esdd-assignment-create',
  SITE_VISIT_VIEW: 'site-visit-view',
  ESDD_ASSIGNMENT_DELETE: 'esdd-assignment-delete',
  SITE_VISIT_UPDATE: 'site-visit-update',
  ESDD_ASSIGNMENT_DOWNLOAD: 'esdd-assignment-download',
  ESDD_ASSIGNMENT_MENU: 'esdd-assignment-menu',
  SITE_VISIT_MENU: 'site-visit-menu',
  ESDD_ASSIGNMENT_UPDATE: 'esdd-assignment-update',
  ESDD_BUCKET_LIST_MENU: 'esdd-bucket-list-menu',
  REQUEST_CREDIT_CHECKING_UPDATE: 'request-credit-checking-update',
  ESDD_BUCKET_LIST_UPDATE: 'esdd-bucket-list-update',
  ESDD_MONITORING_CREATE: 'esdd-monitoring-create',
  REQUEST_CREDIT_CHECKING_MENU: 'request-credit-checking-menu',
  ESDD_MONITORING_DELETE: 'esdd-monitoring-delete',
  ESDD_MONITORING_DOWNLOAD: 'esdd-monitoring-download',
  LIST_LEGAL_ASPECT_REVIEW_DELETE: 'list-legal-aspect-review-delete',
  ESDD_MONITORING_MENU: 'esdd-monitoring-menu',
  MONITORING_CREDIT_CHECKING_CREATE: 'monitoring-credit-checking-create',
  ESDD_MONITORING_UPDATE: 'esdd-monitoring-update',
  MONITORING_CREDIT_CHECKING_DELETE: 'monitoring-credit-checking-delete',
  ESDD_MONITORING_VIEW: 'esdd-monitoring-view',
  MONITORING_CREDIT_CHECKING_DOWNLOAD: 'monitoring-credit-checking-download',
  LIST_LEGAL_ASPECT_REVIEW_DOWNLOAD: 'list-legal-aspect-review-download',
  MONITORING_CREDIT_CHECKING_VIEW: 'monitoring-credit-checking-view',
  LIST_LEGAL_ASPECT_REVIEW_MENU: 'list-legal-aspect-review-menu',
  SUMMARY_CREDIT_CHECKING_CREATE: 'summary-credit-checking-create',
  LIST_LEGAL_ASPECT_REVIEW_UPDATE: 'list-legal-aspect-review-update',
  SUMMARY_CREDIT_CHECKING_DELETE: 'summary-credit-checking-delete',
  ASSIGNMENT_TECHNICAL_STUDY_VIEW: 'assignment-technical-study-view',
  SUMMARY_CREDIT_CHECKING_DOWNLOAD: 'summary-credit-checking-download',
  ASSIGNMENT_TECHNICAL_STUDY_CREATE: 'assignment-technical-study-create',
  SUMMARY_CREDIT_CHECKING_VIEW: 'summary-credit-checking-view',
  ASSIGNMENT_TECHNICAL_STUDY_DELETE: 'assignment-technical-study-delete',
  SUMMARY_CREDIT_CHECKING_UPDATE: 'summary-credit-checking-update',
  ASSIGNMENT_TECHNICAL_STUDY_DOWNLOAD: 'assignment-technical-study-download',
  ASSIGNMENT_TECHNICAL_STUDY_MENU: 'assignment-technical-study-menu',
  SUMMARY_CREDIT_CHECKING_MENU: 'summary-credit-checking-menu',
  ASSIGNMENT_TECHNICAL_STUDY_UPDATE: 'assignment-technical-study-update',
  LIST_LEGAL_ASPECT_REVIEW_VIEW: 'list-legal-aspect-review-view',
  MONITORING_CREDIT_CHECKING_UPDATE: 'monitoring-credit-checking-update',
  MONITORING_CREDIT_CHECKING_MENU: 'monitoring-credit-checking-menu',
  MONITORING_ELIGIBILITY_REVIEW_DELETE: 'monitoring-eligibility-review-delete',
  MONITORING_ELIGIBILITY_REVIEW_DOWNLOAD: 'monitoring-eligibility-review-download',
  MONITORING_ELIGIBILITY_REVIEW_MENU: 'monitoring-eligibility-review-menu',
  LPA_BUCKET_LIST_VIEW: 'lpa-bucket-list-view',
  MONITORING_ELIGIBILITY_REVIEW_UPDATE: 'monitoring-eligibility-review-update',
  LPA_BUCKET_LIST_CREATE: 'lpa-bucket-list-create',
  MONITORING_ELIGIBILITY_REVIEW_VIEW: 'monitoring-eligibility-review-view',
  LPA_BUCKET_LIST_DELETE: 'lpa-bucket-list-delete',
  MONITORING_ELIGIBILITY_REVIEW_CREATE: 'monitoring-eligibility-review-create',
  LPA_BUCKET_LIST_DOWNLOAD: 'lpa-bucket-list-download',
  MONITORING_LEGAL_ASPECT_REVIEW_CREATE: 'monitoring-legal-aspect-review-create',
  LPA_BUCKET_LIST_MENU: 'lpa-bucket-list-menu',
  MONITORING_LEGAL_ASPECT_REVIEW_DELETE: 'monitoring-legal-aspect-review-delete',
  LPA_BUCKET_LIST_UPDATE: 'lpa-bucket-list-update',
  MONITORING_LEGAL_ASPECT_REVIEW_DOWNLOAD: 'monitoring-legal-aspect-review-download',
  LPA_BUCKET_MONITORING_CREATE: 'lpa-bucket-monitoring-create',
  MONITORING_LEGAL_ASPECT_REVIEW_MENU: 'monitoring-legal-aspect-review-menu',
  LPA_ASSIGNMENT_VIEW: 'lpa-assignment-view',
  MONITORING_LEGAL_ASPECT_REVIEW_UPDATE: 'monitoring-legal-aspect-review-update',
  LPA_ASSIGNMENT_CREATE: 'lpa-assignment-create',
  MONITORING_LEGAL_ASPECT_REVIEW_VIEW: 'monitoring-legal-aspect-review-view',
  LPA_ASSIGNMENT_DELETE: 'lpa-assignment-delete',
  MONITORING_TECHNICAL_STUDY_CREATE: 'monitoring-technical-study-create',
  LPA_ASSIGNMENT_DOWNLOAD: 'lpa-assignment-download',
  MONITORING_TECHNICAL_STUDY_DELETE: 'monitoring-technical-study-delete',
  LPA_ASSIGNMENT_MENU: 'lpa-assignment-menu',
  MONITORING_TECHNICAL_STUDY_DOWNLOAD: 'monitoring-technical-study-download',
  LPA_ASSIGNMENT_UPDATE: 'lpa-assignment-update',
  MONITORING_TECHNICAL_STUDY_VIEW: 'monitoring-technical-study-view',
  LPA_BUCKET_MONITORING_DELETE: 'lpa-bucket-monitoring-delete',
  REQUEST_TECHNICAL_STUDY_CREATE: 'request-technical-study-create',
  LPA_BUCKET_MONITORING_DOWNLOAD: 'lpa-bucket-monitoring-download',
  REQUEST_TECHNICAL_STUDY_DELETE: 'request-technical-study-delete',
  LPA_BUCKET_MONITORING_MENU: 'lpa-bucket-monitoring-menu',
  REQUEST_TECHNICAL_STUDY_DOWNLOAD: 'request-technical-study-download',
  LPA_BUCKET_MONITORING_UPDATE: 'lpa-bucket-monitoring-update',
  REQUEST_TECHNICAL_STUDY_VIEW: 'request-technical-study-view',
  LPA_BUCKET_MONITORING_VIEW: 'lpa-bucket-monitoring-view',
  SHARIAH_COMPLIANCE_REVIEW_ASSIGNMENT_CREATE: 'shariah-compliance-review-assignment-create',
  LPA_MONITORING_CREATE: 'lpa-monitoring-create',
  SHARIAH_COMPLIANCE_REVIEW_ASSIGNMENT_DELETE: 'shariah-compliance-review-assignment-delete',
  LPA_MONITORING_DELETE: 'lpa-monitoring-delete',
  SHARIAH_COMPLIANCE_REVIEW_ASSIGNMENT_DOWNLOAD: 'shariah-compliance-review-assignment-download',
  LPA_MONITORING_DOWNLOAD: 'lpa-monitoring-download',
  SHARIAH_COMPLIANCE_REVIEW_ASSIGNMENT_MENU: 'shariah-compliance-review-assignment-menu',
  LPA_MONITORING_MENU: 'lpa-monitoring-menu',
  SHARIAH_COMPLIANCE_REVIEW_ASSIGNMENT_UPDATE: 'shariah-compliance-review-assignment-update',
  LPA_MONITORING_UPDATE: 'lpa-monitoring-update',
  SHARIAH_COMPLIANCE_REVIEW_ASSIGNMENT_VIEW: 'shariah-compliance-review-assignment-view',
  LPA_MONITORING_VIEW: 'lpa-monitoring-view',
  SHARIAH_COMPLIANCE_REVIEW_BUCKET_LIST_CREATE: 'shariah-compliance-review-bucket-list-create',
  LPA_REVIEW_REQUEST_CREATE: 'lpa-review-request-create',
  SHARIAH_COMPLIANCE_REVIEW_BUCKET_LIST_DELETE: 'shariah-compliance-review-bucket-list-delete',
  LPA_REVIEW_REQUEST_DELETE: 'lpa-review-request-delete',
  SHARIAH_COMPLIANCE_REVIEW_BUCKET_LIST_DOWNLOAD: 'shariah-compliance-review-bucket-list-download',
  LPA_REVIEW_REQUEST_DOWNLOAD: 'lpa-review-request-download',
  SHARIAH_COMPLIANCE_REVIEW_BUCKET_LIST_VIEW: 'shariah-compliance-review-bucket-list-view',
  LPA_REVIEW_REQUEST_MENU: 'lpa-review-request-menu',
  SHARIAH_COMPLIANCE_REVIEW_BUCKET_LIST_UPDATE: 'shariah-compliance-review-bucket-list-update',
  LPA_REVIEW_REQUEST_UPDATE: 'lpa-review-request-update',
  SHARIAH_COMPLIANCE_REVIEW_BUCKET_LIST_MENU: 'shariah-compliance-review-bucket-list-menu',
  LPA_REVIEW_REQUEST_VIEW: 'lpa-review-request-view',
  SHARIAH_COMPLIANCE_REVIEW_MONITORING_CREATE: 'shariah-compliance-review-monitoring-create',
  MONITORING_TECHNICAL_STUDY_MENU: 'monitoring-technical-study-menu',
  SHARIAH_COMPLIANCE_REVIEW_MONITORING_DELETE: 'shariah-compliance-review-monitoring-delete',
  MONITORING_TECHNICAL_STUDY_UPDATE: 'monitoring-technical-study-update',
  SHARIAH_COMPLIANCE_REVIEW_MONITORING_DOWNLOAD: 'shariah-compliance-review-monitoring-download',
  MUP_ANALYST_CREATE: 'mup-analyst-create',
  SHARIAH_COMPLIANCE_REVIEW_MONITORING_VIEW: 'shariah-compliance-review-monitoring-view',
  MUP_ANALYST_DELETE: 'mup-analyst-delete',
  SHARIAH_COMPLIANCE_REVIEW_MONITORING_UPDATE: 'shariah-compliance-review-monitoring-update',
  MUP_ANALYST_DOWNLOAD: 'mup-analyst-download',
  MUP_ANALYST_MENU: 'mup-analyst-menu',
  SHARIAH_COMPLIANCE_REVIEW_MONITORING_MENU: 'shariah-compliance-review-monitoring-menu',
  MUP_ANALYST_UPDATE: 'mup-analyst-update',
  LEGAL_SIGING_BUCKET_LIST_VIEW: 'legal-siging-bucket-list-view',
  REQUEST_TECHNICAL_STUDY_UPDATE: 'request-technical-study-update',
  LEGAL_SIGING_BUCKET_LIST_CREATE: 'legal-siging-bucket-list-create',
  REQUEST_TECHNICAL_STUDY_MENU: 'request-technical-study-menu',
  LEGAL_SIGING_BUCKET_LIST_DELETE: 'legal-siging-bucket-list-delete',
  REVIEW_TECHNICAL_STUDY_CREATE: 'review-technical-study-create',
  LEGAL_SIGING_BUCKET_LIST_DOWNLOAD: 'legal-siging-bucket-list-download',
  REVIEW_TECHNICAL_STUDY_DELETE: 'review-technical-study-delete',
  LEGAL_SIGING_ASSIGNMENT_VIEW: 'legal-siging-assignment-view',
  REVIEW_TECHNICAL_STUDY_DOWNLOAD: 'review-technical-study-download',
  LEGAL_SIGING_ASSIGNMENT_CREATE: 'legal-siging-assignment-create',
  REVIEW_TECHNICAL_STUDY_VIEW: 'review-technical-study-view',
  LEGAL_SIGING_ASSIGNMENT_DELETE: 'legal-siging-assignment-delete',
  REVIEW_TECHNICAL_STUDY_UPDATE: 'review-technical-study-update',
  LEGAL_SIGING_ASSIGNMENT_DOWNLOAD: 'legal-siging-assignment-download',
  LEGAL_SIGING_ASSIGNMENT_MENU: 'legal-siging-assignment-menu',
  REVIEW_TECHNICAL_STUDY_MENU: 'review-technical-study-menu',
  LEGAL_SIGING_ASSIGNMENT_UPDATE: 'legal-siging-assignment-update',
  LEGAL_SIGING_BUCKET_LIST_MENU: 'legal-siging-bucket-list-menu',
  MUP_ANALYST_VIEW: 'mup-analyst-view',
  LEGAL_SIGING_BUCKET_LIST_UPDATE: 'legal-siging-bucket-list-update',
  MUP_CREATE: 'mup-create',
  LEGAL_SIGING_MONITORING_CREATE: 'legal-siging-monitoring-create',
  MUP_DELETE: 'mup-delete',
  LEGAL_SIGING_MONITORING_DELETE: 'legal-siging-monitoring-delete',
  MUP_DOWNLOAD: 'mup-download',
  LEGAL_SIGING_MONITORING_DOWNLOAD: 'legal-siging-monitoring-download',
  MUP_MENU: 'mup-menu',
  LEGAL_SIGING_MONITORING_MENU: 'legal-siging-monitoring-menu',
  MUP_UPDATE: 'mup-update',
  LEGAL_SIGING_MONITORING_UPDATE: 'legal-siging-monitoring-update',
  MUP_VIEW: 'mup-view',
  LEGAL_SIGING_MONITORING_VIEW: 'legal-siging-monitoring-view',
  MUR_CREATE: 'mur-create',
  LPS_BAST_CREATE: 'lps-bast-create',
  MUR_DELETE: 'mur-delete',
  LPS_BAST_DELETE: 'lps-bast-delete',
  MUR_DOWNLOAD: 'mur-download',
  LPS_BAST_DOWNLOAD: 'lps-bast-download',
  MUR_MENU: 'mur-menu',
  LPS_BAST_MENU: 'lps-bast-menu',
  MUR_UPDATE: 'mur-update',
  LPS_BAST_UPDATE: 'lps-bast-update',
  MUR_VIEW: 'mur-view',
  LPS_BAST_VIEW: 'lps-bast-view',
  PENGAJUAN_PERIKATAN_BUCKET_LIST_CREATE: 'pengajuan-perikatan-bucket-list-create',
  LPS_CORE_CREATE: 'lps-core-create',
  PENGAJUAN_PERIKATAN_BUCKET_LIST_DELETE: 'pengajuan-perikatan-bucket-list-delete',
  LPS_CORE_DELETE: 'lps-core-delete',
  PENGAJUAN_PERIKATAN_BUCKET_LIST_DOWNLOAD: 'pengajuan-perikatan-bucket-list-download',
  LPS_CORE_DOWNLOAD: 'lps-core-download',
  PENGAJUAN_PERIKATAN_BUCKET_LIST_VIEW: 'pengajuan-perikatan-bucket-list-view',
  LPS_CORE_MENU: 'lps-core-menu',
  SPFP_ASSIGNMENT_CREATE: 'spfp-assignment-create',
  LPS_CORE_UPDATE: 'lps-core-update',
  SPFP_ASSIGNMENT_DELETE: 'spfp-assignment-delete',
  LPS_CORE_VIEW: 'lps-core-view',
  SPFP_ASSIGNMENT_DOWNLOAD: 'spfp-assignment-download',
  MAINTENANCE_DEBTOR_CREATE: 'maintenance-debtor-create',
  SPFP_ASSIGNMENT_MENU: 'spfp-assignment-menu',
  BUSINESS_ACTIVITY_REPORT_VIEW: 'business-activity-report-view',
  SPFP_ASSIGNMENT_UPDATE: 'spfp-assignment-update',
  BUSINESS_ACTIVITY_REPORT_CREATE: 'business-activity-report-create',
  SPFP_ASSIGNMENT_VIEW: 'spfp-assignment-view',
  BUSINESS_ACTIVITY_REPORT_DELETE: 'business-activity-report-delete',
  SPFP_BUCKET_CREATE: 'spfp-bucket-create',
  BUSINESS_ACTIVITY_REPORT_DOWNLOAD: 'business-activity-report-download',
  SPFP_BUCKET_DELETE: 'spfp-bucket-delete',
  BUSINESS_ACTIVITY_REPORT_MENU: 'business-activity-report-menu',
  SPFP_BUCKET_DOWNLOAD: 'spfp-bucket-download',
  BUSINESS_ACTIVITY_REPORT_UPDATE: 'business-activity-report-update',
  SPFP_BUCKET_VIEW: 'spfp-bucket-view',
  MAINTENANCE_DEBTOR_DELETE: 'maintenance-debtor-delete',
  SPFP_BUCKET_UPDATE: 'spfp-bucket-update',
  MAINTENANCE_DEBTOR_DOWNLOAD: 'maintenance-debtor-download',
  SPFP_BUCKET_MENU: 'spfp-bucket-menu',
  MAINTENANCE_DEBTOR_MENU: 'maintenance-debtor-menu',
  SPFP_MONITORING_SPFP_CREATE: 'spfp-monitoring-spfp-create',
  MAINTENANCE_DEBTOR_UPDATE: 'maintenance-debtor-update',
  SPFP_MONITORING_SPFP_DELETE: 'spfp-monitoring-spfp-delete',
  MAINTENANCE_DEBTOR_VIEW: 'maintenance-debtor-view',
  SPFP_MONITORING_SPFP_DOWNLOAD: 'spfp-monitoring-spfp-download',
  MAINTENANCE_GROUP_CREATE: 'maintenance-group-create',
  SPFP_MONITORING_SPFP_VIEW: 'spfp-monitoring-spfp-view',
  MAINTENANCE_GROUP_DELETE: 'maintenance-group-delete',
  SPFP_MONITORING_SPFP_UPDATE: 'spfp-monitoring-spfp-update',
  MAINTENANCE_GROUP_DOWNLOAD: 'maintenance-group-download',
  MAINTENANCE_GROUP_MENU: 'maintenance-group-menu',
  SPFP_MONITORING_SPFP_MENU: 'spfp-monitoring-spfp-menu',
  CAPACITY_VIEW: 'capacity-view',
  CAPACITY_CREATE: 'capacity-create',
  PENGAJUAN_PERIKATAN_BUCKET_LIST_UPDATE: 'pengajuan-perikatan-bucket-list-update',
  CAPACITY_DELETE: 'capacity-delete',
  CAPACITY_DOWNLOAD: 'capacity-download',
  PENGAJUAN_PERIKATAN_BUCKET_LIST_MENU: 'pengajuan-perikatan-bucket-list-menu',
  CAPACITY_MENU: 'capacity-menu',
  CAPACITY_UPDATE: 'capacity-update',
  MAINTENANCE_GROUP_UPDATE: 'maintenance-group-update',
  MAINTENANCE_GROUP_VIEW: 'maintenance-group-view',
  MAINTENANCE_MODAL_CREATE: 'maintenance-modal-create',
  MAINTENANCE_MODAL_DELETE: 'maintenance-modal-delete',
  MAINTENANCE_MODAL_DOWNLOAD: 'maintenance-modal-download',
  MAINTENANCE_MODAL_MENU: 'maintenance-modal-menu',
  MAINTENANCE_MODAL_UPDATE: 'maintenance-modal-update',
  MAINTENANCE_MODAL_VIEW: 'maintenance-modal-view',
  MAINTENANCE_PROYEK_CREATE: 'maintenance-proyek-create',
  ACCESS_MENU_VIEW: 'access-menu-view',
  MAINTENANCE_PROYEK_DELETE: 'maintenance-proyek-delete',
  ACCESS_MENU_CREATE: 'access-menu-create',
  MAINTENANCE_PROYEK_DOWNLOAD: 'maintenance-proyek-download',
  ACCESS_MENU_DELETE: 'access-menu-delete',
  MAINTENANCE_PROYEK_MENU: 'maintenance-proyek-menu',
  ACCESS_MENU_DOWNLOAD: 'access-menu-download',
  MAINTENANCE_PROYEK_UPDATE: 'maintenance-proyek-update',
  ACCESS_MENU_MENU: 'access-menu-menu',
  MAINTENANCE_PROYEK_VIEW: 'maintenance-proyek-view',
  ACCESS_MENU_UPDATE: 'access-menu-update',
  OVERVIEW_ANNUAL_REVIEW_CREATE: 'overview-annual-review-create',
  BMPP_MONITORING_VIEW: 'bmpp-monitoring-view',
  OVERVIEW_ANNUAL_REVIEW_DELETE: 'overview-annual-review-delete',
  OVERVIEW_ANNUAL_REVIEW_DOWNLOAD: 'overview-annual-review-download',
  OVERVIEW_ANNUAL_REVIEW_MENU: 'overview-annual-review-menu',
  OVERVIEW_ANNUAL_REVIEW_UPDATE: 'overview-annual-review-update',
  OVERVIEW_ANNUAL_REVIEW_VIEW: 'overview-annual-review-view',
  PERFORMANCE_CREATE: 'performance-create',
  PERFORMANCE_DELETE: 'performance-delete',
  REASSIGNMENT_SKU_VIEW: 'reassignment-sku-view',
  REASSIGNMENT_SKU_CREATE: 'reassignment-sku-create',
  REASSIGNMENT_SKU_UPDATE: 'reassignment-sku-update',
  REASSIGNMENT_SKU_DELETE: 'reassignment-sku-delete',
  PERFORMANCE_DOWNLOAD: 'performance-download',
  PERFORMANCE_MENU: 'performance-menu',
  PERFORMANCE_UPDATE: 'performance-update',
  PERFORMANCE_VIEW: 'performance-view',
  PROGRESS_CREATE: 'progress-create',
  PROGRESS_DELETE: 'progress-delete',
  PROGRESS_DOWNLOAD: 'progress-download',
  PROGRESS_MENU: 'progress-menu',
  PROGRESS_UPDATE: 'progress-update',
  PROGRESS_VIEW: 'progress-view',
  SUCCESS_RATE_CREATE: 'success-rate-create',
  SUCCESS_RATE_DELETE: 'success-rate-delete',
  SUCCESS_RATE_DOWNLOAD: 'success-rate-download',
  SUCCESS_RATE_MENU: 'success-rate-menu',
  SUCCESS_RATE_UPDATE: 'success-rate-update',
  SUCCESS_RATE_VIEW: 'success-rate-view',
  SURAT_HUTANG_CREATE: 'surat-hutang-create',
  SURAT_HUTANG_DELETE: 'surat-hutang-delete',
  SURAT_HUTANG_DOWNLOAD: 'surat-hutang-download',
  SURAT_HUTANG_MENU: 'surat-hutang-menu',
  SURAT_HUTANG_UPDATE: 'surat-hutang-update',
  SURAT_HUTANG_VIEW: 'surat-hutang-view',
  USER_LIST_CREATE: 'user-list-create',
  USER_LIST_DELETE: 'user-list-delete',
  USER_LIST_DOWNLOAD: 'user-list-download',
  USER_LIST_MENU: 'user-list-menu',
  USER_LIST_UPDATE: 'user-list-update',
  USER_LIST_VIEW: 'user-list-view',
  VIRTUAL_ACCOUNT_CREATE: 'virtual-account-creation-create',
  VIRTUAL_ACCOUNT_DELETE: 'virtual-account-creation-delete',
  VIRTUAL_ACCOUNT_DOWNLOAD: 'virtual-account-creation-download',
  VIRTUAL_ACCOUNT_MENU: 'virtual-account-creation-menu',
  VIRTUAL_ACCOUNT_UPDATE: 'virtual-account-creation-update',
  VIRTUAL_ACCOUNT_VIEW: 'virtual-account-creation-view',
  VIRTUAL_ACCOUNT_ACTIVATION_CREATE: 'virtual-account-activation-create',
  VIRTUAL_ACCOUNT_ACTIVATION_DELETE: 'virtual-account-activation-delete',
  VIRTUAL_ACCOUNT_ACTIVATION_DOWNLOAD: 'virtual-account-activation-download',
  VIRTUAL_ACCOUNT_ACTIVATION_MENU: 'virtual-account-activation-menu',
  VIRTUAL_ACCOUNT_ACTIVATION_UPDATE: 'virtual-account-activation-update',
  VIRTUAL_ACCOUNT_ACTIVATION_VIEW: 'virtual-account-activation-view',
  REPORT_ASSESSMENT_APU_PPT_DOWNLOAD: 'assessment-apu-ppt-download',
  BMPP_INDIVIDUAL_BISNIS_DOWNLOAD: 'bmpp-individual-bisnis-download',
  BMPP_INDIVIDUAL_DPOP_DOWNLOAD: 'bmpp-individual-dpop-download',
  BMPP_GROUP_DOWNLOAD: 'bmpp-group-download',
  BMPP_GROUP_DPOP_DOWNLOAD: 'bmpp-group-dpop-download',
  LAPORAN_CUSTOMER_CUSTOMER_DOWNLOAD: 'laporan-customer-customer-download',
  LAPORAN_DETAIL_CUSTOMER_PIPELINE_DOWNLOAD: 'laporan-detail-customer-pipeline-download',
  LAPORAN_BAS_SUBMITTER_DOWNLOAD: 'laporan-bas-submitter-download',
  LAPORAN_BAS_PARTICIPANT_DOWNLOAD: 'laporan-bas-participant-download',
  LAPORAN_CUSTOMER_GROUP_DOWNLOAD: 'laporan-customer-group-download',
  LAPORAN_CUSTOMER_SITE_VISIT_DOWNLOAD: 'laporan-customer-site-visit-download',
  LAPORAN_VIRTUAL_ACCOUNT_DOWNLOAD: 'laporan-virtual-account-download',
  LOG_PENOMORAN_MEMO_DOWNLOAD: 'log-penomoran-memo-download',
  REPORT_LOG_REASSIGNMENT_DOWNLOAD: 'log-reassignment-download',
  REPORT_LOG_REASSIGNMENT_VIEW: 'log-reassignment-view',
  REPORT_LOG_AUDIT_TRAIL_ACTIVITY_DOWNLOAD: 'log-audit-trail-activity-download',
  REPORT_LOG_AUDIT_TRAIL_USER_ACCESS_DOWNLOAD: 'log-audit-trail-user-access-download',
  REPORT_LOG_END_OF_DAY_DOWNLOAD: 'log-end-of-day-download',
  REPORT_MEMO_CREATION_DOWNLOAD: 'memo-creation-download',
  REPORT_DETAIL_CUSTOMER_PROJECT_DOWNLOAD: 'laporan-customer-project-download',
  REPORT_DETAIL_CUSTOMER_SHAREHOLDER_DOWNLOAD: 'laporan-management-shareholder-download',
  REPORT_DETAIL_CUSTOMER_LPA_DOWNLOAD: 'laporan-customer-lpa-download',
  REPORT_COMMENT_HISTORY_TRACKING_DOWNLOAD: 'comment-history-download',
  REPORT_LAPORAN_CREDIT_CHECKING_DOWNLOAD: 'laporan-credit-checking-download',
  REPORT_LAPORAN_PERSETUJUAN_KHUSUS_DOWNLOAD: 'laporan-persetujuan-khusus-download',
  REPORT_LAPORAN_FACILITIES_DOWNLOAD: 'laporan-facilities-download',
  REPORT_LAPORAN_PK_ADDENDUM_DOWNLOAD: 'laporan-pk-addendum-download',
  REPORT_LAPORAN_RATING_MANAGEMENT_DOWNLOAD: 'laporan-rating-management-download',
  REPORT_AGING_REPORT_DOWNLOAD: 'aging-report-download',
  REPORT_LOG_DOCUMENT_UPLOAD_DOWNLOAD: 'log-document-upload-download',
  REPORT_LOG_DATA_INTERFACE_DOWNLOAD: 'log-data-interface-download',
  REPORT_TAT_SLA_FIN_SUMMARY_DOWNLOAD: 'fin-summary-download',
  REPORT_TAT_SLA_FIN_DETAILS_DOWNLOAD: 'fin-details-download',
  REPORT_LAPORAN_RESIKO_DATABASE_DOWNLOAD: 'laporan-resiko-database-download',
  PARAMETER_BENEFICIAL_OWNER_CREATE: 'parameter-benefical-owner-create',
  PARAMETER_BENEFICIAL_OWNER_VIEW: 'parameter-benefical-owner-view',
  PARAMETER_BENEFICIAL_OWNER_UPDATE: 'parameter-benefical-owner-update',
  PARAMETER_CUSTOMER_DUE_DILIGENCE_CREATE: 'parameter-cdd-create',
  PARAMETER_CUSTOMER_DUE_DILIGENCE_VIEW: 'parameter-cdd-view',
  PARAMETER_CUSTOMER_DUE_DILIGENCE_UPDATE: 'parameter-cdd-update',
  PARAMETER_RATE_UPDATE: 'parameter-rate-update',
  PARAMETER_RATE_CREATE: 'parameter-rate-create',
  PARAMETER_RATE_VIEW: 'parameter-rate-view',
  PARAMETER_RATE_DELETE: 'parameter-rate-delete',
  PARAMETER_RATE_MENU: 'parameter-rate-menu',
  UPLOAD_DATABASE_DK_VIEW: 'upload-database-dk-view',
  UPLOAD_DATABASE_DK_DOWNLOAD: 'upload-database-dk-download',
  UPLOAD_DATABASE_DK_CREATE: 'upload-database-dk-create',
};
