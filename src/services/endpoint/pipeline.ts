const pipeline = {
  group: {
    validateGroup: {
      baseType: 'master',
      method: 'post',
      url: '/v1/group/validate-group-name',
    },
  },
  refina: {
    getListSubmission: {
      baseType: 'bucket',
      method: 'POST',
      url: '/v1/bucket/refina/get-list-submission',
    },
    getListSubmissionDetail: {
      baseType: 'bucket',
      method: 'POST',
      url: '/v1/bucket/refina/get-list-submission-detail',
    },
  },
};

export default pipeline;
