import * as yup from 'yup';


export const yupSchema = yup.lazy((values) => {
  const institutionType = values?.institutionType;
  const isIndividualOrPma = institutionType === 'INDIVIDUAL' || institutionType === 'PMA';

  return yup.object({
    firstNoNotaryDeed: yup.string().nullable().notRequired(),
    firstNoNotaryDeedFile: yup.object().shape({
      extension: yup.string().nullable(),
      file: yup.string().nullable().notRequired(),
      name: yup.string().nullable().notRequired(),
      url: yup.string().nullable().notRequired(),
    }),
    idDocFile: yup.object().shape({
      extension: yup.string().nullable(),
      file: yup.string().nullable().notRequired(),
      name: yup.string().nullable().notRequired(),
      url: yup.string().nullable().notRequired(),
    }).nullable().notRequired(),
    idNumber: yup.string().nullable().notRequired(),
    idType: yup.string().nullable().notRequired(),
    identityExpiry: yup.string().nullable().notRequired(),
    institutionType: yup.string().nullable().notRequired(),
    jobPosition: yup.string().nullable().notRequired(),
    lastModified: yup.string().nullable().notRequired(),
    lastNoNotaryDeed: yup.string().nullable().notRequired(),
    lastNoNotaryDeedFile: yup.object({
      extension: yup.string().nullable().notRequired(),
      file: yup.string().nullable().notRequired(),
      name: yup.string().nullable().notRequired(),
      url: yup.string().nullable().notRequired(),
    }).nullable().notRequired(),
    modifiedBy: yup.string().nullable().notRequired(),
    name: yup.object({
      fullName: yup.string().nullable().notRequired(),
      prefix: yup.string().nullable().notRequired(),
      suffix: yup.string().nullable().notRequired(),
    }).nullable().notRequired(),
    npwp: yup.string().nullable().notRequired(),
    npwpDocFile: yup.object({
      extension: yup.string().nullable().notRequired(),
      file: yup.string().nullable().notRequired(),
      name: yup.string().nullable().notRequired(),
      url: yup.string().nullable().notRequired(),
    }).nullable().notRequired(),
    refId: yup.string().nullable().notRequired(),
  });
});
