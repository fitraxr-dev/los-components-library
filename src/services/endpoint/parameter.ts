const parameter = {
  paramVa: {

    // Filter Options
    getBank: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/param-va/get-bank',
    },


    getCustomerType: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/param-va/get-customer-type',
    },

    getVaParams: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/param-va/get-va-param/lov',
    },

    getVaType: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/param-va/get-va-type',
    },

    // Bucket List Data
    list: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/param-va/list',
    },

    processDetail: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/param-va/process/detail',
    },

    processSave: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/param-va/process/save',
    },

    registerWorkflow: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/param-va/register-workflow',
    },

    // Approval List
    submission: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/param-va/submission',
    },

    // Summary Operations
    summaryChangesList: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/param-va/summary/changes-list',
    },
    validationList: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/timeline/bucket',
    },
  },
  parameter: {
    getCutOff: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter/get-cut-off',
    },
    getListByModule: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter/get-list-by-module',
    },
  },
  parameterApuPpt: {
    detail: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/apu-ppt/detail-budd',
    },
    groupDetail: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/group-data/detail',
    },
    itemDetail: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/item/detail',
    },
    itemList: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/budd/item/list',
    },
    itemStore: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/budd/item/store',
    },
    itemSubStore: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/budd/subitem/store',
    },
    list: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/apu-ppt/list-budd',
    },
    listSubmissionBudd: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/apu-ppt/list-submission-budd',
    },
    noItem: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/budd/lov/no-item',
    },
    preview: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/budd/preview',
    },

    processList: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/apu-ppt/budd/list-group',
    },
    registerBucket: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/apu-ppt/register-budd',
    },
    store: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/budd/group/store',
    },
    subItemDetail: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/subitem/detail',
    },

    subItemList: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/budd/subitem/list',
    },
    // Summary endpoints for parameter group
    summaryGroupAdd: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/budd/summary-add-group',
    },
    summaryGroupUpdate: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/budd/summary-update-group',
    },
    summaryItem: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/budd/summary-update-item',
    },
    summaryItemAdd: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/budd/summary-add-item',
    },
    summarySubitem: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/budd/summary-update-subitem',
    },
    summarySubitemAdd: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/budd/summary-add-subitem',
    },
  },


  // MaintenanceParameterBar endpoints
  parameterBar: {
    RegisterBucket: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-bc/register',
    },
    businessCallStatus: {
      baseType: 'parameter',
      method: 'get',
      url: '/v1/parameter/get-list-by-module',
    },
    businessSummaryChangesList: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-bc/summary/changes-list',
    },
    filterBySubmissionBusinessCall: {
      baseType: 'parameter',
      method: 'get',
      url: '/v1/parameter/get-list-by-module',
    },
    filterStatusMtcParameterBusinessCall: {
      baseType: 'parameter',
      method: 'get',
      url: '/v1/parameter/get-list-by-module',
    },
    getFilterSubmissionList: {
      baseType: 'parameter',
      method: 'get',
      url: '/v1/parameter/get-list-by-module',
    },
    list: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter/list',
    },
    parameterList: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-bc/list',
    },
    parameterSubmission: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-bc/submission',
    },
    processList: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-bc/process/business-summary',
    },
    processSave: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-bc/process/business-summary/save',
    },
    searchByMtcParameterBusinessCall: {
      baseType: 'parameter',
      method: 'get',
      url: '/v1/parameter/get-list-by-module',
    },
    searchBySubmissionBusinessCall: {
      baseType: 'parameter',
      method: 'get',
      url: '/v1/parameter/get-list-by-module',
    },
    sortByMtcParameterBusinessCall: {
      baseType: 'parameter',
      method: 'get',
      url: '/v1/parameter/get-list-by-module',
    },
    sortBySubmissionBusinessCall: {
      baseType: 'parameter',
      method: 'get',
      url: '/v1/parameter/get-list-by-module',
    },
    validationList: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/timeline/bucket',
    },
  },

  parameterBmpp: {
    paramByKey: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter/get-by-key',
    },
  },

  parameterCotEod: {
    cotDetail: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-cot-eod/cot/detail',
    },
    cotList: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-cot-eod/cot/list',
    },
    cotStore: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-cot-eod/cot/store',
    },
    eodDetail: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-cot-eod/eod/detail',
    },
    eodList: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-cot-eod/eod/list',
    },
    eodStore: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-cot-eod/eod/store',
    },
    submission: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-cot-eod/coteod/submission',
    },
    submissionDetail: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-cot-eod/coteod/submission/detail',
    },
    summary: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-cot-eod/coteod/summary',
    },
  },

  parameterData: {
    statusDataSent: {
      baseType: 'parameter',
      method: 'post',
      module: 'statusLogInterface',
      url: '/v1/parameter/get-list-by-module',
    },
    typeOfData: {
      baseType: 'parameter',
      method: 'post',
      module: 'typeLogInterface',
      url: '/v1/parameter/get-list-by-module',
    },
  },

  parameterGroup: {
    detail: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/detail',
    },
    itemDetail: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/item/detail',
    },
    itemList: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/item/list',
    },
    itemStore: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/item/store',
    },
    list: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/list',
    },
    lovCode: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/lov/code',
    },
    noItem: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/lov/no-item',
    },
    preview: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/preview',
    },
    standaloneSave: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/standalone/save',
    },
    store: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/store',
    },
    subItemDetail: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/subitem/detail',
    },
    subItemList: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/subitem/list',
    },
    subItemStore: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/subitem/store',
    },
    submission: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/submission',
    },
    submissionDetail: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/submission/detail',
    },
    summary: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/summary',
    },
    summaryAdd: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/summary/add',
    },
    summaryItem: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/summary/item',
    },
    summaryItemAdd: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/summary/item/add',
    },
    summarySubItem: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/summary/subitem',
    },
    summarySubItemAdd: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-group/summary/subitem/add',
    },
  },


  parameterLov: {
    downloadTemplate: {
      baseType: 'parameter',
      method: 'get',
      url: '/v1/param-lov/download-template',
    },
    importTemplate: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/param-lov/import',
    },
    itemList: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/param-lov/process/item-list',
    },
    list: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/param-lov/list',
    },
    registerWorkflow: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/param-lov/register-workflow',
    },
    save: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/param-lov/process/save',
    },
    searchByMtcParameter: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter/get-list-by-module',
    },
    sortByMtcParameter: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter/get-list-by-module',
    },
    statusMtcParameter: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter/get-list-by-module',
    },
    submission: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/param-lov/submission',
    },
    summaryChangesList: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/param-lov/summary/changes-list',
    },
    uploadHistory: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/param-lov/upload-history',
    },
  },

  parameterRate: {
    detail: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-rate/detail',
    },
    history: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-rate/history',
    },
    list: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-rate/list',
    },
    standaloneSave: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-rate/standalone/save',
    },
    store: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-rate/store',
    },
    submission: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-rate/submission',
    },
    submissionDetail: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-rate/submission/detail',
    },
    summary: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-rate/summary',
    },
  },

  parameterSkemaSyariah: {
    detail: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-syariah/process/detail',
    },
    getParamComponentSyariah: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-syariah/get-param-component-syariah',
    },
    getParamProduct: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-syariah/get-param-product',
    },
    getParamProductReference: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-syariah/get-param-product-reference',
    },
    list: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-syariah/list',
    },
    save: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-syariah/process/save',
    },
    submission: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-syariah/submission',
    },
    submissionDetail: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-syariah/submission/detail',
    },
    summary: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-syariah/summary/changes-list',
    },
  },

  parameterSla: {
    detail: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-sla/detail',
    },
    group: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-sla/group',
    },
    groupDetail: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-sla/group/detail',
    },
    lovProcess: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-sla/lov/process',
    },
    store: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-sla/store',
    },
    submission: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-sla/submission',
    },
    submissionDetail: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-sla/submission/detail',
    },
    summary: {
      baseType: 'parameter',
      method: 'post',
      url: '/v1/parameter-sla/summary',
    },
  },
};

export default parameter;
