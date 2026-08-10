const agreement = {
  add: {
    saveBoc: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/boc-decision/save',
    },
    saveMapp: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/financing-facility-mapping/save',
    },
    saveMeet: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/risalah-rapat-committee-meeting-information/meeting-member/save',
    },
    saveMeetInfo: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/risalah-rapat-committee-meeting-information/save',
    },
    savePk: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/pk-application/save',
    },
    saveProcess: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/processing-type/save',
    },
    saveSheet: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/verification-sheet/save',
    },
  },
  additional: {
    saveBisnis: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/additional-information/save',
    },
    saveDpop: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/additional-information-lpsbd/save',
    },
    saveQualify: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/assumption-qualification/save',
    },
  },

  complianceCheck: {
    saveResponse: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/compliance-check/save-response',
    },
  },

  facility: {
    detailPk: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/processing-type/by-debtor/detail',
    },
  },


  financingFacilityMapping: {
    detail: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/financing-facility-mapping/detail',
    },
    list: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/financing-facility-mapping/list',
    },
    save: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/financing-facility-mapping/save',
    },
  },

  offeringLetter: {
    checkEnableAskForInfo: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/offering-letter/check-enable-ask-for-info',
    },
    checkSubmitAskForInfo: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/offering-letter/check-submit-ask-for-info',
    },
    save: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/offering-letter/save',
    },
    updateCustomerBanding: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/offering-letter/update-customer-banding',
    },
  },

  risalahRapatCommitteeMeetingInformation: {
    delete: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/risalah-rapat-committee-meeting-information/meeting-member/delete',
    },
    sku: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/risalah-rapat-committee-meeting-information/sku',
    },
  },

  risalahRapatConsentSheet: {
    countSigner: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/risalah-rapat-consent-sheet/count-signer',
    },
    list: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/risalah-rapat-consent-sheet/list',
    },
    listByAssignedTo: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/risalah-rapat-consent-sheet/list-by-assigned-to',
    },
    saveList: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/risalah-rapat-consent-sheet/list/save',
    },
  },

  risalahRapatPrivy: {
    getSigners: {
      baseType: 'agreement',
      method: 'POST',
      url: '/v1/risalah-rapat-verification-result/privy-signer',
    },
    submit: {
      baseType: 'agreement',
      method: 'POST',
      url: '/v1/risalah-rapat-verification-result/privy',
    },
  },
  routineReporting: {
    delete: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/routine-reporting/sub/delete',
    },
    getList: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/routine-reporting',
    },
    getSubDetail: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/routine-reporting/sub/detail',
    },
    saveSubDetail: {
      baseType: 'agreement',
      method: 'post',
      url: '/v1/routine-reporting/sub/save',
    },
  },
  saveComplianceCheck: {
    baseType: 'agreement',
    method: 'post',
    url: '/v1/compliance-check/save-response',
  },
};

export default agreement;
