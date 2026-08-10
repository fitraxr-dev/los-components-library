const siteVisit = {
  // example endpoint, copy this format change the method and url
  // serviceName: {
  //   controllerGroup: {
  //     baseType: 'siteVisit',
  //     method: 'post',
  //     url: '/v1/controllerGroup/serviceName',
  //   },
  // },
  siteVisit: {
    saveClearance: {
      baseType: 'siteVisit',
      method: 'post',
      url: '/v1/site-visit/clearance-selected-visit',
    },

    saveSelect: {
      baseType: 'siteVisit',
      method: 'post',
      url: '/v1/site-visit/select-visit',
    },
    saveVisitLocation: {
      baseType: 'siteVisit',
      method: 'post',
      url: '/v1/site-visit/save-visit-location',
    },
    submit: {
      baseType: 'siteVisit',
      method: 'post',
      url: '/v1/site-visit/submit',
    },
    visitDetail: {
      baseType: 'siteVisit',
      method: 'post',
      url: '/v1/site-visit/visit-detail',
    },
  },
};

export default siteVisit;
