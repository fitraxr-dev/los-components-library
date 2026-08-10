const technicalReview = {
  add: {
    save: {
      baseType: 'technicalReview',
      method: 'post',
      url: '/v1/request/save',
    },
  },
  bucket: {
    statusCheck: {
      baseType: 'technicalReview',
      method: 'post',
      url: '/v1/request/status/check',
    },
  },
  delstRequest: {
    businessSave: {
      baseType: 'technicalReview',
      method: 'post',
      url: '/v1/delst-request/business/save',
    },
    difference: {
      baseType: 'technicalReview',
      method: 'post',
      url: '/v1/delst-request/difference',
    },
    updateAcknowledge: {
      baseType: 'technicalReview',
      method: 'post',
      url: '/v1/delst-request/update/acknowledge',
    },
  },
  request: {
    createLatest: {
      baseType: 'technicalReview',
      method: 'post',
      url: '/v1/request/create/latest',
    },
  },
};

export default technicalReview;
