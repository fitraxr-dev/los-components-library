import * as Yup from 'yup';


export const tab = {
  INFORMASISINDIKASI: 'informasiSindikasi',
  LAINNYA: 'lainnya',
  PROJECT: 'project',
};

export const TAB_ITEMS = [
  { label: 'Project', value: tab.PROJECT },
  { label: 'Informasi Sindikasi', value: tab.INFORMASISINDIKASI },
  { label: 'Lainnya', value: tab.LAINNYA },
];

export interface InformationProps {
  type: 'add' | 'edit' | 'viewOnly';
}

export enum COMPONENT_TYPE {
  ADD = 'add',
  EDIT = 'edit',
  VIEWONLY = 'viewOnly'
}

export const schema = Yup.object().shape({
  accountAgent: Yup.string().notRequired(),
  accountOfficer: Yup.string().notRequired(),
  accountOfficerDivision: Yup.string().notRequired(),
  alamat: Yup.string().notRequired(),
  amount: Yup.string().notRequired(),
  effectiveDate: Yup.string().notRequired(),
  exchangeRate: Yup.object().shape({
    currency: Yup.string().notRequired(),
    value: Yup.number()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === '' ? null : value;
      })
      .notRequired(),
  }).notRequired(),
  facilityAgent: Yup.string().notRequired(),
  facilityId: Yup.string().notRequired(),
  idProject: Yup.string().notRequired(),
  kategoriProject: Yup.string().notRequired(),
  keterangan: Yup.string().notRequired(),
  klasifikasiProject: Yup.string().notRequired(),
  kodeCabang: Yup.string().notRequired(),
  lastModified: Yup.string().notRequired(),
  lembagaKeuangan: Yup.string().notRequired(),
  lokasiProjectKecamatan: Yup.string().notRequired(),
  lokasiProjectKelurahan: Yup.string().notRequired(),
  lokasiProjectKotaKabupaten: Yup.string().notRequired(),
  lokasiProjectProvinsi: Yup.string().notRequired(),
  modifiedBy: Yup.string().notRequired(),
  namaProject: Yup.string().notRequired(),

  nilaiProject: Yup.object().shape({
    currency: Yup.string().notRequired(),
    value: Yup.number()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === '' ? null : value;
      })
      .notRequired(),
  }).notRequired(),
  nilaiProjectDalamRp: Yup.object().shape({
    currency: Yup.string().notRequired(),
    value: Yup.number()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === '' ? null : value;
      })
      .notRequired(),
  }).notRequired(),
  nomorAkadAkhir: Yup.string().notRequired(),
  nomorAkadAwal: Yup.string().notRequired(),
  outputProject: Yup.string().notRequired(),
  pemberianPembiayaan: Yup.string().notRequired(),
  penjaminan: Yup.string().notRequired(),

  postalCode: Yup.string().notRequired(),
  programDariSourceFund: Yup.string().notRequired(),
  projectDescription: Yup.string().notRequired(),
  projectEndDate: Yup.string().notRequired(),
  projectStartDate: Yup.string().notRequired(),
  remarksSourceFund: Yup.string().notRequired(),
  satuanOutputProject: Yup.string().notRequired(),
  securityAgent: Yup.string().notRequired(),
  sektorYangDibiayai: Yup.string().notRequired(),
  sindikasi: Yup.string().notRequired(),
  sourceFund: Yup.string().notRequired(),
  statusProjectPhase: Yup.string().notRequired(),
  tanggalAkadAkhir: Yup.string().notRequired(),
  tanggalAkadAwal: Yup.string().notRequired(),
});
