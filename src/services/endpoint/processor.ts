const processor = {
  apuppt: {
    mappingStep: {
      baseType: 'processor',
      method: 'post',
      url: '/v1/processor/dynamic-stepper/mapping-step',
    },
  },
  bucket: {
    stepper: {
      baseType: 'processor',
      method: 'post',
      url: '/v1/processor/bucket/stepper',
    },
  },
  mip: {
    ccExpired: {
      baseType: 'processor',
      method: 'post',
      url: '/v1/stepper/update/mip/credit-checking',
    },
    updateMipr: {
      baseType: 'processor',
      method: 'post',
      url: '/v1/stepper/update/mipr',
    },
  },
  processor: {
    bucketSubmit: {
      baseType: 'processor',
      method: 'post',
      url: '/v1/processor/bucket/submit',
    },
    submitBucketProcess: {
      baseType: 'processor',
      method: 'post',
      url: '/v1/processor/bucket/submit',
    },
  },
};

export default processor;
