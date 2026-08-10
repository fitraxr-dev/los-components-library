export const tab = {
  HISTORY_DOWNLOAD: 'history-download',
  LIST_DATA: 'list-data',
} as const;

export const tabItems = [
  {
    label: 'List Data',
    value: tab.LIST_DATA,
  },
  {
    label: 'History Download',
    value: tab.HISTORY_DOWNLOAD,
  },
];
