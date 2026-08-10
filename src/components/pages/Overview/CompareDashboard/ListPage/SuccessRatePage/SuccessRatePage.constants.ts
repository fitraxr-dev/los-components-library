export interface SuccessRateItem {
  name: string;
  divisi1: number;
  divisi2: number;
}

export interface SuccessRateGroup {
  category: string;
  items: SuccessRateItem[];
}

export const businessSuccessRateData: SuccessRateGroup[] = [
  {
    category: 'Keseluruhan Pengajuan',
    items: [
      { divisi1: 3, divisi2: 9, name: 'Pipeline' },
      { divisi1: 10, divisi2: 7, name: 'In Progress' },
      { divisi1: 23, divisi2: 11, name: 'Approve' },
      { divisi1: 5, divisi2: 5, name: 'Partial Efektif' },
      { divisi1: 15, divisi2: 10, name: 'Efektif Pembiayaan' },
      { divisi1: 1, divisi2: 5, name: 'Decline' },
    ],
  },
  {
    category: 'New Customer',
    items: [
      { divisi1: 3, divisi2: 9, name: 'Pipeline' },
      { divisi1: 10, divisi2: 7, name: 'In Progress' },
      { divisi1: 23, divisi2: 11, name: 'Approve' },
      { divisi1: 5, divisi2: 5, name: 'Partial Efektif' },
      { divisi1: 15, divisi2: 10, name: 'Efektif Pembiayaan' },
      { divisi1: 1, divisi2: 5, name: 'Decline' },
    ],
  },
  {
    category: 'Existing Customer',
    items: [
      { divisi1: 3, divisi2: 9, name: 'Pipeline' },
      { divisi1: 10, divisi2: 7, name: 'In Progress' },
      { divisi1: 23, divisi2: 11, name: 'Approve' },
      { divisi1: 5, divisi2: 5, name: 'Partial Efektif' },
      { divisi1: 15, divisi2: 10, name: 'Efektif Pembiayaan' },
      { divisi1: 1, divisi2: 5, name: 'Decline' },
    ],
  },
];

export const nonBusinessSuccessRateData: SuccessRateGroup[] = [
  {
    category: 'Kesuksuran Pengajuan',
    items: [
      { divisi1: 3, divisi2: 9, name: 'In Progress' },
      { divisi1: 10, divisi2: 7, name: 'Completed' },
      { divisi1: 23, divisi2: 11, name: 'Decline' },
    ],
  },
  {
    category: 'New Customer',
    items: [
      { divisi1: 3, divisi2: 9, name: 'In Progress' },
      { divisi1: 10, divisi2: 7, name: 'Completed' },
      { divisi1: 23, divisi2: 11, name: 'Decline' },
    ],
  },
  {
    category: 'Existing Customer',
    items: [
      { divisi1: 3, divisi2: 9, name: 'In Progress' },
      { divisi1: 10, divisi2: 7, name: 'Completed' },
      { divisi1: 23, divisi2: 11, name: 'Decline' },
    ],
  },
];
