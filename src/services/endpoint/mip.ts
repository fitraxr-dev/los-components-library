const mip = {
  additionalInformation: {
    detail: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/additional-information/detail',
    },
    save: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/additional-information/save',
    },
  },
  apuppt: {
    getDetailNotes: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/notes/detail',
    },
    saveAdditional: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/additional-information/save',
    },
    saveBo: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/beneficial-owner/save',
    },
    saveBoRemark: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/beneficial-owner/remark/save',
    },
    saveCddRemark: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/customer-due-diligence/remark/save',
    },
    saveDebtor: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/debtor-profile-information/save',
    },
    saveDoc: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/document-debtor/save',
    },
    saveDocCdd: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/customer-due-diligence/save',
    },
    saveDocRemark: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/document-debtor-remark/save',
    },
    saveNotes: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/notes/save',
    },
    saveRemark: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/shareholder-structure/remark/save',
    },
    saveShareholder: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/shareholder-structure/save',
    },
  },
  assumtion: {
    save: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/assumption-qualification/save',
    },
  },
  bmpp: {
    calculate: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/bmpp/calculate',
    },
    calculateV2: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/bmpp/calculate-v2',
    },
    detail: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/bmpp/detail',
    },
    detailProposalPlan: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/bmpp/proposal-plan/detail',
    },
    groupList: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/bmpp/bmpp-group',
    },
  },
  cddImplementation: {
    listCdd: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/special-approval/special-approval-type',
    },
  },
  compliance: {
    save: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/sharia-compliance-checklist/save',
    },
  },
  concern: {
    getDetail: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/concern/detail',
    },
    getList: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/concern/list',
    },
    save: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/concern/save',
    },
    saveBusinessResponse: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/concern/save-business-response',
    },
  },
  correctiveActionPlan: {
    delete: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/corrective-action-plan/delete',
    },
    getDetail: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/corrective-action-plan/detail',
    },
    getList: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/corrective-action-plan/list',
    },
    save: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/corrective-action-plan/save',
    },
    saveBusinessResponse: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/corrective-action-plan/description/save-business-response',
    },
    saveBusinessResponseNew: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/corrective-action-plan/description/mup/save-business-response',
    },
  },
  creditChecking: {
    creditCheckingDebtorRemark: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/credit-checking/debtor/mip/remark',
    },
    creditCheckingDebtorRemarkSave: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/credit-checking/debtor/mip/remark/save',
    },
    creditCheckingExternal: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/credit-checking/credit-checking-external',
    },
    creditCheckingExternalSave: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/credit-checking/credit-checking-external/save',
    },
    creditCheckingManagementRemark: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/credit-checking/management/mip/remark',
    },
    creditCheckingManagementRemarkSave: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/credit-checking/management/mip/remark/save',
    },
    detailHistory: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/confirmation-history',
    },
    save: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/credit-checking/credit-checking-external/save',
    },
    saveHistory: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/confirmation-history/save',
    },
  },
  documentComponent: {
    checkUpdates: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/document-component/check-updates',
    },
  },
  esdd: {
    save: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/esdd-report/save',
    },
  },
  exce: {
    save: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/executive-overview/save',
    },
    saveEco: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/financial-economic-indicator/save',
    },
    saveSum: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/executive-summary/save',
    },
  },
  externalRating: {
    delete: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/external-rating/delete',
    },
    detail: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/external-rating/detail',
    },
    list: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/external-rating/list',
    },
    save: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/external-rating/save',
    },
  },
  extraInformation: {
    save: {
      baseType: 'mip',
      method: 'post',
      url: 'v1/extra-information/save',
    },
  },
  financingFacility: {
    detail: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/financing-facility-overview/detail',
    },
    save: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/financing-facility-overview/save',
    },
  },
  financingFacilityMip: {
    detail: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/financing-facility-mip/detail',
    },
    save: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/financing-facility-mip/save',
    },
  },
  financingFacilityOtherBank: {
    delete: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/financing-facility-other-bank/delete',
    },
    detail: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/financing-facility-other-bank/get-by-id',
    },
    list: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/financing-facility-other-bank/get-list-by-mip-id',
    },
    save: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/financing-facility-other-bank/save',
    },
    summary: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/financing-facility-other-bank/summary',
    },
  },
  financingFacilityOverview: {
    save: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/financing-facility-overview/save',
    },
  },
  hr: {
    saveAspect: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/feasibility-aspect/save',
    },
    saveAssumtion: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/assumption-qualification/save',
    },
    saveCompliance: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/compliance-analysis/save',
    },
    saveConclusion: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/conclusion/save',
    },
    saveFa: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/financial-analysis/save',
    },
    saveFga: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/financing-analysis/save',
    },
    saveFp: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/financial-projection/save',
    },
    saveFund: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/analysis-funded-project/save',
    },
    saveGuarante: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/guarantee/save',
    },
    saveLegal: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/legal-basis/save',
    },
    saveMafp: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/monitoring-analysis-funded-project/save',
    },
    saveOp: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/operational-performance/save',
    },
    saveOrgan: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/organogram/save',
    },
    savePeer: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/peer-comparison/save',
    },
    saveProfile: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/profile/save',
    },
    savePsv: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/project-strategic-value/save',
    },
    savePurpose: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/purpose/save',
    },
    saveRegional: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/regional-finance/save',
    },
    saveSpecial: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/special-approval/save',
    },
  },
  identificationLegalRisk: {
    getDetail: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/identification-legal-risk/detail',
    },
    save: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/identification-legal-risk/save',
    },
  },
  memoSupplement: {
    getDetail: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/memo-supplement/detail',
    },
    save: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/memo-supplement/save',
    },
  },
  mipDiscussion: {
    checkConfirmAnalyst: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/mip-discussion/check-confirm-analyst',
    },
    deleteDocsStaff: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/mip-discussion/delete',
    },
    detailDocsStaff: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/mip-discussion/detail',
    },
    listDocAnalyst: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/mip-discussion/list-analyst',
    },
    listDocsStaff: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/mip-discussion/list',
    },
    saveConfirmAnalyst: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/mip-discussion/confirm-analyst',
    },
    saveDocsStaff: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/mip-discussion/save',
    },
  },
  otherRelated: {
    remark: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/credit-checking/other-related/mip/remark',
    },
    save: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/credit-checking/other-related/mip/remark/save',
    },
  },
  proposal: {
    detail: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/proposal/detail',
    },
    getAttachmentList: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/proposal/attachment/list',
    },
    save: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/proposal/save',
    },
  },
  rating: {
    copyRating: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/rating/copy-rating',
    },
    getDetail: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/rating/detail',
    },
    save: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/rating/save',
    },
  },
  riskProfile: {
    getDetail: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/risk-profile/detail',
    },
    save: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/risk-profile/save',
    },
  },
  routineReporting: {
    componentList: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/routine-reporting/component/list',
    },
    delete: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/routine-reporting/sub/delete',
    },
    deleteReport: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/routine-reporting/delete',
    },
    getDetail: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/routine-reporting/detail',
    },
    getList: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/routine-reporting',
    },
    getSubDetail: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/routine-reporting/sub/detail',
    },
    saveBusinessResponse: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/routine-reporting/save-business-response',
    },
    saveSubDetail: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/routine-reporting/sub/save',
    },
  },
  shareholder: {
    remark: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/credit-checking/shareholder/mip/remark',
    },
    save: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/credit-checking/shareholder/mip/remark/save',
    },
  },
  specialApproval: {
    save: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/special-approval/save',
    },
  },
  summary: {
    save: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/summary/save',
    },
  },
  syariahCompliance: {
    save: {
      baseType: 'mip',
      method: 'post',
      url: '/v1/sharia-compliance-checklist/item/save',
    },
  },
};

export default mip;
