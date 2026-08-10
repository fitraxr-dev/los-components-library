const notification = {
  // example endpoint, copy this format change the method and url
  // serviceName: {
  //   controllerGroup: {
  //     baseType: 'notification',
  //     method: 'post',
  //     url: '/v1/controllerGroup/serviceName',
  //   },
  // },
  notification: {
    getDetailNotificationTemplate: {
      baseType: 'notification',
      method: 'post',
      url: '/v1/notification-templates/detail',
    },
    getDetailReminderTemplate: {
      baseType: 'notification',
      method: 'post',
      url: '/v1/reminder-templates/detail',
    },
    getLogNotifications: {
      baseType: 'notification',
      method: 'post',
      url: '/v1/log-notification/list',
    },
    getLogNotificationsDetail: {
      baseType: 'notification',
      method: 'post',
      url: '/v1/log-notification/list/page',
    },
    getLogReminders: {
      baseType: 'notification',
      method: 'post',
      url: '/v1/log-reminder/list',
    },
    getNotificationTemplate: {
      baseType: 'notification',
      method: 'post',
      url: '/v1/notification-templates/list',
    },
    getNotificationTemplateSubmissionDetail: {
      baseType: 'notification',
      method: 'post',
      url: '/v1/notification-templates/submission/detail',
    },
    getReminderTemplateSubmissionDetail: {
      baseType: 'notification',
      method: 'post',
      url: '/v1/reminder-templates/submission/detail',
    },
    saveReminder: {
      baseType: 'notification',
      method: 'post',
      url: '/v1/reminder-templates/save',
    },
    saveTransactionNotificationTemplate: {
      baseType: 'notification',
      method: 'post',
      url: '/v1/notification-templates/save',
    },
  },
};
export default notification;
