import * as Yup from 'yup';


export const schema = Yup.object().shape({
  accountOfficer: Yup.string().notRequired(),
  accountOfficerDivision: Yup.string().notRequired(),
  branchCode: Yup.string().notRequired(),
  childFacilityId: Yup.string().notRequired(),
  description: Yup.string().notRequired(),
  division: Yup.string().notRequired(),
  effectiveDate: Yup.string().notRequired(),
  facilityId: Yup.number().notRequired(),
  facilityNo: Yup.string().notRequired(),
  finalContractDate: Yup.string().notRequired(),
  finalContractNumber: Yup.string().notRequired(),
  guarantee: Yup.string().notRequired(),
  initialContractDate: Yup.string().notRequired(),
  initialContractNumber: Yup.string().notRequired(),
  modifiedBy: Yup.string().notRequired(),
  modifiedDate: Yup.string().notRequired(),
  otherSourceOfFund: Yup.string().when('programSourceOfFund', {
    is: (val: string) => val === 'Others',
    otherwise: (schema) => schema.nullable().notRequired(),
    then: (schema) => schema.required('Other Program Source of Fund is Required'),
  }),
  programSourceOfFund: Yup.string().notRequired(),
  providingFinancing: Yup.string().notRequired(),
  relationshipManager: Yup.string().notRequired(),
  remarkSourceOfFund: Yup.string().notRequired(),
  sourceOfFund: Yup.string().notRequired(),
});
