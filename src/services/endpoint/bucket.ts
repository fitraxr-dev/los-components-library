const bucket = {

  alertModified: {
    list: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/financing-facility/has-modified',
    },
  },
  assignment: {
    assign: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/assignment/assign',
    },
    confirmationInfo: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/assignment/reassignment/sku/is-on-sku',
    },
    getConfirmAccountUpdate: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/assignment/reassignment/sku/check-destination',
    },
    reAssign: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/assignment/re-assign',
    },
    updateStatusConfirmation: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/assignment/reassignment/sku/mark-caution-seen',
    },
  },
  bcm: {
    getBcm: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/bcm',
    },
  },
  bucket: {
    checkSubmit: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/check-submit',
    },
    save: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/debtor/save',
    },
  },
  bucketList: {
    assignment: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/assignment/list',
    },
    checkAvailableRequest: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/check-available-request',
    },
    childList: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/child/list',
    },
    detail: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/detail',
    },
    financingFacility: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/financing-facility/exist-another-process',
    },
    mipProcess: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/get-bucket-process-mip-by-bcm-status',
    },
    monitoring: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/list',
    },
    reassignMonitoring: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/monitoring/re-assign',
    },
    standaloneSave: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/standalone/save',
    },
    status: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/status/list',
    },
    statusByProcess: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/process/status/list',
    },
    totalExposure: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/total-exposure',
    },
    totalExposureGroup: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/total-exposure-group',
    },
  },
  customerMonitoring: {
    detail: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/monitoring/customer/detail',
    },
    list: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/monitoring/customer',
    },
  },
  debtor: {
    checkRequest: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/check-request',
    },
    coBorrower: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/debtor/co-borrower',
    },
    deleteBusinessGroup: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/debtor/business-group-selected/delete',
    },
    detail: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/debtor/detail',
    },
    getBusinessGroup: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/debtor/business-group',
    },
    getBusinessGroupSelected: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/debtor/business-group-selected',
    },
    lov: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/debtor/lov',
    },
    performanceFinancial: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/debtor/performance-financial',
    },
    save: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/debtor/save',
    },
    saveBusinessGroup: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/debtor/business-group-selected/save',
    },
    syndication: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/debtor/syndication',
    },
  },
  detail: {
    byId: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/detail',
    },
  },
  facilitySyariah: {
    delete: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/facility-syariah/delete',
    },
    detail: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/facility-syariah/detail',
    },
    list: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/facility-syariah/list',
    },
    save: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/facility-syariah/save',
    },
    saveChildLimit: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/facility-syariah/child-limit',
    },

  },
  fastTrack: {
    saveRemark: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/remark-fast-track/save',
    },
  },
  financialFacility: {
    applyDiff: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/financing-facility/apply-diff',
    },
    checkDiff: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/financing-facility/check-diff',
    },
    checkFacility: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/check-facility',
    },
    debtor: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/financing-facility/debtor',
    },
    delete: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/financing-facility/delete',
    },
    detail: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/financing-facility/detail',
    },
    existLos: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/financing-facility/exist-los',
    },
    existLosSummary: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/financing-facility/exist-los-summary',
    },
    groupDebtor: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/financing-facility/group-debtor',
    },
    list: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/financing-facility',
    },
    save: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/financing-facility/save',
    },
    syndicationOtherSave: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/financing-facility/syndication/other/save',
    },
  },
  financingFacilityAnnualReview: {
    detail: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/financing-facility-annual-review/detail',
    },
    list: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/financing-facility-annual-review',
    },
    update: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/financing-facility-annual-review/update',
    },
    updateExisting: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/financing-facility-annual-review/update-existing',
    },
  },
  group: {
    list: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/group/list',
    },
  },
  latest: {
    request: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/bucket-master-latest-processes',
    },
  },
  manage: {
    saveCustomer: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/debtor/customer/save',
    },
    saveCustomerManagement: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/customer/management/save',
    },
    saveCustomerShareholder: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/customer/shareholder/save',
    },
    saveDebtor: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/debtor/remark/debtor/save',
    },
    saveFacility: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/financing-facility/save',
    },
    saveManagement: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/debtor/remark/management/save',
    },
    savePipeline: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/pipeline/save',
    },
    saveShareholder: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/debtor/remark/shareholder/save',
    },
  },
  mup: {
    saveDebtor: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/save',
    },
  },
  processMonitoring: {
    list: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/monitoring/process',
    },
  },
  project: {
    autocomplete: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/project/autocomplete',
    },
  },
  reassignmentSku: {
    detail: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/assignment/reassignment/sku/detail',
    },
    dropdownList: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/assignment/reassignment/sku/user-list',
    },
    list: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/list',
    },
    save: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/assignment/reassignment/sku/save',
    },
  },
  refina: {
    download: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/refina/download',
    },
    getAllDocument: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/refina/get-all-document',
    },
    watermarkedDocument: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/refina/watermarked-document',
    },
  },
  register: {
    debtor: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/debtor/register',
    },
  },
  risalahRapat: {
    checkExpired: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/risalah-rapat/check-expired',
    },
    reactivate: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/risalah-rapat/reactivate',
    },
    reactivateDelete: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/risalah-rapat/reactivate/delete',
    },
  },
  shareholder: {
    debtor: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/shareholder/debtor',
    },
  },
  statusProcess: {
    statusName: {
      baseType: 'bucket',
      method: 'get',
      url: '/v1/bucket/status-name',
    },
  },
  timeline: {
    historyAskForInfo: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/timeline/history-ask-for-info',
    },
  },

  uploadTemplate: {
    download: {
      baseType: 'bucket',
      method: 'get',
      url: '/v1/template/download/:processTemplateType',
    },
    upload: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/template/upload/:processTemplateType',
    },
  },
  validation: {
    validateRequest: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/validation/validate-request',
    },
  },
};

export default bucket;
