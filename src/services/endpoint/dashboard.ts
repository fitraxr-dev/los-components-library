const dashboard = {
  annualReviewProgress: {
    annualReviewProgress: {
      baseType: 'dashboard',
      method: 'post',
      url: '/v1/annual-review-progress',
    },
  },

  capacityOverview: {
    capacity: {
      baseType: 'dashboard',
      method: 'post',
      url: '/v1/capacity-overview',
    },
  },

  compareDashboard: {
    progressRate: {
      baseType: 'dashboard',
      method: 'post',
      url: '/v1/compare/progress-rate',
    },
    successRate: {
      baseType: 'dashboard',
      method: 'post',
      url: 'v1/compare/success-rate',
    },
  },

  // example endpoint, copy this format change the method and url
  // serviceName: {
  //   controllerGroup: {
  //     baseType: 'dashboard',
  //     method: 'post',
  //     url: '/v1/controllerGroup/serviceName',
  //   },
  // },
  inquiry: {
    filterProcess: {
      baseType: 'dashboard',
      method: 'get',
      url: '/v1/inquiry/all-process',
    },
  },
  master: {
    processByDivision: {
      baseType: 'dashboard',
      method: 'post',
      url: '/v1/master/division/process',
    },
  },

  performanceOverview: {
    performanceOverview: {
      baseType: 'dashboard',
      method: 'post',
      url: '/v1/performance-overview',
    },
  },

  process: {
    processNonBusiness: {
      baseType: 'dashboard',
      method: 'post',
      url: '/v1/process',
    },
  },

  progressRate: {
    progressOverviewList: {
      baseType: 'dashboard',
      method: 'post',
      url: '/v1/progress-rate/list',
    },
    progressOverviewStatus: {
      baseType: 'dashboard',
      method: 'post',
      url: '/v1/progress-rate/status',
    },
  },

  successRate: {
    existingDebitur: {
      baseType: 'dashboard',
      method: 'post',
      url: '/v1/success-rate/existing-customer',
    },
    keseluruhanPengajuan: {
      baseType: 'dashboard',
      method: 'post',
      url: '/v1/success-rate/all',
    },
    newDebitur: {
      baseType: 'dashboard',
      method: 'post',
      url: '/v1/success-rate/new-customer',
    },
    pengajuanPerbulan: {
      baseType: 'dashboard',
      method: 'post',
      url: '/v1/success-rate/permonth',
    },
  },

  turnAroundTime: {
    tat: {
      baseType: 'dashboard',
      method: 'post',
      url: '/v1/turn-around-time-overview',
    },
  },
};

export default dashboard;
