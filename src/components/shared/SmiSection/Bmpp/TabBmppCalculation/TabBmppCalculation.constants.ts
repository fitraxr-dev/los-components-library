import * as yup from 'yup';


export const calculateSchema = yup.object().shape({
  debtorRating: yup.string().required('This field is required').notOneOf(['-'], 'This field is required'),
  debtorType: yup.string().required('This field is required').notOneOf(['-'], 'This field is required'),
  group: yup.string().nullable(),
  isRelation: yup.boolean().required('This field is required'),
  remarks: yup.string(),
});

export const calculateSchemaPemda = yup.object().shape({
  debtorRating: yup.string().required('This field is required').notOneOf(['-'], 'This field is required'),
  debtorType: yup.string(),
  group: yup.string().nullable(),
  isRelation: yup.boolean().required('This field is required'),
  remarks: yup.string(),
});

export const mockTableData = [
  {
    detail: 'Detail 1',
    value: '2000',
  },
  {
    detail: 'Detail 2',
    value: '2000',
  },
];

export const bgColorBabyBlue = [
  'EXISTING_FACILITY_DEBTOR',
  'EXISTING_FACILITY_GROUP',
  'PROPOSAL_FACILITY_DEBTOR',
  'PROPOSAL_FACILITY_GROUP',
  'COMPREHENSIVE_PROPOSAL_PLAN_DEBTOR',
  'COMPREHENSIVE_PROPOSAL_PLAN_GROUP',
  'LEEWAY_DEBTOR_PROPOSAL_PLAN',
  'LEEWAY_GROUP_PROPOSAL_PLAN',
  'PERCENTAGE_DEBTOR_PROPOSAL_PLAN',
  'PERCENTAGE_GROUP_PROPOSAL_PLAN',
  'PERCENTAGE_GROUP',
  'PERCENTAGE_DEBTOR',
  'LEEWAY_GROUP',
  'LEEWAY_DEBTOR'];

export const bgColorBlue = [
  'EXISTING_FACILITY_TOTAL',
  'PROPOSAL_FACILITY_TOTAL'];

export const bgColorDarkBlue = ['TOTAL_FACILITIES', 'CAPITAL', 'COMPREHENSIVE_PROPOSAL_PLAN_TOTAL'];
