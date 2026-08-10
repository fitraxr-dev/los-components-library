import * as Yup from 'yup';


export const facilityFinancingFormSchema = Yup.object().shape({
  branch: Yup.string().nullable().notRequired(),
  condition: Yup.string().required('Kondisi harus diisi'),
  conditionDate: Yup.string().required('Tanggal Kondisi harus diisi'),
  conditionDesc: Yup.string().nullable().notRequired(),
  creditFinancingContract: Yup.string().required('Akad Pembiayaan harus diisi'),
  creditFinancingContractDesc: Yup.string().nullable().notRequired(),
  creditFinancingContractRemark: Yup.string().when('creditFinancingContract', {
    is: (val: string) => {
      return val === '999';
    },
    otherwise: (schema) => schema.nullable(),
    then: (schema) => schema.required('Akad Lainnya harus diisi'),
  }),
  creditFinancingNature: Yup.string().required('Sifat Kredit / Pembiayaan harus diisi'),
  creditFinancingNatureDesc: Yup.string().nullable().notRequired(),
  creditFinancingNatureRemark: Yup.string().when('creditFinancingNature', {
    is: (val: string) => {
      return val === '9';
    },
    otherwise: (schema) => schema.nullable(),
    then: (schema) => schema.required('Sifat Kredit atau Pembiayaan Lainnya harus diisi'),
  }),
  creditFinancingType: Yup.string().required('Jenis Pembiayaan harus diisi'),
  creditFinancingTypeDesc: Yup.string().nullable().notRequired(),
  creditFinancingTypeRemark: Yup.string().when('creditFinancingType', {
    is: (val: string) => {
      return val === 'P99' || val === 'N99';
    },
    otherwise: (schema) => schema.nullable(),
    then: (schema) => schema.required('Jenis Kredit atau Pembiayaan Lainnya harus diisi'),
  }),
  creditQuality: Yup.string().required('Kualitas harus diisi'),
  creditQualityDesc: Yup.string().nullable().notRequired(),
  currencyOutstanding: Yup.string().nullable().notRequired(),
  customerCategory: Yup.string().required('Kategori Customer harus diisi'),
  customerCategoryDesc: Yup.string().nullable().notRequired(),
  customerClasification: Yup.string().required('Sumber Dana harus diisi'),
  customerClasificationDesc: Yup.string().nullable().notRequired(),
  defaultReason: Yup.string().when('creditQuality', {
    is: (val: string) => {
      return val === '5';
    },
    otherwise: (schema) => schema.nullable(),
    then: (schema) => schema.required('Tanggal Macet harus diisi'),
  }),
  defaultReasonDesc: Yup.string().nullable().notRequired(),
  defaultReasonRemark: Yup.string().when('defaultReason', {
    is: (val: string) => {
      return val === '99';
    },
    otherwise: (schema) => schema.nullable(),
    then: (schema) => schema.required('Sebab Macet Lainnya harus diisi'),
  }),
  delinquencyDays: Yup.string().required('Jumlah Hari Tunggakan harus diisi'),
  economicSector: Yup.string().required('Sektor Ekonomi harus diisi'),
  economicSectorDesc: Yup.string().nullable().notRequired(),
  economicSectorRemark: Yup.string().when('economicSector', {
    is: (val: string) => {
      return val === '009000';
    },
    otherwise: (schema) => schema.nullable(),
    then: (schema) => schema.required('Sektor Ekonomi Lainnya harus diisi'),
  }),
  facilityAccountNumber: Yup.string().nullable().notRequired(),
  finalContractDate: Yup.string().nullable().notRequired(),
  finalContractNo: Yup.string().nullable().notRequired(),
  financingRate: Yup.string().required('Kredit / Pembiayaan harus diisi'),
  financingRateType: Yup.string().required('Jenis Suku Bunga / Imbalan harus diisi'),
  financingRateTypeDesc: Yup.string().nullable().notRequired(),
  financingRateTypeRemark: Yup.string().when('financingRateType', {
    is: (val: string) => {
      return val === '9';
    },
    otherwise: (schema) => schema.nullable(),
    then: (schema) => schema.required('Jenis Suku Bunga / Imbalan Lainnya harus diisi'),
  }),
  firstPlafond: Yup.string().nullable().notRequired(),
  govermentRate: Yup.string().required('Suku Bunga / Imbalan Pemerintah harus diisi'),
  govermentRateDesc: Yup.string().nullable().notRequired(),
  initialContractDate: Yup.string().nullable().notRequired(),
  initialContractNo: Yup.string().nullable().notRequired(),
  initialLoanStartDate: Yup.string().required('Tanggal Mulai harus diisi'),
  interestArrears: Yup.string().required('Tunggakan Bunga / Imbalan harus diisi'),
  latePaymentFrequency: Yup.string().required('Frekuensi Tunggakan harus diisi'),
  loanStartDate: Yup.string().required('Tanggal Awal Kredit / Pembiayaan harus diisi'),
  maturityDate: Yup.string().nullable().notRequired(),
  modifiedBy: Yup.string().nullable().notRequired(),
  modifiedDate: Yup.string().nullable().notRequired(),
  nplDate: Yup.string().when('creditQuality', {
    is: (val: string) => {
      return val === '5';
    },
    otherwise: (schema) => schema.nullable(),
    then: (schema) => schema.required('Tanggal Macet harus diisi'),
  }),
  orientationOfUsage: Yup.string().required('Orientasi Penggunaan harus diisi'),
  orientationOfUsageDesc: Yup.string().nullable().notRequired(),
  orientationOfUsageRemark: Yup.string().when('orientationOfUsage', {
    is: (val: string) => {
      return val === '3';
    },
    otherwise: (schema) => schema.nullable(),
    then: (schema) => schema.required('Orientasi Penggunaan Lainnya harus diisi'),
  }),
  osPrincipal: Yup.string().required('Baki Debet harus diisi'),
  penaltyEt: Yup.string().required('Denda harus diisi'),
  plafon: Yup.string().required('Plafon harus diisi'),
  principalArrears: Yup.string().required('Tunggakan Pokok harus diisi'),
  realitationValue: Yup.string().required('Realisasi atau Pencairan Bulan Berjalan harus diisi'),
  regionCode: Yup.string().required('Lokasi Proyek harus diisi'),
  regionCodeDesc: Yup.string().nullable().notRequired(),
  regionCodeRemark: Yup.string().when('regionCode', {
    is: (val: string) => {
      return val === '0000';
    },
    otherwise: (schema) => schema.nullable(),
    then: (schema) => schema.required('Lokasi Proyek Lainnya harus diisi'),
  }),
  remark: Yup.string().nullable().notRequired(),
  renewalFrequency: Yup.string().required('Frekuensi Perpanjangan Fasilitas Kredit dan Pembiayaan harus diisi'),
  restructureFirstDate: Yup.string().required('Tanggal Restrukturisasi Awal harus diisi'),
  restructureFrequency: Yup.string().required('Frekuensi Restrukturisasi harus diisi'),
  restructureLastDate: Yup.string().required('Tanggal Restrukturisasi Akhir harus diisi'),
  restructureMethode: Yup.string().required('Cara Restrukturisasi harus diisi'),
  restructureMethodeDesc: Yup.string().nullable().notRequired(),
  sourceCurrencyAmount: Yup.string().nullable().notRequired(),
  takeoverSource: Yup.string().required('Asal Kredit harus diisi'),
  takeoverSourceDesc: Yup.string().nullable().notRequired(),
  typeOfUsage: Yup.string().required('Jenis Penggunaan harus diisi'),
  typeOfUsageDesc: Yup.string().nullable().notRequired(),
  valuta: Yup.string().required('Valuta harus diisi'),
  valutaDesc: Yup.string().nullable().notRequired(),
});
