import * as yup from 'yup';


export const facilityDataDetailSchema = yup.object().shape({
  availabilityPeriod: yup.string().when('availabilityPeriodBy', {
    is: (val: string) => { return val === 'DATE';},
    otherwise: (schema) => schema.nullable().notRequired(),
    then: (schema) => schema.required('Availability Period harus diisi'),
  }),
  availabilityPeriodBy: yup.string().required('Availability Period By harus diisi'),
  availabilityPeriodEndDate: yup.string().when('availabilityPeriodBy', {
    is: (val: string) => { return val === 'DATE';},
    otherwise: (schema) => schema.nullable().notRequired(),
    then: (schema) => schema.required('Availability Period End Date harus diisi'),
  }),
  availabilityPeriodStartDate: yup.string().notRequired().nullable(),
  baseRate: yup.string().notRequired().nullable(),
  billingHoliday: yup.string().required('Billing Holiday harus diisi'),
  commitmentFeeMethod: yup.string().required('Commitment Fee Method harus diisi'),
  dayPerYear: yup.string().required('Day Per Year harus diisi'),
  decimalRounded: yup.string().notRequired().nullable(),
  effectiveRate: yup.string().required('Effective Rate harus diisi'),
  endDatePenaltyET: yup.string().when('penaltyET', {
    is: (val: string) => Number(val) > 0,
    otherwise: (schema) => schema.nullable().notRequired(),
    then: (schema) => schema.required('End Date Penalty ET harus diisi'),
  }),
  facilityMaturityDate: yup.string().required('Facility Maturity Date harus diisi'),
  facilityStartDate: yup.string().notRequired().nullable(),
  financingType: yup.string().notRequired().nullable(),
  installmentType: yup.string().required('Installment Type harus diisi'),
  interestGraceperiod: yup.string().required('Interest Grace Period harus diisi'),
  interestPaymentInterval: yup.string().required('Interest Payment Interval harus diisi')
    .test(
      'check-interval',
      'Interest Payment Interval tidak boleh lebih dari Principal Payment Interval',
      function (value, context) {
        const { principalPaymentInterval } = this.parent;
        const interestPayinter = context.options.context?.interestPayinter;
        const principalPayinter = context.options.context?.principalPayinter;

        if (!value || !principalPaymentInterval || !interestPayinter || !principalPayinter) return true;

        const interestVal2 = interestPayinter
          .find((item: any) => String(item.value) === String(value))?.value2;
        const principalVal2 = principalPayinter
          .find((item: any) => String(item.value) === String(principalPaymentInterval))?.value2;

        if (interestVal2 !== undefined && principalVal2 !== undefined &&
            interestVal2 !== null && principalVal2 !== null) {
          return Number(interestVal2) <= Number(principalVal2);
        }
        return true;
      }
    ),
  interestRateReference: yup.string().required('Interest Rate Refference harus diisi'),
  interestRateType: yup.string().required('Interest Rate Type harus diisi'),
  // interestReviewPeriod: yup.string().notRequired(),
  interestType: yup.string().required('Interest Type harus diisi'),
  latePaymentPenalty: yup.string().required('Late Payment Penalty harus diisi'),
  latePaymentPenaltyMethod: yup.string().required('Late Payment Penalty Method harus diisi'),
  // startDateType: yup.string().required('Start Date Type harus diisi'),
  // marginPenalty: yup.string().notRequired(),
  marginRate: yup.string().required('Margin Rate harus diisi'),
  modifiedBy: yup.string().notRequired().nullable(),
  modifiedDate: yup.string().notRequired().nullable(),
  partialPrepaymentMethod: yup.string().required('Partial Prepayment Method harus diisi'),
  paymentDate: yup.string().required('Payment Date harus diisi'),
  penaltyET: yup.string().required('Penalty ET harus diisi'),
  penaltyRateType: yup.string().required('Penalty Rate Type harus diisi'),
  principalGraceperiod: yup.string().when('principalGraceperiodBy', {
    is: (val: string) => { return val === 'DATE';},
    otherwise: (schema) => schema.nullable().notRequired(),
    then: (schema) => schema.required('Principal Grace Period harus diisi'),
  }),
  principalGraceperiodBy: yup.string().required('Principal Grace Period By harus diisi'),
  principalGraceperiodEndDate: yup.string().when('principalGraceperiodBy', {
    is: (val: string) => { return val === 'DATE';},
    otherwise: (schema) => schema.nullable().notRequired(),
    then: (schema) => schema.required('Principal Grace Period harus diisi'),
  }),
  principalPaymentInterval: yup.string().required('Principal Payment Interval harus diisi'),
  sourceOfFund: yup.string().required('Source Of Fund harus diisi'),
  startDatePenaltyET: yup.string().when('penaltyET', {
    is: (val: string) => Number(val) > 0,
    otherwise: (schema) => schema.nullable().notRequired(),
    then: (schema) => schema.required('Start Date Penalty ET harus diisi'),
  }),
  startDateType: yup.string().required('Start Date Type harus diisi'),
  tenor: yup.string().required('Tenor harus diisi'),
});
