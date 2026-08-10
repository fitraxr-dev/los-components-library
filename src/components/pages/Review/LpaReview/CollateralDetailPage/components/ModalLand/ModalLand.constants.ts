import * as yup from 'yup';


export const landValidation = yup.object().shape({
  document: yup.object().notRequired(),
  documentNo: yup.string().max(25, 'Nomor Dokumen maksimal 25 karakter').notRequired(),
  documentType: yup.string().notRequired(),
  endDate: yup.string().notRequired(),
  id: yup.string().notRequired(),
  indicationLiquidationValue: yup.string().notRequired(),
  marketValue: yup.string().notRequired(),
  measuringLetterDate: yup.string().notRequired(),
  measuringLetterNo: yup.string().notRequired(),
  parentId: yup.string().notRequired(),
  publicationDate: yup.string().notRequired(),
  remark: yup.string().notRequired(),
  rightsHolders: yup.string().notRequired(),
  wide: yup.string().notRequired(),
});
