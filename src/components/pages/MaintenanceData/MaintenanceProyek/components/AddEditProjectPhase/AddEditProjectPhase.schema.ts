import * as yup from 'yup';


export const addEditProjectPhaseSchema = yup.object().shape({
  id: yup.number().nullable(),
  projectPhase: yup.string().required('Project Phase is mandatory'),
  statusAsOf: yup.string().required('Status as Of is mandatory'),
});
