import * as yup from 'yup';


export const facilityDataSchema = yup.object().shape({
  alias: yup.string().required('Alias harus diisi'),
  companyStatus: yup.string().notRequired().nullable(),
  currencyExchangeRate: yup.string().nullable().notRequired(),
  currencyOrderValue: yup.string().nullable().notRequired(),
  exchangeRate: yup.string().when('currencyOrderValue', {
    is: (val: string) => {
      console.log('val', val);
      return val === 'USD';
    },
    otherwise: (schema) => schema.nullable(),
    then: (schema) => schema.required('Exchange Rate harus diisi'),
  }),
  facilityStatus: yup.string().notRequired().nullable(),
  financingCategory: yup.string().required('Financing Category harus diisi'),
  financingScheme: yup.string().required('Financing Scheme harus diisi'),
  financingSegment: yup.string(),
  mappingFinancingSegment: yup.string(),
  mappingProduct: yup.string().required('CORE Mapping Product harus diisi'),
  modifiedBy: yup.string().notRequired().nullable(),
  modifiedDate: yup.string().notRequired().nullable(),
  orderStatus: yup.string(),
  orderType: yup.string(),
  orderValue: yup.string().required('Plafond harus diisi'),
  os: yup.string().notRequired().nullable(),
  packageName: yup.string().notRequired().nullable(),
  plafondIDC: yup.string().notRequired().nullable(),
  productLibrary: yup.string().notRequired().nullable(),
  subProductLibrary: yup.string().notRequired().nullable(),
  totalPlafondValue: yup.string().notRequired().nullable(),
});
