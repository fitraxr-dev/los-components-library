const lpa = {
  bucket: {
    statusCheck: {
      baseType: 'bucket',
      method: 'post',
      url: '/v1/bucket/status/check',
    },
  },
  collateral: {
    save: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/collateral/save',
    },
    search: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/collateral/list/search',
    },
  },


  collateralBoat: {
    save: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/collateral-boat/save',
    },
  },
  collateralBuilding: {
    save: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/collateral-building/save',
    },
  },
  collateralComplementaryFacilities: {
    save: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/collateral-complementary-facilities/save',
    },
  },
  collateralInventory: {
    save: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/collateral-inventory/save',
    },
  },
  collateralLand: {
    save: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/collateral-land/save',
    },
  },
  collateralMachineEquipment: {
    save: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/collateral-machines-equipment/save',
    },
  },
  collateralVehicle: {
    save: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/collateral-vehicle/save',
    },
  },
  dpopRequest: {
    businessReviewSave: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/review/business/save',
    },
    businessSave: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/lpa-information/business/save',
    },
    difference: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/review/difference',
    },
    differenceDetail: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/lpa-information/difference',
    },
    updateAcknowledge: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/lpa-information/update/acknowledge',
    },
  },


  // example endpoint, copy this format change the method and url
  // serviceName: {
  //   controllerGroup: {
  //     baseType: 'lpa',
  //     method: 'post',
  //     url: '/v1/controllerGroup/serviceName',
  //   },
  // },
  lpaDetail: {
    detail: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/lpa-information/detail',
    },
    getCollateralBoatList: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/collateral-boat/list',
    },
    getCollateralBuildingList: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/collateral-building/list',
    },
    getCollateralComplementaryFacilitiesList: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/collateral-complementary-facilities/list',
    },
    getCollateralDetail: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/collateral/detail',
    },
    getCollateralInventoryList: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/collateral-inventory/list',
    },
    getCollateralLandList: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/collateral-land/list',
    },
    getCollateralMachinesEquipmentList: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/collateral-machines-equipment/list',
    },
    getCollateralVehicleList: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/collateral-vehicle/list',
    },
  },


  lpaInformation: {
    save: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/lpa-information/save',
    },
    update: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/lpa-information/update',
    },
  },
  save: {
    save: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/financing-facility-overview/save',
    },
    saveReview: {
      baseType: 'lpa',
      method: 'post',
      url: '/v1/review/save',
    },
  },
};

export default lpa;
