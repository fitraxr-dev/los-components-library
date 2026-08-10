const bucketDocument = {


  document: {
    checkDrdStatus: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/drd/check-rating',
    },
    createDocumentGroup: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/document-group/create',
    },
    createRating: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/drd/create-rating',
    },
    debtorRatingHistory: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/drd/find-debtors',
    },
    deleteDocumentGroup: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/document-group/delete',
    },
    documentList: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/maintenance-customer/documentation',
    },
    documentType: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document-param/document-type-name',
    },
    downloadDocumentGroup: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/document-group/download',
    },
    downloadTemplateDRD: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/drd/download-template',
    },
    downloadWithWatermark: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/maintenance-customer/documentation/download-watermark',
    },
    drdInterfaceList: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/drd/drd-interface',
    },
    getDocumentByOwnerId: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/document-group-by-owner-id',
    },
    getDocumentGroup: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/document-group/all',
    },
    getOtherDocumentGroup: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/document-group',
    },
    getRisalahRapatMerged: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/document-group',
    },
    getRisalahRapatRenewal: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/risalah-rapat/renewal',
    },
    ownedDigitalMemo: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/owned-digital-memo-by-process-id',
    },
    previewWatermark: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/maintenance-customer/documentation/preview-watermark',
    },
    ratingHistory: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/drd/rating-list',
    },
    risalahRapatManualUpload: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/risalah-rapat/manual-upload',
    },
    save: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/document-group/checklist',
    },
    sendDrd: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/drd/send-drd',
    },
    sendMemoDrd: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/drd/send-memo',
    },
    sendToElo: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/internal/send-to-elo',
    },
    summary: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/document-group/summary',
    },
  },


  draftMemo: {
    attachmentRisalahRapat: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/draft-memo/attachment-risalah-rapat',
    },
    downloadDraftMemo: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/draft-memo/download-draft-memo',
    },
    generate: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/draft-memo/generate',
    },
    getById: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/draft-memo/get-by-id',
    },
    history: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/draft-memo/history',
    },
    retry: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/draft-memo/retry',
    },
    save: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/draft-memo/save',
    },
  },


  elo: {
    addExisting: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/document-existing/save-elo',
    },
    download: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/elo/download',
    },
    preview: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/elo/watermarked-document',
    },
  },
  // example endpoint, copy this format change the method and url
  // serviceName: {
  //   controllerGroup: {
  //     baseType: 'bucketDocument',
  //     method: 'post',
  //     url: '/v1/controllerGroup/serviceName',
  //   },
  // },
  fastTrack: {
    auditTrailDetail: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/fast-track/audit-trail/detail',
    },
    auditTrailList: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/fast-track/audit-trail/list',
    },
    confirmDocument: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/fast-track/confirm',
    },
    deleteDocument: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/document-group/delete',
    },
    detailDocument: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/fast-track/detail',
    },
    listDocument: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/fast-track/list',
    },
    mandatoryCheckList: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/fast-track/mandatory-check/list',
    },
    mandatoryCheckOptions: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/fast-track/mandatory-check/options',
    },
    uploadDocument: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/document/document-group/create',
    },

  },
  proposal: {
    deleteAttachment: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/proposal/attachment/delete',
    },
    getListAttachment: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/proposal/attachment/list',
    },
    submitAttachment: {
      baseType: 'bucketDocument',
      method: 'post',
      url: '/v1/proposal/attachment',
    },
  },
};

export default bucketDocument;
