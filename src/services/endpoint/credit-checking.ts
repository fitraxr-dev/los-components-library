const creditChecking = {
  creditChecking: {
    save: {
      baseType: 'creditChecking',
      method: 'post',
      url: 'v1/request/save',
    },
    saveSummary: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/summary/save',
    },
  },
  detail: {
    debtor: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/detail/debtor',
    },
    management: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/detail/management',
    },
    otherRelated: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/detail/other-related',
    },
    shareholder: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/detail/shareholder',
    },
  },
  management: {
    result: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/result/management',
    },
  },
  managementShareholder: {
    delete: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/result/summary/delete',
    },
  },
  otherRelated: {
    result: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/result/other-related',
    },
  },
  request: {
    debtor: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/request/debtor',
    },
    deleteOtherRelated: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/request/other-related/delete',
    },
    management: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/request/management',
    },
    otherRelated: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/request/other-related',
    },
    saveOtherRelated: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/request/other-related/save',
    },
    shareholder: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/request/shareholder',
    },
  },
  result: {
    debtor: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/result/debtor',
    },
    deleteDocument: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/result/documents/delete',
    },
    management: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/result/management',
    },
    otherRelated: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/result/other-related',
    },
    saveDebtor: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/result/debtor/save',
    },
    saveDocument: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/result/documents/save',
    },
    saveManagement: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/result/management/save',
    },
    saveOtherRelated: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/result/other-related/save',
    },
    saveShareholder: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/result/shareholder/save',
    },
    selectedDocuments: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/result/documents/selected',
    },
    shareholder: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/result/shareholder',
    },
    stakeholderLov: {
      baseType: 'creditChecking',
      method: 'post',
      url: '/v1/result/summary/stakeholder/lov',
    },
  },
  // example endpoint, copy this format change the method and url
  // serviceName: {
  //   controllerGroup: {
  //     baseType: 'creditChecking',
  //     method: 'post',
  //     url: '/v1/controllerGroup/serviceName',
  //   },
  // },
};

export default creditChecking;
