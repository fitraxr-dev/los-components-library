const maintenanceGroup = {
  group: {
    list: {
      baseType: 'master',
      method: 'post',
      url: '/v1/group/list',
    },
    validateGroup: {
      baseType: 'master',
      method: 'post',
      url: '/v1/group/validate-group-name',
    },
  },
};
export default maintenanceGroup;
