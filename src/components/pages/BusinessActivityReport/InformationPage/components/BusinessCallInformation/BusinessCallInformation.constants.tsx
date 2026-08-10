import * as Yup from 'yup';


export const schema = Yup.object().shape({
  businessCallType: Yup.string().when('$isNew', {
    is: (val: boolean) => val === false,
    otherwise: (schema) => schema.nullable().notRequired(),
    then: (schema) => schema.required('Business call is required'),
  }),
  callDate: Yup.string().when('$isNew', {
    is: (val: boolean) => val === false,
    otherwise: (schema) => schema.nullable().notRequired(),
    then: (schema) => schema.required('Call date is required'),
  }),

  callTime: Yup.string().when('$isNew', {
    is: (val: boolean) => val === false,
    otherwise: (schema) => schema.nullable().notRequired(),
    then: (schema) => schema.required('Call time is required'),
  }),

  checklist: Yup.array(),

  clientRepresentative: Yup.array().of(
    Yup.object().when('$isNew', {
      is: (val: boolean) => val === false,
      otherwise: (schema) => schema.nullable().notRequired(),
      then: (schema) => schema.shape({
        name: Yup.string().required('Name is required'),
        position: Yup.object().shape({
          id: Yup.string().required('Position is required').nonNullable(),
          label: Yup.string().required('Position is required').nonNullable(),
        }).required('Position is required'),
      }),
    }),
  ),

  debtorId: Yup.string().notRequired(),

  debtorStatus: Yup.string().nullable().notRequired(),

  group: Yup.object().shape({
    id: Yup.string().default('').notRequired(),
    label: Yup.string().default('').notRequired(),
  }).nullable().notRequired(),

  institution: Yup.string().required('Institution is required').nullable(),

  isNewClient: Yup.boolean(),

  media: Yup.string().when('$isNew', {
    is: (val: boolean) => val === false,
    otherwise: (schema) => schema.nullable().notRequired(),
    then: (schema) => schema.default('').required('Media is required'),
  }),

  mediaOther: Yup.string().when('$isNew', {
    is: (val: boolean) => val === false,
    otherwise: (schema) => schema.nullable().notRequired(),
    then: (schema) => schema.when('media', {
      is: (val: string) => val === 'OTHER',
      otherwise: (schema) => schema.nullable().notRequired(),
      then: (schema) => schema.required('Sector is required'),
    }),
  }),

  name: Yup.string().when(
    '$isExistingDebtor', ([flag], schema) => flag ? schema.nullable() : schema.required('Required')
  ).test(
    'debtorName', 'Nama Customer minimal terdiri atas 3 karakter.', (value) => value?.length >= 3
  ).test(
    'debtorName', 'Nama Customer memiliki kapital pada huruf pertama', (value) => value?.charAt(0) === value?.charAt(0).toUpperCase()
  ).test(
    'debtorName', 'Nama Customer tidak memiliki akhiran Persero/TBK', (value) => !value?.match(/(PERSERO|TBK)\s*$/i)
  ).test(
    'debtorName', 'Nama Customer ditulis tanpa tipe institusi (PT/PEMKAB/PEMKOT/DLL)', (value) => !/^PT|^PEMKAB|^PEMKOT/i.test(value)
  ),

  other: Yup.string().when('debtorName', {
    is: (val: string) => val === 'OTHERS',
    otherwise: (schema) => schema.nullable(),
    then: (schema) => schema.required('Required').test(
      'debtorNameOthers', 'Nama Customer minimal terdiri atas 3 karakter.', (value, context) => value?.length >= 3
    ),
  }),

  sector: Yup.object().when('$isNew', {
    is: (val: boolean) => val === false,
    otherwise: (schema) => schema.nullable().notRequired(),
    then: (schema) => schema.shape({
      id: Yup.string().default('').required('Sector is required'),
      label: Yup.string().default('').required('Sector is required'),
    }),
  }),

  sectorOther: Yup.string().when('$isNew', {
    is: (val: boolean) => val === false,
    otherwise: (schema) => schema.nullable().notRequired(),
    then: (schema) => schema.when('sector.id', {
      is: (val: string) => val === 'OTHER',
      otherwise: (schema) => schema.nullable().notRequired(),
      then: (schema) => schema.required('Sector is required'),
    }),
  }),

  smiRepresentative: Yup.array().of(
    Yup.object().when('$isNew', {
      is: (val: boolean) => val === false,
      otherwise: (schema) => schema.nullable().notRequired(),
      then: (schema) => schema.shape({
        division: Yup.object().shape({
          id: Yup.string().required('Division is required').nonNullable(),
          label: Yup.string().required('Division is required').nonNullable(),
        }).required('Division is required'),
        person: Yup.object().shape({
          id: Yup.string().required('Person is required').nonNullable(),
          label: Yup.string().required('Person is required').nonNullable(),
        }).required('Person is required'),
        position: Yup.object().shape({
          id: Yup.string(),
          label: Yup.string(),
        }),
        userId: Yup.string(),
      }),
    }),
  ),


  summaryAlert: Yup.string().when('$isNew', {
    is: (val: boolean) => val === false,
    otherwise: (schema) => schema.nullable().notRequired(),
    then: (schema) => schema.trim().required('Summary is required'),
  }),

});

export type BusinessCallInformationProps = {
  handleChangeTab: () => void;
}
