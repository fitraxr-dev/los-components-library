import * as Yup from 'yup';


export const apoloSchema = Yup.object().shape({
  businessCategory: Yup.string().required('Kode Bidang Usaha harus diisi'),
  businessCategoryDescription: Yup.string().required('Deskripsi Bidang Usaha harus diisi'),
  country: Yup.string().required('Kode Negara harus diisi'),
  countryDesc: Yup.string().nullable().notRequired(),
  economicSector: Yup.string().required('Kode Sektor Ekonomi Lapangan Usaha harus diisi'),
  economicSectorDescription: Yup.string().required('Deskripsi Sektor Ekonomi Lapangan Usaha harus diisi'),
  economicSectorRemark: Yup.string().nullable().notRequired(),
  financeCategory: Yup.string().required('Kode Kategori Sustainable Finance harus diisi'),
  financeCategoryDescription: Yup.string().required('Deskripsi Kategori Sustainable Finance harus diisi'),
  financingObject: Yup.string().required('Kode Objek Pembiayaan harus diisi'),
  financingObjectDescription: Yup.string().required('Deskripsi Objek Pembiayaan harus diisi'),
  financingObjectRemark: Yup.string().nullable().notRequired(),
  financingType: Yup.string().required('Jenis Pembiayaan harus diisi'),
  groupCustomerCode: Yup.string().required('Kode Golongan Customer harus diisi'),
  groupCustomerDescription: Yup.string().nullable().notRequired(),
  modifiedBy: Yup.string().nullable(),
  modifiedDate: Yup.string().nullable(),
  projectCity: Yup.string().required('Kode Lokasi Proyek harus diisi'),
  projectCityDescription: Yup.string().required('Deskripsi Lokasi Proyek harus diisi'),
  projectCityRemark: Yup.string().nullable().notRequired(),
  relatedPartyRelationship: Yup.string().required('Kode Hubungan Pihak Terkait harus diisi'),
  relatedPartyRelationshipDescription: Yup.string().required('Deskripsi Hubungan Pihak Terkait harus diisi'),
  relatedStatus: Yup.string().required('Kode Status Keterikatan harus diisi'),
  relatedStatusDescription: Yup.string().required('Deskripsi Status Keterikatan harus diisi'),
});
