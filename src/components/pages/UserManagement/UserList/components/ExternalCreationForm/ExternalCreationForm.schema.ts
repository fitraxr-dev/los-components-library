import * as yup from 'yup';


export const getYupSchema = (isEdit: boolean) => {
  return yup.object().shape({
    accessMenu: yup.object({
      id: yup.string().required('Menu Access is required').nonNullable().defined(),
      label: yup.string().required('Menu Access is required').nonNullable().defined(),
    }).required().defined(),
    expiredDate: yup.string().required('Expired Date is required'),
    institute: yup.string().required('Instansi is required'),
    name: yup.string().required('Nama is required').nonNullable(),
    position: yup.array().of(
      yup.string().required('Each item must be string')
    ).when('role', {
      is: (role) => role,
      then: (schema) => schema.min(1, 'Position is required'),
    }),
    processId: yup.string(),
    proposalReference: yup.string(),
    reason: isEdit ? yup.object({
      id: yup.string().nonNullable().required('Reason is required'),
      label: yup.string().nonNullable().required('Reason is required'),
    }) : yup.string().required('Reason is required'),
    role: yup.string().required('Role is required'),
    userGroup: yup.object().shape({
      id: yup.string().nonNullable().required('User Group is required').defined(),
      label: yup.string().nonNullable().required('User Group is required').defined(),
    }),
    userId: yup.string(),
    userStatus: yup.string(),
    userType: yup.string(),
  });
};

export const getYupSchemaNonMandatory = (isEdit: boolean) => {
  return yup.object().shape({
    accessMenu: yup.object({
      id: yup.string().notRequired().nullable(),
      label: yup.string().notRequired().nullable(),
    }).required().defined(),
    expiredDate: yup.string().notRequired(),
    institute: yup.string().notRequired(),
    name: yup.string().notRequired(),
    position: yup.array().of(
      yup.string().notRequired()
    ).notRequired(),
    processId: yup.string().nullable(),
    proposalReference: yup.string(),
    reason: yup.object({
      id: yup.string().nullable().notRequired(),
      label: yup.string().nullable().notRequired(),
    }),
    role: yup.string().notRequired(),
    userGroup: yup.object().shape({
      id: yup.string().nullable().notRequired(),
      label: yup.string().nullable().notRequired(),
    }),
    userId: yup.string(),
    userStatus: yup.string(),
    userType: yup.string(),
  });
};
