import * as yup from 'yup';


export const getYupSchema = (isEdit: boolean) => {
  return yup.object({
    accessMenu: yup.object({
      id: yup.string().required('Menu Access is required').nonNullable(),
      label: yup.string().required('Menu Access is required').nonNullable(),
    }).required(),
    directorate: yup.object({
      id: yup.string().required('Directorate is required').nonNullable(),
      label: yup.string().required('Directorate is required').nonNullable(),
    }),
    division: yup.object({
      id: yup.string().required('Division is required').nonNullable(),
      label: yup.string().required('Division is required').nonNullable(),
    }),
    name: yup.string().required('Name is required'),
    nik: yup.lazy(() => yup.string().default('').when('nik', {
      is: (nik: string) => nik && nik.length > 0,
      otherwise: (schema) => schema.notRequired(),
      then: (schema) => schema.min(5, 'NIK must be minimum 5 characters'),
    })),
    position: yup.array().of(
      yup.string().required('Each item must be string')
    ).when('division', {
      is: (division: any) => division && division.id,
      then: (schema) => schema.min(1, 'At least have 1 position'),
    }),
    privyId: yup.string().notRequired(),
    processId: yup.string().notRequired(),
    proposalReference: yup.string().notRequired(),
    reason: yup.object({
      id: yup.string().nonNullable().required('Reason is required'),
      label: yup.string().nonNullable().required('Reason is required'),
    }),
    reportTo: yup.object({
      id: yup.string().nonNullable().required('Report To is required'),
      label: yup.string().nonNullable().required('Report To is required'),
    }).when('role', {
      is: (role) => role !== 'STAFF' && role !== 'TL',
      then: () => yup.object({
        id: yup.string().nullable().notRequired(),
        label: yup.string().nullable().notRequired(),
      }),
    }),
    role: yup.string().required('Role is required'),
    userGroup: yup.object().shape({
      id: yup.string().nonNullable().required('User Group is required'),
      label: yup.string().nonNullable().required('User Group is required'),
    }),
    userId: yup.string().notRequired(),
    userStatus: isEdit ? yup.string().required('Status User is requied') : yup.string().nullable().notRequired(),
  });
};

export const getNonMandatoryYupSchema = (isEdit: boolean) => {
  return yup.object({
    accessMenu: yup.object({
      id: yup.string().notRequired().nullable(),
      label: yup.string().notRequired().nullable(),
    }).notRequired().nullable(),
    directorate: yup.object({
      id: yup.string().notRequired().nullable(),
      label: yup.string().notRequired().nullable(),
    }).notRequired().nullable(),
    division: yup.object({
      id: yup.string().notRequired().nullable(),
      label: yup.string().notRequired().nullable(),
    }).notRequired().nullable(),
    name: yup.string().notRequired(),
    nik: yup.lazy(() => yup.string().default('').when('nik', {
      is: (nik: string) => nik && nik.length > 0,
      otherwise: (schema) => schema.notRequired(),
      then: (schema) => schema.min(5, 'NIK must be minimum 5 characters'),
    })),
    position: yup.array().of(
      yup.string().notRequired()
    ).notRequired(),
    privyId: yup.string().notRequired(),
    processId: yup.string().notRequired().nullable(),
    proposalReference: yup.string().notRequired(),
    reason: yup.object({
      id: yup.string().notRequired().nullable(),
      label: yup.string().notRequired().nullable(),
    }),
    reportTo: yup.object({
      id: yup.string().notRequired().nullable(),
      label: yup.string().notRequired().nullable(),
    }).notRequired().nullable(),
    role: yup.string().notRequired(),
    userGroup: yup.object().shape({
      id: yup.string().notRequired().nullable(),
      label: yup.string().notRequired().nullable(),
    }).notRequired().nullable(),
    userId: yup.string().notRequired(),
    userStatus: yup.string().notRequired(),
  });
};
