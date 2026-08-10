import * as yup from 'yup';


export const notificationSchema = yup.object().shape({
  // description: yup.string().required('Description harus diisi'),
  // endDate: yup.date().required('End Date harus diisi'),
  endDateCOD: yup.date().notRequired(),
  // interval: yup.string().required('Interval harus diisi'),
  modifiedBy: yup.string().notRequired(),
  modifiedDate: yup.date().notRequired(),
  // startDate: yup.date().required('Start Date harus diisi'),
  startDateCOD: yup.date().notRequired(),
  statusProjectPhase: yup.string().notRequired(),
  // subject: yup.string().required('Subject harus diisi'),
});
