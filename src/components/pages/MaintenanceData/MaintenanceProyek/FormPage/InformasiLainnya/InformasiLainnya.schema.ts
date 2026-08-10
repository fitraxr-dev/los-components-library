import * as yup from 'yup';


export const informasiLainnyaSchema = yup.object().shape({
  bucketProcessId: yup.string().nullable(),
  contractor: yup.object().nullable(),
  id: yup.string().nullable(),
  otherInformation: yup.object().shape({
    // mandatory
    exchangeRateSourceOfFund: yup.object().shape({
      currency: yup.string().required('Exchange Rate Currency is mandatory'),
      value: yup.number()
        .nullable()
        .transform((value, originalValue) => {
          return originalValue === '' ? null : value;
        })
        .required('Exchange Rate Value Wajib Diisi'),
    }).required('Exchange Rate Source of Fund information is mandatory'),

    modifiedBy: yup.string().nullable(),
    modifiedDate: yup.string().nullable(),

    // Conditional validation for others field
    others: yup.string()
      .nullable()
      .when('programSourceOfFund', {
        is: 'OTHERS',
        otherwise: (schema) => schema.nullable(),
        then: (schema) => schema.required('Others field is required when Program Source of Fund is Others'),
      }),

    physicalRealization: yup.string().required('Physical Realization is mandatory'),

    // Conditional validation for physicalRealizationOthers
    physicalRealizationOthers: yup.string()
      .nullable()
      .when('physicalRealization', {
        is: 'OTHERS',
        otherwise: (schema) => schema.nullable(),
        then: (schema) => schema.required('Physical Realization Others is required when Physical Realization is Others'),
      }),

    programSourceOfFund: yup.string().required('Program Source of Fund is mandatory'),
    projectSourceOfFund: yup.string().required('Project Source of Fund is mandatory'),
    remarkSourceOfFund: yup.string().required('Remark Source of Fund is mandatory'),

    valueInIdr: yup.object().shape({
      currency: yup.string().required('Value in IDR Currency is mandatory'),
      value: yup.number()
        .nullable()
        .transform((value, originalValue) => {
          return originalValue === '' ? null : value;
        })
        .required('Value in IDR is mandatory'),
    }).required('Value in IDR information is mandatory'),

    valueSourceOfFund: yup.object().shape({
      currency: yup.string().required('Currency is mandatory'),
      value: yup.number()
        .nullable()
        .transform((value, originalValue) => {
          return originalValue === '' ? null : value;
        })
        .required('Value Wajib Diisi'),
    }).required('Value Source of Fund information is mandatory'),
  }).required('Other Information is mandatory'),
  owner: yup.object().nullable(),
  projectInformation: yup.object().nullable(),
});
