export interface ProgressRateItem {
  name: string;
  divisi1: number;
  divisi2: number;
}

export interface ProgressRateGroup {
  length: number;
  items: ProgressRateItem[];
  total1: number;
  total2: number;
}

export const businessProgressRateData: ProgressRateGroup = {
  items: [
    { divisi1: 234, divisi2: 67, name: 'Pipeline' },
    { divisi1: 34, divisi2: 45, name: 'MIP' },
    { divisi1: 87, divisi2: 123, name: 'Annual Review' },
    { divisi1: 67, divisi2: 243, name: 'MIP Review' },
    { divisi1: 0, divisi2: 67, name: 'MIR Review' },
    { divisi1: 67, divisi2: 46, name: 'MIR' },
    { divisi1: 123, divisi2: 0, name: 'MUR' },
    { divisi1: 21, divisi2: 123, name: 'MUP' },
    { divisi1: 46, divisi2: 436, name: 'SPFP' },
    { divisi1: 435, divisi2: 647, name: 'Risalah Rapat' },
    { divisi1: 56, divisi2: 234, name: 'Perikatan Pembiayaan' },
    { divisi1: 123, divisi2: 435, name: 'Loan Processing Summary - BAST' },
    { divisi1: 0, divisi2: 87, name: 'Loan Processing Summary - Core' },
  ],
  length: 0,
  total1: 1193,
  total2: 2353,
};

export const dpopProgressRateData: ProgressRateGroup = {
  items: [
    { divisi1: 12, divisi2: 12, name: 'Credit Checking' },
    { divisi1: 24, divisi2: 24, name: 'APJJ PPT/Pengkinian Data' },
    { divisi1: 30, divisi2: 30, name: 'LPA' },
    { divisi1: 10, divisi2: 10, name: 'Compliance Check' },
    { divisi1: 5, divisi2: 5, name: 'Loan Processing Summary' },
  ],
  length: 0,
  total1: 81,
  total2: 81,
};

export const depiProgressRateData: ProgressRateGroup = {
  items: [
    { divisi1: 12, divisi2: 12, name: 'Rating Process & Review Kelayakan' },
    { divisi1: 24, divisi2: 24, name: 'Kajian Pembayaran Khusus' },
    { divisi1: 30, divisi2: 30, name: 'Re-rating' },
  ],
  length: 0,
  total1: 66,
  total2: 66,
};
