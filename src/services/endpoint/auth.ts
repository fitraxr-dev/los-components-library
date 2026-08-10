const auth = {
  // example endpoint, copy this format change the method and url
  // serviceName: {
  //   controllerGroup: {
  //     baseType: 'auth',
  //     method: 'post',
  //     url: '/v1/controllerGroup/serviceName',
  //   },
  // },

  relogin: {
    save: {
      baseType: 'auth',
      method: 'post',
      url: '/v2/auth/relogin',
    },
  },
};

export default auth;
