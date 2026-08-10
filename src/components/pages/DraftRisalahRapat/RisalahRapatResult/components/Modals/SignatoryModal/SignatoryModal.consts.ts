import * as yup from 'yup';


export const validationScheme = yup.object({
  directorForm: yup.object({
    data: yup.object({
      division: yup.array().of(
        yup.object().shape({
          directorate: yup.object().shape({
            directorateCode: yup.string(),
            name: yup.string(),
          }),
          divisionCode: yup.string(),
          name: yup.string(),
        })),
      fullName: yup.string(),
      roleRefactor: yup.object({
        name: yup.string(),
      }),
      userId: yup.string(),
    }).nullable().default(null).required('User Tidak Boleh Kosong'),
    directorate: yup.object().shape({
      id: yup.string(),
      label: yup.string(),
    }),
    division: yup.object({ id: yup.string().default(null), label: yup.string().default(null) }).nullable().default(null).required('Divisi Tidak Boleh Kosong'),
    fullName: yup.string(),
    role: yup.object().shape({
      id: yup.string(),
      label: yup.string(),
    }).required('Roles Tidak Boleh Kosong'),
  }),
  skuForm: yup.object({
    data: yup.object({
      division: yup.array().of(
        yup.object().shape({
          directorate: yup.object().shape({
            directorateCode: yup.string(),
            name: yup.string(),
          }),
          divisionCode: yup.string(),
          name: yup.string(),
        })),
      fullName: yup.string(),
      roleRefactor: yup.object({
        name: yup.string(),
      }),
      userId: yup.string(),
    }).nullable().default(null).when('$hasSKU', {
      is: (val: boolean) => val === true,
      otherwise: (schema) => schema.nullable(),
      then: (schema) => schema.required('Nama Tidak Boleh Kosong'),
    }),
    date: yup.string().nullable().default(null).when('$hasSKU', {
      is: (val: boolean) => val === true,
      otherwise: (schema) => schema.nullable(),
      then: (schema) => schema.required('Tanggal Tidak Boleh Kosong'),
    }),
    directorate: yup.object({ id: yup.string().default(null), label: yup.string().default(null) }).nullable().default(null).when('$hasSKU', {
      is: (val: boolean) => val === true,
      otherwise: (schema) => schema.nullable(),
      then: (schema) => schema.required('Direktorat Tidak Boleh Kosong'),
    }),
    division: yup.object({ id: yup.string().default(null), label: yup.string().default(null) }).nullable().default(null).when('$hasSKU', {
      is: (val: boolean) => val === true,
      otherwise: (schema) => schema.nullable(),
      then: (schema) => schema.required('Division Tidak Boleh Kosong'),
    }),
    fullName: yup.string().when('$hasSKU', {
      is: (val: boolean) => val === true,
      otherwise: (schema) => schema.nullable(),
      then: (schema) => schema.nullable(),
    }),
    number: yup.string().nullable().default(null).when('$hasSKU', {
      is: (val: boolean) => val === true,
      otherwise: (schema) => schema.nullable(),
      then: (schema) => schema.required('Nomor SKU Tidak Boleh Kosong'),
    }),
  }),
});
