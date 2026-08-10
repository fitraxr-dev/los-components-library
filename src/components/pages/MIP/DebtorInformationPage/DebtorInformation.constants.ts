import * as yup from 'yup';


export const modal = {
  GROUP_BUSINESS: 'GROUP_BUSINESS',
  REQUEST_OTHER_PROCESS: 'REQUEST_OTHER_PROCESS',
};

const createCurrencyValidation = () =>
  yup
    .object({
      currency: yup.string().nullable(),
      value: yup
        .string()
        .nullable()
        .notRequired(),
    }).notRequired();


export const initialFormValues = {
  debtor: {
    contactPerson: '',
    debtorName: '',
    debtorType: '',
    isAffiliate: false,
    isGroup: false,
    isRelatedToSmi: '',
    position: {
      label: '',
      value: '',
    },
    relationshipSince: '',
    sectorName: '',
    yearFounded: '',
  },
  description: '',
  financingType: '',
  performanceFinancial: {
    assets: {
      currency: '',
      value: '',
    },
    ebitda: {
      currency: '',
      value: '',
    },
    equity: {
      currency: '',
      value: '',
    },
    income: {
      currency: '',
      value: '',
    },
    liability: {
      currency: '',
      value: '',
    },
    netProfit: {
      currency: '',
      value: '',
    },
    performanceFinancialDate: '',
  },
  processType: '',
  requestType: '',
};

export const debtorInformationSchema = yup.object({
  debtor: yup.object({
    contactPerson: yup.string().nullable(),
    debtorName: yup.string().nullable(),
    isAffiliate: yup.boolean().nullable(),
    isGroup: yup.boolean().nullable(),
    position: yup.object().shape({
      label: yup.string().nullable(),
      value: yup.string().nullable(),
    }).nullable(),
    relationshipSince: yup.string().nullable(),
    sectorName: yup.string().nullable(),
    yearFounded: yup.string().nullable(),
  }),
  description: yup.string().nullable(),
  financingType: yup.string().nullable(),
  performanceFinancial: yup.object({
    assets: createCurrencyValidation(),
    ebitda: createCurrencyValidation(),
    equity: createCurrencyValidation(),
    income: createCurrencyValidation(),
    liability: createCurrencyValidation(),
    netProfit: createCurrencyValidation(),
    performanceFinancialDate: yup.string().nullable(),
  }).nullable(),
  processType: yup.string().nullable(),
  requestType: yup.string().nullable(),
});
