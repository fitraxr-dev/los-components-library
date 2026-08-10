import * as yup from 'yup';


export const projectInformationSchema = yup.object().shape({
  bucketProcessId: yup.string().nullable(),
  contractor: yup.object().nullable(),

  id: yup.string().nullable(),

  // Ensure the whole projectInformation object is required
  otherInformation: yup.object().nullable(),

  owner: yup.object().nullable(),
  // nullable
  projectInformation: yup.object().shape({

    // mandatory
    category: yup.string().required('Category is mandatory'),

    classification: yup.string().required('Classification is mandatory'),

    // mandatory
    description: yup.string().required('Description is mandatory'),

    // mandatory
    endDate: yup
      .string()
      .required('End Date is mandatory')
      .test('is-after-start', 'End Date cannot be before Start Date', function (value) {
        const { startDate } = this.parent;
        if (!value || !startDate) return true;
        return new Date(value) >= new Date(startDate);
      }),

    exchangeRate: yup.object().shape({ // mandatory
      currency: yup.string().required('Exchange Rate Currency is mandatory'),
      value: yup.number()
        .nullable()
        .transform((value, originalValue) => {
          return originalValue === '' ? null : value;
        })
        .required('Exchange Rate Value Wajib Diisi'),
    }).required('Exchange Rate information is mandatory'),

    modifiedBy: yup.string().nullable(),

    // nullable
    modifiedDate: yup.string().nullable(),

    name: yup.string().required('Project Name is mandatory'),

    // mandatory
    output: yup.string().required('Output is mandatory'),

    // mandatory
    outputUnit: yup.string().required('Output Unit is mandatory'),

    // mandatory
    projectAddress: yup.object().shape({
      address: yup.string().required('Address is mandatory'),
      // mandatory
      city: yup.string().required('City is mandatory'),

      // mandatory
      district: yup.string(),

      // mandatory
      postalCode: yup.string(),

      // mandatory
      province: yup.string().required('Province is mandatory'),
      // mandatory
      village: yup.string(),
    }).required('Project Address is mandatory'),

    // mandatory
    sector: yup.string().required('Sector is mandatory'),

    // mandatory
    startDate: yup
      .string()
      .required('Start Date is mandatory')
      .test('is-before-end', 'Start Date cannot be after End Date', function (value) {
        const { endDate } = this.parent;
        if (!value || !endDate) return true;
        return new Date(value) <= new Date(endDate);
      }),

    // mandatory
    value: yup.object().shape({ // mandatory
      currency: yup.string().required('Currency is mandatory'),
      value: yup.number()
        .nullable()
        .transform((value, originalValue) => {
          return originalValue === '' ? null : value;
        })
        .required('Value Wajib Diisi'),
    }).required('Value information is mandatory'),

    valueInIdr: yup.object().shape({ // mandatory
      currency: yup.string().required('Value in IDR Currency is mandatory'),
      value: yup.number()
        .nullable()
        .transform((value, originalValue) => {
          return originalValue === '' ? null : value;
        })
        .required('Value in IDR is mandatory'),
    }).required('Value in IDR information is mandatory'), // nullable
  }).required('Project Information is mandatory'),
});
