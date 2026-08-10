import * as yup from 'yup';


export const EditProcessSLAModalSchema = yup.object().shape({
  groupDivision: yup.string(),
  isActive: yup.boolean(),
  process: yup.string(),
  slaDeadline: yup
    .number()
    .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value))
    .nullable()
    .required('SLA Deadline harus diisi'),
  stage: yup.string(),
});
