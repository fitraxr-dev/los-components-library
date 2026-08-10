export const tab = {
  PROGRESS_RATE: 'progress-rate',
  SUCCESS_RATE: 'success-rate',
} as const;

export const tabItems = [
  {
    label: 'Success Rate',
    tooltip: 'Jumlah proposal/pengajuan/pekerjaan bedasarkan status',
    value: tab.SUCCESS_RATE,
  },
  {
    label: 'Progress Rate',
    tooltip: 'Jumlah proposal/pengajuan/pekerjaan yang masih dalam tahap pengerjaan',
    value: tab.PROGRESS_RATE,
  },
];
