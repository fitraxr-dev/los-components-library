import * as Yup from 'yup';

// Dedicated schema for OtherCommonInformation
export const otherCommonInformationSchema = Yup.object().shape({
  anotherInformation: Yup.object().shape({
    coBorrowerStatus: Yup.string().oneOf(['yes', 'no'], 'invalid option').nullable(),
    detailRelation: Yup.object().shape({
      label: Yup.string().nullable(),
      value: Yup.string().required('required').nonNullable(),
    }).required('required').nonNullable(),
    generalAccountManager: Yup.object().shape({
      label: Yup.string().nullable(),
      value: Yup.string().required('required').nonNullable(),
    }).required('required').nonNullable(),
    isAffiliated: Yup.string().required('required').nonNullable(),
    modifiedBy: Yup.string().nullable(),
    modifiedDate: Yup.string().nullable(),
    relationInformation: Yup.string().required('required').nonNullable(),
    relationshipWithSmiSince: Yup.string().required('required').nonNullable(),
    rm: Yup.object().shape({
      label: Yup.string().nullable(),
      value: Yup.string().required('required').nonNullable(),
    }).required('required').nonNullable(),
    typeOfBusiness: Yup.string().required('required').nonNullable(),
    yearFounded: Yup.string().nullable(),
  }),
  coBorrowerStatus: Yup.string().oneOf(['yes', 'no'], 'invalid option').nullable(),
});
