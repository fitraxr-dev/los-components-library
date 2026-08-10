const userManagement = {


  // example endpoint, copy this format change the method and url
  // serviceName: {
  //   controllerGroup: {
  //     baseType: 'userManagement',
  //     method: 'post',
  //     url: '/v1/controllerGroup/serviceName',
  //   },
  // },
  accessMenu: {
    save: {
      baseType: 'userManagement',
      method: 'post',
      url: '/v1/management/access-menu/store',
    },
  },
  auditTrail: {
    record: {
      baseType: 'userManagement',
      method: 'post',
      url: '/v1/management/audit-trail',
    },
  },
  lov: {
    direktorat: {
      baseType: 'userManagement',
      method: 'post',
      url: '/v1/master/v2/directorate',
    },
    division: {
      baseType: 'userManagement',
      method: 'post',
      url: '/v1/master/v2/division',
    },
    gamByDivisionList: {
      baseType: 'userManagement',
      method: 'post',
      url: '/v1/user/gam/by-division',
    },
    menuName: {
      baseType: 'userManagement',
      method: 'post',
      url: '/v1/management/access-menu/lov/all',
    },
    rmByDivisionList: {
      baseType: 'userManagement',
      method: 'post',
      url: '/v1/user/rm/by-division',
    },
    role: {
      baseType: 'userManagement',
      method: 'post',
      url: '/v1/master/v2/role',
    },
    staff: {
      baseType: 'userManagement',
      method: 'post',
      url: '/v1/user/lov',
    },
    teamLead: {
      baseType: 'userManagement',
      method: 'post',
      url: '/v1/user/lov',
    },
    username: {
      baseType: 'userManagement',
      method: 'post',
      url: '/v1/management/user/lov-userV2/all',
    },
  },
  master: {
    divisionList: {
      baseType: 'userManagement',
      method: 'post',
      url: '/v1/master/v2/division-list',
    },
  },
  user: {
    delete: {
      baseType: 'userManagement',
      method: 'post',
      url: '/v1/management/user/delete',
    },
    lovMonitoring: {
      baseType: 'userManagement',
      method: 'post',
      url: '/v1/user/monitoring/lov',
    },
  },
};

export default userManagement;
