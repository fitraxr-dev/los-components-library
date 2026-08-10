export const modalData = {
  MODAL_DEBTOR_DETAIL_NEW: 'MODAL_DEBTOR_DETAIL_NEW',
  MODAL_MANAGEMENT_DETAIL_EXISTING: 'MODAL_MANAGEMENT_DETAIL_EXISTING',
  MODAL_MANAGEMENT_DETAIL_NEW: 'MODAL_MANAGEMENT_DETAIL_NEW',
  MODAL_MANAGEMENT_EXISTING: 'MODAL_MANAGEMENT_EXISTING',
  MODAL_MANAGEMENT_NEW: 'MODAL_MANAGEMENT_NEW',
  MODAL_SHAREHOLDER_DETAIL_EXISTING: 'MODAL_SHAREHOLDER_DETAIL_EXISTING',
  MODAL_SHAREHOLDER_DETAIL_NEW: 'MODAL_SHAREHOLDER_DETAIL_NEW',
  MODAL_SHAREHOLDER_EXISTING: 'MODAL_SHAREHOLDER_EXISTING',
  MODAL_SHAREHOLDER_NEW: 'MODAL_SHAREHOLDER_NEW',
  MODAL_TABLE_DEBTOR_NEW: 'MODAL_TABLE_DEBTOR_NEW',
};

export const shareholderTooltip = [
  'Nama diketik tanpa tipe institusi (PT/PEMKOT/PEMKAB/DLL)',
  'Nama lengkap tanpa singkatan',
  'Huruf kapital hanya di awal Nama',
  'Tanpa akhiran Persero / TBK',
  'Tanpa QQ atau atas nama selain Customer yang dibiayai',
  'Tanpa gelar depan dan belakang untuk persorangan'
];

export const payloadFilterList = (processId: string, filter?: any) => {
  if (processId?.includes('MAI')) {
    return {
      ...filter?.filter,
      bucketProcessId: processId,
    };
  } else {
    return {
      ...filter?.filter,
      debtorId: processId,
    };
  }
};
