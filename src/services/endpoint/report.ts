const report = {

  agingReportProsesPembiayaan: {
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-aging-proses-pembiayaan/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-aging-proses-pembiayaan/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-aging-proses-pembiayaan/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-aging-proses-pembiayaan/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-aging-proses-pembiayaan/search',
    },
  },

  assessmentApuPpt: {
    csv: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-assessment-apu-ppt/generate/csv',
    },
    detail: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-assessment-apu-ppt/detail',
    },
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-assessment-apu-ppt/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-assessment-apu-ppt/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-assessment-apu-ppt/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-assessment-apu-ppt/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-assessment-apu-ppt/search',
    },
  },


  basAsParticipant: {
    csv: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/bas-as-participant/generate/csv',
    },
    detail: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/bas-as-participant/detail',
    },
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/bas-as-participant/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/bas-as-participant/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/bas-as-participant/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/bas-as-participant/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/bas-as-participant/search',
    },
  },


  basAsSubmitter: {
    csv: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/bas-as-submitter/generate/csv',
    },
    detail: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/bas-as-submitter/detail',
    },
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/bas-as-submitter/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/bas-as-submitter/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/bas-as-submitter/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/bas-as-submitter/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/bas-as-submitter/search',
    },
  },


  bmppGroup: {
    csv: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-group/generate/csv',
    },
    detail: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-group/detail',
    },
    detailExisting: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-group/detail-existing',
    },
    detailProposed: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-group/detail-proposed',
    },
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-group/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-group/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-group/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-group/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-group/search',
    },
  },


  bmppGroupDpop: {
    csv: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-group-dpop/generate/csv',
    },
    detail: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-group-dpop/detail',
    },
    detailExisting: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-group-dpop/detail-existing',
    },
    detailProposed: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-group-dpop/detail-proposed',
    },
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-group-dpop/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-group-dpop/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-group-dpop/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-group-dpop/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-group-dpop/search',
    },
  },


  bmppIndividualBisnis: {
    csv: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-individual/bisnis/generate/csv',
    },
    detail: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-individual/bisnis/detail',
    },
    detailExisting: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-individual/bisnis/detail-existing',
    },
    detailProposed: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-individual/bisnis/detail-proposed',
    },
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-individual/bisnis/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-individual/bisnis/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-individual/bisnis/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-individual/bisnis/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-individual/bisnis/search',
    },
  },


  bmppIndividualDpop: {
    csv: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-individual/dpop/generate/csv',
    },
    detail: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-individual/dpop/detail',
    },
    detailExisting: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-individual/dpop/detail-existing',
    },
    detailProposed: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-individual/dpop/detail-proposed',
    },
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-individual/dpop/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-individual/dpop/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-individual/dpop/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-individual/dpop/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-bmpp-individual/dpop/search',
    },
  },

  commentHistoryTracking: {
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-comment-history-tracking/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-comment-history-tracking/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-comment-history-tracking/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-comment-history-tracking/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-comment-history-tracking/search',
    },
  },

  customer: {
    csv: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/generate/csv',
    },
    detail: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/detail',
    },
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/search',
    },
  },

  customerCreditChecking: {
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/credit-checking/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/credit-checking/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/credit-checking/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/credit-checking/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/credit-checking/search',
    },
  },

  customerFacilities: {
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/facilities/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/facilities/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/facilities/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/facilities/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/facilities/search',
    },
  },

  customerGroup: {
    csv: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/group/generate/csv',
    },
    detail: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/group/detail',
    },
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/group/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/group/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/group/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/group/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/group/search',
    },
  },


  customerLPA: {
    csv: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/lpa/generate/csv',
    },
    detail: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/lpa/detail',
    },
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/lpa/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/lpa/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/lpa/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/lpa/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/lpa/search',
    },
  },


  customerManagementShareholder: {
    csv: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/management/generate/csv',
    },
    detail: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/management/detail',
    },
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/management/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/management/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/management/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/management/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/management/search',
    },
  },

  customerPersetujuanKhusus: {
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/special-approval/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/special-approval/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/special-approval/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/special-approval/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/special-approval/search',
    },
  },


  customerPipeline: {
    csv: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/pipeline/generate/csv',
    },
    detail: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/pipeline/detail',
    },
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/pipeline/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/pipeline/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/pipeline/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/pipeline/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/pipeline/search',
    },
  },

  customerPkAddendum: {
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/pk-addendum/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/pk-addendum/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/pk-addendum/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/pk-addendum/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/pk-addendum/search',
    },
  },

  customerProject: {
    csv: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/project/generate/csv',
    },
    detail: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/project/detail',
    },
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/project/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/project/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/project/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/project/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/project/search',
    },
  },

  customerRatingManagement: {
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/rating-management/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/rating-management/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/rating-management/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/rating-management/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/rating-management/search',
    },
  },

  customerResikoDatabase: {
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/resiko-database/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/resiko-database/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/resiko-database/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/resiko-database/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/resiko-database/search',
    },
  },

  customerSiteVisit: {
    csv: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/site-visit/generate/csv',
    },
    detail: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/site-visit/detail',
    },
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/site-visit/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/site-visit/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/site-visit/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/site-visit/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/site-visit/search',
    },
  },


  customerVirtualAccount: {
    csv: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/virtual-account/generate/csv',
    },
    detail: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/virtual-account/detail',
    },
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/virtual-account/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/virtual-account/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/virtual-account/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/virtual-account/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-detail-customer/virtual-account/search',
    },
  },

  logAuditTrailActivity: {
    csv: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-audit-trails/activity/generate/csv',
    },
    detail: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-audit-trails/activity/detail',
    },
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-audit-trails/activity/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-audit-trails/activity/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-audit-trails/activity/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-audit-trails/activity/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-audit-trails/activity/search',
    },
  },


  logAuditTrailUserAccess: {
    csv: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-audit-trails/user-access/generate/csv',
    },
    detail: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-audit-trails/user-access/detail',
    },
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-audit-trails/user-access/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-audit-trails/user-access/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-audit-trails/user-access/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-audit-trails/user-access/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-audit-trails/user-access/search',
    },
  },

  logDataInterfaceSuccess: {
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-data-interface-success/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-data-interface-success/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-data-interface-success/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-data-interface-success/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-data-interface-success/search',
    },
  },

  logDocumentUploadData: {
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-document-update-data/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-document-update-data/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-document-update-data/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-document-update-data/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-document-update-data/search',
    },
  },

  logEndofDay: {
    csv: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-endofday/generate/csv',
    },
    detail: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-endofday/detail',
    },
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-endofday/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-endofday/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-endofday/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-endofday/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-endofday/search',
    },
  },

  // example endpoint, copy this format change the method and url
  // serviceName: {
  //   controllerGroup: {
  //     baseType: 'report',
  //     method: 'post',
  //     url: '/v1/controllerGroup/serviceName',
  //   },
  // },
  // https://ist-backend-documentation-development.cloudias79.com/report-service/index.html
  logPenomoranMemo: {
    csv: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-penomoran-memo/generate/csv',
    },
    detail: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-penomoran-memo/detail',
    },
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-penomoran-memo/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-penomoran-memo/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-penomoran-memo/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-penomoran-memo/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-penomoran-memo/search',
    },
  },


  memoCreation: {
    csv: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-memo-creation/generate/csv',
    },
    detail: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-memo-creation/detail',
    },
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-memo-creation/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-memo-creation/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-memo-creation/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-memo-creation/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-memo-creation/search',
    },
  },

  reassignment: {
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-reassignment/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-reassignment/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-reassignment/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-reassignment/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-log-reassignment/search',
    },
  },

  tatSlaDetails: {
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-tat-sla-update-fin-details/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-tat-sla-update-fin-details/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-tat-sla-update-fin-details/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-tat-sla-update-fin-details/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-tat-sla-update-fin-details/search',
    },
  },

  tatSlaSum: {
    download: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-tat-sla-update-fin-sum/download',
    },
    excel: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-tat-sla-update-fin-sum/generate/excel',
    },
    history: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-tat-sla-update-fin-sum/history',
    },
    pdf: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-tat-sla-update-fin-sum/generate/pdf',
    },
    search: {
      baseType: 'report',
      method: 'post',
      url: '/v1/report-tat-sla-update-fin-sum/search',
    },
  },

};

export default report;
