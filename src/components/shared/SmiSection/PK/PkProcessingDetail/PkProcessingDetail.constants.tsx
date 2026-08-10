export const tab = {
  TAB_1: 'TAB_1',
  TAB_2: 'TAB_2',
  TAB_3: 'TAB_3',
  TAB_4: 'TAB_4',
  TAB_5: 'TAB_5',
};

export const TAB_ITEMS_PK = [
  { label: 'Mapping Fasilitas', value: tab.TAB_1 },
  { label: 'PK Processing Type', value: tab.TAB_2 },
  { label: 'Validasi PK', value: tab.TAB_3 },
];
export const TAB_ITEMS_LS = [
  { label: 'Mapping Fasilitas', value: tab.TAB_1 },
  { label: 'PK Processing Type', value: tab.TAB_2 },
  { label: 'Asumsi Kualifikasi & Additional Info', value: tab.TAB_3 },
  { label: 'Lampiran & Draft Memo', value: tab.TAB_4 },
  { label: 'Validasi PK', value: tab.TAB_5 },
];


export const modal = {
  DETAIL: 'DETAIL',
  MODAL_PENANDATANGANAN: 'MODAL_PENANDATANGANAN',
};
export const assumptionPath = 'assumption-qualification-additional-information';

// ikutin balikan dari urlPathStepper
export const initialPathStep = [
  {
    tab: tab.TAB_1,
    urlPath: 'facility-overview',
  },
  {
    tab: tab.TAB_2,
    urlPath: 'edit',
  },
  {
    tab: tab.TAB_3,
    urlPath: 'assumption-qualification-additional-information',
  },
  {
    tab: tab.TAB_4,
    urlPath: 'draft-memo',
  },
  {
    tab: tab.TAB_5,
    urlPath: 'validation',
  },

];
