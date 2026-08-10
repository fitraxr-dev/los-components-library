import useGetDebtSecuritiesGroupExcludeDebtorList from '@/hooks/services/useGetDebtSecuritiesGroupExcludeDebtorList';


const master = {
  barFollowUp: {
    save: {
      baseType: 'master',
      method: 'post',
      url: '/v1/bar/discussion-follow-up/save',
    },
  },
  bmpp: {
    customerIndividualResult: {
      baseType: 'master',
      method: 'post',
      url: '/v1/bmpp/monitoring/individual/result',
    },
    deleteProposalPlan: {
      baseType: 'master',
      method: 'post',
      url: '/v1/bmpp/simulation/proposal-plan/delete',
    },
    monitoringIndividualGroupResult: {
      baseType: 'master',
      method: 'post',
      url: '/v1/bmpp/monitoring/individual/group/result',
    },
    saveProposalPlan: {
      baseType: 'master',
      method: 'post',
      url: '/v1/bmpp/simulation/proposal-plan/save',
    },
    simulationCalculate: {
      baseType: 'master',
      method: 'post',
      url: '/v1/bmpp/simulation/calculate',
    },
    simulationDetail: {
      baseType: 'master',
      method: 'post',
      url: '/v1/bmpp/simulation/detail',
    },
  },
  capital: {
    save: {
      baseType: 'master',
      method: 'post',
      url: '/v1/capital/store',
    },
  },
  creditChecking: {
    validation: {
      baseType: 'master',
      method: 'post',
      url: '/v2/group/validate/result',
    },
  },
  customerName: {
    list: {
      baseType: 'master',
      method: 'post',
      url: '/v1/debtor/customer/all',
    },
  },
  databaseDk: {
    customerCheckList: {
      baseType: 'master',
      method: 'post',
      url: '/v1/database-dk/customer-check/list',
    },
    detail: {
      baseType: 'master',
      method: 'post',
      url: '/v1/database-dk/history-upload/detail',
    },
    download: {
      baseType: 'master',
      method: 'get',
      url: '/v1/database-dk/template/download',
    },
    historyUploadList: {
      baseType: 'master',
      method: 'post',
      url: '/v1/database-dk/history-upload/list',
    },
    lovCategory: {
      baseType: 'master',
      method: 'get',
      url: '/v1/database-dk/lov/category',
    },
    lovProfile: {
      baseType: 'master',
      method: 'get',
      url: '/v1/database-dk/lov/profile',
    },
    lovUploadBy: {
      baseType: 'master',
      method: 'get',
      url: '/v1/database-dk/lov/upload-by',
    },
    upload: {
      baseType: 'master',
      method: 'post',
      url: '/v1/database-dk/upload',
    },
  },
  debtSecurities: {
    debtor: {
      baseType: 'master',
      method: 'post',
      url: '/v1/debt-securities/debtor',
    },
    excludeDebtor: {
      baseType: 'master',
      method: 'post',
      url: '/v1/debt-securities/group-exclude-debtor',
    },
  },
  debtor: {
    apuPptData: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/apu-ppt-data/detail',
    },
    dataOnCoreRequirementsResult: {
      baseType: 'master',
      method: 'post',
      url: '/v1/debtor/data-on-core-requirements/result',
    },
    detail: {
      baseType: 'master',
      method: 'post',
      url: '/v1/debtor/detail',
    },
    penerapanCdd: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/penerapan-cdd/list',
    },
    validateCheck: {
      baseType: 'master',
      method: 'post',
      url: '/v1/debtor/validate/check',
    },
    validateResult: {
      baseType: 'master',
      method: 'post',
      url: '/v1/debtor/validate/result',
    },
  },
  debtorIdentity: {
    save: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/debtor-identity/save',
    },
  },
  facility: {
    sendEmail: {
      baseType: 'master',
      method: 'post',
      url: '/v1/facility/send-email',
    },
  },
  facilityConventional: {
    businessHolidayCountryDelete: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/business-holiday-country/delete',
    },
    businessHolidayCountryDetail: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/business-holiday-country/detail',
    },
    businessHolidayCountrySave: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/business-holiday-country/save',
    },
    dataDeltaDetail: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/data-delta-detail',
    },
    dataDeltaTab: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/data-delta-tab',
    },
    facilityDataDetail: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/facility-data/detail',
    },
    facilityDataDetailSave: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/facility-data-detail/save',
    },
    facilityDataDetaildata: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/facility-data-detail',
    },
    facilityDataSave: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/facility-data/save',
    },
    facilityFeeDelete: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/facility-fee/delete',
    },
    facilityFeeDetail: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/facility-fee/detail',
    },
    facilityFeeSave: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/facility-fee/save',
    },
    facilityInformationDetail: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/facility-information/detail',
    },
    facilityInformationSave: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/facility-information/save',
    },
    interestConstructionsDetail: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/interest-construction/detail',
    },
    interestConstructionsSave: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/interest-construction/save',
    },
    list: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/list',
    },
    multiRateDelete: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/multi-rate/delete',
    },
    multiRateDetail: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/multi-rate/detail',
    },
    multirateSave: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/multi-rate/save',
    },
    notificationDetail: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/notification/detail',
    },
    notificationSave: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/notification/save',
    },
    otherInformationDetail: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/other-information/detail',
    },
    otherInformationSave: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/other-information/save',
    },
    projectDetail: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/project/detail',
    },
    projectSave: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/project/save',
    },
    syncArium: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/sync-arium',
    },
    syndicationInformationDetail: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/syndication-information/detail',
    },
    syndicationInformationOtherSave: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/syndication-information/other/save',
    },
    syndicationInformationSave: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-konven/syndication-information/save',
    },
  },

  facilityManagementSyariahExisiting: {
    dataAsOf: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/date-as-of',
    },
    getLovParentSyariah: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/lov-parentSyariahLimitIdTemenos',
    },
    getParentLimitData: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/data-existing-limitInduk',
    },
    inquiryAccount: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/inquiry/account',
    },
    inquiryLimit: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/inquiry/limit',
    },
    limitAnak: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/child-limit',
    },
    limitInduk: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/parent-limit',
    },
    list: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/list',
    },
    other: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/child-limit/other',
    },
    project: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/child-limit/project',
    },
    projectDetail: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/child-limit/project-detail',
    },
    projectList: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/child-limit/project-list',
    },
    saveOther: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/child-limit/other/save',
    },
    saveSyndication: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/child-limit/syndication/save',
    },
    syncTemenos: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/sync-temenos',
    },
    syndication: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/child-limit/syndication',
    },
  },
  facilityManagementSyariahProposed: {
    childLimitList: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/child-limit/master-list',
    },
    childLimitlistModal: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/child-limit/core-list',
    },
    dataDeltaChildLimit: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/data-delta/child-limit',
    },
    dataDeltaParentLimit: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/data-delta/parent-limit',
    },
    deleteChildLimit: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/child-limit/delete',
    },
    deleteParentLimit: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/parent-limit/delete',
    },
    financingFacilityList: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/list-submitted',
    },
    parentLimitList: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/parent-limit/list',
    },
    saveModalChildLimit: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/child-limit/create',
    },
    saveParentLimit: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/parent-limit/create',
    },
    updateChildLimit: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/facility-syariah/mapping/update',
    },
  },
  generalInformation: {
    save: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/general-information/save',
    },
  },
  groupName: {
    list: {
      baseType: 'master',
      method: 'post',
      url: '/v2/group/all',
    },
    listById: {
      baseType: 'master',
      method: 'post',
      url: '/v1/group/get-group-by-debtor-id',
    },
    submission: {
      baseType: 'master',
      method: 'post',
      url: '/v2/group/submission',
    },
    submissionDetail: {
      baseType: 'master',
      method: 'post',
      url: '/v2/group/submission/detail',
    },
  },
  lov: {
    customerName: {
      baseType: 'master',
      method: 'post',
      url: '/v1/debtor/customer/all',
    },
  },
  lps: {
    dataOnCoreRequirements: {
      baseType: 'master',
      method: 'post',
      url: '/v1/lps/data-on-core-requirements',
    },
    sendToCore: {
      baseType: 'master',
      method: 'post',
      url: '/v1/lps/send-to-core',
    },
  },
  maintenanceCustomer: {
    detail: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/detail',
    },
    internalAssessmentCreditChecking: {
      baseType: 'master',
      method: 'post',
      url: 'v1/maintenance-customer/internal-assessment/credit-checking',
    },
    internalAssessmentDK: {
      baseType: 'master',
      method: 'post',
      url: 'v1/maintenance-customer/internal-assessment/dk',
    },
    lpa: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/lpa',
    },
  },
  otherCommonInformation: {
    save: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/other-common-information/save',
    },
  },
  otherRelated: {
    list: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/other-related-parties/list',
    },
    save: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/other-related-parties/save',
    },
  },
  perikatanAkad: {
    detail: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/financing-contract/facility',
    },
    list: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/financing-contract/list',
    },
  },

  project: {
    addFacility: {
      baseType: 'master',
      method: 'post',
      url: '/v2/project/project-facility/save',
    },
    customerFacility: {
      baseType: 'master',
      method: 'post',
      url: '/v2/project/customer-facility',
    },
    debtorDropList: {
      baseType: 'master',
      method: 'post',
      url: '/v1/project/debtor/drop-list',
    },
    deleteFacility: {
      baseType: 'master',
      method: 'post',
      url: '/v2/project/project-facility/delete',
    },
    detail: {
      baseType: 'master',
      method: 'post',
      url: '/v2/project/detail',
    },
  },
  regulatorData: {
    apoloDetail: {
      baseType: 'master',
      method: 'post',
      url: '/v1/regulator-data/apolo/detail',
    },
    businessGroupList: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/group-information/list',
    },
    dataDeltaSlik: {
      baseType: 'master',
      method: 'post',
      url: '/v1/regulator-data/data-delta-slik',
    },
    deltaTab: {
      baseType: 'master',
      method: 'post',
      url: '/v1/regulator-data/data-delta-tab-slik',
    },
    detailSlikCustomer: {
      baseType: 'master',
      method: 'post',
      url: '/v1/regulator-data/slik/customer/detail',
    },
    detailSlikFinancingFacility: {
      baseType: 'master',
      method: 'post',
      url: '/v1/regulator-data/slik/financing-facility/detail',
    },
    detailSlikManagement: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/management/detail',
    },
    detailSlikPenjamin: {
      baseType: 'master',
      method: 'post',
      url: '/v1/regulator-data/slik/guarantor/detail',
    },
    listSlikFinancingFacility: {
      baseType: 'master',
      method: 'post',
      url: '/v1/regulator-data/slik/financing-facility/list',
    },
    listSlikManagement: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/management/list',
    },
    saveApolo: {
      baseType: 'master',
      method: 'post',
      url: '/v1/regulator-data/apolo/save',
    },
    saveSlikCustomer: {
      baseType: 'master',
      method: 'post',
      url: '/v1/regulator-data/slik/customer/save',
    },
    saveSlikFinancingFacility: {
      baseType: 'master',
      method: 'post',
      url: '/v1/regulator-data/slik/financing-facility/save',
    },
    saveSlikManagement: {
      baseType: 'master',
      method: 'post',
      url: 'v1/maintenance-customer/management-slik/save',
    },
    saveSlikPenjamin: {
      baseType: 'master',
      method: 'post',
      url: '/v1/regulator-data/slik/guarantor/save',
    },

  },
  remark: {
    save: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/remark/save',
    },
  },
  shareholder: {
    deleteLevel: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/shareholder/structure/delete-level',
    },
    deleteStructure: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/shareholder/structure/delete',
    },
    detail: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/shareholder/detail',
    },
    list: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/shareholder/list',
    },
    saveShareholder: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/shareholder/save',
    },
    saveStructure: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/shareholder/structure/save',
    },
    structureList: {
      baseType: 'master',
      method: 'post',
      url: '/v1/maintenance-customer/shareholder/structure/list',
    },
  },
  statusVa: {
    list: {
      baseType: 'master',
      method: 'post',
      url: '/v2/virtual-account/lov/t-debtor-va',
    },
  },

  submission: {
    saveGroup: {
      baseType: 'master',
      method: 'post',
      url: '/v2/group/submission/store',
    },
    saveProject: {
      baseType: 'master',
      method: 'post',
      url: '/v2/project/submission/store',
    },
  },
  virtualAccount: {
    activation: {
      baseType: 'master',
      method: 'post',
      url: '/v2/virtual-account/va-activation/list',
    },
    creation: {
      baseType: 'master',
      method: 'post',
      url: '/v2/virtual-account/va-creation/list',
    },
    save: {
      baseType: 'master',
      method: 'post',
      url: '/v2/virtual-account/save-va',
    },
  },
};

export default master;
