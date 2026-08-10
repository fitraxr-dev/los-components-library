import * as yup from 'yup';


export const validationSchema = yup.object().shape({
  // All fields from the form
  address: yup.string().optional().nullable(),
  city: yup.mixed().optional().nullable(),
  country: yup.mixed().optional().nullable(),
  district: yup.mixed().optional().nullable(),
  districtLocation: yup.mixed().optional().nullable(),
  dob: yup.string().required('Date of Birth is required'),
  ethnicOrigin: yup.string().optional().nullable(),
  gender: yup.string().optional().nullable(),
  idNo: yup.string().required('ID Number is required'),
  idType: yup.string().required('ID Type is required'),
  identityExpiry: yup.string().optional().nullable(),
  jobPosition: yup.string().required('Job Position is required'),
  ktpFile: yup.mixed().required('ID Document is required'),
  managementCode: yup.string().optional().nullable(),
  modifiedBy: yup.string().optional().nullable(),
  modifiedDate: yup.string().optional().nullable(),
  name: yup.string().required('Name is required'),
  nationality: yup.mixed().optional().nullable(),
  npwp: yup.string().required('NPWP is required'),
  npwpFile: yup.mixed().required('NPWP Document is required'),
  personInCharge: yup.string().required('Person in Charge is required'),
  placeOfBirth: yup.string().optional().nullable(),
  postalCode: yup.string().optional().test(
    'is-valid-postal-code',
    'Postal code must be valid',
    (value) => !value || /^\d{5}$/.test(value)
  ).nullable(),
  prefix: yup.string().optional().nullable(),
  province: yup.mixed().optional().nullable(),
  provinceLocation: yup.mixed().optional().nullable(),
  refId: yup.string().optional().nullable(),
  status: yup.string().required('Status is required'),
  subDistrict: yup.mixed().optional().nullable(),
  subDistrictLocation: yup.mixed().optional().nullable(),
  suffix: yup.string().optional().nullable(),
  telephone: yup.object({
    areaCode: yup.string().optional().nullable(),
    ext: yup.string().optional().nullable(),
    number: yup.string(),
  }),
  title: yup.string().optional().nullable(),
  village: yup.mixed().optional().nullable(),
  villageLocation: yup.mixed().optional().nullable(),
});
