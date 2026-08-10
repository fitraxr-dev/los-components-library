import * as Yup from 'yup';


export const validationSchema = Yup.object({
  characteristic: Yup.string().nullable(),
  collectability: Yup.string().nullable(),
  exchangeRate: Yup.object().when('orderValue', (orderValue, schema) => {
    return orderValue[0]?.currency === 'USD'
      ? schema.shape({
        currency: Yup.string().required(),
        value: Yup.string().required(),
      }).required('Exchange Rate is required')
      : schema.shape({
        currency: Yup.string().nullable(),
        value: Yup.string().nullable(),
      }).nullable();
  }),
  financingObjectives: Yup.string().required(),
  financingSegment: Yup.string().required(),
  governmentMandate: Yup.string().nullable(),
  gracePeriod: Yup.string().nullable(),
  orderType: Yup.string().nullable(),
  orderValue: Yup.object().shape({
    currency: Yup.string().required(),
    value: Yup.string().required(),
  }).required('Order Value is required'),
  orderValueAfterExchangeRate: Yup.object().shape({
    currency: Yup.string().nullable(),
    value: Yup.string().nullable(),
  }).nullable(),
  outstanding: Yup.object().shape({
    currency: Yup.string().nullable(),
    value: Yup.string().nullable(),
  }).nullable(),
  portionPaymentPeriod: Yup.string().nullable(),
  portionPurchasePeriod: Yup.string().nullable(),
  product: Yup.string().required(),
  profitSharingExpectations: Yup.string().nullable(),
  project: Yup.object().shape({
    cityLabel: Yup.string().nullable(),
    curExchangeRate: Yup.string().nullable(),
    curValue: Yup.string().nullable(),
    districtLabel: Yup.string().nullable(),
    exchangeRate: Yup.string().nullable(),
    id: Yup.mixed().nullable(),
    label: Yup.string().nullable(),
    provinceLabel: Yup.string().nullable(),
    value: Yup.string().nullable(),
    valueInIdr: Yup.string().nullable(),
  }).nullable(),
  providingFacilities: Yup.string().nullable(),
  rates: Yup.string().nullable(),
  remark: Yup.string().nullable(),
  timePeriod: Yup.string().nullable(),
  withdrawalPeriod: Yup.string().nullable(),
});
